// utils/timezone.js
import { DateTime } from "luxon";

// Get user's timezone
export const getUserTimezone = () => {
  return DateTime.local().zoneName || "UTC";
};

// Get user's timezone abbreviation (like IST, PST, EST, etc.)
export const getUserTimezoneAbbreviation = () => {
  const userTimezone = getUserTimezone();
  const now = DateTime.now().setZone(userTimezone);
  return now.toFormat("ZZZZ"); // Returns abbreviation like IST, PST, EST
};

// Get full timezone name
export const getUserTimezoneName = () => {
  const userTimezone = getUserTimezone();
  return userTimezone.split("/").pop()?.replace(/_/g, " ") || userTimezone;
};

// Convert local time (HH:mm) to UTC time (HH:mm)
export const localToUTC = (localTime, timezone = getUserTimezone()) => {
  try {
    if (!localTime) return "";

    // Create a DateTime with today's date and local time
    const today = DateTime.local().setZone(timezone).startOf("day");
    const [hours, minutes] = localTime.split(":").map(Number);

    const localDateTime = today.set({ hour: hours, minute: minutes });

    // Convert to UTC and format as HH:mm
    return localDateTime.toUTC().toFormat("HH:mm");
  } catch (error) {
    console.error("Error converting local to UTC:", error);
    return localTime;
  }
};

// Convert UTC time (HH:mm) to local time (HH:mm)
export const utcToLocal = (utcTime, timezone = getUserTimezone()) => {
  try {
    if (!utcTime) return "";

    // Create a DateTime with today's date and UTC time
    const today = DateTime.utc().startOf("day");
    const [hours, minutes] = utcTime.split(":").map(Number);

    const utcDateTime = today.set({ hour: hours, minute: minutes });

    // Convert to local timezone and format as HH:mm
    return utcDateTime.setZone(timezone).toFormat("HH:mm");
  } catch (error) {
    console.error("Error converting UTC to local:", error);
    return utcTime;
  }
};

// Format time in 12-hour format (HH:mm → hh:mm a)
export const formatTime12Hour = (time24) => {
  try {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":").map(Number);
    const date = DateTime.local().set({ hour: hours, minute: minutes });
    return date.toFormat("hh:mm a");
  } catch (error) {
    return time24;
  }
};

// Format UTC time to local 12-hour format
export const formatUTCToLocal12Hour = (
  utcTime,
  timezone = getUserTimezone()
) => {
  try {
    if (!utcTime) return "";

    const localTime = utcToLocal(utcTime, timezone);
    return formatTime12Hour(localTime);
  } catch (error) {
    return utcTime;
  }
};

// Get shift name based on time (Morning, Afternoon, Evening, Night)
export const getShiftName = (startTime, endTime) => {
  try {
    if (!startTime || !endTime) return "Shift";

    const [startHour] = startTime.split(":").map(Number);
    const [endHour] = endTime.split(":").map(Number);

    // Determine shift based on start time
    if (startHour >= 4 && startHour < 12) {
      return "Morning";
    } else if (startHour >= 12 && startHour < 17) {
      return "Afternoon";
    } else if (startHour >= 17 && startHour < 22) {
      return "Evening";
    } else {
      return "Night";
    }
  } catch (error) {
    return "Shift";
  }
};

// Convert UTC to local time with timezone abbreviation
export const getLocalTimeWithTimezone = (
  utcTime,
  timezone = getUserTimezone()
) => {
  try {
    if (!utcTime) return { time: "", abbreviation: "" };

    const localTime = utcToLocal(utcTime, timezone);
    const formattedTime = formatTime12Hour(localTime);
    const abbreviation = getUserTimezoneAbbreviation();

    return {
      time: formattedTime,
      abbreviation: abbreviation,
      fullName: getUserTimezoneName(),
    };
  } catch (error) {
    return { time: utcTime, abbreviation: "UTC", fullName: "UTC" };
  }
};

