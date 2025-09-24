import React, { useRef, useEffect } from 'react';
import { useMap } from '../context/MapProvider';
import InputField from './forms/InputField'; // We'll still use our styled InputField

const AddressAutocomplete = ({ label, value, onChange, onPlaceSelect, error, placeholder }) => {
  const { isLoaded } = useMap();
  const inputRef = useRef(null);
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    if (isLoaded && window.google && !autoCompleteRef.current) {
      autoCompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          componentRestrictions: { country: 'in' }, // Restrict to India
          fields: ['address_components', 'formatted_address', 'geometry'],
        }
      );

      autoCompleteRef.current.addListener('place_changed', () => {
        const place = autoCompleteRef.current.getPlace();
        if (onPlaceSelect) {
          onPlaceSelect(place);
        }
      });
    }
  }, [isLoaded, onPlaceSelect]);

  return (
    <InputField
      id="address-autocomplete"
      name="street"
      label={label}
      value={value}
      onChange={onChange}
      error={error}
      placeholder={placeholder}
      ref={inputRef} // Pass the ref to the underlying input
    />
  );
};

export default AddressAutocomplete;