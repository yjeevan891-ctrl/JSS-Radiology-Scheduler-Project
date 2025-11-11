import React, { useState, useEffect, useMemo } from 'react';
import { Appointment, SlotStatus } from '../types';
// FIX: Removed unused 'CONSULTING_DOCTORS' import which was causing an error as it's not exported from constants.ts.
import { SCAN_TYPES, TIME_SLOTS } from '../constants';
import XCircleIcon from './icons/XCircleIcon';
import { toYYYYMMDD } from '../utils/timeUtils';
import { useLanguage } from '../contexts/LanguageContext';
import LockIcon from './icons/LockIcon';

interface EditAppointmentModalProps {
  appointment: Appointment;
  allAppointments: Appointment[];
  onClose: () => void;
  onSave: (appointment: Appointment) => void;
}

const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({ appointment, allAppointments, onClose, onSave }) => {
  const [editedAppointment, setEditedAppointment] = useState(appointment);
  const { language, t } = useLanguage();

  useEffect(() => {
    const selectedScan = SCAN_TYPES.find(s => s.id === editedAppointment.scanType);
    if (selectedScan) {
      setEditedAppointment(prev => ({...prev, cost: selectedScan.cost}));
    }
  }, [editedAppointment.scanType]);

  const handleSave = () => {
    onSave(editedAppointment);
  };
  
  const slotStatuses: SlotStatus[] = useMemo(() => {
    const now = new Date();
    const todayStr = toYYYYMMDD(now);
    // Exclude the current appointment being edited from the conflict check
    const otherAppointmentsOnDate = allAppointments.filter(a => a.date === editedAppointment.date && a.id !== editedAppointment.id && a.status !== 'cancelled');

    return TIME_SLOTS.map(slotTime => {
        const slotDateTime = new Date(`${editedAppointment.date}T${slotTime}:00`);

        if (editedAppointment.date === todayStr && slotDateTime < now) {
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
  }, [editedAppointment.date, allAppointments, editedAppointment.id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{t('editAppointment')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('patientName')}</label>
              <input type="text" value={editedAppointment.patient.name} readOnly className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 sm:text-sm"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('selectScan')}</label>
              <select value={editedAppointment.scanType} onChange={e => setEditedAppointment({...editedAppointment, scanType: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                 {SCAN_TYPES.map(s => <option key={s.id} value={s.id}>{s.name[language]} ({new Intl.NumberFormat(language === 'en' ? 'en-IN' : 'kn-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(s.cost)})</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('selectDate')}</label>
                    <input type="date" id="date" value={editedAppointment.date} onChange={e => setEditedAppointment({...editedAppointment, date: e.target.value})} min={toYYYYMMDD(new Date())} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('selectTime')}</label>
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-2">
                        {slotStatuses.filter(slot => slot.status !== 'past').map(slot => (
                            <button type="button" key={slot.time} disabled={slot.status !== 'available'} onClick={() => setEditedAppointment({...editedAppointment, time: slot.time})} 
                            className={`p-2 text-sm rounded-md border flex items-center justify-center ${
                                editedAppointment.time === slot.time ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300' : 
                                slot.status === 'booked' ? 'bg-red-100 text-red-500 border-red-200 cursor-not-allowed' : 
                                'bg-green-50 text-green-800 border-green-200 hover:bg-green-100'
                            }`}>
                                {slot.status === 'booked' && <LockIcon className="h-3 w-3 mr-1" />}
                                {slot.time}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div>
              <label htmlFor="edit-reminder" className="block text-sm font-medium text-gray-700">{t('reminderPreference')}</label>
              <select id="edit-reminder" value={editedAppointment.reminderPreference || 'none'} onChange={e => setEditedAppointment({...editedAppointment, reminderPreference: e.target.value as '1_day' | '2_hours' | 'none'})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                <option value="1_day">{t('oneDayBefore')}</option>
                <option value="2_hours">{t('twoHoursBefore')}</option>
                <option value="none">{t('noReminder')}</option>
              </select>
            </div>
             <div>
                <label htmlFor="edit-notes" className="block text-sm font-medium text-gray-700">{t('notes')}</label>
                <textarea id="edit-notes" value={editedAppointment.notes || ''} onChange={e => setEditedAppointment({...editedAppointment, notes: e.target.value})} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder={t('notesPlaceholder')}></textarea>
            </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">{t('cancel')}</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700">{t('saveChanges')}</button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default EditAppointmentModal;