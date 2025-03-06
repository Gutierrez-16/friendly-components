import React from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  errorMessage?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, errorMessage, className = "", required, ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false);
    const [localErrorMessage, setLocalErrorMessage] = React.useState("");

    const baseClasses = [
      "w-full bg-transparent text-sm py-2 px-0 outline-none",
      "border-b border-b-primary-light transition-colors focus:outline-none focus:border-primary",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    ].join(" ");
    const borderClass = hasError ? "border-b-error" : "border-b-primary-light";
    const finalClasses = `${baseClasses} ${borderClass}`;

    const validateValue = (value: string): string => {
      let errorText = "";
      if (required && !value) {
        errorText = "Field is required";
      } else if (props.minLength !== undefined && value.length < props.minLength) {
        errorText = `Minimum length is ${props.minLength} characters`;
      } else if (props.maxLength !== undefined && value.length > props.maxLength) {
        errorText = `Maximum length is ${props.maxLength} characters`;
      }
      setHasError(!!errorText);
      setLocalErrorMessage(errorText);
      return errorText;
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      const error = validateValue(e.target.value);
      e.target.setCustomValidity(error);
      props.onBlur?.(e);
    };

    const handleInvalid = (e: React.InvalidEvent<HTMLTextAreaElement>) => {
      e.preventDefault();
      const error = validateValue(e.target.value);
      e.target.setCustomValidity(error);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const error = validateValue(e.target.value);
      e.target.setCustomValidity(error);
      props.onChange?.(e);
    };

    return (
      <div className="mb-4">
        {label && (
          <label className="block text-sm text-primary-dark mb-1">
            {label}
            {required && <span className="ml-1 text-error">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          {...props}
          required={required}
          className={finalClasses}
          onBlur={handleBlur}
          onChange={handleChange}
          onInvalid={handleInvalid}
        />
        {hasError && (
          <p className="mt-1 text-xs text-error">
            {errorMessage || localErrorMessage}
          </p>
        )}
      </div>
    );
  }
);
