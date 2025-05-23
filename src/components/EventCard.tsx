
import { Calendar, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Event } from '@/types';

interface EventCardProps {
  event: Event;
  regionName: string;
  year: number;
  showRegion?: boolean;
}

export function EventCard({ event, regionName, year, showRegion = false }: EventCardProps) {
  const eventPath = `/region/${encodeURIComponent(regionName)}/year/${year}/event/${event.id}`;
  
  return (
    <Link to={eventPath}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {event.title}
          </h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2">
            {event.participants.length} 人報名
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{event.summary}</p>
        
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
            <span>{new Date(event.date).toLocaleDateString('zh-TW')}</span>
          </div>
          
          {event.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-green-500" />
              <span>{event.location}</span>
            </div>
          )}
          
          {showRegion && (
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-purple-500" />
              <span>{regionName} · {year}年</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
