import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  label?: string;
  errorMessage?: string;
  options: { value: string; label: string }[];
  onChange?: (selectedValue: string) => void;
  value?: string;
  name?: string;
  required?: boolean;
  searchable?: boolean;
}

const Dropdown = React.forwardRef<HTMLInputElement, DropdownProps>(
  (
    {
      label,
      errorMessage,
      required,
      options,
      value,
      onChange,
      name,
      searchable = false,
    },
    ref
  ) => {
    const [hasError, setHasError] = useState(false);
    const [localErrorMessage, setLocalErrorMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedValue, setSelectedValue] = useState<string | undefined>(
      value
    );
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (value) {
        setSelectedValue(value);
        const selectedLabel =
          options.find((opt) => opt.value === value)?.label || "";
        setSearchTerm(selectedLabel);
      }
    }, [value, options]);

    const validateValue = (val: string) => {
      let errorText = "";
      if (required && !val) {
        errorText = "Field is required";
      }
      setHasError(!!errorText);
      setLocalErrorMessage(errorText);
      return errorText;
    };

    const handleInvalid = (e: React.InvalidEvent<HTMLInputElement>) => {
      e.preventDefault();
      const error = validateValue(selectedValue || "");
      e.target.setCustomValidity(error);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setIsOpen(true);
    };

    const handleSelect = (selectedVal: string) => {
      const selectedLabel =
        options.find((opt) => opt.value === selectedVal)?.label || "";
      setSelectedValue(selectedVal);
      setSearchTerm(selectedLabel);
      setIsOpen(false);
      setHasError(false);
      if (onChange) {
        onChange(selectedVal);
      }
    };

    const handleClick = () => {
      setIsOpen(!isOpen);
      if (searchable) {
        setSearchTerm("");
      }
    };

    const handleFocus = () => {
      if (
        searchable &&
        searchTerm === options.find((opt) => opt.value === selectedValue)?.label
      ) {
        setSearchTerm("");
      }
      setIsOpen(true);
    };

    const filteredOptions = searchable
      ? options.filter((option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <div className="relative mb-4" ref={selectRef}>
        {label && (
          <label className="block text-sm text-gray-700 mb-1">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          {searchable ? (
            <div className="relative">
              <input
                ref={ref}
                type="text"
                name={name}
                value={searchTerm}
                onChange={handleSearchChange}
                required={required}
                className={`w-full bg-transparent text-sm py-2 px-3 border-b pr-8 text-left truncate ${
                  hasError ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:border-blue-500 cursor-pointer`}
                placeholder="Select an option..."
                onFocus={handleFocus}
                onInvalid={handleInvalid}
              />
              <ChevronDown
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          ) : (
            <div
              className={`relative w-full bg-transparent text-sm py-2 px-3 border-b text-left flex items-center justify-between truncate ${
                hasError ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:border-blue-500 cursor-pointer`}
              onClick={handleClick}
            >
              <span
                className={`truncate ${
                  selectedValue ? "text-black" : "text-gray-500"
                }`}
              >
                {options.find((opt) => opt.value === selectedValue)?.label ||
                  "Select an option"}
              </span>
              <input
                type="text"
                hidden
                required={required}
                name={name}
                value={selectedValue || ""}
                onChange={() => {}}
                className="border-none bg-transparent outline-none cursor-default select-none"
                onInvalid={handleInvalid}
              />

              <ChevronDown
                className={`text-gray-500 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          )}

          {isOpen && (
            <ul className="absolute w-full bg-white shadow-md mt-1 max-h-40 overflow-y-auto rounded-md z-10">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li
                    key={option.value}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-200 text-left truncate"
                    onMouseDown={() => handleSelect(option.value)}
                  >
                    {option.label}
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-gray-400 text-left">
                  No options found
                </li>
              )}
            </ul>
          )}
        </div>

        {hasError && (
          <p className="mt-1 text-xs text-red-500">
            {errorMessage || localErrorMessage}
          </p>
        )}
      </div>
    );
  }
);

Dropdown.displayName = "Dropdown";
export default Dropdown;
