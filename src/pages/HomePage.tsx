
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { RegionCard } from '@/components/RegionCard';
import { EventCard } from '@/components/EventCard';
import { loadData } from '@/utils/dataLoader';
import { DataStructure } from '@/types';
import { Loader2, RefreshCw, Star } from 'lucide-react';

export function HomePage() {
  const [data, setData] = useState<DataStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (forceRefresh = false) => {
    try {
      if (forceRefresh) setRefreshing(true);
      const result = await loadData(forceRefresh);
      setData(result);
    } catch (error) {
      console.error('載入資料失敗:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData(true);
  };

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

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-20">
          <p className="text-gray-600">載入資料失敗，請稍後再試</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* 最新活動區塊 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Star className="h-6 w-6 text-yellow-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">最新活動</h2>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              更新
            </button>
          </div>
          
          {data.latest_events.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.latest_events.map((latestEvent) => {
                // 找到對應的完整活動資料
                const region = data.regions.find(r => r.name === latestEvent.region);
                const year = region?.years.find(y => y.year === latestEvent.year);
                const event = year?.events.find(e => e.id === latestEvent.event_id);
                
                if (event && latestEvent.region) {
                  return (
                    <EventCard
                      key={latestEvent.event_id}
                      event={event}
                      regionName={latestEvent.region}
                      year={latestEvent.year || new Date().getFullYear()}
                      showRegion={true}
                    />
                  );
                }
                return null;
              })}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">目前沒有最新活動</p>
            </div>
          )}
        </section>

        {/* 縣市列表 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">所有縣市</h2>
          
          {data.regions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.regions.map((region) => (
                <RegionCard key={region.name} region={region} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">目前沒有活動資料</p>
            </div>
          )}
        </section>

        {/* 資料更新時間 */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>資料更新時間: {new Date(data.last_updated).toLocaleString('zh-TW')}</p>
        </div>
      </main>
    </div>
  );
}
