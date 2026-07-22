import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Balustrades from "./pages/Balustrades";
import PoolFencing from "./pages/PoolFencing";
import HeatPumpCovers from "./pages/HeatPumpCovers";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfTrade from "./pages/TermsOfTrade";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/balustrades" element={<Balustrades />} />
          <Route path="/pool-fencing" element={<PoolFencing />} />
          <Route path="/heat-pump-covers" element={<HeatPumpCovers />} />
          {/* Old service URLs now redirect to the combined Balustrades page */}
          <Route path="/residential-balustrading" element={<Navigate to="/balustrades" replace />} />
          <Route path="/commercial-projects" element={<Navigate to="/balustrades" replace />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-trade" element={<TermsOfTrade />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
