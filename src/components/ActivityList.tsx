import React from 'react';
import { ActivityOccurrence } from '../types';
import { formatDate } from '../utils/dateUtils';

interface ActivityListProps {
  occurrences: ActivityOccurrence[];
}

const ActivityList: React.FC<ActivityListProps> = ({ occurrences }) => {
  const sortedOccurrences = [...occurrences].sort((a, b) => 
    a.date.getTime() - b.date.getTime()
  );

  return (
    <div className="space-y-2">
      {sortedOccurrences.map((occurrence, index) => (
        <div key={`${occurrence.Name}-${index}`} className="p-4 bg-white rounded shadow">
          <h3 className="font-bold">{occurrence.Name}</h3>
          <p className="text-gray-600">
            {formatDate(occurrence.date)} • {occurrence.timeRange.start} - {occurrence.timeRange.end}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ActivityList;