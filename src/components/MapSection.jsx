import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapSection = ({ onLocationChange }) => {
  const containerStyle = {
    width: '100%',
    height: '256px', // 16rem or h-64
    borderRadius: '0.5rem'
  };

  // Initial center set to Hyderabad, India
  const [markerPosition, setMarkerPosition] = useState({
    lat: 17.3850,
    lng: 78.4867
  });

  const handleMapClick = useCallback((event) => {
    const newPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarkerPosition(newPosition);
    if (onLocationChange) {
      onLocationChange(newPosition);
    }
  }, [onLocationChange]);

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyBiq9e-eBarG8M_DSjlGzqd_lEcsB15ViI"
      libraries={["places"]}
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

export default MapSection;