
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Event } from '@/types';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  event?: Event;
}

export function SEO({ title, description, canonical, event }: SEOProps) {
  // Base values
  const siteTitle = '台灣單車賽事 - Taiwan Cycling Events';
  const siteDescription = '台灣各縣市單車比賽活動資訊平台，提供最新活動資訊與參賽選手資料';
  
  const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const pageDescription = description || siteDescription;
  
  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      
      {canonical && <link rel="canonical" href={canonical} />}
      
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content="website" />
      
      {/* Add structured data if event is provided */}
      {event?.ld_json && (
        <script type="application/ld+json">
          {JSON.stringify(event.ld_json)}
        </script>
      )}
    </Helmet>
  );
}
