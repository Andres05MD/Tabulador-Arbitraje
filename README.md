# Tabulador de Arbitraje - Voleybol

Sistema de gestión y cálculo automático de tabuladores de arbitraje para juegos de voleybol.

## 🚀 Estado del Proyecto: AVANZADO (Fase de Pulido y Expansión)

> Última actualización: 2025-12-29

Aplicación web moderna ("Premium Dark Mode") para gestionar, calcular y controlar automáticamente el tabulador de arbitraje. Incluye gestión de pagos, referncias, control de usuarios y una experiencia de usuario (UX) de alto nivel con animaciones.

## ✨ Características Principales

### 1. 🔐 Autenticación y Seguridad
- Login seguro con correo y contraseña (Firebase Auth).
- Registro de nuevos usuarios.
- Protección de rutas (Middleware / AuthGuard).
- Persistencia de sesión.

### 2. 🏐 Módulo de Juegos (Refactorizado)
- **Cargar Juego** (`/juegos/cargar`): Formulario dedicado con animaciones.
- **Lista de Juegos** (`/juegos`): Visualización con filtros y acciones.
- **Selectores Premium**: 
  - Selector de Categoría y Estatus personalizados.
  - Selector de Hora estilo "rueda" móvil.
- Animaciones fluidas (`framer-motion`).

### 3. 💰 Gestión de Pagos y Referencias
- Control de pago individual por equipo (Check visual).
- Registro de Referencia de Pago (opcional).
- **Automatización**: El juego pasa a "Completado" automáticamente si ambos equipos pagan.
- Feedback visual inmediato (Toasts y SweetAlert2).

### 4. 📋 Módulo de Categorías
- CRUD completo de categorías.
- Definición de precios por equipo.

### 5. 🎨 Interfaz "Premium Dark"
- Diseño glassmorphism consistente.
- **Modo oscuro permanente** (eliminado el toggle para mayor consistencia).
- Componentes personalizados (Botones, Inputs, Cards, Badges).
- Indicador de Tasa BCV en Sidebar.

## 🛠️ Stack Tecnológico

**Core:**
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Firebase (Auth & Firestore)

**UI & UX:**
- Tailwind CSS (Estilos base)
- Framer Motion (Animaciones avanzadas)
- Headless UI (Componentes accesibles)
- Heroicons (Iconografía)
- SweetAlert2 (Modales)
- React Datepicker

**Utilidades:**
- clsx & tailwind-merge
- react-hook-form + zod
- date-fns

## 📋 Requisitos Previos

- Node.js 18+ 
- npm
- Cuenta de Firebase

## ⚙️ Instalación

1. **Clonar el repositorio**
2. **Instalar dependencias**
   ```bash
   npm install
   ```
3. **Configurar Firebase**
   Crea un `.env.local` con tus credenciales:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   # ... resto de variables
   ```
4. **Iniciar desarrollo**
   ```bash
   npm run dev
   ```

## 🔄 Roadmap y Avance

### ✅ FASE 1 - BASE Y AUTH
- [x] Configuración Next.js + TS
- [x] Firebase Auth (Login/Register)
- [x] Layout "Premium Dark" con Sidebar

### ✅ FASE 2 - CATEGORÍAS
- [x] CRUD Categorías
- [x] Formulario con validaciones

### ✅ FASE 3 - JUEGOS CORE
- [x] Formulario "Cargar Juego" animado
- [x] Selector de Hora avanzado
- [x] Cálculo automático de costos
- [x] Lista y filtros

### ✅ FASE 4 - PAGOS Y LÓGICA
- [x] Toggle de pagos por equipo
- [x] Captura de referencia
- [x] Cambio automático de estatus
- [x] Componentes SelectField

### 🚧 FASE 5 - REFINAMIENTO (En Progreso)
- [x] Estandarización de inputs
- [ ] Tooltips para referencias
- [ ] Exportación de reportes
- [ ] Dashboard con gráficas

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
