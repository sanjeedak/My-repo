import React, { useCallback, memo } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useMap } from '../context/MapProvider';

const LoadingSpinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', backgroundColor: '#f0f2f5' }}>
    <style>
      {`
        .map-spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border-left-color: #09f;
          animation: spin 1s ease infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
    <div className="map-spinner"></div>
  </div>
);

const MapSection = ({ onLocationChange, onAddressSelect, initialCenter, onGeocodingStart, onGeocodingEnd }) => {
  const { isLoaded } = useMap();
  const containerStyle = {
    width: '100%',
    height: '256px',
    borderRadius: '0.5rem'
  };

  const getAddressFromLatLng = useCallback(async (lat, lng) => {
    if (!isLoaded || !window.google || !window.google.maps.Geocoder) {
      console.error("Google Maps API not loaded yet.");
      return;
    }
    
    if (onGeocodingStart) onGeocodingStart();
    const geocoder = new window.google.maps.Geocoder();
    try {
        const { results } = await geocoder.geocode({ location: { lat, lng } });
        if (results && results[0]) {
            const addressComponents = results[0].address_components;
            const getAddressComponent = (type) =>
              addressComponents.find(c => c.types.includes(type))?.long_name || '';

            const city = getAddressComponent('locality');
            const state = getAddressComponent('administrative_area_level_1');
            const country = getAddressComponent('country');
            const pincode = getAddressComponent('postal_code');
            const address = results[0].formatted_address;

            if (onAddressSelect) {
              onAddressSelect({ address, city, state, country, pincode });
            }
        }
    } catch (error) {
        console.error('Geocoder failed due to: ' + error);
    } finally {
        if (onGeocodingEnd) onGeocodingEnd();
    }
  }, [isLoaded, onAddressSelect, onGeocodingStart, onGeocodingEnd]);

  const handleMarkerDragEnd = useCallback((event) => {
    const newPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    if (onLocationChange) {
      onLocationChange(newPosition);
    }
    getAddressFromLatLng(newPosition.lat, newPosition.lng);
  }, [onLocationChange, getAddressFromLatLng]);

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  // Ensure initialCenter is a valid object before rendering the map
  const centerPosition = initialCenter && typeof initialCenter.lat === 'number' && typeof initialCenter.lng === 'number' 
    ? initialCenter 
    : { lat: 20.5937, lng: 78.9629 }; // Default to center of India if prop is invalid

  return (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={centerPosition}
        zoom={15}
        options={{
          disableDefaultUI: true,
          zoomControl: true
        }}
      >
        <Marker 
            position={centerPosition} 
            draggable={true} 
            onDragEnd={handleMarkerDragEnd} 
        />
      </GoogleMap>
  );
};

export default memo(MapSection);