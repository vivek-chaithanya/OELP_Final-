import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Crops from "./pages/Crops";
import Fields from "./pages/Fields";
import Subscriptions from "./pages/Subscriptions";
import Practices from "./pages/Practices";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import { Layout } from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/crops" element={<Layout><Crops /></Layout>} />
          <Route path="/fields" element={<Layout><Fields /></Layout>} />
          <Route path="/subscriptions" element={<Layout><Subscriptions /></Layout>} />
          <Route path="/practices" element={<Layout><Practices /></Layout>} />
          <Route path="/reports" element={<Layout><Reports /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
