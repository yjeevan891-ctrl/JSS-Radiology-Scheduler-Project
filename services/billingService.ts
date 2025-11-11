import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Appointment } from '../types';
import { formatTime12Hour } from '../utils/timeUtils';

// FIX: Replaced the interface with an intersection type to correctly inherit jsPDF methods and avoid module resolution errors.
// This provides strong types for the jsPDF instance after it has been augmented by 'jspdf-autotable'.
type jsPDFWithAutoTable = jsPDF & {
  autoTable: (options: any) => jsPDFWithAutoTable;
  lastAutoTable: {
    finalY: number;
  };
}

export const generateAndDownloadBill = (appointment: Appointment) => {
    const doc = new jsPDF() as jsPDFWithAutoTable;

    // Hospital Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('JSS Hospital, Mysuru', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Radiology Department - Appointment Bill', 105, 28, { align: 'center' });
    
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Patient and Appointment Details
    doc.setFontSize(11);
    const details = [
        ['Patient Name:', appointment.patient.name],
        ['Registration No.:', appointment.patient.regNo],
        ['Phone Number:', appointment.patient.phone],
        ['Age / Gender:', `${appointment.patient.age} / ${appointment.patient.gender}`],
        ['Appointment Date:', new Date(appointment.date + 'T00:00:00').toLocaleDateString('en-GB')],
        ['Appointment Time:', formatTime12Hour(appointment.time)],
    ];
    
    doc.autoTable({
        startY: 45,
        head: [['Detail', 'Information']],
        body: details,
        theme: 'grid',
        headStyles: { fillColor: [22, 160, 133] },
        styles: { fontSize: 10 },
    });

    // Billing Details
    const finalY = doc.lastAutoTable.finalY;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Billing Details', 20, finalY + 15);
    
    const billItems = [
        [appointment.scanType, `₹ ${appointment.cost.toFixed(2)}`],
    ];
    
    doc.autoTable({
        startY: finalY + 20,
        head: [['Service Description', 'Amount']],
        body: billItems,
        theme: 'striped',
        headStyles: { fillColor: [44, 62, 80] },
        foot: [['Total Amount', `₹ ${appointment.cost.toFixed(2)}`]],
        footStyles: { fontStyle: 'bold', fillColor: [240, 240, 240], textColor: 0 },
        styles: { fontSize: 10 },
    });
    
    const finalY2 = doc.lastAutoTable.finalY;
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('This is a computer-generated bill and does not require a signature.', 105, finalY2 + 20, { align: 'center' });
    doc.text('Thank you for choosing JSS Hospital.', 105, finalY2 + 25, { align: 'center' });


    // Save the PDF
    doc.save(`Bill_${appointment.patient.regNo}_${appointment.date}.pdf`);
};