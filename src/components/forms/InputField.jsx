// components/ui/input.jsx

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { Eye, EyeOff } from 'lucide-react';

import { cn } from '@/lib/utils'; // Assumes you have a `cn` utility
import { Label } from '@/components/ui/label'; // Radix UI Label primitive

const inputVariants = cva(
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'border-input',
                destructive:
                    'border-destructive text-destructive placeholder:text-destructive/70 focus-visible:ring-destructive',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

const Input = React.forwardRef(({ className, type, label, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === 'password';
    const id = React.useId();

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            {label && <Label htmlFor={props.id || id}>{label}</Label>}
            <div className="relative">
                <input
                    type={isPassword ? (showPassword ? 'text' : 'password') : type}
                    className={cn(
                        inputVariants({ variant: error ? 'destructive' : 'default' }),
                        { 'pr-10': isPassword }, // Add padding only for password fields
                        className
                    )}
                    ref={ref}
                    id={props.id || id}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={handleTogglePassword}
                        className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                )}
            </div>
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        </div>
    );
});
Input.displayName = 'Input';

export { Input };