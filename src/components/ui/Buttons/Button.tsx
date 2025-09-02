'use client';
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  size?: "large" | "small";
  width?: string; // ex: "w-[300px]" ou "max-w-md"
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "danger"; // <-- ajouté
};

export default function Button({
  children,
  size = "large",
  width,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  variant = "primary",
}: ButtonProps) {
  const baseClasses =
    "h-[50px] rounded-xl font-poppins text-sm font-medium transition-smooth focus:outline-none focus:ring-2";

  const sizeClasses =
    size === "large" ? "w-full px-6" : "w-[200px] px-4";

  const variantClasses =
    variant === "primary"
      ? "bg-forest-600 text-white hover:bg-forest-700 focus:ring-forest-500"
      : variant === "secondary"
      ? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500"
      : "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"; // danger

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${width ?? sizeClasses} ${variantClasses} 
        ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  );
}
