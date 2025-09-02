'use client';
import React from "react";
import { LucideProps } from "lucide-react";

type InputProps = {
  label?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  error?: string;
  leftIcon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  rightIcon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  disabled?: boolean;
  className?: string;
};

export default function Input({ 
  label, 
  placeholder, 
  value,
  onChange,
  type = "text",
  required = false,
  error,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  disabled = false,
  className = ""
}: InputProps) {
  return (
    <div className="flex flex-col gap-2 flex-1">
      {label && (
        <label className="font-poppins text-sm font-medium text-gray-600">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {LeftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <LeftIcon className="w-5 h-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`h-[50px] ${LeftIcon ? 'pl-11' : 'pl-4'} ${RightIcon ? 'pr-11' : 'pr-4'} py-2 rounded-xl 
                     font-poppins font-medium text-base
                     border ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'}
                     focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-500
                     text-gray-700 placeholder-gray-400
                     transition-smooth
                     hover:bg-gray-100 hover:border-gray-400 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     w-full ${className}`}
        />
        {RightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
            <RightIcon className="w-5 h-5 text-gray-400" />
          </div>
        )}
      </div>
      {error && (
        <span className="text-sm text-red-500 font-poppins">{error}</span>
      )}
    </div>
  );
}