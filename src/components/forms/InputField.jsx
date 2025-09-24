import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const InputField = forwardRef(({ id, name, label, type, value, onChange, error, required = true, placeholder, endIcon, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative">
                <input 
                    id={id} 
                    name={name || id} 
                    type={isPassword ? (showPassword ? 'text' : 'password') : type} 
                    value={value} 
                    onChange={onChange} 
                    required={required} 
                    placeholder={placeholder}
                    ref={ref}
                    className={`w-full px-4 py-3 bg-slate-100 border-2 ${error ? 'border-red-400' : 'border-transparent'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors sm:text-sm ${isPassword || endIcon ? 'pr-10' : ''} ${props.className || ''}`} 
                    {...props} 
                />
                {isPassword && (
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                )}
                {endIcon && (
                     <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {endIcon}
                    </div>
                )}
            </div>
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
});

export default InputField;