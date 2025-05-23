
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Breadcrumb } from '@/components/Breadcrumb';
import { loadData, findEvent, findParticipant, generateBreadcrumbs } from '@/utils/dataLoader';
import { Event, Participant } from '@/types';
import { Loader2, User, Mail, Phone, MapPin, Calendar, Trophy, ArrowLeft } from 'lucide-react';

export function ParticipantPage() {
  const { regionName, year, eventId, participantId } = useParams<{ 
    regionName: string; 
    year: string; 
    eventId: string;
    participantId: string;
  }>();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadData();
        const decodedRegionName = decodeURIComponent(regionName || '');
        const yearNum = parseInt(year || '0');
        const foundEvent = findEvent(data, decodedRegionName, yearNum, eventId || '');
        
        if (foundEvent) {
          const foundParticipant = findParticipant(foundEvent, participantId || '');
          setEvent(foundEvent);
          setParticipant(foundParticipant);
        }
      } catch (error) {
        console.error('載入選手資料失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [regionName, year, eventId, participantId]);

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

  if (!event || !participant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <p className="text-gray-600">找不到選手資料</p>
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
  const eventPath = `/region/${encodeURIComponent(decodedRegionName)}/year/${yearNum}/event/${eventId}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbs} />
        
        {/* 返回活動按鈕 */}
        <div className="mb-6">
          <Link 
            to={eventPath}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回活動頁面
          </Link>
        </div>

        {/* 選手基本資訊 */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 rounded-full p-4 mr-6">
              <User className="h-12 w-12 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{participant.name}</h1>
              <div className="flex items-center text-gray-600">
                <Trophy className="h-5 w-5 mr-2" />
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {participant.detail.category}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                個人資訊
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">年齡</p>
                    <p className="font-medium">{participant.detail.age} 歲</p>
                  </div>
                </div>

                {participant.detail.city && (
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-purple-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">居住城市</p>
                      <p className="font-medium">{participant.detail.city}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                聯絡資訊
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">電子郵件</p>
                    <a 
                      href={`mailto:${participant.detail.email}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {participant.detail.email}
                    </a>
                  </div>
                </div>

                {participant.detail.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-orange-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">電話</p>
                      <a 
                        href={`tel:${participant.detail.phone}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {participant.detail.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 參賽活動資訊 */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">參賽活動</h2>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
            <p className="text-gray-600 mb-4">{event.summary}</p>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">活動日期</p>
                  <p className="text-sm font-medium">{new Date(event.date).toLocaleDateString('zh-TW')}</p>
                </div>
              </div>
              
              {event.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-green-500 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">活動地點</p>
                    <p className="text-sm font-medium">{event.location}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center">
                <Trophy className="h-4 w-4 text-purple-500 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">地區年份</p>
                  <p className="text-sm font-medium">{decodedRegionName} · {yearNum}年</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Link 
                to={eventPath}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                查看完整活動資訊 →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
