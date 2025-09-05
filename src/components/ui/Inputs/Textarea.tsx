'use client';
import React from "react";
import { LucideProps } from "lucide-react";

type TextareaProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  error?: string;
  leftIcon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  rightIcon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  disabled?: boolean;
  className?: string;
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
};

export default function Textarea({ 
  label, 
  placeholder, 
  value = "",
  onChange,
  required = false,
  error,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  disabled = false,
  className = "",
  rows = 4,
  maxLength,
  showCharCount = false
}: TextareaProps) {
  const charCount = value?.length || 0;

  return (
    <div className="flex flex-col gap-2 flex-1">
      {label && (
        <label className="font-poppins text-sm font-medium text-gray-600">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {LeftIcon && (
          <div className="absolute left-3 top-3 z-10">
            <LeftIcon className="w-5 h-5 text-gray-400" />
          </div>
        )}
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={`min-h-[100px] ${LeftIcon ? 'pl-11' : 'pl-4'} ${RightIcon ? 'pr-11' : 'pr-4'} py-3 rounded-xl 
                     font-poppins font-medium text-base
                     border ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'}
                     focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-500
                     text-gray-700 placeholder-gray-400
                     transition-smooth
                     hover:bg-gray-100 hover:border-gray-400 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     resize-none
                     w-full ${className}`}
        />
        {RightIcon && (
          <div className="absolute right-3 top-3 z-10">
            <RightIcon className="w-5 h-5 text-gray-400" />
          </div>
        )}
        {showCharCount && maxLength && (
          <div className="absolute bottom-3 right-3 text-xs text-gray-400 font-poppins">
            {charCount}/{maxLength}
          </div>
        )}
      </div>
      <div className="flex justify-between items-center">
        {error && (
          <span className="text-sm text-red-500 font-poppins">{error}</span>
        )}
        {showCharCount && maxLength && !error && (
          <span className={`text-xs font-poppins ml-auto ${
            charCount > maxLength * 0.9 ? 'text-orange-500' : 'text-gray-400'
          }`}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}