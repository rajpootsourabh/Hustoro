import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Clock, Eye, AlertCircle, ChevronLeft, CheckCircle, XCircle, Sun, Sunset, Moon } from 'lucide-react';
import ShiftMasterForm from './ShiftMasterForm';
import { useSnackbar } from '../../Components/SnackbarContext';
import { getFormattedShiftTime, getUserTimezone } from '../../../utils/timezone';
import { useRolePermissions } from '../../../hooks/useRolePermissions';

export default function ShiftManagementTab({ candidateData }) {
    const [shifts, setShifts] = useState([]);
    const [selectedShift, setSelectedShift] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'list', 'form', 'view'
    const [deleteError, setDeleteError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const { showSnackbar } = useSnackbar();
    const { isEmployee, isLoading: roleLoading } = useRolePermissions();

    // Check if user has permission to manage shifts
    const canManageShifts = isEmployee();

    // Fetch shifts from API
    useEffect(() => {
        fetchShifts();
    }, []);

    const fetchShifts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/shifts`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setShifts(data.data || []);
            } else {
                console.error('Failed to fetch shifts:', response.status);
            }
        } catch (error) {
            console.error('Error fetching shifts:', error);
            showSnackbar('Error fetching shifts', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        if (!canManageShifts) {
            showSnackbar('You do not have permission to create shifts', 'error');
            return;
        }
        setSelectedShift(null);
        setViewMode('form');
    };

    const handleEdit = (shift) => {
        if (!canManageShifts) {
            showSnackbar('You do not have permission to edit shifts', 'error');
            return;
        }
        setSelectedShift(shift);
        setViewMode('form');
    };

    const handleView = (shift) => {
        setSelectedShift(shift);
        setViewMode('view');
    };

    const getShiftIcon = (title) => {
        const lowerTitle = title.toLowerCase();

        if (lowerTitle.includes('morning')) {
            return <Sun className="w-4 h-4 text-yellow-500 mr-1" />;
        }

        if (lowerTitle.includes('evening')) {
            return <Sunset className="w-4 h-4 text-orange-500 mr-1" />;
        }

        if (lowerTitle.includes('night')) {
            return <Moon className="w-4 h-4 text-indigo-500 mr-1" />;
        }

        // Default for custom titles
        return <Clock className="w-4 h-4 text-gray-400 mr-1" />;
    };

    const handleDelete = async (shiftId) => {
        if (!canManageShifts) {
            showSnackbar('You do not have permission to delete shifts', 'error');
            return;
        }

        if (window.confirm('Are you sure you want to delete this shift? This action cannot be undone.')) {
            try {
                setActionLoading(true);
                setDeleteError(null);

                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/shifts/${shiftId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });

                const responseData = await response.json();

                if (response.ok) {
                    showSnackbar('Shift deleted successfully!', 'success');
                    setShifts(prevShifts => prevShifts.filter(shift => shift.id !== shiftId));

                    if (viewMode === 'view' && selectedShift?.id === shiftId) {
                        setViewMode('list');
                        setSelectedShift(null);
                    }

                    setTimeout(() => {
                        fetchShifts();
                    }, 100);
                } else {
                    setDeleteError(responseData.message || 'Failed to delete shift');
                    showSnackbar(responseData.message || 'Failed to delete shift', 'error');
                }
            } catch (error) {
                console.error('Error deleting shift:', error);
                setDeleteError('Network error. Please try again.');
                showSnackbar('Network error. Please try again.', 'error');
            } finally {
                setActionLoading(false);
            }
        }
    };

    const handleDeactivate = async (shiftId) => {
        if (!canManageShifts) {
            showSnackbar('You do not have permission to deactivate shifts', 'error');
            return;
        }

        if (window.confirm('Are you sure you want to deactivate this shift?')) {
            try {
                setActionLoading(true);
                setDeleteError(null);

                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/shifts/${shiftId}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ is_active: false })
                });

                const responseData = await response.json();

                if (response.ok) {
                    showSnackbar('Shift deactivated successfully!', 'success');
                    setShifts(prevShifts =>
                        prevShifts.map(shift =>
                            shift.id === shiftId
                                ? { ...shift, is_active: false }
                                : shift
                        )
                    );

                    if (selectedShift?.id === shiftId) {
                        setSelectedShift(prev => ({ ...prev, is_active: false }));
                    }

                    setTimeout(() => {
                        fetchShifts();
                    }, 100);
                } else {
                    setDeleteError(responseData.message || 'Failed to deactivate shift');
                    showSnackbar(responseData.message || 'Failed to deactivate shift', 'error');
                }
            } catch (error) {
                console.error('Error deactivating shift:', error);
                setDeleteError('Network error. Please try again.');
                showSnackbar('Network error. Please try again.', 'error');
            } finally {
                setActionLoading(false);
            }
        }
    };

    const handleActivate = async (shiftId) => {
        if (!canManageShifts) {
            showSnackbar('You do not have permission to activate shifts', 'error');
            return;
        }

        if (window.confirm('Are you sure you want to activate this shift?')) {
            try {
                setActionLoading(true);
                setDeleteError(null);

                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/shifts/${shiftId}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ is_active: true })
                });

                const responseData = await response.json();

                if (response.ok) {
                    showSnackbar('Shift activated successfully!', 'success');
                    setShifts(prevShifts =>
                        prevShifts.map(shift =>
                            shift.id === shiftId
                                ? { ...shift, is_active: true }
                                : shift
                        )
                    );

                    if (selectedShift?.id === shiftId) {
                        setSelectedShift(prev => ({ ...prev, is_active: true }));
                    }

                    setTimeout(() => {
                        fetchShifts();
                    }, 100);
                } else {
                    setDeleteError(responseData.message || 'Failed to activate shift');
                    showSnackbar(responseData.message || 'Failed to activate shift', 'error');
                }
            } catch (error) {
                console.error('Error activating shift:', error);
                setDeleteError('Network error. Please try again.');
                showSnackbar('Network error. Please try again.', 'error');
            } finally {
                setActionLoading(false);
            }
        }
    };

    const handleFormSuccess = (message = 'Shift saved successfully!') => {
        fetchShifts();
        setViewMode('list');
        setSelectedShift(null);
        showSnackbar(message, 'success');
    };

    const handleBackToList = () => {
        setViewMode('list');
        setSelectedShift(null);
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm} UTC`;
    };

    const formatLocalTime = (utcTime, timezone) => {
        try {
            const date = new Date(`1970-01-01T${utcTime}Z`);
            return new Intl.DateTimeFormat('en-US', {
                timeZone: timezone,
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }).format(date);
        } catch (error) {
            return 'Invalid time';
        }
    };

    // Show loading while checking permissions
    if (roleLoading) {
        return (
            <div className="p-6 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                <span className="ml-3 text-gray-600">Loading permissions...</span>
            </div>
        );
    }

    // Loading state
    if (loading && viewMode === 'list') {
        return (
            <div className="p-6 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                <span className="ml-3 text-gray-600">Loading shifts...</span>
            </div>
        );
    }

    // Form view
    if (viewMode === 'form') {
        // Check permission again for form view
        if (!canManageShifts) {
            return (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleBackToList}
                                className="text-gray-600 hover:text-gray-900 flex bg-gray-100 p-1.5 rounded items-center"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" />
                            </button>
                            <h2 className="text-lg font-semibold">
                                {selectedShift ? 'Edit Shift' : 'Create New Shift'}
                            </h2>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border shadow-sm p-6 text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Permission Required</h3>
                        <p className="text-gray-600 mb-4">
                            You do not have permission to {selectedShift ? 'edit' : 'create'} shifts.
                            Only administrators and employees can manage shifts.
                        </p>
                        <button
                            onClick={handleBackToList}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Go Back
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleBackToList}
                            className="text-gray-600 hover:text-gray-900 flex bg-gray-100 p-1.5 rounded items-center"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                        </button>
                        <h2 className="text-lg font-semibold">
                            {selectedShift ? 'Edit Shift' : 'Create New Shift'}
                        </h2>
                    </div>
                </div>
                <ShiftMasterForm
                    shift={selectedShift}
                    onSuccess={handleFormSuccess}
                    onCancel={handleBackToList}
                />
            </div>
        );
    }

    // Detailed view
    if (viewMode === 'view' && selectedShift) {
        return (
            <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleBackToList}
                            className="text-gray-600 hover:text-gray-900 flex bg-gray-100 p-1.5 rounded items-center"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                        </button>
                        <h2 className="text-lg font-semibold">{selectedShift.title}</h2>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => handleEdit(selectedShift)}
                            disabled={!canManageShifts}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-emerald-600 hover:text-emerald-800 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:text-gray-400"
                        >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg border shadow-sm">
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Shift Information</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-500">Shift Title</p>
                                        <p className="font-medium">{selectedShift.title}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Status</p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedShift.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {selectedShift.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Description</p>
                                        <p className="text-sm">{selectedShift.description || 'No description'}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Time Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-500">UTC Time</p>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <span className="font-medium text-sm">
                                                {formatTime(selectedShift.start_time_utc)} - {formatTime(selectedShift.end_time_utc)}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500 mb-2">Local Times</p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 text-sm">India (IST):</span>
                                                <span className="font-medium text-sm">
                                                    {formatLocalTime(selectedShift.start_time_utc, 'Asia/Kolkata')} - {formatLocalTime(selectedShift.end_time_utc, 'Asia/Kolkata')}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 text-sm">US East (EST):</span>
                                                <span className="font-medium text-sm">
                                                    {formatLocalTime(selectedShift.start_time_utc, 'America/New_York')} - {formatLocalTime(selectedShift.end_time_utc, 'America/New_York')}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 text-sm">US West (PST):</span>
                                                <span className="font-medium text-sm">
                                                    {formatLocalTime(selectedShift.start_time_utc, 'America/Los_Angeles')} - {formatLocalTime(selectedShift.end_time_utc, 'America/Los_Angeles')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Actions</h3>
                            <div className="space-y-2 space-x-3">
                                {actionLoading ? (
                                    <div className="flex items-center justify-center py-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600"></div>
                                        <span className="ml-2 text-sm text-gray-600">Processing...</span>
                                    </div>
                                ) : (
                                    <>
                                        {selectedShift.is_active ? (
                                            <button
                                                onClick={() => handleDeactivate(selectedShift.id)}
                                                disabled={!canManageShifts || actionLoading}
                                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 hover:bg-orange-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                                            >
                                                <AlertCircle className="w-4 h-4 mr-2" />
                                                Deactivate Shift
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleActivate(selectedShift.id)}
                                                    disabled={!canManageShifts || actionLoading}
                                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Activate Shift
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(selectedShift.id)}
                                                    disabled={!canManageShifts || actionLoading}
                                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Permanently Delete Shift
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // List view
    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold">Shift Management</h2>
                    <p className="text-sm text-gray-500">Manage and create shifts for scheduling</p>
                </div>
                <button
                    onClick={handleCreateNew}
                    disabled={!canManageShifts}
                    className="inline-flex items-center text-sm px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Shift
                </button>
            </div>

            {shifts.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {canManageShifts ? 'No shifts created yet' : 'No shifts available'}
                    </h3>
                    <p className="text-gray-500 mb-4">
                        {canManageShifts ? 'Get started by creating your first shift' : 'Shifts will appear here when created by administrators'}
                    </p>
                    {canManageShifts && (
                        <button
                            onClick={handleCreateNew}
                            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create First Shift
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {shifts.map(shift => {
                        const formattedShift = getFormattedShiftTime(shift);

                        return (
                            <div key={shift.id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-medium text-sm text-gray-900">
                                                {shift.title}
                                            </h3>

                                            <div className="flex items-center mt-1">
                                                {getShiftIcon(shift.title)}

                                                <span className="text-xs font-semibold text-gray-500">
                                                    {formattedShift.localTime}
                                                </span>
                                            </div>
                                        </div>

                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${shift.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {shift.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-teal-600 mb-4 line-clamp-2">
                                        Time Zone - {getUserTimezone()}
                                    </p>
                                    <p className="text-xs text-gray-600 mb-4 line-clamp-2">
                                        {shift.description || 'No description provided'}
                                    </p>

                                    <div className="flex items-center justify-between pt-3 border-t">
                                        <div className="text-xs text-gray-500">
                                            Created: {new Date(shift.created_at).toLocaleDateString()}
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleView(shift)}
                                                className="p-1 text-gray-400 hover:text-emerald-600"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() => handleEdit(shift)}
                                                disabled={!canManageShifts}
                                                className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-gray-400"
                                                title={!canManageShifts ? "You don't have permission to edit shifts" : "Edit"}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>

                                            {actionLoading ? (
                                                <div className="p-1">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleDelete(shift.id)}
                                                    disabled={!canManageShifts}
                                                    className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-gray-400"
                                                    title={!canManageShifts ? "You don't have permission to delete shifts" : "Delete"}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}