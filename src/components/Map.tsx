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

const cleanMapStyles = [
    // Hide all default POI icons
    {
        featureType: "poi",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }]
    },
    // Hide business POIs
    {
        featureType: "poi.business",
        stylers: [{ visibility: "off" }]
    },
    // Hide attractions
    {
        featureType: "poi.attraction",
        stylers: [{ visibility: "off" }]
    },
    // Hide parks
    {
        featureType: "poi.park",
        stylers: [{ visibility: "off" }]
    },
    // Hide all labels
    {
        featureType: "all",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
    },
    // Optional: Hide roads if you want
    {
        featureType: "road",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
    }
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
                // styles: mapStyles,
                styles: cleanMapStyles,
                disableDefaultUI: true,
                clickableIcons: false,
                gestureHandling: "cooperative",
                mapTypeControl: true,
                fullscreenControl: true,
                zoomControl: true,
                cameraControl: true,
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
                            ? "/image/shop/storeactive.png" // Selected store icon
                            : "/image/shop/storeicon.png", // Normal store icon
                        scaledSize: new window.google.maps.Size(23, 32)
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


