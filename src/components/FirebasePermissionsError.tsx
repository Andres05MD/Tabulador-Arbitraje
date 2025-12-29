'use client';

export default function FirebasePermissionsError() {
    return (
        <div className="glass-card p-8 max-w-3xl mx-auto">
            <div className="text-center mb-6">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                        className="w-10 h-10 text-red-600 dark:text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    Error de Permisos de Firebase
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                    La base de datos no permite acceso. Configura las reglas de seguridad en Firebase Console.
                </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Pasos para solucionar:
                </h3>
                <ol className="space-y-3 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                            1
                        </span>
                        <div>
                            <p className="font-medium">Ve a Firebase Console</p>
                            <a
                                href="https://console.firebase.google.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                            >
                                https://console.firebase.google.com
                            </a>
                        </div>
                    </li>
                    <li className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                            2
                        </span>
                        <p>
                            Selecciona tu proyecto: <strong>tabulador-arbitraje</strong>
                        </p>
                    </li>
                    <li className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                            3
                        </span>
                        <p>
                            Ve a <strong>Firestore Database</strong> → <strong>Reglas</strong>
                        </p>
                    </li>
                    <li className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                            4
                        </span>
                        <div className="flex-1">
                            <p className="mb-2">Reemplaza las reglas con:</p>
                            <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 overflow-x-auto">
                                <pre className="text-sm text-green-400 font-mono">
                                    {`rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
                                </pre>
                            </div>
                        </div>
                    </li>
                    <li className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                            5
                        </span>
                        <p>
                            Haz clic en <strong>Publicar</strong>
                        </p>
                    </li>
                    <li className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                            6
                        </span>
                        <p>
                            Recarga esta página (F5)
                        </p>
                    </li>
                </ol>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start">
                    <svg
                        className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <div className="flex-1">
                        <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                            Nota de Seguridad
                        </h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            Las reglas mostradas arriba permiten acceso completo para desarrollo. Para producción,
                            implementa autenticación y validaciones más estrictas.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-center">
                <button
                    onClick={() => window.location.reload()}
                    className="btn-primary"
                >
                    <svg className="w-5 h-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Recargar Página
                </button>
            </div>
        </div>
    );
}
