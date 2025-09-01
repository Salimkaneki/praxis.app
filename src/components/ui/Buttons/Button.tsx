'use client';
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  size?: "large" | "small";
  width?: string; // ex: "w-[300px]" ou "max-w-md"
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;  // <-- ajouté ici
  className?: string; // <-- ajouté ici

};

export default function Button({
  children,
  size = "large",
  width,
  onClick,
  type = "button",
  disabled = false,  // valeur par défaut
}: ButtonProps) {
  const baseClasses =
    "h-[50px] rounded-xl font-inter text-base transition-smooth focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-500";

  const sizeClasses =
    size === "large"
      ? "w-full px-6"
      : "w-[200px] px-4";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}  // <-- appliqué ici
      className={`${baseClasses} ${width ? width : sizeClasses} 
                  bg-forest-500 text-white 
                  hover:bg-forest-600 active:bg-forest-700
                  ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}
