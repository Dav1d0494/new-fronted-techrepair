# TechRepair - Plataforma de Soporte Remoto Profesional

Una plataforma moderna y profesional para gestionar soporte remoto, tickets de soporte y conexiones en tiempo real. Construida con React, Vite y tecnologías modernas.

## 🚀 Características

- **Soporte Remoto**: Control remoto seguro de dispositivos en tiempo real
- **Gestión de Tickets**: Sistema completo de creación, asignación y seguimiento de tickets
- **Chat en Tiempo Real**: Comunicación instantánea con clientes durante sesiones
- **Dashboard Inteligente**: Estadísticas y gráficos en tiempo real
- **Gestión de Usuarios**: Control de roles y permisos
- **Modo Oscuro/Claro**: Tema intercambiable automáticamente
- **Modo Offline**: Sincronización de datos cuando se recupera la conexión
- **Responsive**: Diseño totalmente adaptable a dispositivos móviles

## 📋 Requisitos Previos

- Node.js v16 o superior
- npm v7 o superior
- Backend running en `http://localhost:8080`

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd techrepair-frontend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crear archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```

Editar `.env` con tus valores:
```env
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws
VITE_SESSION_TIMEOUT=1800000
```

### 4. Iniciar servidor de desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📦 Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Preview de build
npm run preview

# Ejecutar linter
npm run lint
```

## 📁 Estructura del Proyecto

```
src/
├── assets/          # Imágenes y recursos
├── components/      # Componentes React
│   ├── ui/         # Componentes base (Button, Input, Modal, etc.)
│   ├── layout/     # Layout principal (Header, Sidebar, Footer)
│   ├── dashboard/  # Componentes del dashboard
│   ├── tickets/    # Componentes de tickets
│   ├── chat/       # Componentes de chat
│   ├── notifications/ # Centro de notificaciones
│   ├── users/      # Gestión de usuarios
│   ├── remote/     # Soporte remoto
│   └── settings/   # Configuración
├── context/        # Context API providers
├── hooks/          # Custom hooks
├── pages/          # Páginas principales
├── services/       # Servicios API
├── store/          # Zustand stores
├── styles/         # Estilos CSS
└── utils/          # Funciones auxiliares
```

## 🎨 Tecnologías Utilizadas

### Frontend
- **React 18**: Framework principal
- **Vite**: Build tool y dev server
- **React Router DOM**: Enrutamiento
- **Tailwind CSS**: Estilos y diseño
- **Framer Motion**: Animaciones

### State Management
- **Zustand**: State global
- **React Context API**: Contextos
- **React Query**: Cache de datos

### Comunicación
- **Axios**: Peticiones HTTP
- **Socket.io-client**: WebSocket en tiempo real

### UI Components
- **Lucide React**: Iconos
- **Recharts**: Gráficos

### Notificaciones
- **React Hot Toast**: Sistema de notificaciones

## 🔐 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para autenticación:

1. **Login**: Las credenciales se validan contra el backend
2. **Token Storage**: El token se almacena en localStorage
3. **Auto-refresh**: Los tokens expirados se renuevan automáticamente
4. **Protected Routes**: Las rutas se protegen verificando autenticación

## 🌐 API Integration

### Base URL
Por defecto: `http://localhost:8080/api`

### WebSocket URL
Por defecto: `ws://localhost:8080/ws`

### Interceptores
- **Request**: Agregan token JWT automáticamente
- **Response**: Redirigen a login si token expira (401)

## 🎯 Rutas Principales

```
/login              - Página de inicio de sesión
/                   - Página de inicio
/dashboard          - Dashboard principal
/tickets            - Gestión de tickets
/tickets/:id        - Detalle de ticket
/connections        - Conexiones remotas activas
/remote-session     - Sesión remota con soporte
/users              - Gestión de usuarios
/profile            - Perfil del usuario
/settings           - Configuración de usuario
/reports            - Reportes y análisis
/history            - Historial de actividad
```

## 🛠️ Configuración de Tailwind CSS

El proyecto incluye configuración de Tailwind CSS con:
- Modo oscuro habilitado (class-based)
- Paleta de colores personalizada
- Glassmorphism utilities
- Animaciones personalizadas

## 📱 Responsive Design

La aplicación es completamente responsive:
- Mobile: 360px+
- Tablet: 768px+
- Desktop: 1024px+

## 🔄 Sincronización Offline

El sistema soporta:
- Almacenamiento en caché de datos
- Cola de acciones pendientes
- Sincronización automática cuando se recupera conexión
- Persistencia en localStorage

## 📊 Permisos y Roles

Tres niveles de roles:

| Rol | Permisos |
|-----|----------|
| **Administrador** | Acceso completo a todas las funciones |
| **Técnico** | Gestión de tickets, conexiones y reportes |
| **Cliente** | Crear y ver propios tickets |

## 🚀 Deployment

### Build para Producción
```bash
npm run build
```

Esto genera una carpeta `dist/` lista para deployment.

### Deployment en Vercel
```bash
npm i -g vercel
vercel
```

### Deployment en Netlify
```bash
npm i -g netlify-cli
netlify deploy
```

## 🐛 Debugging

### Console Logs
Usa `import.meta.env.VITE_DEBUG_MODE` para habilitar logs adicionales

### React DevTools
Se recomienda instalar la extensión de navegador para React DevTools

### WebSocket Inspector
Usa las DevTools del navegador para inspeccionar WebSocket

## 📝 Mejores Prácticas

- Usar componentes funcionales con hooks
- Lazy load de páginas para mejor rendimiento
- Validar datos en cliente y servidor
- Usar TypeScript en producción (opcional)
- Mantener componentes pequeños y reutilizables
- Separar lógica de presentación

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit los cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## 🆘 Soporte

Para soporte, contacta a: support@techrepair.com

## 🔗 Enlaces Útiles

- [Documentación de React](https://react.dev)
- [Documentación de Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Zustand](https://github.com/pmndrs/zustand)

---

**Hecho con ❤️ para profesionales de soporte técnico**
