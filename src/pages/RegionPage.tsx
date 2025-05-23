
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Breadcrumb } from '@/components/Breadcrumb';
import { loadData, generateBreadcrumbs } from '@/utils/dataLoader';
import { Region } from '@/types';
import { Loader2, Calendar, Trophy } from 'lucide-react';

export function RegionPage() {
  const { regionName } = useParams<{ regionName: string }>();
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadData();
        const decodedRegionName = decodeURIComponent(regionName || '');
        const foundRegion = data.regions.find(r => r.name === decodedRegionName);
        setRegion(foundRegion || null);
      } catch (error) {
        console.error('載入區域資料失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [regionName]);

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

  if (!region) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <p className="text-gray-600">找不到該縣市資料</p>
            <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
              返回首頁
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const breadcrumbs = generateBreadcrumbs(location.pathname);
  const sortedYears = [...region.years].sort((a, b) => b.year - a.year);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbs} />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{region.name}</h1>
          <p className="text-gray-600">選擇年份來瀏覽活動</p>
        </div>

        {sortedYears.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedYears.map((yearData) => {
              const totalEvents = yearData.events.length;
              const totalParticipants = yearData.events.reduce(
                (sum, event) => sum + event.participants.length, 
                0
              );
              
              return (
                <Link
                  key={yearData.year}
                  to={`/region/${encodeURIComponent(region.name)}/year/${yearData.year}`}
                  className="block"
                >
                  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-blue-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {yearData.year}年
                      </h3>
                      <Calendar className="h-6 w-6 text-blue-500" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">活動數量</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                          {totalEvents} 個
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">總參與人數</span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                          {totalParticipants} 人
                        </span>
                      </div>
                      
                      {totalEvents > 0 && (
                        <div className="pt-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <Trophy className="h-4 w-4 mr-1" />
                            <span>最新活動: {yearData.events[0]?.title}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">該縣市目前沒有活動資料</p>
          </div>
        )}
      </main>
    </div>
  );
}
