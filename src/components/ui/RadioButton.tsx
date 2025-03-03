import * as React from "react";

interface RadioButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
}

const RadioButton = React.forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ label, errorMessage, required, className = "", ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false);
    const [localErrorMessage, setLocalErrorMessage] = React.useState("");

    const validate = (checked: boolean): string => {
      let errorText = "";
      if (required && !checked) {
        errorText = "Field is required";
      }
      setHasError(!!errorText);
      setLocalErrorMessage(errorText);
      return errorText;
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const error = validate(e.target.checked);
      e.target.setCustomValidity(error);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const error = validate(e.target.checked);
      e.target.setCustomValidity(error);
      props.onChange?.(e);
    };

    const handleInvalid = (e: React.InvalidEvent<HTMLInputElement>) => {
      e.preventDefault();
      const error = validate(e.target.checked);
      e.target.setCustomValidity(error);
    };

    const baseClasses = [
      "w-4 h-4",
      "border",
      "rounded-full",
      "focus:ring-[var(--primary-main)]",
      className,
    ].join(" ");

    return (
      <div className="mb-4">
        <label className="inline-flex items-center space-x-2 text-sm text-[var(--primary-dark)]">
          <input
            ref={ref}
            type="radio"
            {...props}
            required={required}
            className={baseClasses}
            onBlur={handleBlur}
            onChange={handleChange}
            onInvalid={handleInvalid}
          />
          {label && <span>{label}</span>}
        </label>
        {hasError && (
          <p className="mt-1 text-xs text-[var(--error-main)]">
            {errorMessage || localErrorMessage}
          </p>
        )}
      </div>
    );
  }
);

RadioButton.displayName = "RadioButton";
export default RadioButton;
