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
      "border-b transition-colors focus:outline-none focus:border-[var(--primary-main)]",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    ].join(" ");
    const borderClass = hasError
      ? "border-b-[var(--error-main)]"
      : "border-b-[var(--primary-light)]";
    const finalClasses = isPassword ? `${baseClasses} pr-8 ${borderClass}` : `${baseClasses} ${borderClass}`;

    const validateValue = (value: string): string => {
      let errorText = "";
      if (required && !value) {
        errorText = "Field is required";
      } else if (props.minLength !== undefined && value.length < props.minLength) {
        errorText = `Minimum length is ${props.minLength} characters`;
      } else if (props.maxLength !== undefined && value.length > props.maxLength) {
        errorText = `Maximum length is ${props.maxLength} characters`;
      } else if (isEmail && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errorText = "Invalid email";
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

    return (
      <div className="mb-4">
        {label && (
          <label className="block text-sm text-[var(--primary-dark)] mb-1">
            {label}
            {required && <span className="ml-1 text-[var(--error-main)]">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={isPassword ? (showPassword ? "text" : "password") : baseType}
            {...extraProps}
            {...props}
            required={required}
            className={finalClasses}
            onBlur={handleBlur}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-0 top-1/2 -translate-y-1/2 pr-1 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-[var(--primary-light)]" />
              ) : (
                <Eye className="h-4 w-4 text-[var(--primary-light)]" />
              )}
            </button>
          )}
        </div>
        {hasError && (
          <p className="mt-1 text-xs text-[var(--error-main)]">
            {errorMessage || localErrorMessage}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
