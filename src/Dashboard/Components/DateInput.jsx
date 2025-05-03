import { useRef } from "react";
import { CalendarDays } from "lucide-react";

export default function DateInput({ value, onChange, error = false }) {
  const inputRef = useRef(null);

  const openDatePicker = () => {
    inputRef.current?.showPicker?.();
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      {/* Input + Icon */}
      <div
        className="relative cursor-pointer"
        onClick={openDatePicker}
      >
        <input
          ref={inputRef}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full p-2 pr-10 text-sm rounded bg-white text-gray-800 outline-none appearance-none border transition-colors duration-200 ${
            error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          }`}
        />
        <CalendarDays className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Error */}
      {error && typeof error === "string" && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}
