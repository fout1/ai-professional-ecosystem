
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useEffect } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import AIEmployees from "./pages/AIEmployees";
import BrainAI from "./pages/BrainAI";
import Calendar from "./pages/Calendar";
import { toast } from "sonner";

// Create QueryClient outside of the component
const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('user') !== null;
  
  useEffect(() => {
    // Clear onboarding flag to ensure it shows for testing
    if (window.location.search.includes('reset-onboarding')) {
      localStorage.removeItem('hasCompletedOnboarding');
      toast.success('Onboarding has been reset');
    }
  }, []);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if onboarding is completed
  const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding') === 'true';
  
  // If not completed onboarding, redirect to onboarding
  // Important: Make sure we force redirect to onboarding from any other page
  if (!hasCompletedOnboarding && window.location.pathname !== '/onboarding') {
    console.log('Redirecting to onboarding - not completed yet');
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
};

// Create a functional component that returns the routing structure
const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route 
        path="/onboarding" 
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/employees" 
        element={
          <ProtectedRoute>
            <AIEmployees />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/brain" 
        element={
          <ProtectedRoute>
            <BrainAI />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/calendar" 
        element={
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } 
      />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

// Main App component
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AnimatePresence mode="wait">
        <AppRoutes />
      </AnimatePresence>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
