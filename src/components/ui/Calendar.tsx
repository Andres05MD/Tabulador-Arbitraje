import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";


function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4 relative text-sm",
                caption: "flex justify-start pt-1 relative items-center mb-4 h-10 px-2",
                caption_label: "text-lg font-black text-white uppercase tracking-widest",
                nav: "absolute right-0 top-1 flex items-center space-x-1 h-10 z-10",
                nav_button: cn(
                    "h-8 w-8 bg-slate-900 hover:bg-slate-800 hover:text-primary-400 p-0 rounded-lg transition-all flex items-center justify-center text-slate-400 active:scale-95 border border-slate-700 hover:border-slate-600 shadow-sm"
                ),
                nav_button_previous: "!static",
                nav_button_next: "!static",
                table: "w-full border-collapse space-y-1",
                head_row: "grid grid-cols-7 w-full justify-items-center",
                head_cell:
                    "text-primary-500/70 rounded-md w-10 font-bold text-[0.7rem] uppercase tracking-wider mb-3",
                row: "grid grid-cols-7 w-full mt-2 justify-items-center",
                cell: "h-10 w-10 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                day: cn(
                    "h-10 w-10 p-0 font-medium aria-selected:opacity-100 font-mono text-sm rounded-lg transition-all hover:bg-slate-800 hover:text-white text-slate-100 border border-transparent hover:border-slate-600/50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                ),
                day_range_end: "day-range-end",
                day_selected:
                    "!bg-primary-500 !text-white hover:!bg-primary-400 hover:!text-white focus:!bg-primary-500 focus:!text-white shadow-[0_0_20px_rgba(14,165,233,0.4)] font-bold scale-110 !border-primary-400/50 z-10 before:absolute before:inset-0 before:bg-gradient-to-tr before:from-white/10 before:to-transparent before:rounded-lg",
                day_today: "bg-slate-800/50 text-primary-400 font-black border !border-primary-500/50 relative after:content-[''] after:absolute after:bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary-500 after:rounded-full shadow-inner shadow-primary-500/10",
                day_outside:
                    "day-outside text-slate-700 opacity-30 aria-selected:bg-slate-800/50 aria-selected:text-slate-500 aria-selected:opacity-30",
                day_disabled: "text-slate-800 opacity-20 font-normal cursor-not-allowed",
                day_range_middle:
                    "aria-selected:bg-slate-800 aria-selected:text-slate-100",
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                PreviousMonthButton: (props) => (
                    <button type="button" {...props}>
                        <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                ),
                NextMonthButton: (props) => (
                    <button type="button" {...props}>
                        <ChevronRightIcon className="h-5 w-5" />
                    </button>
                ),
            }}
            {...props}
        />
    );
}
Calendar.displayName = "Calendar";

export { Calendar };
