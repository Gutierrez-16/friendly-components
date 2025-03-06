import * as React from "react";
import { Upload, Trash2 } from "lucide-react";

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
  preview?: boolean;
}

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ label, errorMessage, className = "", required, preview = true, ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false);
    const [localErrorMessage, setLocalErrorMessage] = React.useState("");
    const [file, setFile] = React.useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string>("");

    const containerClasses = `relative flex items-center rounded-md px-3 py-2 transition-colors focus-within:border-primary border-solid ${
      hasError ? "border-error" : "border-primary-light"
    } ${className}`;

    const validate = (files: FileList | null) => {
      let errorDetected = false;
      let errorText = "";
      if (required && (!files || files.length === 0)) {
        errorDetected = true;
        errorText = "Field is required";
      }
      setHasError(errorDetected);
      setLocalErrorMessage(errorText);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files[0]) {
        setFile(files[0]);
        if (preview) {
          const url = URL.createObjectURL(files[0]);
          setPreviewUrl(url);
        }
      } else {
        setFile(null);
        setPreviewUrl("");
      }
      validate(files);
      props.onChange?.(e);
    };

    const handleClear = () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setFile(null);
      setPreviewUrl("");
      setHasError(required ? true : false);
      if (ref && typeof ref !== "function" && ref.current) {
        ref.current.value = "";
      }
    };

    const handleInvalid = (e: React.InvalidEvent<HTMLInputElement>) => {
      e.preventDefault();
      validate(e.target.files);
    };

    return (
      <div className="mb-4">
        {label && (
          <label className="block text-sm text-primary-dark mb-1">
            {label}
            {required && <span className="ml-1 text-error">*</span>}
          </label>
        )}

        {preview && previewUrl ? (
          <div className="mb-2">
            <img src={previewUrl} alt="Preview" className="h-24 object-contain rounded-md" />
            <div className="flex items-center justify-between mt-1">
              <span className={`text-sm truncate ${hasError ? "text-error" : "text-primary-dark"}`}>
                {file?.name}
              </span>
              <button type="button" onClick={handleClear} className="focus:outline-none">
                <Trash2 className="h-5 w-5 text-error" />
              </button>
            </div>
          </div>
        ) : (
          <div className={containerClasses}>
            <input
              ref={ref}
              type="file"
              required={required}
              onInvalid={handleInvalid}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              {...props}
              onChange={handleChange}
            />
            <div className="flex-1 flex items-center space-x-2">
              <Upload className={`h-5 w-5 ${hasError ? "text-error" : "text-primary-light"}`} />
              <span className={`text-sm ${hasError ? "text-error" : "text-primary-light"}`}>
                Choose
              </span>
            </div>
          </div>
        )}
        {hasError && (
          <p className="mt-1 text-xs text-error">
            {errorMessage || localErrorMessage}
          </p>
        )}
      </div>
    );
  }
);

