import React, { useState } from 'react';
import { Appointment } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { SCAN_TYPES, MACHINES } from '../constants';
import { formatTime12Hour } from '../utils/timeUtils';
import EmptyStateGraphic from './graphics/EmptyStateGraphic';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';
import PaidIcon from './icons/PaidIcon';
import EditAppointmentModal from './EditAppointmentModal';
import ConfirmationModal from './ConfirmationModal';
import PaymentModal from './PaymentModal';
import SpinnerIcon from './icons/SpinnerIcon';
import DownloadIcon from './icons/DownloadIcon';
import ShareIcon from './icons/ShareIcon';

interface AppointmentListProps {
  appointments: Appointment[];
  onUpdate: (appointment: Appointment) => void;
  onCancel: (appointmentId: string) => void;
  onPay: (appointmentId: string) => void;
  onGenerateReport: (appointmentId: string) => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments, onUpdate, onCancel, onPay, onGenerateReport }) => {
  const { language, t } = useLanguage();
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [cancellingAppointment, setCancellingAppointment] = useState<Appointment | null>(null);
  const [payingAppointment, setPayingAppointment] = useState<Appointment | null>(null);

  const getScanDetails = (scanId: string) => SCAN_TYPES.find(s => s.id === scanId);
  const getMachineName = (machineId: string) => MACHINES.find(m => m.id === machineId)?.name || 'N/A';

  const getStatusPill = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">{t(status)}</span>;
      case 'completed': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">{t(status)}</span>;
      case 'paid': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-teal-100 text-teal-800 flex items-center"><PaidIcon className="h-3 w-3 mr-1" /> {t(status)}</span>;
      case 'cancelled': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 line-through">{t(status)}</span>;
      default: return null;
    }
  };

  const handleSaveEdit = (updatedAppointment: Appointment) => {
    onUpdate(updatedAppointment);
    setEditingAppointment(null);
  };

  const handleConfirmCancel = () => {
    if (cancellingAppointment) {
      onCancel(cancellingAppointment.id);
      setCancellingAppointment(null);
    }
  };
  
  const handlePaymentSuccess = () => {
    if (payingAppointment) {
        onPay(payingAppointment.id);
        setPayingAppointment(null);
    }
  };

  const handleShareReport = (appointment: Appointment) => {
    const scanDetails = getScanDetails(appointment.scanType);
    const details = `Radiology Report\nPatient: ${appointment.patient.name}\nScan: ${scanDetails?.name[language]}\nDate: ${new Date(appointment.date).toDateString()}`;
    if (navigator.share) {
      navigator.share({ title: 'JSS Hospital Radiology Report', text: details }).catch(console.error);
    } else {
      navigator.clipboard.writeText(details);
      alert(t('reportSharedClipboard'));
    }
  };


  if (appointments.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <EmptyStateGraphic />
        <h3 className="mt-2 text-lg font-medium text-gray-900">{t('noAppointments')}</h3>
        <p className="mt-1 text-sm text-gray-500">{t('noAppointmentsDescription')}</p>
      </div>
    );
  }

  const scheduledAppointments = appointments.filter(a => a.status !== 'cancelled');
  const completedCount = appointments.filter(a => a.status === 'completed' || a.status === 'paid').length;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{t('appointmentsTitle')}</h2>
        <div className="text-sm text-gray-500">
          <span className="font-semibold text-gray-700">{t('totalAppointments')}: {scheduledAppointments.length}</span> | <span className="font-semibold text-green-600">{t('completed')}: {completedCount}</span>
        </div>
      </div>
      <div className="space-y-4">
        {appointments.map(app => {
          const scanDetails = getScanDetails(app.scanType);
          const IconComponent = scanDetails?.icon;
          return (
            <div key={app.id} className={`p-4 rounded-lg border flex flex-col md:flex-row md:justify-between md:items-center ${app.status === 'cancelled' ? 'bg-gray-50 opacity-60' : 'bg-white'}`}>
              <div className="flex items-center space-x-4">
                {IconComponent && 
                    <div className="hidden sm:block p-2 bg-gray-100 rounded-md">
                        <div className="h-8 w-8 text-blue-600">
                            <IconComponent />
                        </div>
                    </div>
                }
                <div>
                  <p className="font-bold text-gray-800">{app.patient.name} <span className="text-sm font-normal text-gray-500">({app.patient.regNo})</span></p>
                  <p className="text-sm text-gray-600">{scanDetails?.name[language]}</p>
                  <p className="text-sm text-gray-500">{formatTime12Hour(app.time)} on <span className="font-medium">{getMachineName(app.machineId)}</span></p>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                 <div className="flex items-center space-x-2">
                    {getStatusPill(app.status)}
                 </div>

                {app.status === 'scheduled' && (
                  <div className="flex items-center space-x-2 justify-end">
                    <button onClick={() => setPayingAppointment(app)} className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">{t('payNow')}</button>
                    <button onClick={() => setEditingAppointment(app)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full"><PencilIcon className="h-4 w-4" /></button>
                    <button onClick={() => setCancellingAppointment(app)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full"><TrashIcon className="h-4 w-4" /></button>
                  </div>
                )}
                
                {app.status === 'paid' && (
                  <div className="flex items-center space-x-2 justify-end">
                    {app.reportStatus === 'pending' && <button onClick={() => onGenerateReport(app.id)} className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">{t('generateReport')}</button>}
                    {app.reportStatus === 'generating' && (
                        <div className="flex items-center space-x-2 text-sm text-gray-700 px-3 py-1">
                            <SpinnerIcon className="h-4 w-4 text-blue-600 animate-spin" />
                            <span>{t('generatingReport')}</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${app.reportGenerationProgress || 0}%`, transition: 'width 0.2s ease-in-out' }}
                                ></div>
                            </div>
                            <span className="text-xs text-gray-500 w-8 text-right">{`${app.reportGenerationProgress || 0}%`}</span>
                        </div>
                    )}
                    {app.reportStatus === 'ready' && (
                        <div className="flex items-center space-x-2">
                            <button className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"><DownloadIcon className="h-4 w-4 mr-1" />{t('downloadReport')}</button>
                            <button onClick={() => handleShareReport(app)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full"><ShareIcon className="h-4 w-4" /></button>
                        </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {editingAppointment && (
        <EditAppointmentModal
          appointment={editingAppointment}
          allAppointments={appointments}
          onClose={() => setEditingAppointment(null)}
          onSave={handleSaveEdit}
        />
      )}

      {cancellingAppointment && (
        <ConfirmationModal
          title={`${t('cancel')} Appointment`}
          message={`Are you sure you want to cancel the appointment for ${cancellingAppointment.patient.name}? This action cannot be undone.`}
          onConfirm={handleConfirmCancel}
          onCancel={() => setCancellingAppointment(null)}
          confirmText={t('confirm')}
          cancelText={t('cancel')}
        />
      )}
      
      {payingAppointment && (
        <PaymentModal 
            appointment={payingAppointment}
            onClose={() => setPayingAppointment(null)}
            onPaymentSuccess={handlePaymentSuccess}
        />
      )}

    </div>
  );
};

export default AppointmentList;