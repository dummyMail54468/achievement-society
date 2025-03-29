
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AchievementProvider } from "./context/AchievementContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import AchievementDetailPage from "./pages/AchievementDetailPage";
import AchievementFormPage from "./pages/AchievementFormPage";
import SearchPage from "./pages/SearchPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AchievementProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/profile/:username" element={<ProfilePage />} />
                <Route 
                  path="/profile/edit" 
                  element={
                    <ProtectedRoute>
                      {/* Profile Edit Page would go here */}
                      <NotFound />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/achievement/:id" element={<AchievementDetailPage />} />
                <Route 
                  path="/achievement/new" 
                  element={
                    <ProtectedRoute>
                      <AchievementFormPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/achievement/edit/:id" 
                  element={
                    <ProtectedRoute>
                      <AchievementFormPage />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AchievementProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
