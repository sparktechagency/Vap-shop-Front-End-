"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { InfoIcon, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllStoresInMapQuery } from "@/redux/features/store/StoreApi";
import dynamic from "next/dynamic";
import { Store } from "@/lib/types/store";

// Dynamically import the Map component
const MapWithNoSSR = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[80dvh] bg-gray-200 rounded-lg flex items-center justify-center">
      Loading map...
    </div>
  ),
});

interface MapBounds {
  ne: { lat: number; lng: number };
  sw: { lat: number; lng: number };
}

const MapPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [allStores, setAllStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  // Map State
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 23.8103, // Default (e.g., Dhaka)
    lng: 90.4125,
  });


  // URL Params
  const store_id = searchParams.get("store_id");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radius = searchParams.get("radius");

  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const [debouncedBounds, setDebouncedBounds] = useState<MapBounds | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Debounce Bounds
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedBounds(mapBounds);
    }, 500);
    return () => clearTimeout(handler);
  }, [mapBounds]);

  // Determine Map Query Params
  let map_params;
  if (lat && lng && radius) {
    map_params = {
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      radius: parseInt(radius),
    };
  } else {
    map_params = {
      ne_lat: debouncedBounds?.ne.lat,
      ne_lng: debouncedBounds?.ne.lng,
      sw_lat: debouncedBounds?.sw.lat,
      sw_lng: debouncedBounds?.sw.lng,
    };
  }

  // Fetch Data
  const {
    data: storesData,
    isLoading,
    isFetching,
  } = useGetAllStoresInMapQuery(map_params, {
    skip: !debouncedBounds && !lat,
  });

  // --- MAIN LOGIC: Handle Data & Auto-Select Store ---
  useEffect(() => {
    if (storesData?.data) {
      // 1. Set Stores List
      const validStores = storesData.data.filter(
        (store: Store) => store.address?.latitude && store.address?.longitude
      );
      setAllStores(validStores);

      // 2. Check for store_id in URL
      if (store_id) {
        // Convert both to string to avoid "1" (string) !== 1 (number) issues
        const targetStore = validStores.find(
          (s: Store) => String(s.id) === String(store_id)
        );

        if (targetStore) {
          console.log("Found Store from URL:", targetStore.full_name);

          // A. Select Store (triggers Popup)
          setSelectedStore(targetStore);

          // B. Center Map & Zoom In (Focus the pin)
          if (targetStore.address?.latitude && targetStore.address?.longitude) {
            setMapCenter({
              lat: parseFloat(targetStore.address.latitude),
              lng: parseFloat(targetStore.address.longitude),
            });
          }
        }
      }
    }
  }, [storesData, store_id]);


  // --- Handle User Location (Only if NOT looking for a specific store) ---
  useEffect(() => {
    // If user is trying to see a specific store, do not force geolocation center
    if (store_id) return;

    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");

    if (latParam && lngParam) {
      const lat = parseFloat(latParam);
      const lng = parseFloat(lngParam);
      if (!isNaN(lat) && !isNaN(lng)) {
        setMapCenter({ lat, lng });
      }
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(loc);
          setMapCenter(loc);
        },
        (err) => console.error(err)
      );
    }
  }, [store_id]); // Re-run if store_id changes/removes


  // Handle Manual Click on Store
  const handleSelectStore = (store: Store) => {
    setSelectedStore(store);

    if (store.address?.latitude && store.address?.longitude) {
      setMapCenter({
        lat: parseFloat(store.address.latitude),
        lng: parseFloat(store.address.longitude),
      });
    }
  };

  const handleBoundsChange = (bounds: MapBounds) => {
    setMapBounds(bounds);
  };

  const handleGetDirections = (store: Store) => {
    if (!userLocation) {
      alert("Location services needed for directions.");
      return;
    }
    if (!store.address?.latitude) return;

    const origin = `${userLocation.lat},${userLocation.lng}`;
    const destination = `${store.address.latitude},${store.address.longitude}`;
    window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`, "_blank");
  };

  return (
    <main className="my-12 px-4 lg:px-[7%]">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Map</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="my-12">
        <h1 className="font-semibold text-4xl">
          Find a Vape Shop <span className="font-normal">Near You</span>
        </h1>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-3 md:gap-5 space-y-6 md:space-y-0">
        {/* Sidebar List */}
        <div className="relative h-[80dvh] w-full border bg-secondary rounded-md overflow-hidden flex flex-col z-30">
          <div className="h-[48px] w-full bg-primary flex justify-between items-center px-4">
            <div className="flex items-center gap-2 text-xs text-background font-semibold">
              {isFetching ? "Searching..." : `Showing ${allStores.length} results`}
              <InfoIcon className="ml-1 size-3" />
            </div>
            <div>
              <Select>
                <SelectTrigger className="w-min text-background border-0">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="viewed">Most Viewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex-1 w-full overflow-y-auto p-4 space-y-6">
            {isLoading && allStores.length === 0 ? (
              <p className="p-4 text-center">Loading stores...</p>
            ) : allStores.length === 0 && !isLoading ? (
              <p className="p-4 text-center">Move the map to find stores...</p>
            ) : (
              allStores.map((store) => (
                <div
                  key={store.id}
                  onClick={() => handleSelectStore(store)}
                  className={`w-full bg-background p-4 rounded-md cursor-pointer hover:shadow-md transition-shadow relative ${selectedStore?.id === store.id ? "ring-2 ring-primary" : ""
                    }`}
                >
                  <h3 className="font-semibold">{store.full_name}</h3>
                  <p className="text-sm text-gray-600">{store.address?.address}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500">
                      ★ {store.avg_rating ? store.avg_rating.toFixed(1) : "N/A"}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({store.total_reviews} reviews)
                    </span>
                  </div>
                  {store.distance && (
                    <span className="absolute top-4 right-4 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {typeof store.distance === 'number' ? store.distance : store.distance}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Map Area */}
        <div className="relative col-span-2">
          <MapWithNoSSR
            center={mapCenter}
            stores={allStores}
            selectedStore={selectedStore} // Pass selectedStore for the "Large Pin" logic
            onMarkerClick={handleSelectStore}
            onBoundsChange={handleBoundsChange}
          />

          {/* Popup */}
          {selectedStore && (
            <div className="absolute top-4 right-4 z-10 bg-white p-4 rounded-lg shadow-lg max-w-xs w-full">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{selectedStore.full_name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedStore.address?.address}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500 font-bold">
                      ★ {selectedStore.avg_rating ? selectedStore.avg_rating.toFixed(1) : "N/A"}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({selectedStore.total_reviews} reviews)
                    </span>
                  </div>
                  {selectedStore.phone && (
                    <p className="text-sm mt-2 font-medium">📞 {selectedStore.phone}</p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedStore(null)}
                  className="text-gray-400 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="mt-4 flex space-x-2">
                <Button
                  onClick={() => router.push(`/stores/store/${selectedStore.id}`)}
                  size="sm"
                  className="rounded-full flex-1"
                >
                  View Store
                </Button>
                <Button
                  onClick={() => handleGetDirections(selectedStore)}
                  size="sm"
                  variant="outline"
                  className="rounded-full flex-1"
                >
                  Get Directions
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default MapPage;