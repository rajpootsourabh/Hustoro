import React, { useMemo, useState } from "react";

export default function TimeOffBreakdown({ fromDate, toDate, showAllDays: showAllDaysProp }) {
    const [showAllDays, setShowAllDays] = useState(showAllDaysProp);

    // Memoize the date list
    const allDates = useMemo(() => {
        const dates = [];
        const current = new Date(fromDate);
        while (current <= toDate) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        return dates;
    }, [fromDate, toDate]);

    const formatDate = (date) =>
        date.toLocaleDateString("en-GB", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold">Breakdown</h3>
                <button
                    className="text-sm font-medium text-gray-500"
                    onClick={() => setShowAllDays((prev) => !prev)}
                >
                    {showAllDays ? "Hide all days" : "Show all days"}
                </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
                {showAllDays ? (
                    <div className="relative pl-4">
                        {allDates.map((date, index) => (
                            <div key={index} className="flex items-start gap-4 relative">
                                <div className="relative flex flex-col items-center mt-1">
                                    <div className="w-3 h-3 rounded-full bg-gray-500 z-10" />
                                    {index !== allDates.length - 1 && (
                                        <div className="w-px h-6 border-l-2 border-dashed border-gray-300 mt-1" />
                                    )}
                                </div>

                                <div className="flex justify-between items-center w-full text-sm py-[1px]">
                                    <span className="text-sm">{formatDate(date)}</span>
                                    <span className="text-gray-500 text-xs">1 Day</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-[24px_1fr] gap-x-4">
                        {/* Dots and full line */}
                        <div className="flex flex-col items-center pt-2 pb-2">
                            <div className="w-3 h-3 bg-gray-500 rounded-full" />
                            <div className="flex-1 w-px border-l-2 border-dashed border-gray-400" />
                            <div className="w-3 h-3 bg-gray-500 rounded-full" />
                        </div>

                        {/* Summary content */}
                        <div className="flex flex-col justify-between py-1 space-y-8 text-sm text-gray-700">
                            <div className="flex justify-between">
                                <div>
                                    <div className="text-gray-600 text-sm">From</div>
                                    <div className="text-black text-sm">{formatDate(fromDate)}</div>
                                </div>
                                <div className="text-gray-600 text-sm">1 Day</div>
                            </div>

                            <div className="text-gray-500 text-sm">
                                {allDates.length - 2} days in between
                            </div>

                            <div className="flex justify-between">
                                <div>
                                    <div className="text-gray-600 text-sm">To</div>
                                    <div className="text-black text-sm">{formatDate(toDate)}</div>
                                </div>
                                <div className="text-gray-600 text-sm">1 Day</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
