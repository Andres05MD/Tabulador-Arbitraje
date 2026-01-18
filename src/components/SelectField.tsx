'use client';

import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utilidad para combinar clases
function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export interface SelectOption {
    id: string | number;
    name: string;
    [key: string]: any; // Para permitir propiedades extra
}

interface SelectFieldProps<T extends SelectOption> {
    label?: string;
    value: T | null | undefined;
    onChange: (value: T) => void;
    options: T[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    error?: string;
    // Renderizado personalizado opcional para las opciones
    renderOption?: (option: T) => React.ReactNode;
}

export default function SelectField<T extends SelectOption>({
    label,
    value,
    onChange,
    options,
    placeholder = 'Seleccionar...',
    disabled = false,
    className,
    error,
    renderOption,
}: SelectFieldProps<T>) {
    return (
        <div className={cn("w-full", className)}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                </label>
            )}
            <Listbox value={value === null ? undefined : value} onChange={onChange} disabled={disabled}>
                {({ open }) => (
                    <div className="relative mt-1">
                        <Listbox.Button className={cn(
                            "relative w-full cursor-default rounded-xl border-2 py-3 pl-4 pr-10 text-left transition-all duration-200 outline-none",
                            // Estilos Base Premium (Dark Mode Driven)
                            "bg-slate-950/60 backdrop-blur-sm",
                            "text-white placeholder-slate-400",

                            // Bordes y Focus
                            open
                                ? "border-primary-500 ring-2 ring-primary-500/20"
                                : "border-slate-600 hover:border-slate-500",

                            // Estados Disabled y Error
                            disabled && "opacity-50 cursor-not-allowed bg-slate-900 border-slate-700",
                            error && "border-red-500 focus:ring-red-500 bg-red-900/10"
                        )}>
                            <span className={cn("block truncate", !value && "text-slate-400")}>
                                {value ? value.name : placeholder}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon
                                    className={cn("h-5 w-5 transition-colors", open ? "text-primary-500" : "text-slate-400")}
                                    aria-hidden="true"
                                />
                            </span>
                        </Listbox.Button>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-slate-900 py-1 text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-slate-700">
                                {options.length === 0 ? (
                                    <div className="relative cursor-default select-none py-2 px-4 text-slate-500 italic">
                                        No hay opciones disponibles.
                                    </div>
                                ) : (
                                    options.map((option) => (
                                        <Listbox.Option
                                            key={option.id}
                                            className={({ active }) =>
                                                cn(
                                                    "relative cursor-default select-none py-2.5 pl-10 pr-4 transition-colors",
                                                    active ? "bg-slate-800 text-primary-400" : "text-slate-300"
                                                )
                                            }
                                            value={option}
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span className={cn("block truncate", selected ? "font-bold text-white" : "font-normal")}>
                                                        {renderOption ? renderOption(option) : option.name}
                                                    </span>
                                                    {selected ? (
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-400">
                                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))
                                )}
                            </Listbox.Options>
                        </Transition>
                    </div>
                )}
            </Listbox>
            {error && (
                <p className="mt-1 text-sm text-red-500 font-medium animate-pulse">{error}</p>
            )}
        </div>
    );
}
