import React from 'react';

const RadioButton = ({ id, label, checked, onChange, value }) => (
    <label className="flex items-center text-white cursor-pointer">
        <input
            id={id}
            type="radio"
            checked={checked}
            onChange={onChange}
            className="mr-2 h-5 w-5 appearance-none rounded-full border-2 border-gray-400 checked:bg-purple-500 checked:border-transparent transition-colors duration-300"
            aria-label={label}
        />
        <span>{value}</span>
    </label>
);

export default RadioButton;