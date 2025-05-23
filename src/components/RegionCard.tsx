
import { ChevronRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Region } from '@/types';

interface RegionCardProps {
  region: Region;
}

export function RegionCard({ region }: RegionCardProps) {
  const totalEvents = region.years.reduce((sum, year) => sum + year.events.length, 0);
  const latestYear = Math.max(...region.years.map(y => y.year));
  
  return (
    <Link to={`/region/${encodeURIComponent(region.name)}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-blue-300">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {region.name}
            </h3>
            
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Calendar className="h-4 w-4 mr-1" />
              <span>最新年份: {latestYear}</span>
            </div>
            
            <div className="flex space-x-4 text-sm">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {region.years.length} 個年份
              </span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                {totalEvents} 個活動
              </span>
            </div>
          </div>
          
          <ChevronRight className="h-6 w-6 text-gray-400" />
        </div>
      </div>
    </Link>
  );
}
