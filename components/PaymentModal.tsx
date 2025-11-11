import React, { useState } from 'react';
import { Appointment } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import XCircleIcon from './icons/XCircleIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import ShieldCheckIcon from './icons/ShieldCheckIcon';
import { QrCodeIcon } from './icons/QrCodeIcon';
import { UpiIcon } from './icons/payment/UpiIcon';
import { CardIcon } from './icons/payment/CardIcon';
import { WalletIcon } from './icons/payment/WalletIcon';
import { PayLaterIcon } from './icons/payment/PayLaterIcon';
import { GPayIcon } from './icons/payment/GPayIcon';
import { PhonePeIcon } from './icons/payment/PhonePeIcon';
import { PaytmIcon } from './icons/payment/PaytmIcon';
import { AmazonPayIcon } from './icons/payment/AmazonPayIcon';
import { VisaIcon } from './icons/payment/VisaIcon';
import { MastercardIcon } from './icons/payment/MastercardIcon';
import { AmexIcon } from './icons/payment/AmexIcon';
import { SimplIcon } from './icons/payment/SimplIcon';
import { LazyPayIcon } from './icons/payment/LazyPayIcon';

interface PaymentModalProps {
  appointment: Appointment;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

type PaymentTab = 'upi' | 'cards' | 'wallets' | 'paylater';

const PaymentModal: React.FC<PaymentModalProps> = ({ appointment, onClose, onPaymentSuccess }) => {
  const [activeTab, setActiveTab] = useState<PaymentTab>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const { language, t } = useLanguage();

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 2000); // Simulate payment processing
  };
  
  // FIX: Changed JSX.Element to React.JSX.Element to correctly reference the type from the imported React module.
  const TabButton: React.FC<{ tab: PaymentTab, icon: React.JSX.Element, text: string }> = ({ tab, icon, text }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex-1 p-4 flex flex-col items-center justify-center text-sm font-medium border-b-2 transition-colors ${
        activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {React.cloneElement(icon, { className: 'h-6 w-6 mb-1' })}
      {text}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-fade-in">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">{t('choosePaymentMethod')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="flex">
          <TabButton tab="upi" icon={<UpiIcon />} text="UPI" />
          <TabButton tab="cards" icon={<CardIcon />} text={t('cards')} />
          <TabButton tab="wallets" icon={<WalletIcon />} text={t('wallets')} />
          <TabButton tab="paylater" icon={<PayLaterIcon />} text={t('payLater')} />
        </div>
        <div className="p-6">
          <div className="text-center mb-6 bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">{t('forAppointment')}: <span className="font-semibold">{appointment.scanType}</span></p>
            <p className="text-2xl font-bold text-gray-900">{new Intl.NumberFormat(language === 'en' ? 'en-IN' : 'kn-IN', { style: 'currency', currency: 'INR' }).format(appointment.cost)}</p>
          </div>

          {activeTab === 'upi' && (
             <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1 text-center">
                <p className="font-semibold mb-2">{t('scanAtReception')}</p>
                <QrCodeIcon className="h-40 w-40 mx-auto border p-1 rounded-md" />
                <div className="flex items-center justify-center mt-4 space-x-4">
                    <GPayIcon className="h-8" />
                    <PhonePeIcon className="h-8" />
                    <PaytmIcon className="h-8" />
                    <AmazonPayIcon className="h-8" />
                </div>
              </div>
              <div className="flex-1">
                 <p className="font-semibold mb-2 text-center md:text-left">{t('orEnterUpiId')}</p>
                 <input type="text" placeholder={t('upiIdPlaceholder')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          )}
          {activeTab === 'cards' && (
             <div className="space-y-4">
               <input type="text" placeholder="Card Number" className="w-full p-2 border rounded-md" />
               <div className="flex space-x-4">
                 <input type="text" placeholder="MM/YY" className="w-1/2 p-2 border rounded-md" />
                 <input type="text" placeholder="CVC" className="w-1/2 p-2 border rounded-md" />
               </div>
               <input type="text" placeholder="Name on Card" className="w-full p-2 border rounded-md" />
               <div className="flex items-center justify-center space-x-4">
                 <VisaIcon className="h-8" />
                 <MastercardIcon className="h-8" />
                 <AmexIcon className="h-8" />
               </div>
             </div>
          )}
           {activeTab === 'wallets' && <div className="text-center text-gray-500">Wallet options coming soon.</div>}
           {activeTab === 'paylater' && (
             <div className="flex items-center justify-center space-x-6">
                <button className="flex flex-col items-center text-gray-600"><SimplIcon className="h-12 w-12 mb-1" /> Simpl</button>
                <button className="flex flex-col items-center text-gray-600"><LazyPayIcon className="h-12 w-12 mb-1" /> LazyPay</button>
             </div>
           )}
        </div>
        <div className="p-4 bg-gray-50 rounded-b-lg">
          <button onClick={handlePayment} disabled={isProcessing} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center">
            {isProcessing ? (
              <SpinnerIcon className="h-5 w-5 mr-2" />
            ) : (
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
            )}
            {isProcessing ? 'Processing...' : t('paySecurely')}
          </button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default PaymentModal;
