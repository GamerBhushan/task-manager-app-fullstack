import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  linkText: string;
  linkTo: string;
  linkAction: string;
}

export const AuthLayout = ({ 
  children, 
  title, 
  subtitle, 
  linkText, 
  linkTo, 
  linkAction 
}: AuthLayoutProps) => {
  return (
    // Premium Background: Creamy Slate (Slate-50)
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {subtitle}{' '}
            <Link to={linkTo} className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              {linkText} <span className="underline">{linkAction}</span>
            </Link>
          </p>
        </div>

        {/* Card Section: White with subtle shadow */}
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200 sm:rounded-xl sm:px-10 border border-slate-100">
          {children}
        </div>
      </div>
    </div>
  );
};