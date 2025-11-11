import React from 'react';

export type Language = 'en' | 'kn';

export interface LocalizedString {
  en: string;
  kn: string;
}

export interface Patient {
  regNo: string;
  name: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | 'other';
}

export interface ScanType {
  id: string;
  name: LocalizedString;
  cost: number;
  icon: () => React.JSX.Element;
  duration: number; // in minutes
  machineType: 'MRI' | 'CT' | 'X-Ray' | 'USG' | 'PET' | 'Mammography';
}

export interface Machine {
  id: string;
  name: string;
  type: 'MRI' | 'CT' | 'X-Ray' | 'USG';
}

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'paid';
export type ReportStatus = 'pending' | 'generating' | 'ready';

export interface Appointment {
  id: string;
  patient: Patient;
  scanType: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  cost: number;
  status: AppointmentStatus;
  reportStatus: ReportStatus;
  reportGenerationProgress?: number;
  reminderPreference: '1_day' | '2_hours' | 'none';
  notes?: string;
  isEmergency: boolean;
  machineId: string; // Machine assigned to this appointment
}

export interface MachineStatus {
    id: string;
    name: string;
    type: string;
    status: 'Available' | 'In Use';
    bg: string;
    text: string;
    currentAppointment?: Appointment;
}

export interface SlotStatus {
    time: string;
    status: 'available' | 'booked' | 'past';
}

export interface ChatMessage {
  id:string;
  text: string;
  sender: 'user' | 'bot';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error';
  message: string;
}