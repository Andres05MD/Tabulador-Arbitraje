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
                    <Popover.Button
                        id={id}
                        disabled={disabled}
                        className={`
                            ${className || ''}
                            w-full flex items-center justify-between
                            px-4 py-3 rounded-xl transition-all duration-200 outline-none
                            bg-slate-950/60 border-2 
                            ${open ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-slate-600 hover:border-slate-500'}
                            text-white font-medium
                            disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                    >
                        <span className={`block truncate ${!value ? 'text-slate-400' : 'text-xl tracking-wider font-bold'}`}>
                            {value || placeholder}
                        </span>
                        <div className="flex items-center gap-2 text-slate-400">
                            {value && !disabled && (
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onChange(null);
                                    }}
                                    className="p-1 hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            )}
                            <ClockIcon className={`w-5 h-5 transition-transform duration-200 ${open ? 'text-primary-400' : ''}`} />
                        </div>
                    </Popover.Button>

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
