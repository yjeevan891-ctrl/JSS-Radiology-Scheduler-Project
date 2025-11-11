import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import SchedulingForm from './components/SchedulingForm';
import AppointmentList from './components/AppointmentList';
import MachineStatus from './components/MachineStatus';
import Footer from './components/icons/payment/Footer';
import Chatbot from './components/Chatbot';
import ConfirmationScreen from './components/ConfirmationScreen';
import { Appointment, MachineStatus as MachineStatusType, ToastMessage as ToastMessageType } from './types';
import { MACHINES, SCAN_TYPES } from './constants';
import { useLanguage } from './contexts/LanguageContext';
import Toast from './components/Toast';

const App: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [machineStatuses, setMachineStatuses] = useState<MachineStatusType[]>([]);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [toasts, setToasts] = useState<ToastMessageType[]>([]);
  const formRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const addToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  useEffect(() => {
    const updateStatuses = () => {
        const now = new Date();
        const newStatuses = MACHINES.map(machine => {
            const currentAppointment = appointments.find(app => {
                if (app.machineId !== machine.id || (app.status !== 'paid' && app.status !== 'completed')) {
                    return false;
                }
                const scanDetails = SCAN_TYPES.find(s => s.id === app.scanType);
                if (!scanDetails) return false;

                const appStart = new Date(`${app.date}T${app.time}:00`);
                const appEnd = new Date(appStart.getTime() + scanDetails.duration * 60000);
                
                return now >= appStart && now < appEnd;
            });

            const status: 'Available' | 'In Use' = currentAppointment ? 'In Use' : 'Available';
            
            // FIX: Explicitly type the object to match MachineStatusType to resolve type inference issues.
            const machineStatus: MachineStatusType = {
                id: machine.id,
                name: machine.name,
                type: machine.type,
                status: status,
                bg: status === 'Available' ? 'bg-green-100' : 'bg-yellow-100',
                text: status === 'Available' ? 'text-green-800' : 'text-yellow-800',
                currentAppointment: currentAppointment
            };
            return machineStatus;
        });
        setMachineStatuses(newStatuses);
    };

    updateStatuses();
    const intervalId = setInterval(updateStatuses, 30000); 

    return () => clearInterval(intervalId);
  }, [appointments]);
  
  const handleAddAppointment = (newAppointmentData: Omit<Appointment, 'id' | 'status' | 'reportStatus' | 'machineId'>) => {
    const scanDetails = SCAN_TYPES.find(s => s.id === newAppointmentData.scanType);
    if (!scanDetails) {
        addToast('error', t('errorBooking'));
        return;
    }

    const newAppStart = new Date(`${newAppointmentData.date}T${newAppointmentData.time}:00`);
    const newAppEnd = new Date(newAppStart.getTime() + scanDetails.duration * 60000);

    const compatibleMachines = MACHINES.filter(m => m.type === scanDetails.machineType);
    
    // Find all appointments that conflict with the new appointment's time slot
    const conflictingAppointments = appointments.filter(app => {
        if (app.status === 'cancelled' || app.date !== newAppointmentData.date) return false;
        const existingScanDetails = SCAN_TYPES.find(s => s.id === app.scanType);
        if (!existingScanDetails) return false;
        
        const existingAppStart = new Date(`${app.date}T${app.time}:00`);
        const existingAppEnd = new Date(existingAppStart.getTime() + existingScanDetails.duration * 60000);
        return (newAppStart < existingAppEnd) && (newAppEnd > existingAppStart);
    });

    const busyMachineIds = new Set(conflictingAppointments.map(app => app.machineId));
    const availableMachines = compatibleMachines.filter(m => !busyMachineIds.has(m.id));

    if (availableMachines.length === 0) {
        const machineTypeName = scanDetails.machineType;
        addToast('error', t('errorBooking', { machineType: machineTypeName }));
        return;
    }

    // --- Refined Machine Assignment Logic ---
    // Prioritize the machine that has been idle the longest on the selected day.
    const appointmentsOnDate = appointments.filter(app => app.date === newAppointmentData.date && app.status !== 'cancelled');
    const lastAppointmentEndTimes = new Map<string, Date>();

    appointmentsOnDate.forEach(app => {
        const scan = SCAN_TYPES.find(s => s.id === app.scanType);
        if (scan) {
            const appStart = new Date(`${app.date}T${app.time}:00`);
            const appEnd = new Date(appStart.getTime() + scan.duration * 60000);
            const currentLastEnd = lastAppointmentEndTimes.get(app.machineId);
            if (!currentLastEnd || appEnd > currentLastEnd) {
                lastAppointmentEndTimes.set(app.machineId, appEnd);
            }
        }
    });

    availableMachines.sort((a, b) => {
        const lastTimeA = lastAppointmentEndTimes.get(a.id)?.getTime() || 0;
        const lastTimeB = lastAppointmentEndTimes.get(b.id)?.getTime() || 0;
        return lastTimeA - lastTimeB; // Sort by earliest end time first
    });
    
    const bestMachine = availableMachines[0]; // The longest idle machine

    const newAppointment: Appointment = {
      ...newAppointmentData,
      id: Date.now().toString(),
      status: 'scheduled',
      reportStatus: 'pending',
      machineId: bestMachine.id,
    };
    setAppointments(prev => [...prev, newAppointment].sort((a, b) => a.time.localeCompare(b.time)));
    setConfirmedAppointment(newAppointment);
    addToast('success', t('appointmentBookedSuccess'));
  };

  const handleUpdateAppointment = (updatedAppointment: Appointment) => {
    setAppointments(prev => prev.map(app => app.id === updatedAppointment.id ? updatedAppointment : app));
    addToast('success', t('appointmentUpdatedSuccess'));
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.map(app => app.id === appointmentId ? { ...app, status: 'cancelled' } : app));
    addToast('success', t('appointmentCancelledSuccess'));
  };
  
  const handlePaymentSuccess = (appointmentId: string) => {
    // FIX: Changed status to 'paid' to align with the AppointmentStatus type and UI logic.
    setAppointments(prev => prev.map(app => app.id === appointmentId ? { ...app, status: 'paid' } : app));
  };

  const handleGenerateReport = (appointmentId: string) => {
    setAppointments(prev => prev.map(app => 
      app.id === appointmentId 
        ? { ...app, reportStatus: 'generating', reportGenerationProgress: 0 } 
        : app
    ));

    const generationTime = 3000; // 3 seconds
    const updateInterval = 150; 
    const steps = generationTime / updateInterval;
    let currentStep = 0;

    const intervalId = setInterval(() => {
      currentStep++;
      const progress = Math.round((currentStep / steps) * 100);
      
      setAppointments(prev => prev.map(app => 
        app.id === appointmentId 
          ? { ...app, reportGenerationProgress: progress > 100 ? 100 : progress } 
          : app
      ));

      if (currentStep >= steps) {
        clearInterval(intervalId);
        setAppointments(prev => prev.map(app => 
          app.id === appointmentId 
            ? { ...app, reportStatus: 'ready', reportGenerationProgress: 100 } 
            : app
        ));
        addToast('success', t('reportGeneratedSuccess'));
      }
    }, updateInterval);
  }

  const handleBookAnother = () => {
    setConfirmedAppointment(null);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  if (confirmedAppointment) {
    return <ConfirmationScreen appointment={confirmedAppointment} onBookAnother={handleBookAnother} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <SchedulingForm 
              onAddAppointment={handleAddAppointment}
              allAppointments={appointments}
              formRef={formRef}
            />
            <AppointmentList 
              appointments={appointments}
              onUpdate={handleUpdateAppointment}
              onCancel={handleCancelAppointment}
              onPay={handlePaymentSuccess}
              onGenerateReport={handleGenerateReport}
            />
          </div>
          <div className="lg:col-span-1">
            <MachineStatus machineStatuses={machineStatuses} />
          </div>
        </div>
      </main>
      <Footer />
      <Chatbot />
      
      <div className="fixed top-5 right-5 z-[100]">
          <div className="space-y-2">
            {toasts.map(toast => (
              <Toast key={toast.id} {...toast} onDismiss={dismissToast} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default App;
