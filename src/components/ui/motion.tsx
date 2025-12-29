'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utilidad para combinar clases de Tailwind
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// 1. Fade In Up (Entrada suave hacia arriba - Estándar para tarjetas)
export const MotionDiv = motion.div;

export const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" as const }
    }
};

export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

// 2. Botón con efecto de presión y brillo
interface MotionButtonProps extends HTMLMotionProps<"button"> {
    className?: string;
}

export const MotionButton = ({ className, children, ...props }: MotionButtonProps) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02, filter: "brightness(1.1)" }}
            whileTap={{ scale: 0.95 }}
            className={cn(className)}
            {...props}
        >
            {children}
        </motion.button>
    );
};

// 3. Tarjeta Glassmorphism Animada
export const GlassCard = ({ className, children, ...props }: HTMLMotionProps<"div">) => {
    return (
        <motion.div
            variants={fadeIn}
            className={cn(
                "glass-card hover:border-primary-500/30 transition-colors duration-300",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

// 4. Input Animado
export const MotionInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
    return (
        <motion.div whileFocus={{ scale: 1.01 }}>
            <input {...props} className={cn("input-field transition-all duration-200", props.className)} />
        </motion.div>
    );
};
