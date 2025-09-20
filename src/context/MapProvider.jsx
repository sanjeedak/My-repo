import React, { createContext, useContext } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "AIzaSyBsmtx_w9SAGhpzRw7d4zGviSSqTkGUp_c"; 
const libraries = ["places", "geocoding"];

const MapContext = createContext({ isLoaded: false, loadError: undefined });

export const useMap = () => useContext(MapContext);

export const MapProvider = ({ children }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey,
    libraries,
  });

  return (
    <MapContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </MapContext.Provider>
  );
};

