import { type ReactNode } from 'react';
import { Navbar } from '../components/Navbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* The Navbar is now the single source of truth for navigation.
        It handles:
        1. Desktop Links
        2. Mobile Menu (Slide-over)
        3. User Dropdown & Logout
        4. Notification Bell
      */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
        {children}
      </main>

      {/* Optional: Unified Footer for Dashboard pages (can be removed if you want infinite scroll feel) */}
      <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-200 mt-auto">
        <p>&copy; 2025 Task Manager. Secure & Real-time.</p>
      </footer>
    </div>
  );
};