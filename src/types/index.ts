export interface Activity {
  Name: string;
  StartDate: string;
  EndDate: string;
  ScheduleSummary: string;
}

export interface TimeRange {
  start: string;
  end: string;
}

export interface ActivityOccurrence extends Activity {
  date: Date;
  timeRange: TimeRange;
}

export interface AmiliaResponse {
  Items: Activity[];
  Paging: {
    TotalCount: number;
    Next: string;
  };
}