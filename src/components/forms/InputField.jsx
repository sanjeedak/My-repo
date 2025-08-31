import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const InputField = ({ id, label, type, name, placeholder, value, onChange, error, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === 'password';

    return (
        <div className="relative">
            <label htmlFor={id} className="sr-only">{label}</label>
            <input
                id={id}
                type={isPasswordField && showPassword ? 'text' : type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full p-4 text-white placeholder-gray-400 border border-transparent rounded-full bg-gray-700 bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 pr-12"
                aria-label={label}
                {...props}
            />
            {isPasswordField && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            )}
            {error && <p className="text-red-400 text-xs mt-1 pl-2">{error}</p>}
        </div>
    );
};

export default InputField;