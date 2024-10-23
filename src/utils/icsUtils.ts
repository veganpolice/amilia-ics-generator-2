import { createEvents } from 'ics';
import { ActivityOccurrence } from '../types';

export const downloadIcsFile = (occurrences: ActivityOccurrence[]) => {
  const events = occurrences.map(occurrence => {
    const date = occurrence.date;
    const [startHours, startMinutes] = occurrence.timeRange.start.replace(/[ap]m/i, '').split(':').map(Number);
    const [endHours, endMinutes] = occurrence.timeRange.end.replace(/[ap]m/i, '').split(':').map(Number);
    
    // Adjust hours for PM times
    const adjustedStartHours = occurrence.timeRange.start.toLowerCase().includes('pm') && startHours !== 12 
      ? startHours + 12 
      : startHours;
    const adjustedEndHours = occurrence.timeRange.end.toLowerCase().includes('pm') && endHours !== 12
      ? endHours + 12
      : endHours;

    return {
      title: occurrence.Name,
      start: [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        adjustedStartHours,
        startMinutes || 0
      ],
      end: [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        adjustedEndHours,
        endMinutes || 0
      ],
      description: occurrence.ScheduleSummary
    };
  });

  createEvents(events, (error, value) => {
    if (error) {
      console.error(error);
      return;
    }

    const blob = new Blob([value], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'activities.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
};