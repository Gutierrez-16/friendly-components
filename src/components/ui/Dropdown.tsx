import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  label?: string;
  errorMessage?: string;
  options: { value: string; label: string }[];
  onChange?: (selectedValue: string) => void;
  onSearch?: (search: string) => void;
  onScrollBottom?: () => void;
  value?: string;
  name?: string;
  required?: boolean;
  searchable?: boolean;
  className?: string;
}

const Dropdown = React.forwardRef<HTMLInputElement, DropdownProps>(
  (
    {
      label = "Label",
      errorMessage,
      options,
      onChange,
      onSearch,
      onScrollBottom,
      value,
      name,
      required,
      searchable = false,
      className = "",
      ...rest
    },
    ref
  ) => {
    const initialSelected = value ? options.find(opt => opt.value === value) || null : null;
    const [selectedOption, setSelectedOption] = useState<{ value: string; label: string } | null>(initialSelected);
    const [inputValue, setInputValue] = useState<string>(initialSelected ? initialSelected.label : "");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [localErrorMessage, setLocalErrorMessage] = useState<string>("");
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const optionsListRef = useRef<HTMLUListElement>(null);
    const highlightedItemRef = useRef<HTMLLIElement>(null);
    // Referencia para el input oculto (usado en dropdown no searchable)
    const hiddenRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (value) {
        setLocalErrorMessage("");
      }
    }, [value]);

    useEffect(() => {
      if (!isOpen && selectedOption) {
        setInputValue(selectedOption.label);
      }
    }, [isOpen, selectedOption]);

    useEffect(() => {
      if (isOpen && highlightedIndex >= 0 && highlightedItemRef.current && optionsListRef.current) {
        const container = optionsListRef.current;
        const item = highlightedItemRef.current;
        const containerRect = container.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        if (itemRect.bottom > containerRect.bottom) {
          container.scrollTop += itemRect.bottom - containerRect.bottom;
        } else if (itemRect.top < containerRect.top) {
          container.scrollTop -= containerRect.top - itemRect.top;
        }
      }
    }, [highlightedIndex, isOpen]);

    const validateValue = (val: string): string => {
      let errorText = "";
      if (required && !val) {
        errorText = "Field is required";
      }
      setLocalErrorMessage(errorText);
      return errorText;
    };

    const handleInvalid = (e: React.InvalidEvent<HTMLInputElement>) => {
      e.preventDefault();
      const error = validateValue(e.target.value);
      e.target.setCustomValidity(error);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value;
      setInputValue(text);
      setSearchTerm(text);
      if (searchable) {
        setIsOpen(true);
        setHighlightedIndex(-1);
        if (onSearch) onSearch(text);
      }
    };

    const handleSelect = (selected: { value: string; label: string }) => {
      setSelectedOption(selected);
      setInputValue(selected.label);
      setSearchTerm("");
      setIsOpen(false);
      setHighlightedIndex(-1);
      setLocalErrorMessage("");
      if (searchable) {
        if (ref && typeof ref !== "function" && ref.current) {
          ref.current.setCustomValidity("");
        }
      } else {
        if (hiddenRef.current) {
          hiddenRef.current.setCustomValidity("");
        }
      }
      if (onChange) onChange(selected.value);
    };

    const handleFocus = () => {
      setIsOpen(true);
      setHighlightedIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) {
        if (e.key === "ArrowDown" || e.key === "Enter") {
          e.preventDefault();
          setIsOpen(true);
          return;
        }
      }
      
      if (isOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setHighlightedIndex(prev =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
        } else if (e.key === "Enter") {
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
            handleSelect(filteredOptions[highlightedIndex]);
          }
        } else if (e.key === "Escape") {
          e.preventDefault();
          setIsOpen(false);
        } else if (e.key === "Tab") {
          setIsOpen(false);
        }
      }
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollTop + clientHeight >= scrollHeight - 5 && onScrollBottom) {
        onScrollBottom();
      }
    };

    const filteredOptions = searchTerm
      ? options.filter(opt =>
          opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;
    
    const hasError = !!(errorMessage || localErrorMessage);
    
    return (
      <div className={`relative mb-4 ${className}`} ref={containerRef}>
        <label className="block text-sm mb-1 text-primary">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          {searchable ? (
            <input
              ref={ref}
              type="text"
              name={name}
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              onInvalid={handleInvalid}
              placeholder={rest.placeholder || "Select an option..."}
              required={required}
              className={`w-full bg-transparent text-sm py-2 px-3 pr-8 text-left truncate focus:outline-none cursor-pointer ${
                hasError 
                  ? "border-red-500 focus:border-red-500 border-b"
                  : "border-gray-300 focus:border-blue-500 border-b"
              }`}
              aria-invalid={hasError}
              aria-expanded={isOpen}
              role="combobox"
              aria-autocomplete="list"
              aria-haspopup="listbox"
              {...rest}
            />
          ) : (
            <div
              className={`relative w-full bg-transparent text-sm py-2 px-3 border-b text-left flex items-center justify-between truncate ${
                hasError ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:border-blue-500 cursor-pointer`}
              onClick={handleFocus}
            >
              <span className={`truncate ${selectedOption ? "text-black" : "text-gray-500"}`}>
                {selectedOption ? selectedOption.label : "Select an option"}
              </span>
              {name && (
                <input
                  ref={hiddenRef}
                  type="text"
                  name={name}
                  value={selectedOption ? selectedOption.value : ""}
                  required={required}
                  onChange={() => {}}
                  onInvalid={handleInvalid}
                  className="absolute opacity-0 w-px h-px pointer-events-none"

                />
              )}
              <ChevronDown
                className={`text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </div>
          )}

          {isOpen && (
            <ul 
              ref={optionsListRef}
              role="listbox"
              className="absolute w-full bg-white shadow-md mt-1 max-h-40 overflow-y-auto rounded-md z-10" 
              onScroll={handleScroll}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <li
                    ref={index === highlightedIndex ? highlightedItemRef : null}
                    key={option.value}
                    id={`option-${option.value}`}
                    role="option"
                    aria-selected={index === highlightedIndex}
                    className={`px-3 py-2 cursor-pointer text-left truncate ${
                      index === highlightedIndex ? "bg-gray-300" : "hover:bg-gray-200"
                    }`}
                    onMouseDown={() => handleSelect(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    {option.label}
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-gray-400">No options found</li>
              )}
            </ul>
          )}
        </div>
        {hasError && (
          <p className="mt-1 text-xs text-red-500">{errorMessage || localErrorMessage}</p>
        )}
      </div>
    );
  }
);

Dropdown.displayName = "Dropdown";
export default Dropdown;
