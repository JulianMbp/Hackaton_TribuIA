// ============================================
// BUTTON COMPONENT - PRIMARY, SECONDARY & DANGER VARIANTS
// ============================================

import React from "react";

export type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  loading = false,
  disabled,
  className = "",
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center";

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-black text-white hover:bg-neutral-800",
    secondary: "bg-neutral-200 text-neutral-900 hover:bg-neutral-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${
        loading ? "opacity-70 cursor-wait" : ""
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Cargando...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};
