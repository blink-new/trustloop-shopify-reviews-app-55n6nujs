import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ShopifyProvider } from './contexts/ShopifyContext';
import { Toaster } from 'sonner';
import { lazy, Suspense } from 'react';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Page components (lazy loaded)
const LoginPage = lazy(() => import('./pages/LoginPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Reviews = lazy(() => import('./pages/Reviews'));
const QA = lazy(() => import('./pages/QA'));
const Campaigns = lazy(() => import('./pages/Campaigns'));
const Widgets = lazy(() => import('./pages/Widgets'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Moderation = lazy(() => import('./pages/Moderation'));
const Settings = lazy(() => import('./pages/Settings'));
const StoreSetup = lazy(() => import('./pages/StoreSetup'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading component for lazy-loaded pages
const PageLoader = () => (
  <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
    <div className="animate-pulse flex flex-col items-center gap-4">
      <div className="h-12 w-12 rounded-full bg-primary/20"></div>
      <div className="h-4 w-48 bg-muted rounded"></div>
    </div>
  </div>
);

function App() {
  // In a real Shopify app, this would come from environment variables
  const shopifyApiKey = 'demo_api_key';

  return (
    <BrowserRouter>
      <ShopifyProvider apiKey={shopifyApiKey}>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/reviews" element={<Reviews />} />
                      <Route path="/qa" element={<QA />} />
                      <Route path="/campaigns" element={<Campaigns />} />
                      <Route path="/widgets" element={<Widgets />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/moderation" element={<Moderation />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/store-setup" element={<StoreSetup />} />
                      <Route path="/404" element={<NotFound />} />
                      <Route path="*" element={<Navigate to="/404" replace />} />
                    </Routes>
                  </Suspense>
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </ShopifyProvider>
    </BrowserRouter>
  );
}

export default App;