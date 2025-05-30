
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { HomePage } from "./pages/HomePage";
import { RegionPage } from "./pages/RegionPage";
import { YearPage } from "./pages/YearPage";
import { EventPage } from "./pages/EventPage";
import { ParticipantPage } from "./pages/ParticipantPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/region/:regionName" element={<RegionPage />} />
            <Route path="/region/:regionName/year/:year" element={<YearPage />} />
            <Route path="/region/:regionName/year/:year/event/:eventId" element={<EventPage />} />
            <Route path="/region/:regionName/year/:year/event/:eventId/participant/:participantId" element={<ParticipantPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