// Get formatted shift time display
export const getFormattedShiftTime = (shift) => {
  if (!shift) return "";

  const userTimezone = getUserTimezone();
  const userTzAbbr = getUserTimezoneAbbreviation();
  const userTzName = getUserTimezoneName();

  // Get local times
  const localStart = getLocalTimeWithTimezone(shift.start_time_utc);
  const localEnd = getLocalTimeWithTimezone(shift.end_time_utc);

  // Get shift name
  const userLocalShiftName =
    shift.title || getShiftName(shift.start_time_utc, shift.end_time_utc);
  const originalShifName = shift.title || "Unknown Shift";

  // Get UTC times for display
  const utcStart = formatTime12Hour(shift.start_time_utc);
  const utcEnd = formatTime12Hour(shift.end_time_utc);

  return {
    originalShifName,
    userLocalShiftName,
    localTime: `${localStart.time} - ${localEnd.time} ${localStart.abbreviation}`,
    utcTime: `${utcStart} - ${utcEnd} UTC`,
    userTimezone: userTzName,
    timezoneAbbreviation: userTzAbbr,
    fullDisplay: `${userLocalShiftName}\n${localStart.time} - ${localEnd.time} ${localStart.abbreviation}\n(${localStart.time} - ${localEnd.time} your local time - ${userTzName})`,
  };
};

// Get time in multiple timezones
export const getMultiTimezoneDisplay = (utcTime) => {
  const timezones = [
    { label: "UTC", zone: "UTC", short: "UTC" },
    { label: "India Standard Time", zone: "Asia/Kolkata", short: "IST" },
    {
      label: "Eastern Time (US & Canada)",
      zone: "America/New_York",
      short: "ET",
    },
    {
      label: "Pacific Time (US & Canada)",
      zone: "America/Los_Angeles",
      short: "PT",
    },
    { label: "Central European Time", zone: "Europe/Paris", short: "CET" },
    {
      label: "Australian Eastern Time",
      zone: "Australia/Sydney",
      short: "AET",
    },
    { label: "Japan Standard Time", zone: "Asia/Tokyo", short: "JST" },
    { label: "China Standard Time", zone: "Asia/Shanghai", short: "CST" },
    { label: "Singapore Time", zone: "Asia/Singapore", short: "SGT" },
    { label: "Dubai Time", zone: "Asia/Dubai", short: "GST" },
  ];

  if (!utcTime)
    return timezones.map((tz) => ({
      ...tz,
      time: "--:-- --",
      shortTime: "--:--",
    }));

  try {
    // Parse the UTC time
    const [hours, minutes] = utcTime.split(":").map(Number);
    const today = DateTime.utc().startOf("day");
    const utcDateTime = today.set({ hour: hours, minute: minutes });

    return timezones.map((tz) => {
      const localTime = utcDateTime.setZone(tz.zone).toFormat("hh:mm a");
      const localTime24 = utcDateTime.setZone(tz.zone).toFormat("HH:mm");
      return {
        label: tz.label,
        short: tz.short,
        zone: tz.zone,
        time: localTime,
        time24: localTime24,
      };
    });
  } catch (error) {
    console.error("Error getting multi-timezone display:", error);
    return timezones.map((tz) => ({ ...tz, time: "Invalid", time24: "00:00" }));
  }
};

// Convert local HH:mm to UTC for API payload
export const prepareTimeForAPI = (localTime, timezone = getUserTimezone()) => {
  const utcTime = localToUTC(localTime, timezone);
  return utcTime ? utcTime + ":00" : "00:00:00";
};

// Parse UTC time from API for display
export const parseTimeFromAPI = (utcTime, timezone = getUserTimezone()) => {
  if (!utcTime) return "";
  // Extract HH:mm from HH:mm:ss format
  const timePart = utcTime.includes(":")
    ? utcTime.split(":").slice(0, 2).join(":")
    : utcTime;
  return utcToLocal(timePart, timezone);
};

// Get user-friendly timezone display
export const getUserFriendlyTimezone = () => {
  const tz = getUserTimezone();
  const tzAbbr = getUserTimezoneAbbreviation();
  const tzName = getUserTimezoneName();

  return `${tzName} (${tzAbbr})`;
};

// Get current time in user's timezone
export const getCurrentLocalTime = () => {
  return DateTime.now().setZone(getUserTimezone()).toFormat("hh:mm a");
};

// Check if timezone supports DST
export const hasDaylightSaving = () => {
  const now = DateTime.now().setZone(getUserTimezone());
  return now.isInDST;
};

