'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/layout/BottomNav';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Rutas donde NO queremos mostrar navegación (login/register)
    // OJO: La ruta pública /arbitro tendrá su propio layout o manejo? 
    // Si queremos que /arbitro no tenga sidebar/nav, la agregamos aquí.
    const hiddenRoutes = ['/', '/login', '/register'];
    const shouldHideNav = hiddenRoutes.includes(pathname) || pathname.startsWith('/arbitro');

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Sidebar Desktop (Controlled by internal hidden lg:flex) */}
            {!shouldHideNav && <Sidebar />}

            <main
                className={`
                    transition-all duration-300 min-h-screen
                    ${shouldHideNav ? '' : 'lg:ml-72 pb-24 lg:pb-8'} 
                `}
            >
                {/* Content wrapper with safe area for mobile nav */}
                <div className="p-4 lg:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Bottom Nav Mobile */}
            {!shouldHideNav && (
                <div className="lg:hidden">
                    <BottomNav />
                </div>
            )}
        </div>
    );
}

