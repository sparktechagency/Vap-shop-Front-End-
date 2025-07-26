
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { InfoIcon, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// UPDATED: Import the new query hook and remove the old one
import { useGetllstoreinMapQuery } from '@/redux/features/store/StoreApi';
import dynamic from 'next/dynamic';
import { Store } from '@/lib/types/store';
import Link from 'next/link';

// Dynamically import the Map component
const MapWithNoSSR = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="w-full h-[80dvh] bg-gray-200 rounded-lg flex items-center justify-center">Loading map...</div>
});

// Type for the bounds object
interface MapBounds {
  ne: { lat: number; lng: number; };
  sw: { lat: number; lng: number; };
}

const MapPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // REMOVED: `page` and `per_page` state are no longer needed for pagination.
  const [allStores, setAllStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 23.8103,
    lng: 90.4125
  });
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const [debouncedBounds, setDebouncedBounds] = useState<MapBounds | null>(null);

  // NEW: Debounce effect for map bounds
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedBounds(mapBounds);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [mapBounds]);


  // UPDATED: Call the new API with debounced bounds. It will only run when debouncedBounds is not null.
  const { data: storesData, isLoading, isFetching } = useGetllstoreinMapQuery({
    ne_lat: debouncedBounds?.ne.lat,
    ne_lng: debouncedBounds?.ne.lng,
    sw_lat: debouncedBounds?.sw.lat,
    sw_lng: debouncedBounds?.sw.lng,
  }, {
    skip: !debouncedBounds, // Skip the query until we have bounds
  });

  // UPDATED: This effect now populates the store list from the new API response
  useEffect(() => {
    // The API response for `getllstoreinMap` is `response.data` which is an array of stores
    if (storesData?.data) {
      const validStores = storesData.data.filter((store: Store) =>
        store.address?.latitude && store.address?.longitude
      );
      setAllStores(validStores);
    }
  }, [storesData]);

  // This effect for setting initial center from URL params remains largely the same
  useEffect(() => {
    if (allStores.length === 0) return;

    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');

    if (latParam && lngParam && !selectedStore) {
      const lat = parseFloat(latParam);
      const lng = parseFloat(lngParam);
      if (!isNaN(lat) && !isNaN(lng)) {
        setMapCenter({ lat, lng });
        const storeToSelect = allStores.find(
          store => parseFloat(store.address?.latitude || '0') === lat && parseFloat(store.address?.longitude || '0') === lng

        );
        if (storeToSelect) {
          setSelectedStore(storeToSelect);
        }
      }
    }
  }, [allStores, searchParams]);

  const handleSelectStore = (store: Store) => {
    setSelectedStore(store);
    setMapCenter({
      lat: parseFloat(store.address?.latitude || '0'),
      lng: parseFloat(store.address?.longitude || '0')
    });
  };

  // UPDATED: The bounds change handler now sets the state which triggers the API call via the debounce effect
  const handleBoundsChange = (bounds: MapBounds) => {
    setMapBounds(bounds);
  };

  return (
    <main className="my-12 px-4 lg:px-[7%]">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Map</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>


      <div className="my-12">
        <h1 className="font-semibold text-4xl">
          Vape Shop in <span className="font-normal">Murfreesboro, TN</span>
        </h1>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-3 md:gap-5 space-y-6 md:space-y-0">
        <div className="relative h-[80dvh] w-full border bg-secondary rounded-md overflow-hidden flex flex-col z-30">
          <div className="h-[48px] w-full bg-primary flex justify-between items-center px-4">
            <div className="flex items-center gap-2 text-xs text-background font-semibold">
              {isFetching ? 'Searching...' : `Showing ${allStores.length} results`}
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
              <p>Move the map to find stores...</p>
            ) : (
              allStores.map((store) => (
                <div key={store.id} onClick={() => handleSelectStore(store)} className={`w-full bg-background p-4 rounded-md cursor-pointer hover:shadow-md transition-shadow ${selectedStore?.id === store.id ? 'ring-2 ring-primary' : ''}`}>
                  <h3 className="font-semibold">{store.full_name}</h3>
                  <p className="text-sm text-gray-600">{store.address?.address}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500">★ {store.avg_rating.toFixed(1)}</span>
                    <span className="text-sm text-gray-500 ml-2">({store.total_reviews} reviews)</span>
                  </div>
                </div>
              ))
            )}

          </div>
        </div>

        <div className="relative col-span-2">
          <MapWithNoSSR
            center={mapCenter}
            stores={allStores}
            selectedStore={selectedStore}
            onMarkerClick={handleSelectStore}
            onBoundsChange={handleBoundsChange}
          />
          {selectedStore && (
            <div className="absolute top-4 right-4 z-10 bg-white p-4 rounded-lg shadow-lg max-w-xs">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{selectedStore.full_name}</h3>
                  <p className="text-sm text-gray-600">{selectedStore.address?.address}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-500">★ {selectedStore.avg_rating.toFixed(1) || 'N/A'}</span>
                    <span className="text-sm text-gray-500 ml-1">({selectedStore.total_reviews} reviews)</span>
                  </div>
                  {selectedStore.phone && (
                    <p className="text-sm mt-1">Phone: {selectedStore.phone}</p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedStore(null)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close popup"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="mt-2 flex space-x-2">
                <Button onClick={() => router.push(`/stores/store/${selectedStore.id}`)} size="sm" className="rounded-full">
                  {/* <Link href={`/stores/store/${selectedStore.id}`}>View Store</Link> */}
                  View Store
                </Button>
                <Button size="sm" variant="outline" className="rounded-full">
                  Save
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