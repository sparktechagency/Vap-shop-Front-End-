import Dotter from "@/components/ui/dotter";
import { useEffect, useState } from "react";

// Converts 24-hour time like "14:30" to "02:30 PM"
function formatTo12Hour(timeStr: string): string {
  const [hourStr, minuteStr] = timeStr.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";

  hour = hour % 12 || 12; // 0 becomes 12, 13 becomes 1, etc.

  return `${hour.toString().padStart(2, "0")}:${minuteStr} ${ampm}`;
}

// Parses "14:30" to total minutes since midnight: 14*60 + 30 = 870
function parseTimeToMinutes(timeStr: string): number {
  const [hoursStr, minutesStr] = timeStr.trim().split(":");
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  if (isNaN(hours) || isNaN(minutes)) {
    console.error(`Invalid time format: "${timeStr}". Expected "HH:mm"`);
    return 0;
  }

  return hours * 60 + minutes;
}

export default function OpenStatus({
  openFrom,
  openTo,
}: {
  openFrom?: string;
  openTo?: string;
}) {
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    if (!openFrom || !openTo) {
      setStatus("Anytime");
      return;
    }

    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const fromMinutes = parseTimeToMinutes(openFrom);
    const toMinutes = parseTimeToMinutes(openTo);

    const isOpen =
      fromMinutes < toMinutes
        ? nowMinutes >= fromMinutes && nowMinutes <= toMinutes
        : nowMinutes >= fromMinutes || nowMinutes <= toMinutes;

    if (isOpen) {
      setStatus("Open now");
    } else {
      setStatus(`Opens at ${formatTo12Hour(openFrom)}`);
    }
  }, [openFrom, openTo]);

  return (
    <span className="text-green-600 flex items-center gap-2">
      {status}
      {openTo && (
        <>
          <Dotter />
          <span className="text-gray-500">
            Closes at {formatTo12Hour(openTo)}
          </span>
        </>
      )}
    </span>
  );
}
