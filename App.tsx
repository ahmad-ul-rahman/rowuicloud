
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import { routeFactories } from './utils/routeImports';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy Load Pages
const HomePage = lazy(routeFactories.HomePage);
const CategoryPage = lazy(routeFactories.CategoryPage);
const CategoriesPage = lazy(routeFactories.CategoriesPage);
const SinglePostPage = lazy(routeFactories.SinglePostPage);
const AllPostsPage = lazy(routeFactories.AllPostsPage);
const AboutPage = lazy(routeFactories.AboutPage);
const ContactPage = lazy(routeFactories.ContactPage);
const PrivacyPolicyPage = lazy(routeFactories.PrivacyPolicyPage);
const TermsPage = lazy(routeFactories.TermsPage);
const AdminDashboard = lazy(routeFactories.AdminDashboard);
const AdminLogin = lazy(routeFactories.AdminLogin);

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout Wrapper to handle conditional Navbar/Footer
const AppLayout: React.FC<{ children: React.ReactNode, darkMode: boolean, toggleTheme: () => void }> = ({ children, darkMode, toggleTheme }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 isolate">
      {!isAdminPath && <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />}
      <main 
        className={!isAdminPath ? "pt-20 min-h-[calc(100vh-400px)] relative" : "min-h-screen relative"}
        style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
      >
        {children}
      </main>
      {!isAdminPath && <Footer />}
    </div>
  );
};

const PageSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse opacity-60">
    <div className="space-y-4 mb-12">
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-2xl w-3/4 md:w-1/3"></div>
      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-lg w-full md:w-1/2"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden h-[420px] flex flex-col">
          <div className="h-56 bg-slate-200 dark:bg-slate-800 w-full"></div>
          <div className="p-6 flex-1 space-y-4">
            <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-6 w-full bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
              <div className="h-6 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  if (loading) return null;

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppLayout darkMode={darkMode} toggleTheme={toggleTheme}>
        <AnimatePresence mode="wait">
          <Suspense fallback={<PageSkeleton />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/posts" element={<AllPostsPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/tech" element={<CategoryPage category="Tech" />} />
              <Route path="/design" element={<CategoryPage category="Design" />} />
              <Route path="/tools" element={<CategoryPage category="Tools" />} />
              <Route path="/guides" element={<CategoryPage category="Guides" />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/blog/:slug" element={<SinglePostPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/admin/login" element={!session ? <AdminLogin /> : <Navigate to="/admin" replace />} />
              <Route path="/admin/*" element={session ? <AdminDashboard session={session} /> : <Navigate to="/admin/login" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </AppLayout>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: darkMode ? '#1e293b' : '#fff',
            color: darkMode ? '#fff' : '#333',
          },
        }}
      />
    </BrowserRouter>
  );
};

export default App;
