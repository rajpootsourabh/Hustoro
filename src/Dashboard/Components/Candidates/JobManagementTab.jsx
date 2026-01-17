import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, Users, Eye, Briefcase, AlertCircle, ChevronLeft, User, Clock, CheckCircle, XCircle, Timer, Lock, CalendarDays } from 'lucide-react';
import JobCreationForm from './JobCreationForm';
import JobTimer from './JobTimer';
import { getFormattedShiftTime } from '../../../utils/timezone';
import { useSnackbar } from '../../Components/SnackbarContext';
import { useRolePermissions } from '../../../hooks/useRolePermissions';

export default function JobManagementTab({ candidateData }) {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list');
    const [deleteError, setDeleteError] = useState(null);
    const [timeLogs, setTimeLogs] = useState([]);
    const [loadingTimeLogs, setLoadingTimeLogs] = useState(false);

    const { showSnackbar } = useSnackbar();
    const {
        canCreateJobs,
        canEditJobs,
        canDeleteJobs,
        canTrackTime,
        isCandidate,
        isLoading: roleLoading
    } = useRolePermissions();

    // Fetch jobs for the candidate from API
    useEffect(() => {
        if (candidateData?.candidate_id) {
            fetchJobs();
        }
    }, [candidateData]);

    // Fetch time logs when selected job changes in view mode
    useEffect(() => {
        if (viewMode === 'view' && selectedJob) {
            fetchTimeLogs(selectedJob.id);
        }
    }, [viewMode, selectedJob]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/candidates/${candidateData.candidate_id}/jobs`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setJobs(data.data || []);
            } else {
                console.error('Failed to fetch jobs:', response.status);
                setJobs([]);
                showSnackbar('Failed to load jobs', 'error');
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setJobs([]);
            showSnackbar('Network error. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchTimeLogs = async (jobId) => {
        try {
            setLoadingTimeLogs(true);
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/jobs/${jobId}/time/logs`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTimeLogs(data.data || []);
            } else {
                console.error('Failed to fetch time logs:', response.status);
                setTimeLogs([]);
            }
        } catch (error) {
            console.error('Error fetching time logs:', error);
            setTimeLogs([]);
        } finally {
            setLoadingTimeLogs(false);
        }
    };

    const handleCreateNew = () => {
        if (!canCreateJobs()) {
            showSnackbar('You do not have permission to create jobs', 'error');
            return;
        }
        setSelectedJob(null);
        setViewMode('form');
    };

    const handleEdit = (job) => {
        if (!canEditJobs()) {
            showSnackbar('You do not have permission to edit jobs', 'error');
            return;
        }
        setSelectedJob(job);
        setViewMode('form');
    };

    const handleView = (job) => {
        setSelectedJob(job);
        setViewMode('view');
    };

    const handleDeleteJob = async (jobId) => {
        if (!canDeleteJobs()) {
            showSnackbar('You do not have permission to delete jobs', 'error');
            return;
        }

        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/jobs/${jobId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });

                const responseData = await response.json();

                if (response.ok) {
                    fetchJobs();
                    setDeleteError(null);
                    showSnackbar('Job deleted successfully!', 'success');

                    if (viewMode === 'view') {
                        setViewMode('list');
                        setSelectedJob(null);
                    }
                } else {
                    setDeleteError(responseData.message || 'Failed to delete job');
                    showSnackbar(responseData.message || 'Failed to delete job', 'error');
                }
            } catch (error) {
                console.error('Error deleting job:', error);
                setDeleteError('Network error. Please try again.');
                showSnackbar('Network error. Please try again.', 'error');
            }
        }
    };

    const handleFormSuccess = () => {
        fetchJobs();
        setViewMode('list');
        setSelectedJob(null);
        showSnackbar('Job saved successfully!', 'success');
    };

    const handleBackToList = () => {
        setViewMode('list');
        setSelectedJob(null);
        setTimeLogs([]);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getJobStatusBadge = (status) => {
        const statusConfig = {
            draft: {
                color: 'bg-gray-100 text-gray-800',
                label: 'Draft',
                icon: <CheckCircle className="w-3 h-3 mr-1" />
            },
            assigned: {
                color: 'bg-teal-100 text-green-800',
                label: 'Assigned',
                icon: <CheckCircle className="w-3 h-3 mr-1" />
            },
            completed: {
                color: 'bg-purple-100 text-purple-800',
                label: 'Completed',
                icon: <CheckCircle className="w-3 h-3 mr-1" />
            }
        };

        const config = statusConfig[status] || statusConfig.draft;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                {config.icon}
                {config.label}
            </span>
        );
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        const time = timeString.split(':').slice(0, 2).join(':');
        const [hours, minutes] = time.split(':').map(Number);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        return `${hours12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    };

    const formatSeconds = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const calculateTotalTime = () => {
        return timeLogs.reduce((total, log) => total + (log.total_seconds || 0), 0);
    };

    const handleTimerStopped = () => {
        if (selectedJob) {
            fetchTimeLogs(selectedJob.id);
        }
    };

    useEffect(() => {
        window.onTimerStopped = handleTimerStopped;

        return () => {
            delete window.onTimerStopped;
        };
    }, [selectedJob]);

    // Loading state
    if (loading && viewMode === 'list') {
        return (
            <div className="p-6 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                <span className="ml-3 text-gray-600">Loading jobs...</span>
            </div>
        );
    }

    if (roleLoading) {
        return (
            <div className="p-6 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                <span className="ml-3 text-gray-600">Loading permissions...</span>
            </div>
        );
    }

    // Form view
    if (viewMode === 'form') {
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
                            {selectedJob ? 'Edit Job' : 'Create New Job & Assign to Candidate'}
                        </h2>
                    </div>
                </div>
                <JobCreationForm
                    candidateData={candidateData}
                    job={viewMode === 'form' && selectedJob ? selectedJob : null}
                    onSuccess={handleFormSuccess}
                    onCancel={handleBackToList}
                />
            </div>
        );
    }

    // Detailed view
    if (viewMode === 'view' && selectedJob) {
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
                        <div>
                            <h2 className="text-lg font-semibold">{selectedJob.job_title}</h2>
                            <div className="flex items-center space-x-4 mt-1">
                                {getJobStatusBadge(selectedJob.status)}
                                <div className="flex items-center text-sm text-gray-500">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {formatDate(selectedJob.job_startdate || selectedJob.job_date)}
                                    {selectedJob.job_enddate && selectedJob.job_enddate !== selectedJob.job_startdate &&
                                        ` - ${formatDate(selectedJob.job_enddate)}`
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {canEditJobs() && (
                            <button
                                onClick={() => handleEdit(selectedJob)}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-teal-700 hover:text-teal-800"
                            >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                            </button>
                        )}
                    </div>
                </div>

                {/* Job Timer Component - Always visible but controls based on role */}
                <div className="mb-6">
                    <JobTimer
                        jobId={selectedJob.id}
                        candidateId={candidateData?.candidate_id}
                         job={selectedJob}
                    />
                </div>

                <div className="bg-white rounded-lg border shadow-sm">
                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <h3 className="text-sm font-medium text-gray-500 mb-3">Job Description</h3>
                                <div className="prose max-w-none">
                                    <p className="whitespace-pre-line text-sm">{selectedJob.job_description || 'No description provided'}</p>
                                </div>

                                {/* Shifts Information */}
                                {selectedJob.shifts && selectedJob.shifts.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="text-sm font-medium text-gray-500 mb-3">Assigned Shifts</h3>
                                        <div className="space-y-3">
                                            {selectedJob.shifts.map((shift, index) => {
                                                const formattedShift = getFormattedShiftTime(shift);
                                                return (
                                                    <div key={shift.id} className="border p-2 px-4 rounded-lg">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <div className="flex items-center space-x-2">
                                                                    <p className="font-medium text-sm">{shift.title}</p>
                                                                    <span className={`px-2 py-[1px] rounded-full text-[11px] ${shift.is_active ? 'bg-green-200 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                        {shift.is_active ? 'Active' : 'Inactive'}
                                                                    </span>
                                                                </div>

                                                                {/* Local Time Display */}
                                                                <div className="mt-1">
                                                                    <p className="text-xs text-gray-600">
                                                                        {formattedShift.localTime} (Local Time)
                                                                    </p>
                                                                    <p className="text-[11px] text-gray-500 mt-1">
                                                                        {formattedShift.utcTime}
                                                                    </p>
                                                                    <div className="mt-1 text-[11px] px-1 bg-blue-100 text-blue-700 py-[2px] rounded inline-block">
                                                                        Timezone: {formattedShift.userTimezone} ({formattedShift.timezoneAbbreviation})
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {shift.description && (
                                                            <p className="mt-3 text-sm text-gray-600">{shift.description}</p>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-3">Job Details</h3>
                                <div className="space-y-4">
                                    {selectedJob.assigner && (
                                        <div>
                                            <p className="text-xs text-gray-500">Assigned By</p>
                                            <p className="font-medium text-sm">
                                                {selectedJob.assigner?.first_name || 'Unknown'}
                                                {selectedJob.assigner?.last_name || ''}
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-xs text-gray-500">Assigned Date</p>
                                        <p className="font-medium text-sm">
                                            {selectedJob.assigned_at
                                                ? new Date(selectedJob.assigned_at).toLocaleDateString()
                                                : 'Not assigned yet'}
                                        </p>
                                    </div>

                                    {selectedJob.notes && (
                                        <div>
                                            <p className="text-xs text-gray-500">Job Notes</p>
                                            <p className="text-sm text-gray-700 mt-1 bg-blue-50 p-2 rounded">
                                                {selectedJob.notes}
                                            </p>
                                        </div>
                                    )}
                                    {/* Total Time Worked */}
                                    <div>
                                        <p className="text-xs text-gray-500">Total Time Worked</p>
                                        <p className="font-medium text-lg text-teal-700 text-sm">
                                            {formatSeconds(calculateTotalTime())}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Time Logs Section - Visible to all */}
                        <div className="mt-8 pt-6 border-t">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Time Logs</h3>
                                <span className="text-sm text-gray-500">
                                    Total: {timeLogs.length} session{timeLogs.length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            {loadingTimeLogs ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                                </div>
                            ) : timeLogs.length === 0 ? (
                                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                    <Timer className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h4 className="text-lg font-medium text-gray-900 mb-2">No time logs yet</h4>
                                    <p className="text-gray-500">Start the timer to begin tracking time for this job</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {timeLogs.map(log => (
                                        <div key={log.id} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                                <div className="mb-2 md:mb-0">
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="w-3 h-3 text-gray-500" />
                                                        <p className="font-medium text-sm">
                                                            {formatDateTime(log.start_time)}
                                                        </p>
                                                        {log.end_time && (
                                                            <>
                                                                <span className="text-gray-400">→</span>
                                                                <p className="font-medium text-sm">
                                                                    {formatDateTime(log.end_time)}
                                                                </p>
                                                            </>
                                                        )}
                                                    </div>
                                                    {log.notes && (
                                                        <p className="text-xs text-gray-600 mt-2">
                                                            Notes: {log.notes}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <div className="text-center">
                                                        <p className="text-xs text-gray-500">Duration</p>
                                                        <p className="font-bold text-teal-700 text-sm">
                                                            {formatSeconds(log.total_seconds || 0)}
                                                        </p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs ${log.status === 'completed' ? 'bg-green-200 text-green-800' :
                                                        log.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-yellow-100 text-yellow-800'}`}>
                                                        {log.status.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Delete Button - Only for authorized users */}
                        {canDeleteJobs() && (
                            <div className="mt-6 pt-6 border-t">
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Action</h3>
                                <button
                                    onClick={() => handleDeleteJob(selectedJob.id)}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Job
                                </button>
                            </div>
                        )}
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
                    <h2 className="text-lg font-semibold">Jobs</h2>
                    <p className="text-sm text-gray-500">
                        Jobs assigned to {candidateData?.candidate?.first_name || candidateData?.first_name} {candidateData?.candidate?.last_name || candidateData?.last_name}
                    </p>
                </div>
                {canCreateJobs() && (
                    <button
                        onClick={handleCreateNew}
                        className="inline-flex items-center text-sm px-3 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-700"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Job
                    </button>
                )}
            </div>

            {jobs.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs yet</h3>
                    <p className="text-gray-500 mb-4">
                        {canCreateJobs()
                            ? 'Create a job to get started'
                            : 'No jobs have been assigned yet'
                        }
                    </p>
                    {canCreateJobs() && (
                        <button
                            onClick={handleCreateNew}
                            className="inline-flex items-center px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-600"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create First Job
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {jobs.map(job => (
                        <div key={job.id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <h3 className="font-semibold text-gray-900">{job.job_title}</h3>
                                                {getJobStatusBadge(job.status)}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleView(job)}
                                                    className="p-1 text-gray-400 hover:text-teal-600"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {canEditJobs() && (
                                                    <button
                                                        onClick={() => handleEdit(job)}
                                                        className="p-1 text-gray-400 hover:text-blue-600"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {canDeleteJobs() && (
                                                    <button
                                                        onClick={() => handleDeleteJob(job.id)}
                                                        className="p-1 text-gray-400 hover:text-red-600"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                                            <div className="flex text-[13px] items-center">
                                                <Calendar className="w-3 h-3 mr-1 text-orange-500" />
                                                {formatDate(job.job_startdate || job.job_date)}
                                                {job.job_enddate && job.job_enddate !== job.job_startdate &&
                                                    ` - ${formatDate(job.job_enddate)}`
                                                }
                                            </div>
                                            {job.assigned_at && (
                                                <div className="flex text-[13px] items-center">
                                                    <Clock className="w-3 h-3 mr-1 text-orange-500" />
                                                    Assigned on: {new Date(job.assigned_at).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>

                                        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                                            {job.job_description || 'No description provided'}
                                        </p>

                                        {/* Multiple Shifts Display */}
                                        {job.shifts && job.shifts.length > 0 && (
                                            <div className="mt-4">
                                                <p className="text-xs text-gray-500 mb-1">Assigned Shifts:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {job.shifts.map(shift => {
                                                        const formattedShift = getFormattedShiftTime(shift);
                                                        return (
                                                            <div
                                                                key={shift.id}
                                                                className="inline-flex flex-col px-3 py-2 rounded-md text-xs bg-blue-100 text-blue-700 border border-blue-200"
                                                            >

                                                                <span className="flex items-center gap-1 font-medium text-sm">
                                                                    <CalendarDays className="w-3 h-3" />
                                                                    {formattedShift.userLocalShiftName}
                                                                </span>
                                                                <span className="flex items-center gap-1 font-medium text-sm">
                                                                    <Clock className="w-3 h-3" />
                                                                    {formattedShift.localTime}
                                                                </span>
                                                                {/* <span className="text-blue-600 text-sm">{formattedShift.localTime}</span> */}
                                                                <span className="text-blue-500 text-[10px] mt-0.5">
                                                                    {formattedShift.utcTime} ({formattedShift.originalShifName})
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {job.notes && (
                                            <div className="mt-3">
                                                <p className="text-xs text-gray-500 mb-1">Job Notes:</p>
                                                <p className="text-sm text-gray-600 line-clamp-2">{job.notes}</p>
                                            </div>
                                        )}

                                        {/* Time Tracking Summary */}
                                        {job.timeLogs && job.timeLogs.length > 0 && (
                                            <div className="mt-3">
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <Timer className="w-4 h-4" />
                                                    <span>
                                                        {job.timeLogs.length} time log{job.timeLogs.length !== 1 ? 's' : ''} •
                                                        Total: {formatSeconds(job.timeLogs.reduce((total, log) => total + (log.total_seconds || 0), 0))}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}