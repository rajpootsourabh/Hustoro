import { Info, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import ActionButton from '../../Components/ActionButton';
import Calendar from '../../Components/TimeOff/CalendarSelector';
import UploadBox from '../../Components/Settings/UploadBox';
import { useSnackbar } from "../../Components/SnackbarContext";
import CustomSelect from '../../Components/CustomSelect';
import CustomDateRangeDisplay from '../../Components/TimeOff/CustomDateRangeDisplay';
import { timeOffRequestSchema as validationSchema } from "../../../utils/validators/timeOffRequestValidator";
import { formatDate, calculateRequestedDays } from "../../../utils/leaveDateUtils";
import { dayTypeOptions, timeOffTypeOptions } from "../../../utils/selectOptionsData";
import useMonthNavigation from "../../../hooks/useMonthNavigation";



export default function TimeOffRequestModal({ onClose }) {
    const { leftMonth, rightMonth, handlePrev, handleNext } = useMonthNavigation();
    const [selecting, setSelecting] = useState('start');
    const [leaveBalances, setLeaveBalances] = useState([]);
    const [isLoadingLeaveBalances, setIsLoadingLeaveBalances] = useState(true);
    const { showSnackbar } = useSnackbar();
    const [hoverDate, setHoverDate] = useState(null);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const typeIdToNameMap = {
        "1": "Paid Time Off",
        "2": "Sick Leave",
        "3": "Unpaid Leave"
    };

    useEffect(() => {
        const fetchLeaveBalance = async () => {
            const token = localStorage.getItem("access_token");
            setIsLoadingLeaveBalances(true); // Start loading
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/time-off-requests/leave-balance`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                const result = await res.json();
                if (result.success && Array.isArray(result.data)) {
                    setLeaveBalances(result.data);
                } else {
                    showSnackbar("Failed to fetch leave balances", "error");
                }
            } catch (err) {
                showSnackbar("Error fetching leave balances", "error");
            } finally {
                setIsLoadingLeaveBalances(false);
            }
        };


        fetchLeaveBalance();
    }, []);


    function handleClose() {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 500);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#313b46e6]">
            <button
                onClick={handleClose}
                className="absolute top-4 right-4 bg-transparent p-1.5 hover:bg-opacity-100 transition text-white"
            >
                <X className="w-6 h-6" />
            </button>

            <div
                className={`relative w-full max-w-screen-2xl h-[90vh] bg-white rounded-t-2xl shadow-lg flex flex-col ${isClosing ? 'animate-shrinkToBottom' : 'animate-growFromBottom'}`}
            >
                <Formik
                    initialValues={{
                        selectedType: '',
                        startDate: null,
                        endDate: null,
                        sickLeaveFile: null,
                        firstDayType: 'full',
                        lastDayType: 'full',
                        note: ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        const token = localStorage.getItem('access_token');

                        const payload = {
                            time_off_type_id: parseInt(values.selectedType),
                            start_date: values.startDate,
                            end_date: values.endDate,
                            first_day_type: values.firstDayType,
                            last_day_type: values.lastDayType,
                            note: values.note.trim(),
                        };

                        try {
                            let res;

                            if (values.selectedType === "2" && values.sickLeaveFile) {
                                // Sick leave - send FormData with attachment
                                const formData = new FormData();
                                Object.entries(payload).forEach(([key, val]) => formData.append(key, val));
                                formData.append("attachment", values.sickLeaveFile);

                                res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/time-off-requests`, {
                                    method: "POST",
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                        Accept: "application/json",
                                    },
                                    body: formData,
                                });
                            } else {
                                // JSON payload
                                res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/time-off-requests`, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${token}`,
                                        Accept: "application/json",
                                    },
                                    body: JSON.stringify(payload),
                                });
                            }

                            const result = await res.json();

                            if (!res.ok) {
                                // Enhanced Error Handling for Validation & Custom Errors
                                if (result.errors) {
                                    const firstError = Object.values(result.errors)?.[0]?.[0];
                                    showSnackbar(firstError || "Validation failed", "error");
                                } else if (result.message) {
                                    showSnackbar(result.message, "error");
                                } else {
                                    showSnackbar("Something went wrong!", "error");
                                }
                            } else {
                                showSnackbar("Time off requested successfully!", "success");
                                onClose();
                            }
                        } catch (error) {
                            console.error("Submission error:", error);
                            showSnackbar("Failed to submit time-off request.", "error");
                        } finally {
                            setSubmitting(false);
                        }
                    }}


                >
                    {({ values, errors, touched, handleChange, handleSubmit, setFieldValue, isSubmitting }) => {
                        const selectedTypeName = typeIdToNameMap[values.selectedType];
                        const selectedLeave = leaveBalances.find(lb => lb.type === selectedTypeName);

                        return (
                            <>
                                <div className="sticky top-0 bg-white px-4 sm:px-6 md:px-8 py-6 border-b flex items-center justify-between flex-wrap gap-2 sm:gap-0 rounded-t-2xl">
                                    <h2 className="text-lg sm:text-2xl font-semibold text-gray-900">Request time off</h2>
                                    <ActionButton
                                        label="Request time off"
                                        onClick={handleSubmit}
                                        isLoading={isSubmitting}
                                        className="sm:w-[170px] h-[38px] px-[20px]"
                                        labelClassName="text-sm"
                                    />
                                </div>

                                <div className="overflow-auto flex-1">
                                    <div className="px-4 sm:px-6 md:px-8 py-6 w-full max-w-[850px] mx-auto space-y-6">
                                        {/* Type Select */}
                                        <CustomSelect
                                            label="Time-off Type"
                                            optionsList={timeOffTypeOptions}
                                            placeholder="Select a Time Off Type"
                                            required={true}
                                            value={values.selectedType}
                                            onChange={(val) => setFieldValue('selectedType', val)}
                                            error={touched.selectedType && errors.selectedType}
                                        />

                                        {/* Time Off Period */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Time Off Period <span className="text-red-500">*</span>
                                            </label>

                                            <div className="border border-gray-300 rounded-lg px-4 py-6 space-y-6">
                                                {/* Date Display */}
                                                <CustomDateRangeDisplay
                                                    label="Time Off Period"
                                                    startDate={values.startDate}
                                                    endDate={values.endDate}
                                                    formatDate={formatDate}
                                                    required
                                                    error={touched.endDate && errors.dateRange}
                                                    onClear={() => {
                                                        setFieldValue("startDate", null);
                                                        setFieldValue("endDate", null);
                                                        setSelecting("start");
                                                    }}
                                                />

                                                {/* Calendars */}
                                                <div className="grid gap-6 sm:grid-cols-2">
                                                    {/* Left Calendar */}
                                                    <div>
                                                        <div className="flex items-center justify-between text-gray-700 font-medium mb-2 uppercase">
                                                            <button onClick={handlePrev} className="px-2">{'<'}</button>
                                                            <div className="w-4" />
                                                        </div>
                                                        <Calendar
                                                            month={leftMonth.month}
                                                            year={leftMonth.year}
                                                            onDateClick={(date) => {
                                                                if (selecting === 'start') {
                                                                    setFieldValue('startDate', date);
                                                                    setFieldValue('endDate', null);
                                                                    setSelecting('end');
                                                                } else {
                                                                    if (new Date(date) < new Date(values.startDate)) {
                                                                        setFieldValue('startDate', date);
                                                                        setFieldValue('endDate', null);
                                                                        setSelecting('end');
                                                                    } else {
                                                                        setFieldValue('endDate', date);
                                                                        setSelecting('start');
                                                                    }
                                                                }
                                                            }}
                                                            startDate={values.startDate}
                                                            endDate={values.endDate}
                                                            hoverDate={hoverDate}
                                                            setHoverDate={setHoverDate}
                                                        />
                                                    </div>

                                                    {/* Right Calendar */}
                                                    <div>
                                                        <div className="flex items-center justify-between text-gray-700 font-medium mb-2 uppercase">
                                                            <div className="w-4" />
                                                            <button onClick={handleNext} className="px-2">{'>'}</button>
                                                        </div>
                                                        <Calendar
                                                            month={rightMonth.month}
                                                            year={rightMonth.year}
                                                            onDateClick={(date) => {
                                                                if (selecting === 'start') {
                                                                    setFieldValue('startDate', date);
                                                                    setFieldValue('endDate', null);
                                                                    setSelecting('end');
                                                                } else {
                                                                    if (new Date(date) < new Date(values.startDate)) {
                                                                        setFieldValue('startDate', date);
                                                                        setFieldValue('endDate', null);
                                                                        setSelecting('end');
                                                                    } else {
                                                                        setFieldValue('endDate', date);
                                                                        setSelecting('start');
                                                                    }
                                                                }
                                                            }}
                                                            startDate={values.startDate}
                                                            endDate={values.endDate}
                                                            hoverDate={hoverDate}
                                                            setHoverDate={setHoverDate}
                                                        />
                                                    </div>
                                                </div>

                                                {/* First / Last Day */}
                                                {values.startDate && values.endDate && (
                                                    <div className="flex flex-col sm:flex-row gap-4">
                                                        <div className="flex-1">
                                                            <CustomSelect
                                                                label="First day"
                                                                optionsList={dayTypeOptions}
                                                                value={values.firstDayType}
                                                                onChange={(val) => setFieldValue('firstDayType', val)}
                                                                placeholder="Select day type"
                                                                required
                                                                error={touched.firstDayType && errors.firstDayType}
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <CustomSelect
                                                                label="Last day"
                                                                optionsList={dayTypeOptions}
                                                                value={values.lastDayType}
                                                                onChange={(val) => setFieldValue('lastDayType', val)}
                                                                placeholder="Select day type"
                                                                required
                                                                error={touched.lastDayType && errors.lastDayType}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Summary */}
                                        {values.startDate && values.endDate && (
                                            isLoadingLeaveBalances ? (
                                                <div className="bg-teal-50/60 border border-teal-200 rounded-xl px-6 py-5 mt-6 animate-pulse space-y-2">
                                                    <div className="h-4 w-1/3 bg-teal-200 rounded" />
                                                    <div className="h-3 w-2/3 bg-teal-100 rounded" />
                                                </div>
                                            ) : selectedLeave && (
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-teal-50/60 border border-teal-600 rounded-xl px-6 py-5 mt-6 backdrop-blur-sm">
                                                    <div className="p-2 bg-teal-200/40 rounded-full">
                                                        <Info className="w-5 h-5 text-teal-700" />
                                                    </div>
                                                    <div className="text-gray-800 space-y-1 text-sm">
                                                        <p className="font-medium text-sm">
                                                            You’re requesting{" "}
                                                            <span className="text-teal-900 text-sm font-semibold text-base">
                                                                {calculateRequestedDays(values.startDate, values.endDate, values.firstDayType, values.lastDayType)} days off
                                                            </span>.
                                                        </p>
                                                        <p className="text-sm">
                                                            You’ll have{" "}
                                                            <span className="text-teal-900 text-sm font-semibold text-base">
                                                                {Math.max(
                                                                    selectedLeave.remaining_days - calculateRequestedDays(values.startDate, values.endDate, values.firstDayType, values.lastDayType),
                                                                    0
                                                                ).toFixed(1)} days
                                                            </span>{" "}
                                                            of {selectedLeave.type} remaining.
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        )}

                                        {/* Sick Leave Upload */}
                                        {values.selectedType === "2" && values.startDate && values.endDate && (
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Medical Document <span className="text-red-500">*</span>
                                                </label>
                                                <UploadBox
                                                    buttonText="Upload a file"
                                                    accept="image/*,.pdf"
                                                    maxSizeMB={3}
                                                    onChange={(file) => setFieldValue('sickLeaveFile', file)}
                                                />
                                                {touched.sickLeaveFile && errors.sickLeaveFile && (
                                                    <div className="text-red-500 text-sm mt-1">{errors.sickLeaveFile}</div>
                                                )}
                                            </div>
                                        )}




                                        {/* Note */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                <span className="text-gray-900 text-sm">Note</span>{" "}
                                                <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                                            </label>
                                            <div className="flex flex-col space-y-1 relative">
                                                <textarea
                                                    name="note"
                                                    value={values.note}
                                                    onChange={handleChange}
                                                    maxLength={140}
                                                    placeholder="Write a note for the time-off approver"
                                                    className="w-full text-sm border border-gray-300 rounded px-3 py-2 h-20 resize-none focus:outline-none focus:ring-1 focus:ring-teal-500"
                                                />
                                                <div className="self-end text-xs text-gray-500">{values.note.length}/140</div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                    }}
                </Formik>
            </div>
        </div>
    );
}
