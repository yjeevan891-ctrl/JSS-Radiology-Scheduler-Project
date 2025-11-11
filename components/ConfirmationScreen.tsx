import React from 'react';
import { Appointment } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { SCAN_TYPES } from '../constants';
import { formatTime12Hour } from '../utils/timeUtils';
import { generateAndDownloadBill } from '../services/billingService';
import CheckCircleIcon from './icons/CheckCircleIcon';
import { QrCodeIcon } from './icons/QrCodeIcon';
import DownloadIcon from './icons/DownloadIcon';
import ShareIcon from './icons/ShareIcon';

interface ConfirmationScreenProps {
  appointment: Appointment;
  onBookAnother: () => void;
}

const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ appointment, onBookAnother }) => {
  const { language, t } = useLanguage();

  const getScanName = (id: string) => SCAN_TYPES.find(s => s.id === id)?.name[language] || id;

  const handleShare = () => {
    const details = `Appointment Confirmed!\nPatient: ${appointment.patient.name}\nScan: ${getScanName(appointment.scanType)}\nDate: ${new Date(appointment.date).toDateString()} at ${formatTime12Hour(appointment.time)}\nJSS Hospital, Mysuru`;
    if (navigator.share) {
      navigator.share({
        title: 'JSS Hospital Appointment Confirmation',
        text: details,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(details);
      alert('Appointment details copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 animate-fade-in">
        <div className="text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">{t('appointmentConfirmed')}</h1>
          <p className="mt-2 text-gray-600">{t('appointmentSuccessMessage')}</p>
        </div>

        <div className="mt-8 border-t border-b border-gray-200 divide-y divide-gray-200">
          <div className="py-4 grid grid-cols-3 gap-4">
            <dt className="text-sm font-medium text-gray-500">{t('patient')}</dt>
            <dd className="col-span-2 text-sm text-gray-900 font-semibold">{appointment.patient.name} ({appointment.patient.regNo})</dd>
          </div>
          <div className="py-4 grid grid-cols-3 gap-4">
            <dt className="text-sm font-medium text-gray-500">{t('selectScan')}</dt>
            <dd className="col-span-2 text-sm text-gray-900">{getScanName(appointment.scanType)}</dd>
          </div>
          <div className="py-4 grid grid-cols-3 gap-4">
            <dt className="text-sm font-medium text-gray-500">{t('dateTime')}</dt>
            <dd className="col-span-2 text-sm text-gray-900">{new Date(appointment.date + 'T00:00:00').toLocaleDateString(language === 'en' ? 'en-GB' : 'kn-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {formatTime12Hour(appointment.time)}</dd>
          </div>
           <div className="py-4 grid grid-cols-3 gap-4">
            <dt className="text-sm font-medium text-gray-500">{t('cost')}</dt>
            <dd className="col-span-2 text-sm text-gray-900 font-bold">{new Intl.NumberFormat(language === 'en' ? 'en-IN' : 'kn-IN', { style: 'currency', currency: 'INR' }).format(appointment.cost)}</dd>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg flex items-center gap-6">
          <div className="flex-shrink-0">
            <QrCodeIcon className="h-24 w-24" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-800">{t('scanAtReception')}</h3>
            <p className="text-sm text-blue-700">Present this QR code at the reception for a quick and easy check-in process.</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button onClick={() => generateAndDownloadBill(appointment)} className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <DownloadIcon className="h-5 w-5 mr-2" />
            {t('downloadBill')}
          </button>
          <button onClick={handleShare} className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <ShareIcon className="h-5 w-5 mr-2" />
            {t('shareDetails')}
          </button>
          <button onClick={onBookAnother} className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            {t('done')}
          </button>
        </div>
      </div>
        <style>{`
        @keyframes fade-in { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ConfirmationScreen;