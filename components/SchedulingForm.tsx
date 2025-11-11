import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Patient, Appointment, SlotStatus } from '../types';
import { SCAN_TYPES, MOCK_HIS_DATA, TIME_SLOTS } from '../constants';
import { toYYYYMMDD } from '../utils/timeUtils';
import { useLanguage } from '../contexts/LanguageContext';
import SpinnerIcon from './icons/SpinnerIcon';
import InfoIcon from './icons/InfoIcon';
import ScanInfoModal from './ScanInfoModal';
import LockIcon from './icons/LockIcon';

interface SchedulingFormProps {
  onAddAppointment: (appointment: Omit<Appointment, 'id' | 'status' | 'reportStatus' | 'machineId'>) => void;
  allAppointments: Appointment[];
  formRef: React.RefObject<HTMLDivElement>;
}

const initialState = {
  regNo: '',
  scanType: SCAN_TYPES[0].id,
  date: toYYYYMMDD(new Date()),
  time: '',
  reminderPreference: '1_day' as '1_day' | '2_hours' | 'none',
  notes: '',
  isEmergency: false,
};

const SchedulingForm: React.FC<SchedulingFormProps> = ({ onAddAppointment, allAppointments, formRef }) => {
  const [formData, setFormData] = useState(initialState);
  const [patient, setPatient] = useState<Omit<Patient, 'regNo'> | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');
  const [cost, setCost] = useState(SCAN_TYPES[0].cost);
  const [infoModalScan, setInfoModalScan] = useState<string | null>(null);
  
  const { language, t } = useLanguage();

  useEffect(() => {
    const selectedScan = SCAN_TYPES.find(s => s.id === formData.scanType);
    if (selectedScan) {
      setCost(selectedScan.cost);
    }
  }, [formData.scanType]);

  const handleFetchPatient = () => {
    if (!formData.regNo) return;
    setIsFetching(true);
    setError('');
    setTimeout(() => {
      const patientData = MOCK_HIS_DATA[formData.regNo.toUpperCase()];
      if (patientData) {
        setPatient(patientData);
      } else {
        setError(t('patientNotFound'));
        setPatient(null);
      }
      setIsFetching(false);
    }, 500); // Simulate network delay
  };
  
  const slotStatuses: SlotStatus[] = useMemo(() => {
    const now = new Date();
    const todayStr = toYYYYMMDD(now);
    const otherAppointmentsOnDate = allAppointments.filter(a => a.date === formData.date && a.status !== 'cancelled');

    return TIME_SLOTS.map(slotTime => {
        const slotDateTime = new Date(`${formData.date}T${slotTime}:00`);

        if (formData.date === todayStr && slotDateTime < now) {
            return { time: slotTime, status: 'past' };
        }

        for (const app of otherAppointmentsOnDate) {
            const appScan = SCAN_TYPES.find(s => s.id === app.scanType);
            if (!appScan) continue;

            const appStart = new Date(`${app.date}T${app.time}:00`);
            const appEnd = new Date(appStart.getTime() + appScan.duration * 60000);

            if (slotDateTime >= appStart && slotDateTime < appEnd) {
                return { time: slotTime, status: 'booked' };
            }
        }
        
        return { time: slotTime, status: 'available' };
    });
  }, [formData.date, allAppointments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient || !formData.regNo || !formData.scanType || !formData.date) {
      setError(t('fillAllFields'));
      return;
    }
    if (!formData.time && !formData.isEmergency) {
      setError(t('selectSlot'));
      return;
    }
    setError('');
    onAddAppointment({
      patient: { ...patient, regNo: formData.regNo.toUpperCase() },
      scanType: formData.scanType,
      date: formData.date,
      time: formData.time,
      cost,
      reminderPreference: formData.reminderPreference,
      notes: formData.notes,
      isEmergency: formData.isEmergency,
    });
    setFormData(initialState);
    setPatient(null);
  };
  
  const handleReset = () => {
    setFormData(initialState);
    setPatient(null);
    setError('');
  }

  return (
    <>
      <div ref={formRef} className="bg-white p-6 rounded-lg shadow-md scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t('bookAppointmentTitle')}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Details */}
          <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-semibold px-2">{t('patientDetails')}</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="regNo" className="block text-sm font-medium text-gray-700">{t('regNo')}</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input type="text" id="regNo" value={formData.regNo} onChange={e => setFormData({...formData, regNo: e.target.value})} className="flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300" placeholder={t('regNoPlaceholder')} />
                    <button type="button" onClick={handleFetchPatient} disabled={isFetching} className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm hover:bg-gray-100 disabled:bg-gray-200">
                      {isFetching ? <SpinnerIcon className="h-4 w-4 text-gray-600 animate-spin"/> : t('fetchDetails')}
                    </button>
                  </div>
                </div>
                {patient && (
                    <div className="grid grid-cols-2 gap-4 md:col-span-1 bg-green-50 p-2 rounded-md border border-green-200">
                        <div><p className="text-xs text-gray-500">{t('patientName')}</p><p className="font-medium text-gray-800">{patient.name}</p></div>
                        <div><p className="text-xs text-gray-500">{t('phoneNo')}</p><p className="font-medium text-gray-800">{patient.phone}</p></div>
                        <div><p className="text-xs text-gray-500">{t('age')}</p><p className="font-medium text-gray-800">{patient.age}</p></div>
                        <div><p className="text-xs text-gray-500">{t('gender')}</p><p className="font-medium text-gray-800 capitalize">{t(patient.gender as 'male' | 'female' | 'other')}</p></div>
                    </div>
                )}
            </div>
          </fieldset>
          
          {/* Appointment Details */}
          <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-semibold px-2">{t('appointmentDetails')}</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="scanType" className="block text-sm font-medium text-gray-700">{t('selectScan')}</label>
                    <div className="flex items-center">
                      <select id="scanType" value={formData.scanType} onChange={e => setFormData({...formData, scanType: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                          {SCAN_TYPES.map(s => <option key={s.id} value={s.id}>{s.name[language]}</option>)}
                      </select>
                      <button type="button" onClick={() => setInfoModalScan(SCAN_TYPES.find(s => s.id === formData.scanType)?.name['en'] || '')} className="ml-2 mt-1 text-gray-400 hover:text-blue-600">
                          <InfoIcon className="h-5 w-5" />
                      </button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('cost')}</label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{new Intl.NumberFormat(language === 'en' ? 'en-IN' : 'kn-IN', { style: 'currency', currency: 'INR' }).format(cost)}</p>
                </div>
            </div>
            <div className="mt-4">
                <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                        <input id="isEmergency" name="isEmergency" type="checkbox" checked={formData.isEmergency} onChange={e => setFormData({...formData, isEmergency: e.target.checked, time: ''})} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="isEmergency" className="font-medium text-gray-700">{t('markAsEmergency')}</label>
                        {formData.isEmergency && <p className="text-gray-500">{t('emergencySlotInfo')}</p>}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">{t('selectDate')}</label>
                    <input type="date" id="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value, time: ''})} min={toYYYYMMDD(new Date())} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                </div>
                <div className={formData.isEmergency ? 'opacity-50' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('selectTime')}</label>
                    <div className="grid grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-2">
                        {slotStatuses.filter(slot => slot.status !== 'past').length > 0 ? (
                            slotStatuses.filter(slot => slot.status !== 'past').map(slot => (
                                <button type="button" key={slot.time} disabled={slot.status !== 'available' || formData.isEmergency} onClick={() => setFormData({...formData, time: slot.time})} 
                                className={`p-2 text-sm rounded-md border flex items-center justify-center ${
                                    formData.time === slot.time ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300' : 
                                    slot.status === 'booked' ? 'bg-red-100 text-red-500 border-red-200 cursor-not-allowed' : 
                                    'bg-green-50 text-green-800 border-green-200 hover:bg-green-100'
                                } ${formData.isEmergency ? 'cursor-not-allowed' : ''}`}>
                                    {slot.status === 'booked' && <LockIcon className="h-3 w-3 mr-1" />}
                                    {slot.time}
                                </button>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 col-span-full">{t('noSlots')}</p>
                        )}
                    </div>
                </div>
            </div>
          </fieldset>
          
          {/* Additional Options */}
          <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-semibold px-2">{t('additionalOptions')}</legend>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="reminder" className="block text-sm font-medium text-gray-700">{t('reminderPreference')}</label>
                  <select id="reminder" value={formData.reminderPreference} onChange={e => setFormData({...formData, reminderPreference: e.target.value as '1_day' | '2_hours' | 'none'})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                    <option value="1_day">{t('oneDayBefore')}</option>
                    <option value="2_hours">{t('twoHoursBefore')}</option>
                    <option value="none">{t('noReminder')}</option>
                  </select>
                </div>
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">{t('notes')}</label>
                    <textarea id="notes" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={1} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder={t('notesPlaceholder')}></textarea>
                </div>
             </div>
          </fieldset>
          
          {error && <p className="text-red-600 text-sm">{error}</p>}
          
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={handleReset} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">{t('resetForm')}</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700">{t('bookAppointmentBtn')}</button>
          </div>
        </form>
      </div>

      {infoModalScan && (
        <ScanInfoModal
          scanType={infoModalScan}
          onClose={() => setInfoModalScan(null)}
        />
      )}
    </>
  );
};

export default SchedulingForm;