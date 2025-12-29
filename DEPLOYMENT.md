# 🚀 Guía de Deployment en Vercel

## Configuración Necesaria

### 1️⃣ Preparar el Repositorio Git

```bash
# Inicializar Git (si no lo has hecho)
git init

# Agregar todos los archivos
git add .

# Hacer commit inicial
git commit -m "Initial commit: Tabulador de Arbitraje"

# Crear repositorio en GitHub y conectar
git remote add origin https://github.com/TU_USUARIO/tabulador-arbitraje.git
git push -u origin main
```

### 2️⃣ Variables de Entorno en Vercel

Cuando despliegues en Vercel, debes configurar estas variables de entorno:

**Ve a:** Tu Proyecto en Vercel → Settings → Environment Variables

Agrega las siguientes variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC-MXvRIs03epC9LyhmElyFa5bJ-hsmfrM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tabulador-arbitraje.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tabulador-arbitraje
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tabulador-arbitraje.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=515090823638
NEXT_PUBLIC_FIREBASE_APP_ID=1:515090823638:web:53ebabeb48051b8d860c77
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-2YKC4H5GRX
```

**Importante:** Marca todas como disponibles para:
- ✅ Production
- ✅ Preview
- ✅ Development

### 3️⃣ Configuración de Firebase para Producción

#### Actualizar Reglas de Firestore

Para producción, usa reglas más seguras. En Firebase Console → Firestore → Reglas:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Categorías: Solo lectura pública, escritura con autenticación (opcional)
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if true; // Cambiar a 'if request.auth != null' si implementas auth
    }
    
    // Juegos: Solo lectura pública, escritura con autenticación (opcional)
    match /games/{gameId} {
      allow read: if true;
      allow write: if true; // Cambiar a 'if request.auth != null' si implementas auth
    }
  }
}
```

#### Configurar Dominios Autorizados en Firebase

1. Ve a Firebase Console → Authentication → Settings → Authorized domains
2. Agrega tu dominio de Vercel:
   ```
   tu-proyecto.vercel.app
   ```

### 4️⃣ Pasos para Deployment en Vercel

#### Opción A: Deploy desde GitHub (Recomendado)

1. **Conectar GitHub con Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Click en "Add New Project"
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente Next.js

2. **Configurar Variables de Entorno**
   - En la sección "Environment Variables"
   - Pega cada variable del paso 2
   - Click en "Add" para cada una

3. **Deploy**
   - Click en "Deploy"
   - Espera a que termine el build (~2-3 minutos)
   - ✅ ¡Listo! Tu app estará en: `https://tu-proyecto.vercel.app`

#### Opción B: Deploy desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar
vercel

# Para producción
vercel --prod
```

### 5️⃣ Configuraciones Post-Deployment

#### Verificar Build

Asegúrate de que no haya errores:

```bash
# Probar build localmente antes de deploy
npm run build
```

Si hay errores, corrígelos antes de hacer deploy.

#### Configurar Dominio Personalizado (Opcional)

1. Ve a tu proyecto en Vercel → Settings → Domains
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones de Vercel

### 6️⃣ Optimizaciones para Producción

#### Agregar archivo `next.config.mjs`

Ya tienes este archivo, verifica que contenga:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
```

#### Verificar Performance

Después del deploy:

1. Usa Lighthouse en Chrome DevTools
2. Verifica métricas:
   - Performance > 90
   - Accessibility > 90
   - Best Practices > 90
   - SEO > 90

### 7️⃣ Mantenimiento y Updates

#### Deploy Automático

Cada vez que hagas `git push` a la rama `main`, Vercel automáticamente:
- ✅ Ejecutará el build
- ✅ Ejecutará los tests (si los tienes)
- ✅ Desplegará a producción

#### Preview Deployments

Los Pull Requests generan deployments de preview automáticamente.

### 8️⃣ Monitoreo

#### Analytics de Vercel

Activa Vercel Analytics para ver:
- Visitantes
- Rendimiento
- Errores en producción

```bash
npm install @vercel/analytics
```

Luego en `app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

// En el return
<Analytics />
```

### 9️⃣ Troubleshooting

#### Error: "Module not found"

```bash
npm install
npm run build
```

#### Error: Firebase permissions en producción

- Verifica que las variables de entorno estén configuradas
- Verifica las reglas de Firestore
- Verifica que el dominio esté autorizado en Firebase

#### Error: Build failed

- Revisa los logs en Vercel
- Ejecuta `npm run build` localmente
- Corrige errores de TypeScript/ESLint

### 🎯 Checklist Pre-Deploy

- [ ] Build local sin errores (`npm run build`)
- [ ] Variables de entorno configuradas en Vercel
- [ ] Reglas de Firestore publicadas
- [ ] Dominio de Vercel autorizado en Firebase
- [ ] .gitignore incluye .env.local
- [ ] README.md actualizado
- [ ] Código subido a GitHub

### 📊 Después del Deploy

1. ✅ Prueba todas las funcionalidades
2. ✅ Verifica que Firebase funcione
3. ✅ Comprueba que la API del dólar funcione
4. ✅ Prueba en móvil y desktop
5. ✅ Verifica el modo oscuro

## 🔗 Links Útiles

- [Documentación de Vercel](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Firebase Console](https://console.firebase.google.com)

---

**¡Tu aplicación estará lista para producción siguiendo estos pasos!** 🚀
