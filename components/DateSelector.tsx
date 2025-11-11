import React, { useState } from 'react';
import { toYYYYMMDD } from '../utils/timeUtils';

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onDateChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startOfMonth.getDate() - startOfMonth.getDay());
  const endDate = new Date(endOfMonth);
  endDate.setDate(endOfMonth.getDate() + (6 - endOfMonth.getDay()));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const isSelected = (date: Date) => toYYYYMMDD(date) === selectedDate;
  
  const isPast = (date: Date) => date < today;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <button type="button" onClick={handlePrevMonth} className="p-1 rounded-full text-gray-500 hover:bg-gray-100">&lt;</button>
        <span className="font-semibold">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
        <button type="button" onClick={handleNextMonth} className="p-1 rounded-full text-gray-500 hover:bg-gray-100">&gt;</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="font-medium text-gray-500">{day}</div>
        ))}
        {dates.map(date => (
          <button
            type="button"
            key={date.toISOString()}
            onClick={() => !isPast(date) && onDateChange(toYYYYMMDD(date))}
            disabled={isPast(date)}
            className={`p-2 rounded-full transition-colors ${
              isPast(date) ? 'text-gray-300 cursor-not-allowed' :
              isSelected(date) ? 'bg-blue-600 text-white' :
              date.getMonth() !== currentMonth.getMonth() ? 'text-gray-400' : 'text-gray-700'
            } ${!isPast(date) && 'hover:bg-blue-100'}`}
          >
            {date.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateSelector;
