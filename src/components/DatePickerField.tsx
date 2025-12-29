'use client';

import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

// Registrar el locale en español
registerLocale('es', es);

interface DatePickerFieldProps {
    selected: Date | null;
    onChange: (date: Date | null) => void;
    placeholderText?: string;
    minDate?: Date;
    maxDate?: Date;
    disabled?: boolean;
    dateFormat?: string;
    showTimeSelect?: boolean;
    timeFormat?: string;
    timeIntervals?: number;
    className?: string;
    id?: string;
}

export default function DatePickerField({
    selected,
    onChange,
    placeholderText = 'Selecciona una fecha',
    minDate,
    maxDate,
    disabled = false,
    dateFormat = 'dd/MM/yyyy',
    showTimeSelect = false,
    timeFormat = 'HH:mm',
    timeIntervals = 15,
    className,
    id,
}: DatePickerFieldProps) {
    return (
        <div className="relative">
            <DatePicker
                id={id}
                selected={selected}
                onChange={onChange}
                placeholderText={placeholderText}
                dateFormat={dateFormat}
                locale="es"
                minDate={minDate}
                maxDate={maxDate}
                disabled={disabled}
                showTimeSelect={showTimeSelect}
                timeFormat={timeFormat}
                timeIntervals={timeIntervals}
                className={`input-field ${className || ''}`}
                calendarClassName="custom-calendar"
                wrapperClassName="w-full"
                autoComplete="off"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                    className="w-5 h-5 text-slate-400 dark:text-slate-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            </div>
        </div>
    );
}
