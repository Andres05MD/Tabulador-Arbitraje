'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/src/components/Sidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Rutas donde NO queremos mostrar el sidebar
    const hiddenRoutes = ['/', '/login', '/register'];
    const shouldHideSidebar = hiddenRoutes.includes(pathname);

    return (
        <div className="min-h-screen flex">
            {!shouldHideSidebar && <Sidebar />}

            <main
                className={`flex-1 transition-all duration-300 ${shouldHideSidebar ? '' : 'lg:ml-72'
                    }`}
            >
                {children}
            </main>
        </div>
    );
}
