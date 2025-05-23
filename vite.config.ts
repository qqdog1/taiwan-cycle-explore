
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { vitePluginSSR } from 'vite-plugin-ssr/plugin';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import fs from 'fs';
import { generateStaticRoutes, generateSitemap, generateRobotsTxt } from './src/utils/staticPageGenerator';

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  // Generate routes for static site generation
  const routes = mode === 'production' ? await generateStaticRoutes() : [];
  
  // Generate and write sitemap and robots.txt in production mode
  if (mode === 'production') {
    // Create public directory if it doesn't exist
    const publicDir = path.resolve(__dirname, 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }
    
    // Write sitemap.xml
    const sitemap = generateSitemap(routes);
    fs.writeFileSync(path.resolve(publicDir, 'sitemap.xml'), sitemap);
    
    // Write robots.txt
    const robotsTxt = generateRobotsTxt();
    fs.writeFileSync(path.resolve(publicDir, 'robots.txt'), robotsTxt);
    
    console.log(`Generated sitemap.xml with ${routes.length} routes`);
  }
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
      
      // SSR plugin for static site generation
      mode === 'production' && vitePluginSSR({
        prerender: {
          routes,
        },
      }),
      
      // Copy JSON data file to the build output
      mode === 'production' && viteStaticCopy({
        targets: [
          {
            src: 'src/data/sampleData.json',
            dest: 'data',
          },
        ],
      }),
    ].filter(Boolean),
    
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
