import React from 'react';

export const formatTime12Hour = (time24: string): string => {
  if (!time24 || !time24.includes(':')) return time24;
  const [hourStr, minuteStr] = time24.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour || 12; 
  
  const hour12Str = hour.toString();
  const minuteStrPadded = minute.toString().padStart(2, '0');

  return `${hour12Str}:${minuteStrPadded} ${ampm}`;
};

export const toYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
