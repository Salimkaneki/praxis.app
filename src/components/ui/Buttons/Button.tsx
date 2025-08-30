'use client';
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  size?: "large" | "small";
  width?: string; // ex: "w-[300px]" ou "max-w-md"
  onClick?: () => void;
};

export default function Button({
  children,
  size = "large",
  width,
  onClick,
}: ButtonProps) {
  const baseClasses =
    "h-[50px] rounded-xl font-inter text-base transition-smooth focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-500";

  const sizeClasses =
    size === "large"
      ? "w-full px-6"
      : "w-[200px] px-4";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${width ? width : sizeClasses} 
                  bg-forest-500 text-white 
                  hover:bg-forest-600 active:bg-forest-700`}
    >
      {children}
    </button>
  );
}
