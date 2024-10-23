import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ActivityOccurrence } from '../types';

interface CalendarProps {
  occurrences: ActivityOccurrence[];
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ occurrences, currentMonth, onMonthChange }) => {
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getOccurrencesForDay = (day: number) => {
    return occurrences.filter(occurrence => {
      const occurrenceDate = occurrence.date;
      return (
        occurrenceDate.getDate() === day &&
        occurrenceDate.getMonth() === currentMonth.getMonth() &&
        occurrenceDate.getFullYear() === currentMonth.getFullYear()
      );
    });
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex items-center justify-between p-4 border-b">
        <button onClick={previousMonth} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="bg-gray-50 p-2 text-center text-sm font-semibold">
            {day}
          </div>
        ))}

        {blanks.map((blank) => (
          <div key={`blank-${blank}`} className="bg-white p-2 h-32" />
        ))}

        {days.map((day) => {
          const dayOccurrences = getOccurrencesForDay(day);
          return (
            <div key={day} className="bg-white p-2 border-t first:border-l h-32 overflow-y-auto">
              <div className="font-semibold mb-1">{day}</div>
              {dayOccurrences.map((occurrence, idx) => (
                <div
                  key={idx}
                  className="text-xs p-1 mb-1 bg-blue-50 rounded"
                >
                  <div className="font-medium whitespace-normal leading-tight">
                    {occurrence.Name}
                  </div>
                  <div className="text-gray-600 mt-0.5">
                    {occurrence.timeRange.start} - {occurrence.timeRange.end}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;