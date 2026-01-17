import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, StopCircle, Clock, AlertCircle, CheckCircle, Lock, Loader2, Calendar, Clock as ClockIcon } from 'lucide-react';
import { useSnackbar } from '../../Components/SnackbarContext';
import { useRolePermissions } from '../../../hooks/useRolePermissions';
import { isJobAvailableForTimer, formatTimeUntil } from '../../../utils/timezone';

export default function JobTimer({ jobId, candidateId, job }) {
    const [timer, setTimer] = useState({
        isRunning: false,
        isPaused: false,
        seconds: 0,
        startTime: null,
        currentLogId: null,
        totalSeconds: 0,
        lastResumedAt: null
    });

    const [loading, setLoading] = useState({
        start: false,
        pause: false,
        resume: false,
        stop: false,
        fetch: false
    });
    const [error, setError] = useState(null);
    const [availability, setAvailability] = useState({ isAvailable: true, message: '' });
    const intervalRef = useRef(null);
    const lastUpdateRef = useRef(Date.now());

    const { showSnackbar } = useSnackbar();
    const { canTrackTime, isLoading: roleLoading } = useRolePermissions();

    // Calculate elapsed seconds
    const calculateElapsedSeconds = (startTime, pausedTime = null) => {
        if (!startTime) return 0;

        const start = new Date(startTime);
        const now = new Date();

        if (pausedTime) {
            const paused = new Date(pausedTime);
            return Math.floor((paused - start) / 1000);
        }

        return Math.floor((now - start) / 1000);
    };

    // Check job availability on mount and periodically
    useEffect(() => {
        checkJobAvailability();

        // Check every minute
        const availabilityInterval = setInterval(checkJobAvailability, 60000);

        return () => {
            clearInterval(availabilityInterval);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [job, jobId]);

    // Fetch active time log
    useEffect(() => {
        if (availability.isAvailable) {
            fetchActiveTimeLog();
        }
    }, [jobId, candidateId, availability.isAvailable]);

    const checkJobAvailability = () => {
        if (job) {
            const availabilityCheck = isJobAvailableForTimer(job);
            setAvailability(availabilityCheck);
        }
    };

    const fetchActiveTimeLog = async () => {
        setLoading(prev => ({ ...prev, fetch: true }));
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/jobs/${jobId}/time/logs`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const activeLog = data.data.find(log =>
                    log.status === 'in_progress' || log.status === 'paused'
                );

                if (activeLog) {
                    let displaySeconds = 0;
                    let isRunning = false;
                    let isPaused = false;

                    if (activeLog.status === 'in_progress') {
                        displaySeconds = calculateElapsedSeconds(activeLog.start_time);
                        isRunning = true;
                        isPaused = false;
                    } else if (activeLog.status === 'paused') {
                        displaySeconds = activeLog.total_seconds || 0;
                        isRunning = false;
                        isPaused = true;
                    }

                    setTimer({
                        isRunning,
                        isPaused,
                        seconds: displaySeconds,
                        startTime: activeLog.start_time ? new Date(activeLog.start_time) : null,
                        currentLogId: activeLog.id,
                        totalSeconds: activeLog.total_seconds || 0,
                        lastResumedAt: activeLog.last_resumed_at ? new Date(activeLog.last_resumed_at) : null
                    });

                    if (isRunning) {
                        startTimerInterval(displaySeconds);
                    }
                } else {
                    setTimer({
                        isRunning: false,
                        isPaused: false,
                        seconds: 0,
                        startTime: null,
                        currentLogId: null,
                        totalSeconds: 0,
                        lastResumedAt: null
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching time log:', error);
            setError('Network error. Please try again.');
        } finally {
            setLoading(prev => ({ ...prev, fetch: false }));
        }
    };

    const startTimerInterval = (initialSeconds = 0) => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        setTimer(prev => ({ ...prev, seconds: initialSeconds }));
        lastUpdateRef.current = Date.now();

        intervalRef.current = setInterval(() => {
            const now = Date.now();
            const elapsed = Math.floor((now - lastUpdateRef.current) / 1000);

            if (elapsed >= 1) {
                setTimer(prev => ({
                    ...prev,
                    seconds: prev.seconds + elapsed
                }));
                lastUpdateRef.current = now;
            }
        }, 1000);
    };

    const stopTimerInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartTimer = async () => {
        if (!canTrackTime()) {
            showSnackbar('Only candidates can track time', 'error');
            return;
        }

        // Check availability before starting
        if (!availability.isAvailable) {
            showSnackbar(availability.message, 'error');
            return;
        }

        setLoading(prev => ({ ...prev, start: true }));
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/jobs/${jobId}/time/start`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                const now = new Date();
                setTimer({
                    isRunning: true,
                    isPaused: false,
                    seconds: 0,
                    startTime: now,
                    currentLogId: data.data.id,
                    totalSeconds: 0,
                    lastResumedAt: now
                });

                startTimerInterval(0);
                showSnackbar('Timer started', 'success');

                if (window.onTimerStarted) {
                    window.onTimerStarted();
                }
            } else {
                setError(data.message || 'Failed to start timer');
                showSnackbar(data.message || 'Failed to start timer', 'error');
            }
        } catch (error) {
            console.error('Error starting timer:', error);
            setError('Network error. Please try again.');
            showSnackbar('Network error. Please try again.', 'error');
        } finally {
            setLoading(prev => ({ ...prev, start: false }));
        }
    };

    const handlePauseTimer = async () => {
        if (!canTrackTime()) {
            showSnackbar('Only candidates can track time', 'error');
            return;
        }

        setLoading(prev => ({ ...prev, pause: true }));

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/jobs/${jobId}/time/pause`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                const elapsedSeconds = timer.seconds;

                setTimer(prev => ({
                    ...prev,
                    isRunning: false,
                    isPaused: true,
                    totalSeconds: elapsedSeconds
                }));

                stopTimerInterval();
                showSnackbar('Timer paused', 'success');
            } else {
                setError(data.message || 'Failed to pause timer');
                showSnackbar(data.message || 'Failed to pause timer', 'error');
            }
        } catch (error) {
            console.error('Error pausing timer:', error);
            setError('Network error. Please try again.');
            showSnackbar('Network error. Please try again.', 'error');
        } finally {
            setLoading(prev => ({ ...prev, pause: false }));
        }
    };

    const handleResumeTimer = async () => {
        if (!canTrackTime()) {
            showSnackbar('Only candidates can track time', 'error');
            return;
        }

        // Check availability before resuming
        if (!availability.isAvailable) {
            showSnackbar(availability.message, 'error');
            return;
        }

        setLoading(prev => ({ ...prev, resume: true }));

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/jobs/${jobId}/time/resume`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                const now = new Date();
                const currentSeconds = timer.seconds;

                setTimer(prev => ({
                    ...prev,
                    isRunning: true,
                    isPaused: false,
                    lastResumedAt: now
                }));

                startTimerInterval(currentSeconds);
                showSnackbar('Timer resumed', 'success');
            } else {
                setError(data.message || 'Failed to resume timer');
                showSnackbar(data.message || 'Failed to resume timer', 'error');
            }
        } catch (error) {
            console.error('Error resuming timer:', error);
            setError('Network error. Please try again.');
            showSnackbar('Network error. Please try again.', 'error');
        } finally {
            setLoading(prev => ({ ...prev, resume: false }));
        }
    };

    const handleStopTimer = async () => {
        if (!canTrackTime()) {
            showSnackbar('Only candidates can track time', 'error');
            return;
        }

        if (!window.confirm('Are you sure you want to stop the timer? This will save your time log.')) {
            return;
        }

        setLoading(prev => ({ ...prev, stop: true }));

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/jobs/${jobId}/time/stop`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    notes: 'Completed work session'
                })
            });

            const data = await response.json();

            if (response.ok) {
                setTimer({
                    isRunning: false,
                    isPaused: false,
                    seconds: 0,
                    startTime: null,
                    currentLogId: null,
                    totalSeconds: 0,
                    lastResumedAt: null
                });

                stopTimerInterval();
                showSnackbar('Timer stopped and time logged', 'success');

                if (window.onTimerStopped) {
                    window.onTimerStopped();
                }
            } else {
                setError(data.message || 'Failed to stop timer');
                showSnackbar(data.message || 'Failed to stop timer', 'error');
            }
        } catch (error) {
            console.error('Error stopping timer:', error);
            setError('Network error. Please try again.');
            showSnackbar('Network error. Please try again.', 'error');
        } finally {
            setLoading(prev => ({ ...prev, stop: false }));
        }
    };

    // Refresh timer every minute to stay in sync
    useEffect(() => {
        if (timer.isRunning) {
            const syncInterval = setInterval(() => {
                if (timer.startTime) {
                    const elapsedSeconds = calculateElapsedSeconds(timer.startTime);
                    setTimer(prev => ({ ...prev, seconds: elapsedSeconds }));
                }
            }, 60000);

            return () => clearInterval(syncInterval);
        }
    }, [timer.isRunning, timer.startTime]);

    // Loading state
    if (roleLoading || loading.fetch) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mb-4"></div>
                    <p className="text-gray-600">Loading timer...</p>
                </div>
            </div>
        );
    }

    // Show availability info
    const showAvailabilityInfo = !timer.isRunning && !timer.isPaused && !availability.isAvailable;

    if (!canTrackTime()) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Work Timer</h3>
                        <p className="text-sm text-gray-500">Time tracking for this job</p>
                    </div>

                    <div className="mt-4 md:mt-0">
                        <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg">
                            <Clock className="w-4 h-4 text-gray-600" />
                            <span className="text-xl font-bold text-gray-900 font-mono">
                                {timer.isRunning || timer.isPaused ? formatTime(timer.seconds) : '00:00:00'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {timer.isRunning && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-sm font-medium text-green-800">Timer is running</span>
                            </div>
                            <p className="text-sm text-green-700 mt-1">
                                Started: {timer.startTime ? formatTime(calculateElapsedSeconds(timer.startTime)) : '00:00:00'}
                            </p>
                        </div>
                    )}

                    {timer.isPaused && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <span className="text-sm font-medium text-yellow-800">Timer is paused</span>
                            </div>
                            <p className="text-sm text-yellow-700 mt-1">
                                Total time: {formatTime(timer.seconds)}
                            </p>
                        </div>
                    )}

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                            <Lock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="text-[13px] font-medium text-blue-800">Time Tracking Information</h4>
                                <p className="text-xs text-blue-700 mt-1">
                                    Only candidates assigned to this job can start and stop the timer.
                                    You can view the current timer status and time logs below.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Candidate view with full timer controls
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Work Timer</h3>
                    <p className="text-sm text-gray-500">Track your work time for this job</p>
                </div>

                <div className="mt-4 md:mt-0">
                    <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg">
                        <Clock className="w-5 h-5 text-orange-600" />
                        <span className="text-2xl font-bold text-gray-900 font-mono">
                            {formatTime(timer.seconds)}
                        </span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <span className="text-sm text-red-700">{error}</span>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {/* Status Info */}
                {timer.isRunning && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-sm font-medium text-green-800">Timer is running</span>
                        </div>
                        <p className="text-sm text-green-700 mt-1">
                            Started: {timer.startTime ? formatTime(calculateElapsedSeconds(timer.startTime)) : '00:00:00'}
                        </p>
                    </div>
                )}

                {timer.isPaused && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span className="text-sm font-medium text-yellow-800">Timer is paused</span>
                        </div>
                        <p className="text-sm text-yellow-700 mt-1">
                            Total time: {formatTime(timer.seconds)}
                        </p>
                    </div>
                )}

                {/* Availability Information */}
                {showAvailabilityInfo && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start space-x-2">

                            <div>
                                <h4 className="text-sm font-medium text-blue-800">Job Availability</h4>
                                <p className="text-sm text-blue-700 mt-1">{availability.message}</p>
                                {job && (
                                    <div className="mt-2 text-xs text-blue-600 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3" />
                                            <span className='text-sm'>Job Dates: {new Date(job.job_startdate).toLocaleDateString()} - {new Date(job.job_enddate).toLocaleDateString()}</span>
                                        </div>
                                        {job.shifts && job.shifts.length > 0 && (
                                            <div className="flex items-center gap-2">
                                                <ClockIcon className="w-3 h-3" />
                                                <span className='text-sm'>Shifts: {job.shifts.map(s => s.title).join(', ')}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons - Only for candidates */}
                <div className="flex flex-wrap gap-3">
                    {!timer.isRunning && !timer.isPaused && (
                        <button
                            onClick={handleStartTimer}
                            disabled={loading.start || loading.pause || loading.resume || loading.stop || !availability.isAvailable}
                            className="inline-flex text-sm items-center px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[120px] justify-center"
                            title={!availability.isAvailable ? availability.message : 'Start timer'}
                        >
                            {loading.start ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Starting...
                                </>
                            ) : (
                                <>
                                    <Play className="w-3 h-3 mr-2" />
                                    Start Timer
                                </>
                            )}
                        </button>
                    )}

                    {timer.isRunning && (
                        <>
                            <button
                                onClick={handlePauseTimer}
                                disabled={loading.pause || loading.stop}
                                className="inline-flex text-sm items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[100px] justify-center"
                            >
                                {loading.pause ? (
                                    <>
                                        <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                                        Pausing...
                                    </>
                                ) : (
                                    <>
                                        <Pause className="w-3 h-3 mr-2" />
                                        Pause
                                    </>
                                )}
                            </button>

                            <button
                                onClick={handleStopTimer}
                                disabled={loading.pause || loading.stop}
                                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[120px] justify-center"
                            >
                                {loading.stop ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Stopping...
                                    </>
                                ) : (
                                    <>
                                        <StopCircle className="w-4 h-4 mr-2" />
                                        Stop & Save
                                    </>
                                )}
                            </button>
                        </>
                    )}

                    {timer.isPaused && (
                        <>
                            <button
                                onClick={handleResumeTimer}
                                disabled={loading.resume || loading.stop || !availability.isAvailable}
                                className="inline-flex text-sm items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[100px] justify-center"
                                title={!availability.isAvailable ? availability.message : 'Resume timer'}
                            >
                                {loading.resume ? (
                                    <>
                                        <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                                        Resuming...
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-3 h-3 mr-2" />
                                        Resume
                                    </>
                                )}
                            </button>

                            <button
                                onClick={handleStopTimer}
                                disabled={loading.resume || loading.stop}
                                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[120px] justify-center"
                            >
                                {loading.stop ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Stopping...
                                    </>
                                ) : (
                                    <>
                                        <StopCircle className="w-4 h-4 mr-2" />
                                        Stop & Save
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>

                {/* Instructions */}
                <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">How it works:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-start">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className='text-sm'>Click "Start Timer" when you begin working during your assigned shift</span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className='text-sm'>Use "Pause" for short breaks</span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className='text-sm'>Click "Stop & Save" when you finish working</span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className='text-sm'>Timer is only available during your assigned shift times</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}