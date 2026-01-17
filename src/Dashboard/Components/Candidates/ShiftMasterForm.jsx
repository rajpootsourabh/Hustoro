import React, { useState, useEffect } from 'react';
import {
    getUserTimezone,
    localToUTC,
    utcToLocal,
    getMultiTimezoneDisplay,
    prepareTimeForAPI,
    parseTimeFromAPI,
    formatTime12Hour
} from '../../../utils/timezone';
import { Clock, Calendar, Globe, Save, X, AlertCircle, ChevronDown, Clock as ClockIcon, Sun, Moon, Sunset } from 'lucide-react';
import { useSnackbar } from '../../Components/SnackbarContext'; // Import the snackbar hook

export default function ShiftMasterForm({ shift, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        title: '',
        start_time_local: '', // Local time for user input (HH:mm)
        end_time_local: '',   // Local time for user input (HH:mm)
        description: '',
        is_active: true
    });

    const [loading, setLoading] = useState(false);
    const [userTimezone, setUserTimezone] = useState('UTC');
    const [timePreview, setTimePreview] = useState([]);
    const [errors, setErrors] = useState({});
    
    // Use the snackbar hook
    const { showSnackbar } = useSnackbar();

    // Get user's timezone on component mount
    useEffect(() => {
        const tz = getUserTimezone();
        setUserTimezone(tz);

        // If editing, convert UTC times from backend to local for display
        if (shift) {
            setFormData({
                title: shift.title,
                start_time_local: parseTimeFromAPI(shift.start_time_utc, tz),
                end_time_local: parseTimeFromAPI(shift.end_time_utc, tz),
                description: shift.description || '',
                is_active: shift.is_active
            });
        }
    }, [shift]);

    // Update time preview when times change
    useEffect(() => {
        if (formData.start_time_local) {
            const utcTime = localToUTC(formData.start_time_local, userTimezone);
            const preview = getMultiTimezoneDisplay(utcTime);
            setTimePreview(preview);
        } else {
            setTimePreview([]);
        }
    }, [formData.start_time_local, formData.end_time_local, userTimezone]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title) {
            newErrors.title = 'Shift title is required';
        }

        if (!formData.start_time_local) {
            newErrors.start_time_local = 'Start time is required';
        }

        if (!formData.end_time_local) {
            newErrors.end_time_local = 'End time is required';
        }

        if (formData.start_time_local && formData.end_time_local) {
            const [startHour, startMinute] = formData.start_time_local.split(':').map(Number);
            const [endHour, endMinute] = formData.end_time_local.split(':').map(Number);

            if (startHour > endHour || (startHour === endHour && startMinute >= endMinute)) {
                newErrors.end_time_local = 'End time must be after start time';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showSnackbar('Please fix the errors in the form', 'error');
            return;
        }

        setLoading(true);

        try {
            // Convert local times to UTC before sending
            const payload = {
                title: formData.title,
                start_time_utc: prepareTimeForAPI(formData.start_time_local, userTimezone),
                end_time_utc: prepareTimeForAPI(formData.end_time_local, userTimezone),
                description: formData.description,
                is_active: formData.is_active
            };

            const url = shift
                ? `${import.meta.env.VITE_API_BASE_URL}/shifts/${shift.id}`
                : `${import.meta.env.VITE_API_BASE_URL}/shifts`;

            const method = shift ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const message = shift ? 'Shift updated successfully!' : 'Shift created successfully!';
                showSnackbar(message, 'success');
                onSuccess();
            } else {
                const error = await response.json();
                showSnackbar(error.message || 'Failed to save shift', 'error');
            }
        } catch (error) {
            console.error('Error saving shift:', error);
            showSnackbar('Network error. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Get shift icon based on title
    const getShiftIcon = (title) => {
        switch (title.toLowerCase()) {
            case 'morning': return <Sun className="w-4 h-4 text-yellow-500" />;
            case 'evening': return <Sunset className="w-4 h-4 text-orange-500" />;
            case 'night': return <Moon className="w-4 h-4 text-indigo-500" />;
            default: return <ClockIcon className="w-4 h-4 text-gray-500" />;
        }
    };

    const shiftOptions = [
        { value: 'Morning', label: 'Morning Shift', icon: <Sun className="w-4 h-4 text-yellow-500" /> },
        { value: 'Evening', label: 'Evening Shift', icon: <Sunset className="w-4 h-4 text-orange-500" /> },
        { value: 'Night', label: 'Night Shift', icon: <Moon className="w-4 h-4 text-indigo-500" /> },
        { value: 'Custom', label: 'Custom Shift', icon: <ClockIcon className="w-4 h-4 text-gray-500" /> }
    ];

    const showConversionExample = formData.start_time_local && formData.end_time_local;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-teal-600 px-6 py-2.5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div>
                            <div className="flex items-center space-x-2 mt-1">
                                <Globe className="w-4 h-4 text-white" />
                                <span className="text-sm text-white">
                                    Your timezone: <strong className="font-medium text-sm">{userTimezone}</strong>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Shift Title - Enhanced Select */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Shift Title <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            {getShiftIcon(formData.title)}
                        </div>
                        <select
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-10 py-2 rounded-xl border ${errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'} bg-white shadow-sm transition-all duration-200 hover:border-gray-400`}
                            required
                        >
                            <option value="" className="text-gray-400">Select a shift type...</option>
                            {shiftOptions.map(option => (
                                <option key={option.value} value={option.value} className="flex items-center py-2">
                                    <span className="flex items-center">
                                        <span className="mr-2">{option.icon}</span>
                                        {option.label}
                                    </span>
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                    {errors.title && (
                        <div className="flex items-center space-x-1 text-sm text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.title}</span>
                        </div>
                    )}
                </div>

                {/* Time Inputs - Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Start Time */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Start Time <span className="text-red-500">*</span>
                            <span className="block text-xs text-gray-500 font-normal mt-1">Your local time: {userTimezone}</span>
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <Clock className="w-4 h-4 text-gray-400" />
                            </div>
                            <input
                                type="time"
                                name="start_time_local"
                                value={formData.start_time_local}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-2 rounded-xl border ${errors.start_time_local ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'} bg-white shadow-sm transition-all duration-200 hover:border-gray-400`}
                                required
                                step="300"
                            />
                        </div>
                        {formData.start_time_local && (
                            <div className="text-xs text-emerald-600 text-sm px-3 py-1.5 rounded-lg">
                                <span className="text-xs">UTC Storage: {localToUTC(formData.start_time_local, userTimezone)}:00 </span>
                            </div>
                        )}
                        {errors.start_time_local && (
                            <div className="flex items-center space-x-1 text-sm text-red-600">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errors.start_time_local}</span>
                            </div>
                        )}
                    </div>

                    {/* End Time */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            End Time <span className="text-red-500">*</span>
                            <span className="block text-xs text-gray-500 font-normal mt-1">Your local time: {userTimezone}</span>
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <Clock className="w-4 h-4 text-gray-400" />
                            </div>
                            <input
                                type="time"
                                name="end_time_local"
                                value={formData.end_time_local}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-2 rounded-xl border ${errors.end_time_local ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'} bg-white shadow-sm transition-all duration-200 hover:border-gray-400`}
                                required
                                step="300"
                            />
                        </div>
                        {formData.end_time_local && (
                            <div className="text-xs text-emerald-600 text-sm px-3 py-1.5 rounded-lg">
                                <span className="text-xs">UTC Storage: {localToUTC(formData.end_time_local, userTimezone)}:00 </span>
                            </div>
                        )}
                        {errors.end_time_local && (
                            <div className="flex items-center space-x-1 text-sm text-red-600">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errors.end_time_local}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${formData.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                            {formData.is_active ? (
                                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                            ) : (
                                <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                            )}
                        </div>
                        <div>
                            <span className="font-medium text-gray-900">Shift Status</span>
                            <p className="text-sm text-gray-600">
                                {formData.is_active ? 'This shift is active and will be available for assignments' : 'It will be hidden for selection when creating a new job'}
                            </p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            id="is_active"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Description
                        <span className="block text-xs text-gray-500 font-normal mt-1">Optional details about this shift</span>
                    </label>
                    <div className="relative">
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400 resize-none"
                            placeholder="e.g., Morning shift for Indian team, perfect for early risers..."
                        />
                        <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                            {formData.description.length}/500
                        </div>
                    </div>
                </div>

                {/* Timezone Preview */}
                {showConversionExample && (
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                            <div className="flex items-center space-x-2">
                                <Globe className="w-5 h-5 text-gray-600" />
                                <h3 className="font-medium text-gray-900">Timezone Preview</h3>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                                This shift will appear differently based on each user's timezone
                            </p>
                        </div>

                        <div className="p-4">
                            {/* Local Time Example */}
                            <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-2">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <Calendar className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-emerald-900">Your Local Time ({userTimezone})</div>
                                            <div className="text-sm text-emerald-700">
                                                This is what you entered
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold text-emerald-900">
                                        {formatTime12Hour(formData.start_time_local)} - {formatTime12Hour(formData.end_time_local)}
                                    </div>
                                </div>
                            </div>

                            {/* Global Timezones */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                {timePreview.map((tz, index) => (
                                    <div
                                        key={index}
                                        className={`p-3 rounded-lg border ${tz.label === 'UTC' ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' : 'bg-white border-gray-200'} hover:shadow-sm transition-shadow duration-200`}
                                    >
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className={`p-1.5 rounded ${tz.label === 'UTC' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                                {tz.label === 'UTC' ? (
                                                    <Globe className="w-3 h-3 text-blue-600" />
                                                ) : tz.label.includes('India') ? (
                                                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                                ) : tz.label.includes('US') ? (
                                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                ) : (
                                                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                                )}
                                            </div>
                                            <span className={`text-xs font-medium ${tz.label === 'UTC' ? 'text-blue-700' : 'text-gray-700'}`}>
                                                {tz.label}
                                            </span>
                                        </div>
                                        <div className={`text-lg font-bold ${tz.label === 'UTC' ? 'text-blue-900' : 'text-gray-900'}`}>
                                            {tz.time}
                                        </div>
                                        {tz.label === 'UTC' && (
                                            <div className="mt-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                                Stored in Database
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex items-start space-x-2">
                                    <div className="p-1.5 bg-gray-100 rounded">
                                        <AlertCircle className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        All times are automatically converted from UTC to each user's local timezone. This ensures accurate scheduling across different regions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="group flex items-center px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        <X className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !formData.start_time_local || !formData.end_time_local}
                        className="group relative flex items-center px-4 py-2 rounded-md bg-gradient-to-r from-teal-700 to-teal-700 text-white hover:from-teal-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 overflow-hidden"
                    >
                        {loading ? (
                            <>
                                <div className="absolute bg-teal-700"></div>
                                <div className="relative flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Saving...
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="absolute bg-teal-700"></div>
                                <div className="relative flex text-sm items-center">
                                    <Save className="w-4 h-4 mr-2" />
                                    {shift ? 'Update Shift' : 'Create Shift'}
                                </div>

                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}