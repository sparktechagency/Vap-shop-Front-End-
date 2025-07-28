

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from '@/components/ui/breadcrumb';
// import { Button } from '@/components/ui/button';
// import { InfoIcon, X } from 'lucide-react';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { useGetllstoreinMapQuery } from '@/redux/features/store/StoreApi';
// import dynamic from 'next/dynamic';
// import { Store } from '@/lib/types/store';
// import Link from 'next/link';

// // Dynamically import the Map component
// const MapWithNoSSR = dynamic(() => import('@/components/Map'), {
//   ssr: false,
//   loading: () => <div className="w-full h-[80dvh] bg-gray-200 rounded-lg flex items-center justify-center">Loading map...</div>
// });

// // Type for the bounds object
// interface MapBounds {
//   ne: { lat: number; lng: number; };
//   sw: { lat: number; lng: number; };
// }

// const MapPage: React.FC = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [allStores, setAllStores] = useState<Store[]>([]);
//   const [selectedStore, setSelectedStore] = useState<Store | null>(null);
//   // 📍 The initial state is now a fallback in case geolocation fails
//   const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
//     lat: 23.8103, // Fallback latitude
//     lng: 90.4125  // Fallback longitude
//   });
//   const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
//   const [debouncedBounds, setDebouncedBounds] = useState<MapBounds | null>(null);

//   // Debounce effect for map bounds
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedBounds(mapBounds);
//     }, 500);

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [mapBounds]);

//   // Call API with debounced bounds
//   const { data: storesData, isLoading, isFetching } = useGetllstoreinMapQuery({
//     ne_lat: debouncedBounds?.ne.lat,
//     ne_lng: debouncedBounds?.ne.lng,
//     sw_lat: debouncedBounds?.sw.lat,
//     sw_lng: debouncedBounds?.sw.lng,
//   }, {
//     skip: !debouncedBounds,
//   });

//   // Populate the store list from the API response
//   useEffect(() => {
//     if (storesData?.data) {
//       const validStores = storesData.data.filter((store: Store) =>
//         store.address?.latitude && store.address?.longitude
//       );
//       setAllStores(validStores);
//     }
//   }, [storesData]);

//   // 📍 MODIFIED: This effect runs on mount to set the initial map center.
//   useEffect(() => {
//     const latParam = searchParams.get('lat');
//     const lngParam = searchParams.get('lng');

//     // Priority 1: Use coordinates from the URL if they exist
//     if (latParam && lngParam) {
//       const lat = parseFloat(latParam);
//       const lng = parseFloat(lngParam);
//       if (!isNaN(lat) && !isNaN(lng)) {
//         setMapCenter({ lat, lng });
//       }
//     } else if (navigator.geolocation) {
//       // Priority 2: Use the browser's geolocation API
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           // Success: Set map center to user's current location
//           setMapCenter({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });
//         },
//         (error) => {
//           // Error: The map will use the default fallback center.
//           console.error("Geolocation error:", error);
//         }
//       );
//     }
//   }, []); // Empty dependency array means this runs only once on mount

//   // This effect selects a store if its coordinates are in the URL, after stores are loaded.
//   useEffect(() => {
//     if (allStores.length === 0) return;

//     const latParam = searchParams.get('lat');
//     const lngParam = searchParams.get('lng');

//     if (latParam && lngParam && !selectedStore) {
//       const lat = parseFloat(latParam);
//       const lng = parseFloat(lngParam);
//       const storeToSelect = allStores.find(
//         store => parseFloat(store.address?.latitude || '0') === lat && parseFloat(store.address?.longitude || '0') === lng
//       );
//       if (storeToSelect) {
//         setSelectedStore(storeToSelect);
//       }
//     }
//   }, [allStores, searchParams]);

//   const handleSelectStore = (store: Store) => {
//     setSelectedStore(store);
//     setMapCenter({
//       lat: parseFloat(store.address?.latitude || '0'),
//       lng: parseFloat(store.address?.longitude || '0')
//     });
//   };

