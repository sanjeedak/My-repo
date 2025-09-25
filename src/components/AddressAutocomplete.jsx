import React, { useRef, useEffect } from 'react';
import { useMap } from '../context/MapProvider';
import InputField from './forms/InputField';

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
        
        // Update the input value with the selected address
        if (place.formatted_address) {
          // Create a synthetic event to update the form value
          const syntheticEvent = {
            target: {
              name: 'street',
              value: place.formatted_address
            }
          };
          onChange(syntheticEvent); // This updates the form state
        }
        
        if (onPlaceSelect) {
          onPlaceSelect(place);
        }
      });
    }
  }, [isLoaded, onPlaceSelect, onChange]);

  return (
    <InputField
      id="address-autocomplete"
      name="street"
      label={label}
      value={value}
      onChange={onChange}
      error={error}
      placeholder={placeholder}
      ref={inputRef}
    />
  );
};

export default AddressAutocomplete;