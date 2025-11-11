// FIX: Imported the 'Patient' type to be used in MOCK_HIS_DATA.
import { ScanType, Machine, Patient } from './types';
import { MriIcon } from './components/icons/scans/MriIcon';
import { CtIcon } from './components/icons/scans/CtIcon';
import { XrayIcon } from './components/icons/scans/XrayIcon';
import { UltrasoundIcon } from './components/icons/scans/UltrasoundIcon';

export const SCAN_TYPES: ScanType[] = [
    { id: 'mri_brain', name: { en: 'MRI Brain', kn: 'ಎಂಆರ್‌ಐ ಬ್ರೈನ್' }, cost: 8000, icon: MriIcon, duration: 60, machineType: 'MRI' },
    { id: 'ct_chest', name: { en: 'CT Chest', kn: 'ಸಿಟಿ ಚೆಸ್ಟ್' }, cost: 5000, icon: CtIcon, duration: 20, machineType: 'CT' },
    { id: 'xray_knee', name: { en: 'X-Ray Knee', kn: 'ಎಕ್ಸ್-ರೇ ಮೊಣಕಾಲು' }, cost: 1200, icon: XrayIcon, duration: 10, machineType: 'X-Ray' },
    { id: 'usg_abdomen', name: { en: 'Ultrasound Abdomen', kn: 'ಅಲ್ಟ್ರಾಸೌಂಡ್ ಹೊಟ್ಟೆ' }, cost: 2500, icon: UltrasoundIcon, duration: 20, machineType: 'USG' },
];

export const TOTAL_MACHINES = 10;
export const MACHINES: Machine[] = [
    { id: 'mri1', name: 'MRI 1', type: 'MRI' },
    { id: 'ct1', name: 'CT 1', type: 'CT' },
    { id: 'usg1', name: 'USG 1', type: 'USG' },
    { id: 'usg2', name: 'USG 2', type: 'USG' },
    { id: 'usg3', name: 'USG 3', type: 'USG' },
    { id: 'usg4', name: 'USG 4', type: 'USG' },
    { id: 'usg5', name: 'USG 5', type: 'USG' },
    { id: 'usg6', name: 'USG 6', type: 'USG' },
    { id: 'xray1', name: 'X-Ray 1', type: 'X-Ray' },
    { id: 'xray2', name: 'X-Ray 2', type: 'X-Ray' },
];

export const MOCK_HIS_DATA: { [key: string]: Omit<Patient, 'regNo'> } = {
    "JSS12345": { name: "Ramesh Kumar", phone: "9876543210", age: 45, gender: 'male' },
    "JSS67890": { name: "Sunita Sharma", phone: "9123456780", age: 32, gender: 'female' },
    "JSS54321": { name: "Arjun Reddy", phone: "9988776655", age: 28, gender: 'male' },
};


// Generate 10-minute time slots from 10:00 to 21:00, excluding 13:00-14:00
const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    // Morning session 10:00 - 13:00
    for (let h = 10; h < 13; h++) {
        for (let m = 0; m < 60; m += 10) {
            slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
        }
    }
    // Afternoon session 14:00 - 21:00
    for (let h = 14; h < 21; h++) {
        for (let m = 0; m < 60; m += 10) {
            slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
        }
    }
    return slots;
}

export const TIME_SLOTS: string[] = generateTimeSlots();