import Link from 'next/link';

export default function Home() {
  return (
    <div className="page-container">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 dark:from-primary-400 dark:via-purple-400 dark:to-secondary-400 bg-clip-text text-transparent">
            Tabulador de Arbitraje
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Sistema de gestión y cálculo automático de tabuladores de arbitraje para juegos de voleybol
        </p>
      </div>

      {/* Quick Actions Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* Categorías Card */}
        <Link href="/categorias" className="group">
          <div className="glass-card-hover p-8 h-full">
            <div className="flex items-center mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Categorías
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Gestiona las categorías y define los precios de arbitraje por equipo para cada una
            </p>
            <div className="flex items-center text-primary-600 dark:text-primary-400 font-semibold">
              Gestionar categorías
              <svg
                className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </div>
        </Link>

        {/* Juegos Card */}
        <Link href="/juegos" className="group">
          <div className="glass-card-hover p-8 h-full">
            <div className="flex items-center mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
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
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Juegos
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Registra los juegos del día y calcula automáticamente el tabulador de arbitraje
            </p>
            <div className="flex items-center text-secondary-600 dark:text-secondary-400 font-semibold">
              Gestionar juegos
              <svg
                className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Features Section */}
      <div className="glass-card p-8">
        <h2 className="section-title">Características principales</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-2">
              Cálculo Automático
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Los tabuladores se calculan automáticamente según las categorías y equipos
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-2">
              Responsive
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Funciona perfectamente en dispositivos móviles, tablets y escritorio
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-2">
              Modo Oscuro
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Alterna entre tema claro y oscuro según tus preferencias
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

