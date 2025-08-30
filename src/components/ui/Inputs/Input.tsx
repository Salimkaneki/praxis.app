'use client';
import React from "react";
import { LucideIcon } from "lucide-react";

type InputProps = {
  label?: string;
  placeholder?: string;
  width?: string; // ex: "w-[440px]" ou "max-w-md"
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

export default function Input({ 
  label, 
  placeholder, 
  width = "w-full",
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onLeftIconClick,
  onRightIconClick,
  value,
  onChange,
  type = "text"
}: InputProps) {
  return (
    <div className={`flex flex-col gap-2 ${width}`}>
      {label && (
        <label className="font-poppins text-base text-gray-600">
          {label}
        </label>
      )}
      <div className="relative">
        {/* Left Icon */}
        {LeftIcon && (
          <div 
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 z-10 ${
              onLeftIconClick ? 'cursor-pointer text-gray-400 hover:text-forest-600 transition-smooth' : 'text-gray-400'
            }`}
            onClick={onLeftIconClick}
          >
            <LeftIcon className="w-5 h-5" />
          </div>
        )}
        
        {/* Input */}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder || "Enter text"}
          className={`h-[50px] px-4 py-2 rounded-xl 
                     font-poppins font-medium text-base
                     border border-gray-300 bg-gray-50
                     focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-500
                     text-gray-700 placeholder-gray-400
                     transition-smooth
                     hover:bg-gray-100 hover:border-gray-400 w-full
                     ${LeftIcon ? 'pl-11' : 'pl-4'}
                     ${RightIcon ? 'pr-11' : 'pr-4'}`}
        />
        
        {/* Right Icon */}
        {RightIcon && (
          <div 
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 z-10 ${
              onRightIconClick ? 'cursor-pointer text-gray-400 hover:text-forest-600 transition-smooth' : 'text-gray-400'
            }`}
            onClick={onRightIconClick}
          >
            <RightIcon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}