import * as React from "react";
import { Search } from "lucide-react";

export interface InputSearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
}

export const InputSearch = React.forwardRef<HTMLInputElement, InputSearchProps>(
  ({ label, errorMessage, className = "", required, ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false);
    const [localErrorMessage, setLocalErrorMessage] = React.useState("");

    const validateValue = (value: string): string => {
      let errorText = "";
      if (required && !value) {
        errorText = "Required field";
      } else if (props.minLength !== undefined && value.length < props.minLength) {
        errorText = `The minimum length is ${props.minLength} characters`;
      } else if (props.maxLength !== undefined && value.length > props.maxLength) {
        errorText = `The maximum length is ${props.maxLength} characters`;
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

    const baseClasses = [
      "w-full bg-transparent text-sm py-2 px-0 outline-none",
      "border-b border-b-primary-light transition-colors focus:outline-none focus:border-primary",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    ].join(" ");
    const borderClass = hasError ? "border-b-error" : "border-b-primary-light";
    const finalClasses = `${baseClasses} pl-10 ${borderClass}`;

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
            type={props.type || "text"}
            {...props}
            required={required}
            className={finalClasses}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 pl-2">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
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

InputSearch.displayName = "InputSearch";

export default InputSearch;