// Get offset from UTC in hours
export const getUTCOffset = () => {
  const now = DateTime.now().setZone(getUserTimezone());
  const offsetMinutes = now.offset;
  const offsetHours = offsetMinutes / 60;

  const sign = offsetHours >= 0 ? "+" : "-";
  const absHours = Math.abs(Math.floor(offsetHours));
  const minutes = Math.abs(offsetMinutes % 60);

  return `UTC${sign}${absHours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};


export const isJobAvailableForTimer = (job) => {
  if (!job) return { isAvailable: false, message: "No job data" };

  const now = DateTime.now();

  // 1. Check if current date is within job date range
  const jobStartDate = DateTime.fromISO(job.job_startdate).startOf("day");
  const jobEndDate = DateTime.fromISO(job.job_enddate).endOf("day");

  if (now < jobStartDate) {
    const diff = jobStartDate
      .diff(now, ["days", "hours", "minutes"])
      .toObject();
    return {
      isAvailable: false,
      message: `Job will be available in ${Math.ceil(
        diff.days || 0
      )} days, ${Math.ceil(diff.hours || 0)} hours`,
      type: "before_start",
    };
  }

  if (now > jobEndDate) {
    return {
      isAvailable: false,
      message: "Job has ended",
      type: "after_end",
    };
  }

  // 2. Check if job has shifts and current time is within shift time
  if (job.shifts && job.shifts.length > 0) {
    const userTimezone = getUserTimezone();
    const currentTime = now.setZone(userTimezone);
    
    // Get current time in seconds for more precise comparison
    const currentTimeInSeconds = currentTime.toSeconds();

    let isWithinAnyShift = false;
    let nextAvailableShift = null;
    let smallestTimeDifference = Infinity;

    for (const shift of job.shifts) {
      // Parse shift times
      const [startHour, startMinute, startSecond = 0] = shift.start_time_utc
        .split(":")
        .map(Number);
      const [endHour, endMinute, endSecond = 0] = shift.end_time_utc
        .split(":")
        .map(Number);

      // Create DateTime objects for shift start and end in UTC
      const shiftStartUtc = DateTime.utc().set({
        hour: startHour,
        minute: startMinute,
        second: startSecond,
      });
      const shiftEndUtc = DateTime.utc().set({
        hour: endHour,
        minute: endMinute,
        second: endSecond,
      });

      // Convert to local timezone
      const shiftStartLocal = shiftStartUtc.setZone(userTimezone);
      const shiftEndLocal = shiftEndUtc.setZone(userTimezone);

      // Get shift times in seconds
      const shiftStartInSeconds = shiftStartLocal.toSeconds();
      const shiftEndInSeconds = shiftEndLocal.toSeconds();

      // Check if current time is within this shift
      if (
        currentTimeInSeconds >= shiftStartInSeconds &&
        currentTimeInSeconds <= shiftEndInSeconds
      ) {
        isWithinAnyShift = true;
        break;
      }

      // Track next available shift
      // If shift hasn't started yet, calculate time until start
      if (currentTimeInSeconds < shiftStartInSeconds) {
        const timeUntilStart = shiftStartInSeconds - currentTimeInSeconds;
        if (timeUntilStart < smallestTimeDifference) {
          smallestTimeDifference = timeUntilStart;
          nextAvailableShift = {
            shift,
            startTime: shiftStartLocal,
            secondsUntilStart: timeUntilStart,
          };
        }
      }
    }

    if (!isWithinAnyShift) {
      if (nextAvailableShift) {
        const hours = Math.floor(nextAvailableShift.secondsUntilStart / 3600);
        const minutes = Math.floor((nextAvailableShift.secondsUntilStart % 3600) / 60);
        const seconds = nextAvailableShift.secondsUntilStart % 60;

        let timeUntil = "";
        if (hours > 0) {
          timeUntil += `${hours} hour${hours > 1 ? "s" : ""}`;
        }
        if (minutes > 0) {
          if (timeUntil) timeUntil += ", ";
          timeUntil += `${minutes} minute${minutes > 1 ? "s" : ""}`;
        }
        if (seconds > 0 && minutes === 0 && hours === 0) {
          timeUntil = `${seconds} second${seconds > 1 ? "s" : ""}`;
        }

        return {
          isAvailable: false,
          message: `Job will be available in ${timeUntil} (Shift: ${
            nextAvailableShift.shift.title
          } at ${nextAvailableShift.startTime.toFormat("hh:mm:ss a")})`,
          type: "before_shift",
          nextAvailable: nextAvailableShift,
        };
      } else {
        return {
          isAvailable: false,
          message: "No shifts available for today",
          type: "no_shift_today",
        };
      }
    }
  }

  // 3. If no shifts defined, allow timer during job date range
  return {
    isAvailable: true,
    message: "Job is available",
    type: "available",
  };
};

// Format time until availability
export const formatTimeUntil = (minutes) => {
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    let result = `${hours} hour${hours !== 1 ? "s" : ""}`;
    if (remainingMinutes > 0) {
      result += ` ${remainingMinutes} minute${
        remainingMinutes !== 1 ? "s" : ""
      }`;
    }
    return result;
  }
};
