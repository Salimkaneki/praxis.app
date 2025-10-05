'use client';
import React, { useState, useRef, useEffect } from "react";

type SessionCodeInputProps = {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  length?: number;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
};

export default function SessionCodeInput({
  label,
  value = "",
  onChange,
  length = 6,
  required = false,
  error,
  disabled = false,
  className = ""
}: SessionCodeInputProps) {
  const [code, setCode] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize code array from value prop - only when value changes externally
  useEffect(() => {
    if (value !== code.join("")) {
      if (value) {
        const codeArray = value.split("").slice(0, length);
        while (codeArray.length < length) {
          codeArray.push("");
        }
        setCode(codeArray);
      } else {
        setCode(Array(length).fill(""));
      }
    }
  }, [value, length]); // Removed code from dependencies to prevent infinite loop

  // Update parent component when code changes - only if different from current value
  useEffect(() => {
    const fullCode = code.join("");
    if (onChange && fullCode !== value && fullCode.length === length) {
      onChange(fullCode);
    }
  }, [code, onChange, value, length]);

  const handleInputChange = (index: number, inputValue: string) => {
    if (disabled) return;

    // Only allow alphanumeric characters
    const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    if (sanitizedValue.length <= 1) {
      const newCode = [...code];
      newCode[index] = sanitizedValue;
      setCode(newCode);

      // Auto-focus next input if a character was entered
      if (sanitizedValue && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === "Backspace" && !code[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return;

    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    if (pasteData.length > 0) {
      const newCode = [...code];
      for (let i = 0; i < Math.min(pasteData.length, length); i++) {
        newCode[i] = pasteData[i] || "";
      }
      setCode(newCode);

      // Focus the next empty input or the last input
      const nextEmptyIndex = newCode.findIndex(char => char === "");
      const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="flex flex-col gap-2 flex-1">
      {label && (
        <label className="font-sans text-sm font-medium text-gray-600">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex gap-2 justify-center">
        {code.map((char, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            value={char}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            disabled={disabled}
            maxLength={1}
            className={`w-12 h-[50px] text-center rounded-xl
                       font-sans font-medium text-lg
                       border ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'}
                       focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-500
                       text-gray-700 placeholder-gray-400
                       transition-smooth
                       hover:bg-gray-100 hover:border-gray-400
                       disabled:opacity-50 disabled:cursor-not-allowed
                       ${className}`}
            placeholder=""
          />
        ))}
      </div>

      {error && (
        <span className="text-sm text-red-500 font-sans text-center">{error}</span>
      )}
    </div>
  );
}