//   const handleBoundsChange = (bounds: MapBounds) => {
//     setMapBounds(bounds);
//   };

//   return (
//     <main className="my-12 px-4 lg:px-[7%]">
//       <Breadcrumb>
//         <BreadcrumbList>
//           <BreadcrumbItem>
//             <BreadcrumbLink href="/">Home</BreadcrumbLink>
//           </BreadcrumbItem>
//           <BreadcrumbSeparator />
//           <BreadcrumbItem>
//             <BreadcrumbPage>Map</BreadcrumbPage>
//           </BreadcrumbItem>
//         </BreadcrumbList>
//       </Breadcrumb>

//       <div className="my-12">
//         <h1 className="font-semibold text-4xl">
//           Find a Vape Shop <span className="font-normal">Near You</span>
//         </h1>
//       </div>

//       <div className="relative grid grid-cols-1 md:grid-cols-3 md:gap-5 space-y-6 md:space-y-0">
//         <div className="relative h-[80dvh] w-full border bg-secondary rounded-md overflow-hidden flex flex-col z-30">
//           <div className="h-[48px] w-full bg-primary flex justify-between items-center px-4">
//             <div className="flex items-center gap-2 text-xs text-background font-semibold">
//               {isFetching ? 'Searching...' : `Showing ${allStores.length} results`}
//               <InfoIcon className="ml-1 size-3" />
//             </div>
//             <div>
//               <Select>
//                 <SelectTrigger className="w-min text-background border-0">
//                   <SelectValue placeholder="Sort by" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-background">
//                   <SelectItem value="recent">Most Recent</SelectItem>
//                   <SelectItem value="viewed">Most Viewed</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//           <div className="flex-1 w-full overflow-y-auto p-4 space-y-6">
//             {isLoading && allStores.length === 0 ? (
//               <p>Move the map to find stores...</p>
//             ) : (
//               allStores.map((store) => (
//                 <div key={store.id} onClick={() => handleSelectStore(store)} className={`w-full bg-background p-4 rounded-md cursor-pointer hover:shadow-md transition-shadow ${selectedStore?.id === store.id ? 'ring-2 ring-primary' : ''}`}>
//                   <h3 className="font-semibold">{store.full_name}</h3>
//                   <p className="text-sm text-gray-600">{store.address?.address}</p>
//                   <div className="flex items-center mt-2">
//                     <span className="text-yellow-500">★ {store.avg_rating.toFixed(1)}</span>
//                     <span className="text-sm text-gray-500 ml-2">({store.total_reviews} reviews)</span>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         <div className="relative col-span-2">
//           <MapWithNoSSR
//             center={mapCenter}
//             stores={allStores}
//             selectedStore={selectedStore}
//             onMarkerClick={handleSelectStore}
//             onBoundsChange={handleBoundsChange}
//           />
//           {selectedStore && (
//             <div className="absolute top-4 right-4 z-10 bg-white p-4 rounded-lg shadow-lg max-w-xs">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h3 className="font-bold text-lg">{selectedStore.full_name}</h3>
//                   <p className="text-sm text-gray-600">{selectedStore.address?.address}</p>
//                   <div className="flex items-center mt-1">
//                     <span className="text-yellow-500">★ {selectedStore.avg_rating.toFixed(1) || 'N/A'}</span>
//                     <span className="text-sm text-gray-500 ml-1">({selectedStore.total_reviews} reviews)</span>
//                   </div>
//                   {selectedStore.phone && (
//                     <p className="text-sm mt-1">Phone: {selectedStore.phone}</p>
//                   )}
//                 </div>
//                 <button
//                   onClick={() => setSelectedStore(null)}
//                   className="text-gray-500 hover:text-gray-700"
//                   aria-label="Close popup"
//                 >
//                   <X size={16} />
//                 </button>
//               </div>
//               <div className="mt-2 flex space-x-2">
//                 <Button onClick={() => router.push(`/stores/store/${selectedStore.id}`)} size="sm" className="rounded-full">
//                   View Store
//                 </Button>
//                 <Button size="sm" variant="outline" className="rounded-full">
//                   Save
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// };

