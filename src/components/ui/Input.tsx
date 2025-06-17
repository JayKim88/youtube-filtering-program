import React from "react";
import { cn } from "../../utils";
import type { InputProps } from "../../types";

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      placeholder,
      value,
      onChange,
      disabled = false,
      error,
      label,
      required = false,
      id,
      onKeyPress,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={cn(
            "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm",
            "focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500",
            "disabled:bg-gray-50 disabled:text-gray-500",
            error && "border-red-300 focus:ring-red-500 focus:border-red-500",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
