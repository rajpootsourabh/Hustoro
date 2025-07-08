import { CalendarDays, X } from "lucide-react";

const CustomDateRangeDisplay = ({
    label = "Date Range",
    startDate,
    endDate,
    formatDate = (date) => date,
    onClear = () => { },
    error,
    required = false,
}) => {
    const display = startDate || endDate;
    return (
        <div className="w-full">
            <label className="block text-sm mb-1">
                {required && <span className="text-red-500 mr-1">*</span>}
                {label}
            </label>

            <div
                className={`rounded-md px-3 h-10 flex justify-between items-center text-sm bg-[#f3f5f8] w-full ${error ? "border border-red-500" : ""
                    }`}
            >
                <div className="flex items-center gap-2 text-gray-700 truncate w-full">
                    <span className="text-sm">{startDate ? formatDate(startDate) : "Start date"}</span>
                    <span>-</span>
                    <span className="text-sm">{endDate ? formatDate(endDate) : "End date"}</span>
                </div>

                <div className="flex items-center justify-center h-10">
                    {display ? (
                        <button
                            type="button"
                            onClick={onClear}
                            className="flex items-center justify-center text-gray-500 hover:text-gray-700 h-full"
                        >
                            <X size={16} />
                        </button>
                    ) : (
                        <CalendarDays className="w-4 h-4 text-gray-500" />
                    )}
                </div>

            </div>

            {error && typeof error === "string" && (
                <div className="text-red-500 text-xs mt-1">{error}</div>
            )}
        </div>
    );
};

export default CustomDateRangeDisplay;
