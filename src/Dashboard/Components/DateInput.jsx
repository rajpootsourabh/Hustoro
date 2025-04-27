import { useRef } from "react";
import { CalendarDays } from "lucide-react";

export default function DateInput({ value, onChange }) {
  const inputRef = useRef(null);

  const openDatePicker = () => {
    inputRef.current?.showPicker?.();
    inputRef.current?.focus();
  };

  return (
    <div className="relative cursor-pointer" onClick={openDatePicker}>
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 text-sm border rounded bg-white text-gray-800 outline-none appearance-none"
      />
      <CalendarDays className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
    </div>
  );
}
