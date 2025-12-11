"use client";
import { useState, useEffect } from "react";

type LocationType = {
  lat: number | null;
  lng: number | null;
};

export default function useAutoLocation() {
  const [location, setLocation] = useState<LocationType>({
    lat: null,
    lng: null,
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return; // SSR-safe

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos: GeolocationPosition) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err: GeolocationPositionError) => {
        setError(err.message);
      }
    );
  }, []); // runs automatically on mount

  return { location, error };
}
