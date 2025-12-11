

'use client';

import React, { useState } from 'react';
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

const libraries: ("places")[] = ['places'];
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
    onBoundsChange: (bounds: { ne: { lat: number; lng: number; }; sw: { lat: number; lng: number; }; }) => void;
}

const Map: React.FC<MapProps> = ({ center, stores, selectedStore, onMarkerClick, onBoundsChange }) => {
    const [map, setMap] = useState<google.maps.Map | null>(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries: libraries,
    });

    const handleLoad = React.useCallback((mapInstance: google.maps.Map) => {
        setMap(mapInstance);
    }, []);

    const handleUnmount = React.useCallback(() => {
        setMap(null);
    }, []);

    const handleIdle = () => {
        if (map) {
            const bounds = map.getBounds();
            if (bounds) {
                const ne = bounds.getNorthEast();
                const sw = bounds.getSouthWest();
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
                    label={
                        selectedStore?.id === store.id ? {
                            text: store.full_name,
                            color: "#000000",
                            fontWeight: "bold",
                            className: "marker-label"
                        } : undefined
                    }
                />
            ))}
        </GoogleMap>
    );
};

export default Map;