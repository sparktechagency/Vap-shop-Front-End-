'use client';

import React from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { Store } from '@/lib/types/store';
const mapStyles = [
    {
        featureType: "all",
        elementType: "geometry",
        stylers: [
            { color: "#242f3e" }
        ]
    },
    {
        featureType: "all",
        elementType: "labels.text.stroke",
        stylers: [
            { color: "#242f3e" },
            { weight: 0.5 }
        ]
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [
            { color: "#17263c" } // Dark blue for water
        ]
    },
    // Add more style rules as needed
];
const libraries = ['places'] as const;
const mapContainerStyle = {
    width: '100%',
    height: '80dvh',
    borderRadius: '0.5rem'
};

interface MapProps {
    center: {
        lat: number;
        lng: number;
    };
    stores: Store[];
    selectedStore: Store | null;
    onMarkerClick: (store: Store) => void;
}

const Map: React.FC<MapProps> = ({ center, stores, selectedStore, onMarkerClick }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries: libraries as any,
    });

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading maps</div>;

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={12}
            center={center}
            options={{
                styles: mapStyles,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                // backgroundColor: "#e0e0e0",
                zoomControl: true,
                cameraControl: true,
                clickableIcons: true,
                // colorScheme: "#e0e0e0",
                // gestureHandling: "greedy",
                disableDefaultUI: true

            }}
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
                            ? "/image/shop/storeicon.png" // Selected store icon
                            : "/image/shop/storeicon.png", // Normal store icon
                        scaledSize: new window.google.maps.Size(32, 32)
                    }}
                    label={
                        {
                            text: store.full_name,
                            color: "black",
                            className: "marker-label"

                        }
                    }
                />
            ))}
        </GoogleMap>
    );
};

export default Map;


