import { ReactNode } from 'react';
import { MotionDiv } from '../ui/motion';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    trend?: {
        value: number;
        label: string;
        isPositive: boolean;
    };
    colorClass?: string;
}

export default function StatsCard({ title, value, icon, trend, colorClass = "bg-primary-500" }: StatsCardProps) {
    return (
        <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 relative overflow-hidden group"
        >
            {/* Background decoration */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 group-hover:scale-110 transition-transform duration-500 ease-out ${colorClass}`}></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm`}>
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend.isPositive
                            ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30'
                            : 'text-rose-600 bg-rose-100 dark:bg-rose-900/30'
                        }`}>
                        <span>{trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{title}</h3>
                <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">{value}</p>
                {trend && (
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">{trend.label}</p>
                )}
            </div>
        </MotionDiv>
    );
}
