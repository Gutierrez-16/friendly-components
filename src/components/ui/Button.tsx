import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  color?: 
    | "primary" | "primaryl" | "primarym"
    | "secondary" | "secondaryl" | "secondarym"
    | "warning" 
    | "error" 
    | "info" 
    | "success" ;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}


export const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  color = "primary",
  isLoading = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeClasses = {
    xs: "text-xs px-6 h-18 w-18",  
    sm: "text-sm px-4 h-8",  
    md: "text-base px-5 h-10",  
    lg: "text-lg px-6 h-12",  
    xl: "text-xl px-8 h-14",  
    "2xl": "text-2xl px-10 h-16",  
  };
  const colorClasses = {
    primary: "bg-primary-dark text-white hover:bg-primary-dark",
    primaryl: "bg-primary-light text-white hover:bg-primary",
    primarym: "bg-primary text-white hover:bg-primary",
  
    secondary: "bg-secondary-dark text-white hover:bg-secondary-dark",
    secondaryl: "bg-secondary-light text-white hover:bg-secondary-light",
    secondarym: "bg-secondary text-white hover:bg-secondary",

    warning: "bg-warning text-white hover:bg-warning",
  
    error: "bg-error text-white hover:bg-error",
  
    info: "bg-info text-white hover:bg-info",
  
    success: "bg-success text-white hover:bg-success",
  };
  

  const finalClasses = `${baseClasses} ${sizeClasses[size]} ${colorClasses[color]} ${className}`;

  return (
    <button className={finalClasses} disabled={disabled || isLoading} {...props}>
      {isLoading && <span className="loader mr-2"></span>}
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};
