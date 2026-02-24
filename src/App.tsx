import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ResidentialBalustrading from "./pages/ResidentialBalustrading";
import PoolFencing from "./pages/PoolFencing";
import CommercialProjects from "./pages/CommercialProjects";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfTrade from "./pages/TermsOfTrade";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/residential-balustrading" element={<ResidentialBalustrading />} />
          <Route path="/pool-fencing" element={<PoolFencing />} />
          <Route path="/commercial-projects" element={<CommercialProjects />} />
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
