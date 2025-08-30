'use client';
import React from "react";

type InputProps = {
  label?: string;
  placeholder?: string;
  width?: string; // ex: "w-[440px]" ou "max-w-md"
};

export default function Input({ label, placeholder, width = "w-full" }: InputProps) {
  return (
    <div className={`flex flex-col gap-2 ${width}`}>
      {label && (
        <label className="font-inter text-base text-gray-600">
          {label}
        </label>
      )}
      <input
        type="text"
        placeholder={placeholder || "Enter text"}
        className="h-[50px] px-4 py-2 rounded-xl 
                   font-inter font-medium text-base
                   border border-gray-300 bg-gray-50
                   focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-500
                   text-gray-700 placeholder-gray-400
                   transition-smooth
                   hover:bg-gray-100 hover:border-gray-400 w-full"
      />
    </div>
  );
}
