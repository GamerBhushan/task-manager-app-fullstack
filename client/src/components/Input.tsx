import { forwardRef, useState } from 'react'; // Import useState
import type { InputHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LuEye, LuEyeOff } from 'react-icons/lu'; // Import Icons

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, type, ...props }, ref) => {
    // State to toggle visibility
    const [showPassword, setShowPassword] = useState(false);
    
    // Check if this is a password field
    const isPassword = type === 'password';

    return (
      <div className="flex flex-col gap-1 w-full relative">
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
        
        <div className="relative">
          <input
            ref={ref}
            // If it's a password field, toggle between 'text' and 'password'
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            className={cn(
              "w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
              error && "border-red-500 focus:ring-red-500",
              isPassword && "pr-10", // Add padding for the eye icon
              className
            )}
            {...props}
          />
          
          {/* The Eye Button */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
            </button>
          )}
        </div>

        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;