import { DataStructure, Event, Participant } from '@/types';

let cachedData: DataStructure | null = null;
let lastFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5分鐘快取

export async function loadData(forceRefresh = false): Promise<DataStructure> {
  const now = Date.now();
  
  if (!forceRefresh && cachedData && (now - lastFetch < CACHE_DURATION)) {
    return cachedData;
  }

  try {
    // Check if we're running in SSG/production mode with pre-built data
    const isStaticBuild = import.meta.env.PROD;
    const dataPath = isStaticBuild ? '/data/sampleData.json' : '/src/data/sampleData.json';
    
    const response = await fetch(dataPath);
    const data = await response.json();
    
    cachedData = data;
    lastFetch = now;
    
    console.log('資料載入完成:', new Date().toISOString());
    console.log('載入模式:', isStaticBuild ? '靜態生成' : '動態載入');
    return data;
  } catch (error) {
    console.error('載入資料失敗:', error);
    
    // 如果載入失敗且有快取資料，返回快取資料
    if (cachedData) {
      return cachedData;
    }
    
    // 回傳空資料結構
    return {
      regions: [],
      latest_events: [],
      last_updated: new Date().toISOString()
    };
  }
}

export function findEvent(data: DataStructure, regionName: string, year: number, eventId: string): Event | null {
  const region = data.regions.find(r => r.name === regionName);
  if (!region) return null;
  
  const yearData = region.years.find(y => y.year === year);
  if (!yearData) return null;
  
  return yearData.events.find(e => e.id === eventId) || null;
}

export function findParticipant(event: Event, participantId: string): Participant | null {
  return event.participants.find(p => p.id === participantId) || null;
}

export function getEventPath(regionName: string, year: number, eventId: string): string {
  return `/region/${encodeURIComponent(regionName)}/year/${year}/event/${eventId}`;
}

export function getParticipantPath(regionName: string, year: number, eventId: string, participantId: string): string {
  return `${getEventPath(regionName, year, eventId)}/participant/${participantId}`;
}

// 產生麵包屑導航
export function generateBreadcrumbs(path: string): Array<{label: string, path: string}> {
  const parts = path.split('/').filter(Boolean);
  const breadcrumbs = [{label: '首頁', path: '/'}];
  
  if (parts.length >= 2 && parts[0] === 'region') {
    const regionName = decodeURIComponent(parts[1]);
    breadcrumbs.push({label: regionName, path: `/region/${parts[1]}`});
    
    if (parts.length >= 4 && parts[2] === 'year') {
      const year = parts[3];
      breadcrumbs.push({label: `${year}年`, path: `/region/${parts[1]}/year/${year}`});
      
      if (parts.length >= 6 && parts[4] === 'event') {
        breadcrumbs.push({label: '活動詳情', path: `/region/${parts[1]}/year/${year}/event/${parts[5]}`});
        
        if (parts.length >= 8 && parts[6] === 'participant') {
          breadcrumbs.push({label: '選手資料', path: path});
        }
      }
    }
  }
  
  return breadcrumbs;
}
