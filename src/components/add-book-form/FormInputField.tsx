import React, { KeyboardEvent, ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormInputFieldProps {
    id: string;
    label: string;
    icon: ReactNode;
    value: string;
    placeholder?: string;
    error?: string;
    isLoading?: boolean;
    autoFocus?: boolean;

    onChange: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onKeyDown?: (e: KeyboardEvent) => void;
    inputRef?: React.RefObject<HTMLInputElement>;
}

const FormInputField: React.FC<FormInputFieldProps> = ({
                                                           id,
                                                           label,
                                                           icon,
                                                           value,
                                                           placeholder,
                                                           error,
                                                           isLoading = false,
                                                           autoFocus = false,
                                                           onChange,
                                                           onFocus,
                                                           onBlur,
                                                           onKeyDown,
                                                           inputRef,
                                                       }) => {
    return (
        <div className="space-y-2 relative">
            <Label htmlFor={id} className="text-sm font-medium text-slate-700 flex items-center">
                {icon}
                {label}
            </Label>

            <div className="relative">
                <Input
                    ref={inputRef}
                    id={id}
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    autoFocus={autoFocus}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onKeyDown={onKeyDown}
                    className={cn(
                        'transition-colors duration-200',
                        error
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-slate-300 focus:border-red-500 focus:ring-red-500'
                    )}
                />
                {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                    </div>
                )}
            </div>

            {error && (
                <div className="flex items-center text-sm text-red-600 mt-1">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {error}
                </div>
            )}
        </div>
    );
};

export default FormInputField;
