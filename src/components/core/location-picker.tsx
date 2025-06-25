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
import { MapPin, Check } from "lucide-react";

// You'll need to add your Google Maps API key
const GOOGLE_MAPS_API_KEY = "AIzaSyARXa6r8AXKRaoeWqyesQNBI8Y3EUEWSnY";

interface LocationPickerProps {
  onLocationSelect?: (lat: number, lng: number) => void;
  defaultLocation?: { lat: number; lng: number };
}

export default function LocationPicker({
  onLocationSelect,
  defaultLocation = { lat: 40.7128, lng: -74.006 }, // New York City default
}: LocationPickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [map, setMap] = useState<any | null>(null);
  const [marker, setMarker] = useState<any | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Load Google Maps script
  useEffect(() => {
    if (!open) return;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [open]);

  const initMap = () => {
    if (!mapRef.current || !window.google) return;

    const location = selectedLocation || defaultLocation;

    const mapOptions: any = {
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
    };

    const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);

    // Add marker at current location if one exists
    if (selectedLocation) {
      addMarker(selectedLocation, newMap);
    }

    // Add click listener to map
    newMap.addListener("click", (e: any) => {
      if (e.latLng) {
        const clickedLocation = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        };

        addMarker(clickedLocation, newMap);
        setSelectedLocation(clickedLocation);
      }
    });
  };

  const addMarker = (
    location: { lat: number; lng: number },
    targetMap: any
  ) => {
    // Remove existing marker if any
    if (marker) {
      marker.setMap(null);
    }

    // Create new marker
    const newMarker = new window.google.maps.Marker({
      position: location,
      map: targetMap,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
    });

    // Add drag end listener to update coordinates
    newMarker.addListener("dragend", () => {
      const position = newMarker.getPosition();
      if (position) {
        const newLocation = {
          lat: position.lat(),
          lng: position.lng(),
        };
        setSelectedLocation(newLocation);
      }
    });

    setMarker(newMarker);
  };

  const handleSelectLocation = () => {
    if (selectedLocation && onLocationSelect) {
      onLocationSelect(selectedLocation.lat, selectedLocation.lng);
    }
    setOpen(false);
  };

  const formatCoordinate = (value: number) => {
    return value.toFixed(6);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-12 text-left justify-start"
        >
          <MapPin className="mr-3 h-5 w-5 text-muted-foreground" />
          <div className="flex flex-col items-start">
            <span className="font-medium">Select Location</span>
            {selectedLocation && (
              <span className="text-xs text-muted-foreground">
                {formatCoordinate(selectedLocation.lat)},{" "}
                {formatCoordinate(selectedLocation.lng)}
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

          {selectedLocation && (
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium">Selected Coordinates</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {formatCoordinate(selectedLocation.lat)},{" "}
                  {formatCoordinate(selectedLocation.lng)}
                </p>
              </div>
              <Button onClick={handleSelectLocation} className="gap-2">
                <Check className="h-4 w-4" />
                Confirm Location
              </Button>
            </div>
          )}

          {!selectedLocation && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                Click on the map to select a location
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
