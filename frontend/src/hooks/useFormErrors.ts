import { useState } from 'react';
import { toast } from 'sonner';

export type FieldErrors = Record<string, string[]>;

export function useFormErrors(global_alert: boolean = false) {
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [globalError, setGlobalError] = useState<string | null>(null);

    const handleError = (err) => {
        if (err.response?.data?.fields) {
            const errors: FieldErrors = {};
            err.response.data.fields.forEach((f) => {
                errors[f.field_name] = f.errors;
            });
            setFieldErrors(errors);
            setGlobalError(null);
        } else {
            setGlobalError(err.response?.data?.message || 'Произошла ошибка');
            setFieldErrors({});
            if (global_alert) {
                toast.error(err.response?.data?.message || 'Произошла ошибка');
            }
        }
    };

    const resetErrors = () => {
        setFieldErrors({});
        setGlobalError(null);
    };

    return { fieldErrors, globalError, handleError, resetErrors };
}
