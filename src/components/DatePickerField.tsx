import React, { useState, useEffect, Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { format, isValid, parse, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from './ui/Calendar';

interface DatePickerFieldProps {
    selected: Date | null;
    onChange: (date: Date | null) => void;
    placeholderText?: string;
    minDate?: Date;
    maxDate?: Date;
    disabled?: boolean;
    className?: string;
    id?: string;
}

export default function DatePickerField({
    selected,
    onChange,
    placeholderText = 'DD/MM/AAAA',
    minDate,
    maxDate,
    disabled = false,
    className,
    id,
}: DatePickerFieldProps) {
    const [inputValue, setInputValue] = useState('');

    // Sincronizar input cuando cambia la fecha externa
    useEffect(() => {
        if (selected && isValid(selected)) {
            setInputValue(format(selected, 'dd/MM/yyyy'));
        } else if (selected === null) {
            setInputValue('');
        }
    }, [selected]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;

        // Solo permitir números y slashes
        if (!/^[\d/]*$/.test(val)) return;
        if (val.length > 10) return;

        const isDeleting = val.length < inputValue.length;

        if (!isDeleting) {
            // Auto-formateo del Día
            if (val.length === 1 && parseInt(val) > 3) {
                val = '0' + val + '/';
            } else if (val.length === 2 && !val.includes('/')) {
                const day = parseInt(val);
                if (day > 0 && day <= 31) {
                    val += '/';
                }
            }

            // Auto-formateo del Mes (después del primer slash)
            const parts = val.split('/');
            if (parts.length === 2) {
                const monthPart = parts[1];
                if (monthPart.length === 1 && parseInt(monthPart) > 1) {
                    val = parts[0] + '/0' + monthPart + '/';
                } else if (monthPart.length === 2) {
                    const month = parseInt(monthPart);
                    if (month > 0 && month <= 12) {
                        val += '/';
                    }
                }
            }
        }

        setInputValue(val);

        // Intentar parsear si está completa
        if (val.length === 10) {
            const parsedDate = parse(val, 'dd/MM/yyyy', new Date());
            if (isValid(parsedDate)) {
                // Verificar límites
                if (minDate && parsedDate < startOfDay(minDate)) return;
                if (maxDate && parsedDate > startOfDay(maxDate)) return;
                onChange(parsedDate);
            }
        } else if (val === '') {
            onChange(null);
        }
    };

    const handleBlur = () => {
        if (inputValue === '') {
            onChange(null);
            return;
        }

        // Si no tiene 10 caracteres, intentamos completar o limpiar
        const parsedDate = parse(inputValue, 'dd/MM/yyyy', new Date());
        if (isValid(parsedDate)) {
            // Validar límites
            const finalDate = (minDate && parsedDate < startOfDay(minDate)) ? minDate :
                (maxDate && parsedDate > startOfDay(maxDate)) ? maxDate :
                    parsedDate;

            setInputValue(format(finalDate, 'dd/MM/yyyy'));
            onChange(finalDate);
        } else {
            // Si es inválido, revertimos al valor anterior (selected) o vaciamos
            if (selected) {
                setInputValue(format(selected, 'dd/MM/yyyy'));
            } else {
                setInputValue('');
                onChange(null);
            }
        }
    };

    const handleCalendarSelect = (date: Date | undefined) => {
        if (date) {
            onChange(date);
            setInputValue(format(date, 'dd/MM/yyyy'));
        } else {
            // Si deseleccionan (click en el mismo día), lo tratamos como null?
            // React-day-picker single mode toggleable defaults to unselect.
            // Para obligar selección, podríamos chequear required, pero aqui permitimos null.
            onChange(null);
            setInputValue('');
        }
    };

    return (
        <Popover className="relative w-full">
            {({ open, close }) => (
                <>
                    <div className="relative w-full">
                        <input
                            id={id}
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder={placeholderText}
                            disabled={disabled}
                            autoComplete="off"
                            className={`
                                ${className || ''}
                                w-full px-4 py-3 rounded-xl transition-all duration-200 outline-none
                                bg-slate-950/60 border-2 
                                ${open ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-slate-600 hover:border-slate-500'}
                                focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
                                text-white font-bold text-xl tracking-wider placeholder:text-slate-600 font-mono
                                disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                        />

                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {/* Botón de limpiar si hay valor */}
                            {selected && !disabled && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onChange(null);
                                        setInputValue('');
                                    }}
                                    className="p-1 text-slate-400 hover:bg-slate-800 rounded-full transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}

                            <Popover.Button className="p-1 text-slate-400 hover:text-primary-400 focus:outline-none">
                                <CalendarIcon className={`w-6 h-6 transition-transform duration-200 ${open ? 'text-primary-400' : ''}`} />
                            </Popover.Button>
                        </div>
                    </div>

                    {/* Mobile Backdrop */}
                    <Transition
                        show={open}
                        as={Fragment}
                        enter="duration-200 ease-out"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="duration-150 ease-in"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 sm:hidden" aria-hidden="true" />
                    </Transition>

                    {/* Calendar Panel */}
                    <Transition
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm z-50 p-4 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black ring-1 ring-white/10 transition-all sm:absolute sm:inset-auto sm:left-0 sm:top-full sm:mt-2 sm:w-auto sm:translate-x-0 sm:translate-y-0 sm:p-2 sm:rounded-xl">
                            {({ close }) => (
                                <Calendar
                                    mode="single"
                                    selected={selected || undefined}
                                    onSelect={(date) => {
                                        handleCalendarSelect(date);
                                        close();
                                    }}
                                    disabled={[
                                        ...(disabled ? [{ from: new Date(0), to: new Date(3000, 0, 1) }] : []),
                                        ...(minDate ? [{ before: minDate }] : []),
                                        ...(maxDate ? [{ after: maxDate }] : [])
                                    ] as any}
                                    fromDate={minDate}
                                    toDate={maxDate}
                                    locale={es}
                                    initialFocus
                                />
                            )}
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
}
