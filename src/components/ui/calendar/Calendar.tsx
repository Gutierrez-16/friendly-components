import React, { useState, useRef, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface CalendarProps {
  value?: Date | null;
  label?: string;
  required?: boolean;
  errorMessage?: string;
  onChange: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  value,
  label,
  required,
  errorMessage,
  onChange,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(value ?? new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ?? null);
  const [isOpen, setIsOpen] = useState(false);
  const [err, setErr] = useState(false);
  const [view, setView] = useState<"date" | "month" | "year">("date");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [localErrorMessage, setLocalErrorMessage] = useState<string>("");
  const [calendarPosition, setCalendarPosition] = useState<"above" | "below">("below");

  const validateValue = (val: string): string => {
    if (required && !val) {
      return "Field is required";
    }
    return "";
  };

  const handleInvalid = (e: React.InvalidEvent<HTMLInputElement>) => {
    setErr(true);
    e.preventDefault();
    const error = validateValue(e.target.value);
    setLocalErrorMessage(error);
    e.target.setCustomValidity(error);
  };

  useEffect(() => {
    if (value) {
      setCurrentDate(value);
      setSelectedDate(value);
      setLocalErrorMessage("");
    } else {
      setSelectedDate(null);
    }
  }, [value]);
  useEffect(() => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (containerRect) {
      const spaceBelow = window.innerHeight - containerRect.bottom;
      const spaceAbove = containerRect.top;
      const calendarHeight = 250;
      if (spaceBelow < calendarHeight && spaceAbove > calendarHeight) {
        setCalendarPosition("above");
      } else {
        setCalendarPosition("below");
      }
    }
  }, [isOpen]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const firstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const generateCalendar = () => {
    const days = daysInMonth(currentDate);
    const firstDay = firstDayOfMonth(currentDate);
    const calendar: (number | null)[] = Array(42).fill(null);
    for (let i = 0; i < days; i++) {
      calendar[i + firstDay] = i + 1;
    }
    return calendar;
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(newDate);
    onChange(newDate);
    setIsOpen(false);
  };

  const changeMonth = (increment: number) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1)
    );
  };

  const handleMonthClick = (month: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
    setView("date");
  };

  const handleYearClick = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setView("month");
  };

  const changeYear = (increment: number) => {
    setCurrentDate(
      new Date(currentDate.getFullYear() + increment, currentDate.getMonth(), 1)
    );
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const calendar = generateCalendar();
  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  const currentYear = currentDate.getFullYear();
  const years = Array.from({ length: 12 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="mb-4 relative" ref={containerRef}>
      {label && (
        <label className="block text-sm text-primary-dark mb-1">
          {label}
          {required && <span className="ml-1 text-error">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`w-full bg-transparent text-sm py-2 px-3 pr-10 border rounded-md transition-colors focus:outline-none text-left ${
            err && required && !selectedDate
              ? "border-[var(--error-main)]"
              : "border-[var(--primary-main)]"
          }`}
        >
          {selectedDate ? formatDate(selectedDate) : "dd/mm/yyyy"}
        </button>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <CalendarIcon
            size={20}
            className={`${
              err && required && !selectedDate
                ? "text-[var(--error-main)]"
                : "text-[var(--primary-main)]"
            }`}
          />
        </div>
        <input
          type="text"
          required={required}
          onChange={() => {}}
          value={selectedDate ? formatDate(selectedDate) : ""}
          onInvalid={handleInvalid}
          className="absolute opacity-0 w-px h-px pointer-events-none"
        />
      </div>

      {isOpen && (
        <div  className={`absolute z-10 bg-white rounded-md shadow-lg p-2 w-56 left-1/2 transform -translate-x-1/2 ${
          calendarPosition === "above" ? "bottom-full mb-2" : "top-full mt-2"
        }`}>
          {view === "date" && (
            <div className="flex justify-between items-center bg-gray-100 px-2 py-1">
              <button
                onClick={() => changeMonth(-1)}
                className="text-primary hover:text-primary-dark focus:outline-none"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setView("year")}
                className="text-gray-600 hover:text-gray-800 focus:outline-none text-sm"
              >
                {currentDate.toLocaleString("es-ES", {
                  month: "long",
                  year: "numeric",
                })}
              </button>
              <button
                onClick={() => changeMonth(1)}
                className="text-primary hover:text-primary-dark focus:outline-none"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
          {view === "month" && (
            <div className="flex justify-between items-center bg-gray-100 px-2 py-1">
              <button
                onClick={() => changeYear(-1)}
                className="text-primary hover:text-primary-dark focus:outline-none"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setView("year")}
                className="text-gray-600 hover:text-gray-800 focus:outline-none text-sm"
              >
                {currentDate.getFullYear()}
              </button>
              <button
                onClick={() => changeYear(1)}
                className="text-primary hover:text-primary-dark focus:outline-none"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
          {view === "year" && (
            <div className="flex justify-between items-center bg-gray-100 px-2 py-1">
              <button
                onClick={() => changeYear(-12)}
                className="text-primary hover:text-primary-dark focus:outline-none"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm text-gray-600">{`${years[0]} - ${
                years[years.length - 1]
              }`}</span>
              <button
                onClick={() => changeYear(12)}
                className="text-primary hover:text-primary-dark focus:outline-none"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
          {view === "date" && (
            <div className="grid grid-cols-7 gap-1 p-2">
              {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"].map((day) => (
                <div
                  key={day}
                  className="text-center text-gray-600 text-xs font-medium"
                >
                  {day}
                </div>
              ))}
              {calendar.map((day, index) => (
                <button
                  key={index}
                  onClick={() => day && handleDateClick(day)}
                  className={`w-8 h-8 flex items-center justify-center text-sm focus:outline-none ${
                    day === null ? "invisible" : "hover:bg-blue-100"
                  } ${
                    selectedDate &&
                    day === selectedDate.getDate() &&
                    currentDate.getMonth() === selectedDate.getMonth() &&
                    currentDate.getFullYear() === selectedDate.getFullYear()
                      ? "bg-blue-500 text-white"
                      : "text-gray-700"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          )}
          {view === "month" && (
            <div className="grid grid-cols-3 gap-2 p-2">
              {months.map((month, index) => (
                <button
                  key={month}
                  onClick={() => handleMonthClick(index)}
                  className="w-full py-2 text-sm focus:outline-none hover:bg-blue-100 rounded"
                >
                  {month}
                </button>
              ))}
            </div>
          )}
          {view === "year" && (
            <div className="grid grid-cols-3 gap-2 p-2">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearClick(year)}
                  className="w-full py-2 text-sm focus:outline-none hover:bg-blue-100 rounded"
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {err && (
        <p className="mt-1 text-xs text-red-500">
          {errorMessage || localErrorMessage}
        </p>
      )}
    </div>
  );
};
