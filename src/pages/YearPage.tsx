
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Breadcrumb } from '@/components/Breadcrumb';
import { EventCard } from '@/components/EventCard';
import { loadData, generateBreadcrumbs } from '@/utils/dataLoader';
import { Year } from '@/types';
import { Loader2, Calendar } from 'lucide-react';

export function YearPage() {
  const { regionName, year } = useParams<{ regionName: string; year: string }>();
  const [yearData, setYearData] = useState<Year | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadData();
        const decodedRegionName = decodeURIComponent(regionName || '');
        const region = data.regions.find(r => r.name === decodedRegionName);
        const foundYear = region?.years.find(y => y.year === parseInt(year || '0'));
        setYearData(foundYear || null);
      } catch (error) {
        console.error('載入年份資料失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [regionName, year]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">載入中...</span>
        </div>
      </div>
    );
  }

  if (!yearData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <p className="text-gray-600">找不到該年份的活動資料</p>
            <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
              返回首頁
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const breadcrumbs = generateBreadcrumbs(location.pathname);
  const decodedRegionName = decodeURIComponent(regionName || '');
  const sortedEvents = [...yearData.events].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbs} />
        
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Calendar className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              {decodedRegionName} - {year}年
            </h1>
          </div>
          <p className="text-gray-600">
            共有 {yearData.events.length} 個活動，
            總計 {yearData.events.reduce((sum, event) => sum + event.participants.length, 0)} 人參與
          </p>
        </div>

        {sortedEvents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                regionName={decodedRegionName}
                year={parseInt(year || '0')}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">該年份目前沒有活動資料</p>
          </div>
        )}
      </main>
    </div>
  );
}
