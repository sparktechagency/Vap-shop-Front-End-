'use client';

import React, { useState, useEffect } from 'react';
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
import { useGetAllstoreQuery } from '@/redux/features/store/StoreApi';
import dynamic from 'next/dynamic';
import { Store, StoreApiResponse } from '@/lib/types/store';

// Dynamically import the Map component to avoid SSR issues
const MapWithNoSSR = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="w-full h-[80dvh] bg-gray-200 rounded-lg flex items-center justify-center">Loading map...</div>
});

const MapPage: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 35.8456,
    lng: -86.3903
  }); // Default to Murfreesboro, TN

  const { data, isLoading } = useGetAllstoreQuery({ page });
  const storeData = data as StoreApiResponse;

  // Filter stores with valid latitude and longitude
  const validStores = storeData?.data?.data?.filter(store =>
    store.address?.latitude && store.address?.longitude &&
    !isNaN(parseFloat(store.address.latitude)) &&
    !isNaN(parseFloat(store.address.longitude))
  ) || [];

  // Set map center to first valid store if available
  useEffect(() => {
    if (validStores.length > 0 && !selectedStore) {
      const firstStore = validStores[0];
      setMapCenter({
        lat: parseFloat(firstStore.address.latitude || '0'),
        lng: parseFloat(firstStore.address.longitude || '0')
      });
    }
  }, [storeData, selectedStore]);

  if (isLoading) {
    return (
      <main className="my-12 px-4 lg:px-[7%]">
        <div>Loading stores...</div>
      </main>
    );
  }

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
        <div className="relative h-[80dvh] w-full border bg-secondary rounded-md overflow-hidden flex flex-col justify-between items-center z-30">
          <div className="h-[48px] w-full bg-primary flex justify-between items-center px-4">
            <div className="flex items-center gap-2 text-xs text-background font-semibold">
              Showing {validStores.length} results <InfoIcon className="ml-1 size-3" />
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
            {validStores.map((store) => (
              <div
                key={store.id}
                className={`h-[100px] w-full bg-background p-4 rounded-md cursor-pointer hover:shadow-md transition-shadow ${selectedStore?.id === store.id ? 'ring-2 ring-primary' : ''
                  }`}
                onClick={() => {
                  setSelectedStore(store);
                  setMapCenter({
                    lat: parseFloat(store.address.latitude || '0'),
                    lng: parseFloat(store.address.longitude || '0')
                  });
                }}
              >
                <h3 className="font-semibold">{store.full_name}</h3>
                <p className="text-sm text-gray-600">{store.address?.address}</p>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-500">★ {store.avg_rating.toFixed(1) || 'N/A'}</span>
                  <span className="text-sm text-gray-500 ml-2">({store.total_reviews} reviews)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative col-span-2">
          <MapWithNoSSR
            center={mapCenter}
            stores={validStores}
            selectedStore={selectedStore}
            onMarkerClick={setSelectedStore}
          />

          {/* Store Details Popup */}
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
                <Button size="sm" className="rounded-full">
                  Directions
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