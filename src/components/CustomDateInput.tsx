"use client";

import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";

interface CustomDateInputProps {
    form: UseFormReturn<any>;
    fieldName: string;
}

export function CustomDateInput({ form, fieldName }: CustomDateInputProps) {
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        const isComplete = inputValue.length === 10;
        if (isComplete) {
            const parts = inputValue.split('-');
            const ymdFormat = `${parts[2]}-${parts[1]}-${parts[0]}`;
            form.setValue(fieldName, ymdFormat, { shouldValidate: true });
        } else {
            form.setValue(fieldName, "", { shouldValidate: true });
        }
    }, [inputValue, form, fieldName]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Get only the digits from the input
        const digitsOnly = e.target.value.replace(/\D/g, '');

        // ✅ --- VALIDATION LOGIC STARTS HERE ---
        let day = digitsOnly.slice(0, 2);
        let month = digitsOnly.slice(2, 4);
        const year = digitsOnly.slice(4, 8);

        // Cap day at 31
        if (parseInt(day, 10) > 31) {
            day = '31';
        }

        // Cap month at 12
        if (parseInt(month, 10) > 12) {
            month = '12';
        }

        // Reassemble the validated digits
        const validatedDigits = day + month + year;
        // ✅ --- VALIDATION LOGIC ENDS HERE ---

        // Apply the DD-MM-YYYY mask
        let formattedValue = validatedDigits;
        if (validatedDigits.length > 2) {
            formattedValue = `${validatedDigits.slice(0, 2)}-${validatedDigits.slice(2)}`;
        }
        if (validatedDigits.length > 4) {
            formattedValue = `${validatedDigits.slice(0, 2)}-${validatedDigits.slice(2, 4)}-${validatedDigits.slice(4)}`;
        }

        setInputValue(formattedValue);
    };

    return (
        <div>
            <FormLabel>Date of Birth</FormLabel>
            <div className="mt-2">
                <Input
                    type="tel"
                    placeholder="DD-MM-YYYY"
                    maxLength={10}
                    value={inputValue}
                    onChange={handleInputChange}
                />
            </div>
        </div>
    );
}