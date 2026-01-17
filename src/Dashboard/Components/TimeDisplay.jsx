// components/TimeDisplay.jsx
import { formatUTCTimeForDisplay, getMultiTimezoneDisplay } from '../utils/timezone';
import { Clock, Globe } from 'lucide-react';

export default function TimeDisplay({ utcStartTime, utcEndTime, date, showAllTimezones = false }) {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    const localStart = formatUTCTimeForDisplay(utcStartTime, date);
    const localEnd = formatUTCTimeForDisplay(utcEndTime, date);
    
    if (!showAllTimezones) {
        return (
            <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                <span>{localStart} - {localEnd}</span>
                <span className="ml-2 text-xs text-gray-500">({userTimezone})</span>
            </div>
        );
    }
    
    const allTimezones = getMultiTimezoneDisplay(utcStartTime, date);
    
    return (
        <div className="space-y-3">
            <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2 text-gray-400" />
                <span className="font-medium">Times in different timezones:</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {allTimezones.map((tz, index) => (
                    <div key={index} className="bg-gray-50 p-2 rounded text-center">
                        <div className="text-xs font-medium text-gray-600">{tz.label}</div>
                        <div className="text-sm font-semibold">{tz.time}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}