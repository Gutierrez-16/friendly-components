import React from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  errorMessage?: string;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, errorMessage, className = "", required, ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false);
    const [localErrorMessage, setLocalErrorMessage] = React.useState("");

    const baseClasses = [
      "w-full bg-transparent text-sm py-2 px-0 outline-none",
      "border-b transition-colors focus:outline-none focus:border-[var(--primary-main)]",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    ].join(" ");
    const borderClass = hasError ? "border-b-[var(--error-main)]" : "border-b-[var(--primary-light)]";
    const finalClasses = `${baseClasses} ${borderClass}`;

    const validateValue = (value: string) => {
      let errorDetected = false;
      let errorText = "";
      if (required && !value) {
        errorDetected = true;
        errorText = "Field is required";
      }
      if (props.minLength !== undefined && value.length < props.minLength) {
        errorDetected = true;
        errorText = `Minimum length is ${props.minLength} characters`;
      }
      if (props.maxLength !== undefined && value.length > props.maxLength) {
        errorDetected = true;
        errorText = `Maximum length is ${props.maxLength} characters`;
      }
      setHasError(errorDetected);
      setLocalErrorMessage(errorText);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      validateValue(e.target.value);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      validateValue(e.target.value);
      props.onChange?.(e);
    };

    return (
      <div className="mb-4">
        {label && (
          <label className="block text-sm text-[var(--primary-dark)] mb-1">
            {label}
            {required && <span className="ml-1 text-[var(--error-main)]">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          {...props}
          required={required}
          className={finalClasses}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {hasError && (
          <p className="mt-1 text-xs text-[var(--error-main)]">
            {errorMessage || localErrorMessage}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
export default TextArea;
