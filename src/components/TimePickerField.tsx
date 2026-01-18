'use client';

import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon, ClockIcon } from '@heroicons/react/24/outline';

interface TimePickerFieldProps {
    value: string | null;
    onChange: (value: string | null) => void;
    disabled?: boolean;
    className?: string;
    id?: string;
    placeholder?: string;
}

export default function TimePickerField({
    value,
    onChange,
    disabled = false,
    className,
    id,
    placeholder = 'HH:MM',
}: TimePickerFieldProps) {
    // Parsear valor inicial
    const [selectedHour, setSelectedHour] = useState<string>('12');
    const [selectedMinute, setSelectedMinute] = useState<string>('00');

    useEffect(() => {
        if (value) {
            const [h, m] = value.split(':');
            if (h && m) {
                setSelectedHour(h);
                setSelectedMinute(m);
            }
        }
    }, [value]);

    // Generar arrays de horas y minutos
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    // Minutos en intervalos de 5 para acceso rápido, pero permitimos todos en scroll
    const quickMinutes = ['00', '15', '30', '45'];

    const handleTimeChange = (h: string, m: string) => {
        setSelectedHour(h);
        setSelectedMinute(m);
        onChange(`${h}:${m}`);
    };

    const setNow = () => {
        const now = new Date();
        const h = now.getHours().toString().padStart(2, '0');
        const m = now.getMinutes().toString().padStart(2, '0');
        handleTimeChange(h, m);
    };

    return (
        <Popover className="relative w-full">
            {({ open }) => (
                <>
                    <div className="relative w-full">
                        <input
                            id={id}
                            type="text"
                            value={value || ''}
                            maxLength={5}
                            onChange={(e) => {
                                let newVal = e.target.value;

                                // Solo permitir números y dos puntos
                                if (!/^[\d:]*$/.test(newVal)) return;

                                // Limitar longitud máxima a 5 caracteres (HH:MM)
                                if (newVal.length > 5) return;

                                // Detectar si se está borrando comparando con el valor anterior
                                const isDeleting = newVal.length < (value || '').length;

                                if (!isDeleting) {
                                    // Caso 1: Usuario escribe dos dígitos (ej: "12") -> añadir ":" automáticamente si es hora válida
                                    if (newVal.length === 2 && !newVal.includes(':')) {
                                        const num = parseInt(newVal);
                                        if (num >= 0 && num <= 23) {
                                            newVal += ':';
                                        } else if (num > 23) {
                                            // Si es inválido (ej: 25), podemos limitarlo a 2 o dejar que el usuario corrija
                                            // Por ahora dejamos que escriba pero no auto-formateamos
                                        }
                                    }
                                    // Caso 2: Usuario escribe un dígito > 2 (ej: "3") -> es imposible que sea la primera cifra de una hora de 2 dígitos (excepto 0, 1, 2)
                                    // Entonces auto-formateamos como "03:"
                                    if (newVal.length === 1 && parseInt(newVal) > 2) {
                                        newVal = '0' + newVal + ':';
                                    }
                                }

                                // Actualizar el estado si el formato parcial es válido o está vacío
                                if (newVal === '' || /^[\d:]*$/.test(newVal)) {
                                    // Si tenemos un formato completo HH:MM, sincronizamos los selectores internos
                                    if (/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(newVal)) {
                                        const [h, m] = newVal.split(':');
                                        setSelectedHour(h.padStart(2, '0'));
                                        setSelectedMinute(m.padStart(2, '0'));
                                    }
                                    onChange(newVal);
                                }
                            }}
                            onBlur={() => {
                                // Validate rigid format on blur to prevent saving invalid times
                                if (value && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
                                    // If invalid, could reset or leave as is but it won't be valid date
                                    // Let's try to fix simple cases like "9:00" -> "09:00"
                                    const parts = value.split(':');
                                    if (parts.length === 2) {
                                        let h = parts[0].padStart(2, '0');
                                        let m = parts[1].padStart(2, '0').slice(0, 2);
                                        if (/^([0-1]?[0-9]|2[0-3])$/.test(h) && /^[0-5][0-9]$/.test(m)) {
                                            handleTimeChange(h, m);
                                        }
                                    }
                                }
                            }}
                            placeholder={placeholder}
                            disabled={disabled}
                            className={`
                                ${className || ''}
                                w-full px-4 py-3 rounded-xl transition-all duration-200 outline-none
                                bg-slate-950/60 border-2 
                                ${open ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-slate-600 hover:border-slate-500'}
                                text-white font-bold text-xl tracking-wider placeholder:text-slate-600 font-mono
                                disabled:opacity-50 disabled:cursor-not-allowed
                             `}
                        />

                        {/* Overlay invisible para abrir Popover en click fuera del input si se quiere comportamiento mixto, 
                            pero Button normal bloquea input. Usamos un div absolute para el icono que togglea. */}

                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {value && !disabled && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onChange(null);
                                        setSelectedHour('12');
                                        setSelectedMinute('00');
                                    }}
                                    className="p-1 text-slate-400 hover:bg-slate-800 rounded-full transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                            <Popover.Button className="p-1 text-slate-400 hover:text-primary-400 focus:outline-none">
                                <ClockIcon className={`w-6 h-6 transition-transform duration-200 ${open ? 'text-primary-400' : ''}`} />
                            </Popover.Button>
                        </div>
                    </div>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="absolute left-0 z-50 mt-2 w-full max-w-sm transform px-0">
                            <div className="overflow-hidden rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl ring-1 ring-black ring-opacity-5">
                                {/* Header */}
                                <div className="bg-slate-800/50 p-3 border-b border-slate-700 flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Seleccionar Hora</span>
                                    <button
                                        onClick={setNow}
                                        className="text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors bg-primary-500/10 px-2 py-1 rounded-md"
                                    >
                                        AHORA
                                    </button>
                                </div>

                                {/* Selectores de Columna */}
                                <div className="flex h-64 relative">
                                    {/* Sombra de selección central */}
                                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 bg-slate-700/30 border-y border-primary-500/30 pointer-events-none z-0"></div>

                                    {/* Columna Horas */}
                                    <div className="flex-1 overflow-y-auto scrollbar-hide py-[108px] text-center relative z-10 scroll-smooth">
                                        {hours.map((h) => (
                                            <div
                                                key={h}
                                                onClick={() => handleTimeChange(h, selectedMinute)}
                                                className={`
                                                    h-10 flex items-center justify-center cursor-pointer transition-all duration-150 snap-center
                                                    ${selectedHour === h
                                                        ? 'text-2xl font-bold text-white scale-110'
                                                        : 'text-lg text-slate-500 hover:text-slate-300'
                                                    }
                                                `}
                                            >
                                                {h}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Separador */}
                                    <div className="flex items-center justify-center text-slate-600 font-bold text-xl z-10 pb-1">:</div>

                                    {/* Columna Minutos */}
                                    <div className="flex-1 overflow-y-auto scrollbar-hide py-[108px] text-center relative z-10 scroll-smooth">
                                        {minutes.map((m) => (
                                            <div
                                                key={m}
                                                onClick={() => handleTimeChange(selectedHour, m)}
                                                className={`
                                                    h-10 flex items-center justify-center cursor-pointer transition-all duration-150 snap-center
                                                    ${selectedMinute === m
                                                        ? 'text-2xl font-bold text-primary-400 scale-110'
                                                        : 'text-lg text-slate-500 hover:text-slate-300'
                                                    }
                                                `}
                                            >
                                                {m}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Minutes Footer */}
                                <div className="bg-slate-800/50 p-3 border-t border-slate-700 grid grid-cols-4 gap-2">
                                    {quickMinutes.map((qm) => (
                                        <button
                                            key={qm}
                                            onClick={() => handleTimeChange(selectedHour, qm)}
                                            className="px-2 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-600"
                                        >
                                            :{qm}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
}
