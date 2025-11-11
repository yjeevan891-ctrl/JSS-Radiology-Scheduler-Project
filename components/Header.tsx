import React from 'react';
import JssHospitalLogo from './icons/JssHospitalLogo';
import BellIcon from './icons/BellIcon';
import { useLanguage } from '../contexts/LanguageContext';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (lang: 'en' | 'kn') => {
    setLanguage(lang);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <JssHospitalLogo className="h-14 w-auto" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {t('jssHospital')}
              </h1>
              <p className="text-sm text-gray-500">{t('radiologyDept')}</p>
              <p className="text-xs italic text-blue-500 mt-1">{t('hospitalTagline')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center border border-gray-300 rounded-md">
                <button 
                    onClick={() => handleLanguageChange('en')}
                    className={`px-3 py-1 text-sm rounded-l-md ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                >
                    English
                </button>
                <button 
                    onClick={() => handleLanguageChange('kn')}
                    className={`px-3 py-1 text-sm rounded-r-md ${language === 'kn' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                >
                    ಕನ್ನಡ
                </button>
            </div>
            <button className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" aria-label={t('viewNotifications')}>
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;