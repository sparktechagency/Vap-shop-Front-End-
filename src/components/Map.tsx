// 'use client';

// import React from 'react';
// import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
// import { Store } from '@/lib/types/store';

// const cleanMapStyles = [
//     // Hide all default POI icons
//     {
//         featureType: "poi",
//         elementType: "labels.icon",
//         stylers: [{ visibility: "off" }]
//     },
//     // Hide business POIs
//     {
//         featureType: "poi.business",
//         stylers: [{ visibility: "off" }]
//     },
//     // Hide attractions
//     {
//         featureType: "poi.attraction",
//         stylers: [{ visibility: "off" }]
//     },
//     // Hide parks
//     {
//         featureType: "poi.park",
//         stylers: [{ visibility: "off" }]
//     },
//     // Hide all labels
//     {
//         featureType: "all",
//         elementType: "labels",
//         stylers: [{ visibility: "off" }]
//     },
//     // Optional: Hide roads if you want
//     {
//         featureType: "road",
//         elementType: "labels",
//         stylers: [{ visibility: "off" }]
//     }
// ];


// const mapStyles = [
//     {
//         featureType: "poi",
//         elementType: "labels.icon",
//         stylers: [{ visibility: "off" }]
//     },
//     {
//         featureType: "poi",
//         elementType: "labels.text",
//         stylers: [{ visibility: "off" }]
//     },
//     {
//         featureType: "poi",
//         elementType: "geometry",
//         stylers: [{ visibility: "off" }]
//     }
// ]

// const libraries = ['places'] as const;
// const mapContainerStyle = {
//     width: '100%',
//     height: '80dvh',
//     borderRadius: '0.5rem'
// };

// interface MapProps {
//     center: {
//         lat: number;
//         lng: number;
//     };
//     stores: Store[];
//     selectedStore: Store | null;
//     onMarkerClick: (store: Store) => void;
// }

// const Map: React.FC<MapProps> = ({ center, stores, selectedStore, onMarkerClick }) => {
//     const { isLoaded, loadError } = useLoadScript({
//         googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
//         libraries: libraries as any,
//     });

//     if (loadError) return <div>Error loading maps</div>;
//     if (!isLoaded) return <div>Loading maps</div>;

//     return (
//         <GoogleMap
//             mapContainerStyle={mapContainerStyle}
//             zoom={12}
//             center={center}
//             options={{
//                 styles: mapStyles,
//                 // styles: cleanMapStyles,
//                 disableDefaultUI: true,
//                 clickableIcons: false,
//                 gestureHandling: "cooperative",
//                 mapTypeControl: true,
//                 fullscreenControl: true,

//                 rotateControl: true,
//                 zoomControl: true,
//                 cameraControl: true,

//             }}
//         >
//             {stores.map((store) => (
//                 <Marker
//                     key={store.id}
//                     position={{
//                         lat: parseFloat(store.address.latitude || '0'),
//                         lng: parseFloat(store.address.longitude || '0')
//                     }}
//                     onClick={() => onMarkerClick(store)}
//                     icon={{
//                         url: selectedStore?.id === store.id
//                             ? "/image/shop/storeactive.png" // Selected store icon
//                             : "/image/shop/storeicon.png", // Normal store icon
//                         scaledSize: new window.google.maps.Size(23, 32)
//                     }}
//                     label={
//                         {
//                             text: store.full_name,
//                             color: "black",
//                             className: "marker-label"

//                         }
//                     }
//                 />
//             ))}
//         </GoogleMap>
//     );
// };

// export default Map;




'use client';

import React, { useState } from 'react'; // NEW: Imported useState
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { Store } from '@/lib/types/store';

// This is a sample style array to hide points of interest (POIs)
const mapStyles = [
    {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
    },
    {
        featureType: "transit",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }]
    }
];

const libraries = ['places'] as const;
const mapContainerStyle = {
    width: '100%',
    height: '80dvh',
    borderRadius: '0.5rem'
};

// UPDATED: Added onBoundsChange to the props interface
interface MapProps {
    center: {
        lat: number;
        lng: number;
    };
    stores: Store[];
    selectedStore: Store | null;
    onMarkerClick: (store: Store) => void;
    onBoundsChange: (bounds: { ne: { lat: number; lng: number; }; sw: { lat: number; lng: number; }; }) => void;
}

// UPDATED: Destructured the new onBoundsChange prop
const Map: React.FC<MapProps> = ({ center, stores, selectedStore, onMarkerClick, onBoundsChange }) => {
    // NEW: State to hold the map instance
    const [map, setMap] = useState<google.maps.Map | null>(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries: libraries,
    });

    // NEW: Handler for when the map loads
    const handleLoad = React.useCallback((mapInstance: google.maps.Map) => {
        setMap(mapInstance);
    }, []);

    // NEW: Handler for when the map is unmounted
    const handleUnmount = React.useCallback(() => {
        setMap(null);
    }, []);

    // NEW: Handler for when the map is idle (stopped moving)
    const handleIdle = () => {
        if (map) {
            const bounds = map.getBounds();
            if (bounds) {
                const ne = bounds.getNorthEast();
                const sw = bounds.getSouthWest();
                // Call the function passed from the parent with the new coordinates
                onBoundsChange({
                    ne: { lat: ne.lat(), lng: ne.lng() },
                    sw: { lat: sw.lat(), lng: sw.lng() },
                });
            }
        }
    };

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading maps</div>;

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={12}
            center={center}
            options={{
                styles: mapStyles,
                disableDefaultUI: true,
                clickableIcons: false,
                gestureHandling: "cooperative",
                fullscreenControl: true,
                zoomControl: true,
            }}
            // UPDATED: Added event handlers
            onLoad={handleLoad}
            onUnmount={handleUnmount}
            onIdle={handleIdle}
        >
            {stores.map((store) => (
                <Marker
                    key={store.id}
                    position={{
                        lat: parseFloat(store.address.latitude || '0'),
                        lng: parseFloat(store.address.longitude || '0')
                    }}
                    onClick={() => onMarkerClick(store)}
                    icon={{
                        url: selectedStore?.id === store.id
                            ? "/image/shop/storeactive.png"
                            : "/image/shop/storeicon.png",
                        scaledSize: new window.google.maps.Size(23, 32)
                    }}
                    // Note: Labels on markers can sometimes impact performance with many markers.
                    // Consider showing the label only for the selected store if needed.
                    label={
                        selectedStore?.id === store.id ? {
                            text: store.full_name,
                            color: "#000000",
                            fontWeight: "bold",
                            className: "marker-label" // You can style this in your global CSS
                        } : undefined
                    }
                />
            ))}
        </GoogleMap>
    );
};

export default Map;