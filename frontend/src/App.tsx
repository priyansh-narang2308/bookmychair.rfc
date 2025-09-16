import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Auth pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";

// Layout
import Layout from "./components/Layout";

// Employee pages
import Dashboard from "./pages/employee/Dashboard";
import BookChair from "./pages/employee/BookChair";
import MyBookings from "./pages/employee/MyBookings";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ChairManagement from "./pages/admin/ChairManagement";
import BookingManagement from "./pages/admin/BookingManagement";
import Reports from "./pages/admin/Reports";

// Shared pages
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, adminOnly = false }: { 
  children: React.ReactNode; 
  adminOnly?: boolean; 
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Employee routes */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="book-chair" element={<BookChair />} />
        <Route path="my-bookings" element={<MyBookings />} />
        <Route path="settings" element={<Settings />} />

        {/* Admin routes */}
        <Route
          path="admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/chairs"
          element={
            <ProtectedRoute adminOnly>
              <ChairManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/bookings"
          element={
            <ProtectedRoute adminOnly>
              <BookingManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/reports"
          element={
            <ProtectedRoute adminOnly>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/settings"
          element={
            <ProtectedRoute adminOnly>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;