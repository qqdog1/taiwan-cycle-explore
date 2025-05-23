
import fs from 'fs';
import path from 'path';
import { DataStructure, Event } from '@/types';

export async function generateStaticRoutes() {
  try {
    const dataPath = path.resolve(__dirname, '../../src/data/sampleData.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const data: DataStructure = JSON.parse(rawData);
    
    const routes: string[] = ['/'];
    
    // Generate region routes
    data.regions.forEach((region) => {
      const regionPath = `/region/${encodeURIComponent(region.name)}`;
      routes.push(regionPath);
      
      // Generate year routes
      region.years.forEach((year) => {
        const yearPath = `${regionPath}/year/${year.year}`;
        routes.push(yearPath);
        
        // Generate event routes
        year.events.forEach((event) => {
          const eventPath = `${yearPath}/event/${event.id}`;
          routes.push(eventPath);
          
          // Generate participant routes
          event.participants.forEach((participant) => {
            const participantPath = `${eventPath}/participant/${participant.id}`;
            routes.push(participantPath);
          });
        });
      });
    });
    
    return routes;
  } catch (error) {
    console.error('Error generating static routes:', error);
    return ['/'];
  }
}

export function generateSitemap(routes: string[]) {
  const baseUrl = 'https://taiwan-cycling-events.lovable.app'; // Replace with your actual domain
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes.map(route => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;
  
  return xml;
}

export function generateRobotsTxt() {
  return `User-agent: *
Allow: /
Sitemap: https://taiwan-cycling-events.lovable.app/sitemap.xml`; // Replace with your actual domain
}
