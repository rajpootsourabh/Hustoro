import React from "react";

export default function LeaveSection({ days, viewMode, weekDates, monthDates, employees, onLeaveClick, loading }) {
    const today = new Date();
    const todayString = today.toLocaleDateString("en-US", { weekday: "short", day: "numeric" });

    const leaveTypeStyles = {
        "Unpaid Leave": { bg: "bg-red-100", text: "text-red-700 font-semibold" },
        "Sick Leave": { bg: "bg-blue-100", text: "text-blue-700 font-semibold" },
        "Paid Time Off": { bg: "bg-green-100", text: "text-green-700 font-semibold" },
    };

    const skeletonRows = Array.from({ length: 6 });

    return (
        <div className="mb-6 flex">
            {/* Left Fixed Employee List */}
            <div className="w-[240px] shrink-0">
                <div className="h-16 px-4 border-b bg-white flex items-center justify-left text-sm font-semibold">
                    Employee
                </div>

                {(loading ? skeletonRows : employees).map((employee, i) => (
                    <div key={employee?.empId || i} className="border-b flex items-center gap-3 px-4 h-16 bg-white">
                        {loading ? (
                            <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse" />
                        ) : employee.avatar ? (
                            <img src={employee.avatar} className="w-8 h-8 rounded-full" alt="avatar" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-300 text-xs font-bold flex items-center justify-center">
                                {employee.initials}
                            </div>
                        )}

                        <div className="flex flex-col gap-1">
                            {loading ? (
                                <>
                                    <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
                                    <div className="w-16 h-2 bg-gray-100 rounded animate-pulse" />
                                </>
                            ) : (
                                <>
                                    <div className="text-sm font-semibold">{employee.name}</div>
                                    <div className="text-xs text-gray-500">{employee.role} · {employee.hours}</div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Right Grid - Scrollable */}
            <div className="overflow-x-auto">
                <div className="min-w-[1000px]">
                    {/* Date Header */}
                    <div className="flex border-b text-sm text-gray-700 h-16">
                        {days.map((day, i) => {
                            const isToday = day === todayString;
                            return (
                                <div
                                    key={i}
                                    className={`flex-1 text-center flex flex-col uppercase justify-center border-r ${i === 0 ? "border-l" : ""
                                        } ${isToday ? "bg-teal-700" : ""}`}
                                >
                                    <div className={`text-[11px] ${isToday ? "text-white" : "text-gray-600"}`}>
                                        {day.split(" ")[1]}
                                    </div>
                                    <div className={`text-[15px] font-medium ${isToday ? "text-white" : "text-gray-800"}`}>
                                        {day.split(" ")[0]}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Employee Rows */}
                    {(loading ? skeletonRows : employees).map((employee, idx) => (
                        <div key={employee?.empId || idx} className="flex border-b bg-white relative h-16">
                            {Array.from({ length: days.length }).map((_, i) => (
                                <div key={i} className="flex-1 border-r border-gray-100 px-4 py-3">
                                    {loading && <div className="w-full h-3 rounded bg-gray-100 animate-pulse" />}
                                </div>
                            ))}

                            {!loading && employee?.leaves?.map((leave, ldx) => {
                                const viewDates = viewMode === "month" ? monthDates : weekDates;
                                const viewStart = viewDates[0];
                                const viewEnd = viewDates[viewDates.length - 1];
                                if (leave.end < viewStart || leave.start > viewEnd) return null;

                                const leaveEndInclusive = new Date(leave.end);
                                leaveEndInclusive.setHours(23, 59, 59, 999);

                                const finalStart = viewDates.findIndex((d) => d >= leave.start);
                                const finalEnd = viewDates.findIndex((d) => d > leaveEndInclusive);

                                const start = finalStart === -1 ? 0 : finalStart;
                                const end = finalEnd === -1 ? viewDates.length : finalEnd;
                                const span = end - start;

                                const style = leaveTypeStyles[leave.label] || {
                                    bg: "bg-gray-200",
                                    text: "text-gray-600",
                                };

                                return (
                                    <button
                                        key={ldx}
                                        onClick={() => onLeaveClick({ ...leave, employee })}
                                        className={`absolute top-1/2 -translate-y-1/2 h-7 flex items-center justify-center text-center px-2 overflow-hidden whitespace-nowrap rounded ${style.bg
                                            } ${style.text} hover:shadow-md transition-shadow`}
                                        style={{
                                            left: `${(100 / days.length) * start}%`,
                                            width: `${(100 / days.length) * span}%`,
                                            zIndex: 1,
                                            cursor: "pointer",
                                        }}
                                    >
                                        <span className="block text-xs whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                                            {leave.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    ))}

                    {/* Empty State if no data */}
                    {!loading && employees.length === 0 && (
                        <div className="relative h-[400px]">
                            <div className="absolute inset-0 flex items-center justify-center border-t bg-white">
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-teal-100 text-teal-600 text-3xl font-bold">
                                        💤
                                    </div>
                                    <p className="text-gray-600 text-sm">No leave records found for this period.</p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