// export default MapPage;




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
import { useGetllstoreinMapQuery } from '@/redux/features/store/StoreApi';
import dynamic from 'next/dynamic';
import { Store } from '@/lib/types/store';

// Dynamically import the Map component to prevent SSR issues
const MapWithNoSSR = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="w-full h-[80dvh] bg-gray-200 rounded-lg flex items-center justify-center">Loading map...</div>
});

// Type definition for map bounds
interface MapBounds {
  ne: { lat: number; lng: number; };
  sw: { lat: number; lng: number; };
}

const MapPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allStores, setAllStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 23.8103, // Default fallback latitude (Dhaka)
    lng: 90.4125  // Default fallback longitude (Dhaka)
  });
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const [debouncedBounds, setDebouncedBounds] = useState<MapBounds | null>(null);
  // State to store the user's current location for generating directions
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Debounce effect for map bounds to reduce API calls while panning
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedBounds(mapBounds);
    }, 500);
    return () => clearTimeout(handler);
  }, [mapBounds]);

  // Fetch stores within the current map bounds
  const { data: storesData, isLoading, isFetching } = useGetllstoreinMapQuery({
    ne_lat: debouncedBounds?.ne.lat,
    ne_lng: debouncedBounds?.ne.lng,
    sw_lat: debouncedBounds?.sw.lat,
    sw_lng: debouncedBounds?.sw.lng,
  }, {
    skip: !debouncedBounds, // Skip query if bounds are not set
  });

  // Update the list of stores when API data is received
  useEffect(() => {
    if (storesData?.data) {
      const validStores = storesData.data.filter((store: Store) =>
        store.address?.latitude && store.address?.longitude
      );
      setAllStores(validStores);
    }
  }, [storesData]);

  // This effect runs once on mount to get the user's location
  useEffect(() => {
    // Check if coordinates are provided in the URL
    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');

    if (latParam && lngParam) {
      const lat = parseFloat(latParam);
      const lng = parseFloat(lngParam);
      if (!isNaN(lat) && !isNaN(lng)) {
        setMapCenter({ lat, lng });
      }
    } else if (navigator.geolocation) {
      // If no URL params, use the browser's Geolocation API
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentUserLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          // Set the user's location in state for directions
          setUserLocation(currentUserLocation);
          // Center the map on the user's location
          setMapCenter(currentUserLocation);
        },
        (error) => {
          // If geolocation fails, log the error and use the fallback location
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []); // Empty dependency array ensures this runs only once

  // Handler to select a store and center the map on it
  const handleSelectStore = (store: Store) => {
    setSelectedStore(store);
    setMapCenter({
      lat: parseFloat(store.address?.latitude || '0'),
      lng: parseFloat(store.address?.longitude || '0')
    });
  };

  // Handler to update map bounds when the user pans or zooms
  const handleBoundsChange = (bounds: MapBounds) => {
    setMapBounds(bounds);
  };

  // This function generates a Google Maps URL and opens it in a new tab
  const handleGetDirections = (store: Store) => {
    if (!userLocation) {
      alert("Your location is not available. Please enable location services in your browser and try again.");
      return;
    }

    if (!store.address?.latitude || !store.address?.longitude) {
      alert("Sorry, the location for this store is not available.");
      return;
    }

    // Construct the Google Maps directions URL
    const origin = `${userLocation.lat},${userLocation.lng}`;
    const destination = `${store.address.latitude},${store.address.longitude}`;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;

    // Open the URL in a new tab
    window.open(googleMapsUrl, '_blank');
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
          Find a Vape Shop <span className="font-normal">Near You</span>
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
                  View Store
                </Button>
                {/* This button will open Google Maps for directions */}
                <Button
                  onClick={() => handleGetDirections(selectedStore)}
                  size="sm"
                  variant="outline"
                  className="rounded-full"
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
