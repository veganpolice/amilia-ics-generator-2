import React, { useState } from 'react';
import { CalendarDays, Upload, List, FileJson, Download } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';
import Calendar from './components/Calendar';
import ActivityList from './components/ActivityList';
import { Activity, AmiliaResponse, ActivityOccurrence } from './types';
import { generateOccurrences } from './utils/dateUtils';
import { downloadIcsFile } from './utils/icsUtils';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [occurrences, setOccurrences] = useState<ActivityOccurrence[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(jsonInput) as AmiliaResponse;
      const sortedActivities = [...parsed.Items].sort((a, b) => 
        new Date(a.StartDate).getTime() - new Date(b.StartDate).getTime()
      );
      setActivities(sortedActivities);
      
      // Generate all occurrences for each activity
      const allOccurrences = sortedActivities.flatMap(activity => 
        generateOccurrences(activity)
      );
      setOccurrences(allOccurrences);
      setError(null);
    } catch (err) {
      console.error('Parsing error:', err);
      setError('Invalid JSON format. Please check your input.');
      setActivities([]);
      setOccurrences([]);
    }
  };

  const handleExampleData = async () => {
    try {
      const response = await fetch('/activities.json');
      if (!response.ok) throw new Error('Failed to fetch example data');
      const data = await response.text();
      setJsonInput(data);
      
      const parsed = JSON.parse(data) as AmiliaResponse;
      const sortedActivities = [...parsed.Items].sort((a, b) => 
        new Date(a.StartDate).getTime() - new Date(b.StartDate).getTime()
      );
      setActivities(sortedActivities);
      
      // Generate all occurrences for each activity
      const allOccurrences = sortedActivities.flatMap(activity => 
        generateOccurrences(activity)
      );
      setOccurrences(allOccurrences);
      setError(null);
    } catch (err) {
      console.error('Failed to load example data:', err);
      setError('Failed to load example data');
    }
  };

  const handleDownloadIcs = () => {
    if (occurrences.length === 0) {
      setError('No activities to download');
      return;
    }
    downloadIcsFile(occurrences);
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">Amilia Classes Formatter</h1>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full h-48 p-2 border rounded mb-4"
            placeholder="Paste the JSON response from the Amilia API here"
          />
          
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              <Upload size={16} /> Parse activities from Amilia
            </button>
            <button
              type="button"
              onClick={handleExampleData}
              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              <FileJson size={16} /> Paste example activities from Amilia
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded mb-4">
            {error}
          </div>
        )}

        {occurrences.length > 0 && (
          <div>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded ${
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                <List size={16} /> List View
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-2 px-4 py-2 rounded ${
                  viewMode === 'calendar'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                <CalendarDays size={16} /> Calendar View
              </button>
              <button
                onClick={handleDownloadIcs}
                className="flex items-center gap-2 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
              >
                <Download size={16} /> Download Calendar
              </button>
            </div>

            {viewMode === 'list' ? (
              <ActivityList occurrences={occurrences} />
            ) : (
              <Calendar
                occurrences={occurrences}
                currentMonth={currentMonth}
                onMonthChange={setCurrentMonth}
              />
            )}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;