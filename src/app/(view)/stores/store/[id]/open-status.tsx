import Dotter from "@/components/ui/dotter";
import { useEffect, useState } from "react";

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

    const [fromH, fromM] = openFrom.split(":").map(Number);
    const [toH, toM] = openTo.split(":").map(Number);

    const fromMinutes = fromH * 60 + fromM;
    const toMinutes = toH * 60 + toM;

    const isOpen =
      fromMinutes < toMinutes
        ? nowMinutes >= fromMinutes && nowMinutes <= toMinutes
        : nowMinutes >= fromMinutes || nowMinutes <= toMinutes;

    if (isOpen) {
      setStatus("Open now");
    } else {
      setStatus(`Opens at ${openFrom}`);
    }
  }, [openFrom, openTo]);

  return (
    <span className="text-green-600 flex items-center gap-2">
      {status}
      {openTo && (
        <>
          <Dotter />
          <span className="text-gray-500">Closes at {openTo}</span>
        </>
      )}
    </span>
  );
}
