"use client";
import { useEffect, useState } from "react";

type Location = {
  lat: number;
  lng: number;
};

export function useGoogleLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/geolocation/v1/geolocate?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
          {
            method: "POST",
          }
        );

        if (!res.ok) throw new Error("Failed to fetch location");

        const data = await res.json();
        setLocation({
          lat: data.location.lat,
          lng: data.location.lng,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return { location, error, loading };
}
