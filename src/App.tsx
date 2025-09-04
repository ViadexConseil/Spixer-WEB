import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Events from "./pages/Events";
import CourseDetail from "./pages/CourseDetail";
import Clubs from "./pages/Clubs";
import Inscription from "./pages/Inscription";
import Login from "./pages/Login";
import Profil from "./pages/Profil";
import CreateEvent from "./pages/CreateEvent";
import AdminDashboard from "./pages/AdminDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import Pricing from "./pages/Pricing";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Settings from "./pages/Settings";
import Privacy from "./pages/Privacy";
import { AuthProvider } from "./hooks/useAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Events Management */}
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<CourseDetail />} />
          <Route path="/clubs" element={<Clubs />} />
            <Route path="/events/:id/register" element={<Inscription />} />
            <Route path="/events/:id/volunteer" element={<Inscription />} />
            <Route path="/create-event" element={<CreateEvent />} />
            {/* User Management */}
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profil />} />
            <Route path="/settings" element={<Settings />} />
            {/* Admin & Organizer */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/organizer" element={<OrganizerDashboard />} />
            {/* Commerce */}
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/checkout" element={<Checkout />} />
            {/* Static Pages */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
            {/* Legacy redirects for backward compatibility */}
            <Route path="/courses" element={<Events />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/courses/:id/participer" element={<Inscription />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/create" element={<CreateEvent />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
