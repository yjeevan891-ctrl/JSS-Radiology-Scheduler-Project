import React from 'react';
import { MachineStatus as MachineStatusType } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface MachineStatusProps {
    machineStatuses: MachineStatusType[];
}

const MachineStatus: React.FC<MachineStatusProps> = ({ machineStatuses }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{t('machineStatusTitle')}</h2>
      <div className="space-y-4 lg:grid lg:grid-cols-1 lg:gap-4">
        {machineStatuses.map((machine) => (
          <div key={machine.id} className="p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-700">{machine.name}</p>
                <p className="text-sm text-gray-500">{machine.type}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${machine.bg} ${machine.text}`}>
                {/* FIX: Cast the dynamically created string to the expected literal type for the translation function. */}
                {t(machine.status.toLowerCase().replace(' ', '') as 'available' | 'inuse')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MachineStatus;