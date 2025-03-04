import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "text" | "decimal" | "number" | "email" | "password";
  label?: string;
  errorMessage?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { variant = "default", label, errorMessage, className = "", required, ...props },
    ref
  ) => {
    let baseType = props.type || "text";
    const [hasError, setHasError] = React.useState(false);
    const [localErrorMessage, setLocalErrorMessage] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const isDecimal = variant === "decimal";
    const isNumber = variant === "number";
    const isEmail = variant === "email";
    const isPassword = variant === "password";
    const extraProps: Partial<React.InputHTMLAttributes<HTMLInputElement>> = {};

    if (isDecimal) {
      baseType = "number";
      if (!props.step) extraProps.step = "0.01";
      if (!props.min) extraProps.min = "0";
    } else if (isNumber) {
      baseType = "number";
      if (!props.step) extraProps.step = "1";
      if (!props.min) extraProps.min = "0";
    } else if (isEmail) {
      baseType = "email";
    } else if (isPassword) {
      baseType = showPassword ? "text" : "password";
    }

    const baseClasses = [
      "w-full bg-transparent text-sm py-2 px-0 outline-none",
      "border-b border-b-primary-light transition-colors focus:outline-none focus:border-primary",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    ].join(" ");
    const borderClass = hasError ? "border-b-error" : "border-b-primary-light";
    const finalClasses = isPassword
      ? `${baseClasses} pr-8 ${borderClass}`
      : `${baseClasses} ${borderClass}`;

    const validateValue = (value: string): string => {
      let errorText = "";
      if (required && !value) {
        errorText = "Campo requerido";
      } else if (props.minLength !== undefined && value.length < props.minLength) {
        errorText = `La longitud mínima es de ${props.minLength} caracteres`;
      } else if (props.maxLength !== undefined && value.length > props.maxLength) {
        errorText = `La longitud máxima es de ${props.maxLength} caracteres`;
      } else if (isEmail && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errorText = "Email inválido";
        }
      }
      setHasError(!!errorText);
      setLocalErrorMessage(errorText);
      return errorText;
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const error = validateValue(e.target.value);
      e.target.setCustomValidity(error);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      if (props.maxLength !== undefined && newValue.length > props.maxLength) {
        newValue = newValue.slice(0, props.maxLength);
        e.target.value = newValue;
      }
      const error = validateValue(newValue);
      e.target.setCustomValidity(error);
      props.onChange?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if ((isDecimal || isNumber) && e.key === "-") {
        e.preventDefault();
      }
      props.onKeyDown?.(e);
    };

    const handleInvalid = (e: React.InvalidEvent<HTMLInputElement>) => {
      e.preventDefault();
      const error = validateValue(e.target.value);
      e.target.setCustomValidity(error);
    };

    return (
      <div className="mb-4">
        {label && (
          <label className="block text-sm text-primary-dark mb-1">
            {label}
            {required && <span className="ml-1 text-error">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={baseType}
            {...extraProps}
            {...props}
            required={required}
            className={finalClasses}
            onBlur={handleBlur}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onInvalid={handleInvalid}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-0 top-1/2 -translate-y-1/2 pr-1 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-primary-light" />
              ) : (
                <Eye className="h-4 w-4 text-primary-light" />
              )}
            </button>
          )}
        </div>
        {hasError && (
          <p className="mt-1 text-xs text-error">
            {errorMessage || localErrorMessage}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
