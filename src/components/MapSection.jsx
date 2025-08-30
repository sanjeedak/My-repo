import React, { useState, useCallback, memo } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const googleMapsApiKey = "AIzaSyBsmtx_w9SAGhpzRw7d4zGviSSqTkGUp_c"; 

const LoadingSpinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
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

const MapSection = ({ onLocationChange, onAddressSelect }) => {
  const containerStyle = {
    width: '100%',
    height: '256px',
    borderRadius: '0.5rem'
  };

  const [markerPosition, setMarkerPosition] = useState({
    lat: 17.3850,
    lng: 78.4867
  });

  const getAddressFromLatLng = useCallback((lat, lng) => {
    if (!window.google || !window.google.maps.Geocoder) {
      console.error("Google Maps API not loaded yet.");
      return;
    }
    
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
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
      } else {
        console.error('Geocoder failed due to: ' + status);
      }
    });
  }, [onAddressSelect]);

  const handleMapClick = useCallback((event) => {
    const newPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarkerPosition(newPosition);
    if (onLocationChange) {
      onLocationChange(newPosition);
    }
    getAddressFromLatLng(newPosition.lat, newPosition.lng);
  }, [onLocationChange, getAddressFromLatLng]);

  return (
    <LoadScript
      googleMapsApiKey={googleMapsApiKey}
      libraries={["places", "geocoding"]}
      loadingElement={<LoadingSpinner />}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPosition}
        zoom={12}
        onClick={handleMapClick}
        options={{
          disableDefaultUI: true,
          zoomControl: true
        }}
      >
        <Marker position={markerPosition} draggable={true} onDragEnd={handleMapClick} />
      </GoogleMap>
    </LoadScript>
  );
};

// Wraping component in React.memo to prevent unnecessary re-renders
export default memo(MapSection);