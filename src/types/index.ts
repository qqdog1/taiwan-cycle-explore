
export interface Participant {
  id: string;
  name: string;
  detail: {
    age: number;
    category: string;
    city?: string;
    phone?: string;
    email?: string;
  };
}

export interface Event {
  id: string;
  title: string;
  summary: string;
  date: string;
  location?: string;
  description?: string;
  ld_json?: any;
  participants: Participant[];
}

export interface Year {
  year: number;
  events: Event[];
}

export interface Region {
  name: string;
  years: Year[];
}

export interface LatestEvent {
  event_id: string;
  title: string;
  summary: string;
  date: string;
  region?: string;
  year?: number;
}

export interface DataStructure {
  regions: Region[];
  latest_events: LatestEvent[];
  last_updated: string;
}

export interface BreadcrumbItem {
  label: string;
  path: string;
}
