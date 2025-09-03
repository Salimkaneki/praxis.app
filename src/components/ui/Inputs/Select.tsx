'use client';
import React, { useState, useEffect, useRef } from "react";

type Option = {
  value: string;
  label: string;
};

type SelectInputProps = {
  label?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement> | { target: { value: string } }) => void;
  options: Option[];
  leftIcon?: React.ComponentType<any>;
  width?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean; // ⭐ Ajout de la propriété disabled
};

export default function SelectInput({
  label,
  name,
  placeholder,
  value,
  onChange,
  options,
  leftIcon: Icon,
  width = "w-full",
  error,
  required = false,
  disabled = false, // ⭐ Valeur par défaut
}: SelectInputProps) {
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Gérer la position du dropdown selon viewport
  useEffect(() => {
    if (open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBottom = window.innerHeight - rect.bottom;
      const spaceTop = rect.top;

      if (spaceBottom < 200 && spaceTop > spaceBottom) {
        setDropUp(true);
      } else {
        setDropUp(false);
      }
    }
  }, [open]);

  const handleSelect = (val: string) => {
    if (disabled) return; // ⭐ Empêcher la sélection si disabled
    if (onChange) onChange({ target: { value: val } } as any);
    setOpen(false);
  };

  const handleToggle = () => {
    if (disabled) return; // ⭐ Empêcher l'ouverture si disabled
    setOpen(!open);
  };

  // Placeholder si aucune option sélectionnée
  const selectedLabel =
    value !== undefined && value !== null && value !== ""
      ? options.find((o) => o.value === value)?.label || ""
      : "";

  return (
    <div className={`flex flex-col gap-2 relative ${width}`} ref={containerRef}>
      {label && (
        <label className="font-poppins text-sm font-medium text-gray-600">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`h-[50px] px-4 ${Icon ? "pl-10" : "pl-4"} pr-8 rounded-xl 
                    font-poppins font-medium text-base
                    border ${error ? "border-red-300 bg-red-50" : "border-gray-300 bg-gray-50"}
                    text-gray-700 placeholder-gray-400
                    flex items-center justify-between
                    transition-smooth
                    relative
                    ${disabled 
                      ? "cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200" 
                      : "cursor-pointer hover:bg-gray-100 hover:border-gray-400"
                    }`} // ⭐ Styles conditionnels pour disabled
        onClick={handleToggle}
      >
        {Icon && (
          <Icon 
            className={`w-5 h-5 absolute left-3 ${
              disabled ? "text-gray-300" : "text-gray-400"
            }`} 
          />
        )}
        <span className={`${!selectedLabel ? "text-gray-400" : ""} ${disabled ? "text-gray-400" : ""}`}>
          {selectedLabel || placeholder}
        </span>
        <svg
          className={`h-4 w-4 transition-transform ${
            disabled ? "text-gray-300" : "text-gray-400"
          } ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Dropdown custom - ne s'affiche que si pas disabled */}
      {open && !disabled && (
        <ul
          className={`absolute left-0 z-50 w-full mt-0.5 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto
            ${dropUp ? "bottom-full mb-1" : "top-full mt-1"}`}
        >
          {options.map((opt, idx) => (
            <li
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`px-4 py-2 cursor-pointer hover:bg-forest-100 
                ${idx === 0 ? "rounded-t-xl" : ""} 
                ${idx === options.length - 1 ? "rounded-b-xl" : ""}`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}

      {error && (
        <span className="text-sm text-red-500 font-poppins">{error}</span>
      )}
    </div>
  );
}