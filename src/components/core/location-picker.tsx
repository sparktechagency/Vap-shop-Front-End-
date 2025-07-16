/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Check, AlertCircle, Loader2 } from "lucide-react";
import { useCountysQuery } from "@/redux/features/AuthApi";

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}
declare global {
  interface Window {
    google: any;
  }
}
interface LocationPickerProps {
  onLocationSelect?: (locationData: LocationData) => void;
  defaultLocation?: { lat: number; lng: number };
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export default function LocationPicker({
  onLocationSelect,
  defaultLocation = { lat: 40.7128, lng: -74.006 },
}: LocationPickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );
  const [, setMap] = useState<any | null>(null);
  const [marker, setMarker] = useState<any | null>(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const { data: countriesResponse, isLoading: isLoadingCountries } =
    useCountysQuery();
  const loadGoogleMaps = () => {
    return new Promise<void>((resolve, reject) => {
      if (typeof window.google !== "undefined" && window.google.maps) {
        resolve();
        return;
      }

      const existingScript = document.getElementById("google-maps");
      if (existingScript) {
        existingScript.addEventListener("load", () => resolve());
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
      script.id = "google-maps";
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    if (open) {
      loadGoogleMaps().then(() => {
        initMap();
      });
    }
  }, [open]);

  const initMap = () => {
    if (!mapRef.current || !window.google?.maps) return;

    const location = selectedLocation || defaultLocation;

    const newMap = new window.google.maps.Map(mapRef.current, {
      center: location,
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    setMap(newMap);

    if (selectedLocation) {
      addMarker(selectedLocation, newMap);
    }

    newMap.addListener("click", (e: any) => {
      const clicked = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      addMarker(clicked, newMap);
      handleLocationChange(clicked);
    });
  };

  const addMarker = (
    location: { lat: number; lng: number },
    targetMap: any
  ) => {
    if (marker) marker.setMap(null);

    const newMarker = new window.google.maps.Marker({
      position: location,
      map: targetMap,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
    });

    newMarker.addListener("dragend", () => {
      const pos = newMarker.getPosition();
      if (pos) {
        handleLocationChange({ lat: pos.lat(), lng: pos.lng() });
      }
    });

    setMarker(newMarker);
  };

  const handleLocationChange = async (location: {
    lat: number;
    lng: number;
  }) => {
    setSelectedLocation({ ...location });
    await fetchAddressFromNominatim(location);
  };

  const fetchAddressFromNominatim = async (location: {
    lat: number;
    lng: number;
  }) => {
    setIsLoadingAddress(true);
    setAddressError(null);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
      );
      if (!res.ok) throw new Error("Nominatim failed");

      const data = await res.json();
      const address = data?.display_name;

      if (address) {
        setSelectedLocation((prev) => (prev ? { ...prev, address } : null));
      } else {
        setAddressError("No address found.");
      }
    } catch (err) {
      console.error("Nominatim error:", err);
      setAddressError("Unable to retrieve address.");
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const handleSelectLocation = () => {
    if (selectedLocation && onLocationSelect) {
      onLocationSelect(selectedLocation);
    }
    setOpen(false);
  };

  const formatCoordinate = (value: number) => value.toFixed(6);

  const resetState = () => {
    setSelectedLocation(null);
    setAddressError(null);
    setIsLoadingAddress(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) resetState();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-16 text-left justify-start overflow-hidden"
        >
          <MapPin className="mr-3! h-5 w-5 text-muted-foreground shrink-0" />
          <div className="flex flex-col items-start overflow-hidden">
            <span className="font-medium truncate w-full">Select Location</span>
            {selectedLocation && (
              <span className="text-xs text-muted-foreground w-full truncate pr-2!">
                {selectedLocation.address ||
                  `${formatCoordinate(
                    selectedLocation.lat
                  )}, ${formatCoordinate(selectedLocation.lng)}`}
              </span>
            )}
          </div>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Choose Location
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div
            ref={mapRef}
            className="h-[450px] w-full rounded-lg border border-border overflow-hidden"
          />

          {selectedLocation ? (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <p className="text-sm font-medium">Selected Coordinates</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {formatCoordinate(selectedLocation.lat)},{" "}
                  {formatCoordinate(selectedLocation.lng)}
                </p>

                <p className="text-sm font-medium mt-3">Address</p>
                {isLoadingAddress ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <Skeleton className="h-4 w-full max-w-xs" />
                  </div>
                ) : selectedLocation.address ? (
                  <p className="text-sm text-muted-foreground">
                    {selectedLocation.address}
                  </p>
                ) : addressError ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      {addressError}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    Address not available
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSelectLocation}
                  className="gap-2"
                  disabled={isLoadingAddress}
                >
                  <Check className="h-4 w-4" />
                  Confirm Location
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Click on the map to select a location
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                The address will be retrieved freely 🔓
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
