# Tabulador de Arbitraje - Voleybol

Sistema de gestión y cálculo automático de tabuladores de arbitraje para juegos de voleybol.

## 🚀 Características

- ✅ **Diseño Premium**: Interfaz moderna con efectos glassmorphism
- ✅ **Modo Claro/Oscuro**: Cambio de tema con persistencia en localStorage
- ✅ **Responsive**: Compatible con dispositivos móviles, tablets y escritorio
- ✅ **Firebase Integration**: Base de datos en tiempo real con Firestore
- 🔄 **Gestión de Categorías**: CRUD completo de categorías (En desarrollo)
- 🔄 **Gestión de Juegos**: Registro y cálculo automático de tabuladores (En desarrollo)

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Firebase

## 🛠️ Instalación

1. **Clonar el repositorio** (o descargar el código)

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Firebase**
   
   Crea un archivo`.env.local` en la raíz del proyecto con tus credenciales de Firebase:
   
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=tu_measurement_id
   ```

4. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   
   Visita [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
tabulador-arbitraje/
├── app/                      # Páginas de Next.js (App Router)
│   ├── categorias/          # Página de gestión de categorías
│   ├── juegos/              # Página de gestión de juegos
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Página de inicio
│   └── globals.css          # Estilos globales
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Navigation.tsx   # Barra de navegación
│   │   ├── ThemeProvider.tsx # Provider de tema
│   │   └── ThemeToggle.tsx  # Botón de cambio de tema
│   ├── lib/                 # Utilidades y configuraciones
│   │   └── firebase.ts      # Configuración de Firebase
│   ├── hooks/               # Custom hooks
│   └── types/               # Tipos TypeScript
│       └── index.ts         # Tipos principales
├── public/                  # Archivos estáticos
├── .env.local              # Variables de entorno (no incluido)
├── env.example             # Ejemplo de variables de entorno
├── tailwind.config.ts      # Configuración de Tailwind CSS
├── tsconfig.json           # Configuración de TypeScript
└── package.json            # Dependencias del proyecto
```

## 🎨 Stack Tecnológico

### Frontend
- **Next.js 14+** - Framework de React con App Router
- **React 18+** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS v4** - Framework de CSS

### Backend/Database
- **Firebase Firestore** - Base de datos en tiempo real
- **Firebase** - Plataforma de desarrollo

### Librerías Adicionales
- **SweetAlert2** - Alertas y confirmaciones
- **date-fns** - Manejo de fechas
- **react-hook-form** - Gestión de formularios
- **zod** - Validación de datos

## 📝 Categorías Predefinidas

| Categoría | Precio por Equipo | Precio Total por Juego |
|-----------|-------------------|------------------------|
| U9        | $5.00            | $10.00                |
| U11       | $5.00            | $10.00                |
| U13       | $7.50            | $15.00                |
| U15       | $7.50            | $15.00                |
| U17       | $10.00           | $20.00                |
| U19       | $10.00           | $20.00                |
| U21       | $12.50           | $25.00                |

## 🔄 Estado del Desarrollo

### ✅ Fase 1 - Configuración y Base (Completada)
- [x] Configurar proyecto Next.js con TypeScript
- [x] Configurar Firebase y Firestore
- [x] Configurar Tailwind CSS con tema personalizado
- [x] Implementar sistema de tema claro/oscuro
- [x] Crear layout principal y navegación

### 🔄 Fase 2 - Módulo de Categorías (En Desarrollo)
- [ ] Crear formulario de categoría
- [ ] Implementar CRUD completo de categorías
- [ ] Implementar validaciones
- [ ] Agregar confirmaciones con SweetAlert2

### 📋 Fase 3 - Módulo de Juegos (Pendiente)
- [ ] Crear página de Juegos
- [ ] Implementar formulario de registro de juegos
- [ ] Implementar cálculo automático del tabulador
- [ ] Conectar con Firebase para guardar juegos
- [ ] Implementar edición y eliminación

### 📋 Fase 4 - Vistas y Reportes (Pendiente)
- [ ] Implementar vista Calendario (juegos del día)
- [ ] Implementar vista por Equipos
- [ ] Agregar filtros por fecha y categoría
- [ ] Implementar cálculos y totales

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría realizar.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

Desarrollado como sistema de gestión de arbitraje de voleybol.

---

**Nota**: Este proyecto está en desarrollo activo. Las funcionalidades de gestión de categorías y juegos están siendo implementadas progresivamente siguiendo el planteamiento del proyecto.
