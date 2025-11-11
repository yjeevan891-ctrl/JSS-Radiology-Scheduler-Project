import React, { useState, useEffect } from 'react';
import { getScanExplanation } from '../services/geminiService';
import XCircleIcon from './icons/XCircleIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import { useLanguage } from '../contexts/LanguageContext';

interface ScanInfoModalProps {
  scanType: string;
  onClose: () => void;
}

const ScanInfoModal: React.FC<ScanInfoModalProps> = ({ scanType, onClose }) => {
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    const fetchExplanation = async () => {
      try {
        setIsLoading(true);
        setError('');
        const result = await getScanExplanation(scanType);
        setExplanation(result);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError(t('unknownError'));
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchExplanation();
  }, [scanType, t]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <XCircleIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('aboutScan')} {scanType}</h2>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <SpinnerIcon className="h-8 w-8 text-blue-600 animate-spin" />
            <p className="ml-3 text-gray-600">{t('fetchingInfo')}</p>
          </div>
        ) : error ? (
          <div className="text-red-600 bg-red-100 p-3 rounded-md">{error}</div>
        ) : (
          <p className="text-gray-600 leading-relaxed">{explanation}</p>
        )}
      </div>
       <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ScanInfoModal;
