import { useState, useCallback, memo, useEffect, useRef } from 'react';
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
  
  const [mapState, setMapState] = useState({
    center: initialCenter,
    markerPosition: initialCenter
  });
  
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    console.log('📍 MapSection - initialCenter received:', initialCenter);
    
    setMapState({
      center: initialCenter,
      markerPosition: initialCenter
    });
    
    if (mapRef.current) {
      setTimeout(() => {
        if (window.google && window.google.maps && mapRef.current) {
          mapRef.current.panTo(initialCenter);
        }
      }, 100);
    }
  }, [initialCenter]);

  const getAddressFromLatLng = useCallback(async () => {
    // ... same as before ...
  }, [isLoaded, onAddressSelect, onGeocodingStart, onGeocodingEnd]);

  const handleMarkerDragEnd = useCallback(() => {
    // ... same as before ...
  }, [onLocationChange, getAddressFromLatLng]);

  const handleMapClick = useCallback(() => {
    // ... same as before ...
  }, [onLocationChange, getAddressFromLatLng]);

  const onMapLoad = useCallback((map) => {
    console.log('📍 Map loaded successfully');
    mapRef.current = map;
  }, []);

  const onMarkerLoad = useCallback((marker) => {
    console.log('📍 Marker loaded successfully');
    markerRef.current = marker;
    
    // Force marker visibility
    setTimeout(() => {
      if (marker) {
        const markerElement = document.querySelector('[src*="mapfiles/ms/icons/red-dot.png"]');
        if (markerElement) {
          markerElement.style.zIndex = '9999';
          markerElement.style.position = 'relative';
        }
      }
    }, 100);
  }, []);

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  console.log('📍 Rendering map with center:', mapState.center);
  console.log('📍 Rendering marker at:', mapState.markerPosition);

  return (
    <div style={{ position: 'relative' }}>
      {/* Add custom CSS for marker visibility */}
      <style>
        {`
          .marker-fix {
            z-index: 9999 !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
          img[src*="red-dot.png"] {
            z-index: 9999 !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
        `}
      </style>
      
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapState.center}
        zoom={15}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: 'greedy'
        }}
        onClick={handleMapClick}
        onLoad={onMapLoad}
      >
        {mapState.markerPosition && (
         <Marker 
    key={`marker-${mapState.markerPosition.lat}-${mapState.markerPosition.lng}`}
    position={mapState.markerPosition}
    draggable={true} 
    onDragEnd={handleMarkerDragEnd}
    onLoad={onMarkerLoad}
    // Custom icon हटा दें - default marker use करें
    // icon={undefined} // ये line comment out कर दें
/>
        )}
      </GoogleMap>
    </div>
  );
};

export default memo(MapSection);