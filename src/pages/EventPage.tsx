
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Breadcrumb } from '@/components/Breadcrumb';
import { loadData, findEvent, generateBreadcrumbs, getParticipantPath } from '@/utils/dataLoader';
import { Event } from '@/types';
import { Loader2, Calendar, MapPin, Users, Mail, Phone, User } from 'lucide-react';

export function EventPage() {
  const { regionName, year, eventId } = useParams<{ 
    regionName: string; 
    year: string; 
    eventId: string; 
  }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadData();
        const decodedRegionName = decodeURIComponent(regionName || '');
        const yearNum = parseInt(year || '0');
        const foundEvent = findEvent(data, decodedRegionName, yearNum, eventId || '');
        setEvent(foundEvent);
      } catch (error) {
        console.error('載入活動資料失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [regionName, year, eventId]);

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

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <p className="text-gray-600">找不到該活動資料</p>
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
  const yearNum = parseInt(year || '0');

  // 按照組別分組參賽者
  const participantsByCategory = event.participants.reduce((acc, participant) => {
    const category = participant.detail.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(participant);
    return acc;
  }, {} as Record<string, typeof event.participants>);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbs} />
        
        {/* 活動資訊 */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{event.summary}</p>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">活動日期</p>
                  <p className="font-medium">{new Date(event.date).toLocaleDateString('zh-TW')}</p>
                </div>
              </div>
              
              {event.location && (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">活動地點</p>
                    <p className="font-medium">{event.location}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center">
                <Users className="h-5 w-5 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">報名人數</p>
                  <p className="font-medium">{event.participants.length} 人</p>
                </div>
              </div>
            </div>
          </div>
          
          {event.description && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">活動詳情</h2>
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </div>
          )}
        </div>

        {/* 參賽選手 */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">參賽選手</h2>
          
          {Object.keys(participantsByCategory).length > 0 ? (
            <div className="space-y-8">
              {Object.entries(participantsByCategory).map(([category, participants]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                    {category} ({participants.length} 人)
                  </h3>
                  
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {participants.map((participant) => {
                      const participantPath = getParticipantPath(
                        decodedRegionName, 
                        yearNum, 
                        event.id, 
                        participant.id
                      );
                      
                      return (
                        <Link
                          key={participant.id}
                          to={participantPath}
                          className="block"
                        >
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border border-gray-200">
                            <div className="flex items-center mb-3">
                              <User className="h-5 w-5 text-blue-500 mr-2" />
                              <h4 className="font-semibold text-gray-900">{participant.name}</h4>
                            </div>
                            
                            <div className="space-y-1 text-sm text-gray-600">
                              <p>年齡: {participant.detail.age} 歲</p>
                              {participant.detail.city && (
                                <p>城市: {participant.detail.city}</p>
                              )}
                              <div className="flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                <span className="truncate">{participant.detail.email}</span>
                              </div>
                              {participant.detail.phone && (
                                <div className="flex items-center">
                                  <Phone className="h-3 w-3 mr-1" />
                                  <span>{participant.detail.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">目前沒有參賽選手</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
