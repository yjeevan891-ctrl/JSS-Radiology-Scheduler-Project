import React from 'react';
import LocationMarkerIcon from '../LocationMarkerIcon';
import PhoneIcon from '../PhoneIcon';
import MailIcon from '../MailIcon';
import HospitalLogoIcon from '../HospitalLogoIcon';
import { useLanguage } from '../../../contexts/LanguageContext';

const Footer: React.FC = () => {
    const { t } = useLanguage();
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <HospitalLogoIcon className="h-8 w-8 text-blue-400" />
              <h3 className="text-lg font-semibold">{t('jssHospitalMysuru')}</h3>
            </div>
            <p className="text-gray-400 text-sm">
              {t('footerDescription')}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{t('contactInformation')}</h3>
            <div className="flex items-start space-x-3 text-gray-300">
              <LocationMarkerIcon className="h-5 w-5 mt-1 flex-shrink-0" />
              <p className="text-sm">{t('hospitalAddress')}</p>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <PhoneIcon className="h-5 w-5" />
              <a href="tel:+91-821-254-8400" className="text-sm hover:text-blue-400">+91-821-254-8400</a>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <MailIcon className="h-5 w-5" />
              <a href="mailto:info@jsshosp.com" className="text-sm hover:text-blue-400">info@jsshosp.com</a>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{t('operatingHours')}</h3>
            <p className="text-sm text-gray-300">10:00 AM - 01:00 PM</p>
            <p className="text-sm text-gray-300">02:00 PM - 09:00 PM</p>
            <p className="text-xs text-gray-400">{t('operatingDays')}</p>
          </div>
          <div className="space-y-2">
             <h3 className="text-lg font-semibold">{t('cancellationPolicy')}</h3>
             <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                <li>{t('cancelPolicy1')}</li>
                <li>{t('cancelPolicy2')}</li>
             </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
          <span>&copy; {new Date().getFullYear()} {t('copyright')}.</span>
          <span className="hidden sm:inline mx-2">|</span>
          <span className="block sm:inline">{t('prototypeDesignedBy')}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;