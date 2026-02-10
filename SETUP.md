# Guía de Instalación y Configuración - TechRepair

## 🚀 Primeros Pasos

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus valores
# VITE_API_URL=http://localhost:8080/api
# VITE_WS_URL=ws://localhost:8080/ws
```

### 3. Iniciar Servidor de Desarrollo
```bash
npm run dev
```

Abre tu navegador en `http://localhost:5173`

## 🔑 Credenciales de Prueba

Para pruebas locales, utiliza estas credenciales:

**Administrador:**
- Email: `cristian.admin@itegperformance.com`
- Password: `Admin#0019`

**Técnico:**
- Email: `Nain.zuñiga@itegperformance.com`
- Password: `Performance2025`

**Cliente:**
- Email: `David12@hotmail.com`
- Password: `Colombia123`

## 📦 Estructura de Archivos Creada

```
src/
├── assets/
│   └── images/              # Imágenes de la aplicación
│
├── components/
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Card.jsx
│   │   ├── Badge.jsx
│   │   ├── Tooltip.jsx
│   │   ├── Spinner.jsx
│   │   ├── Avatar.jsx
│   │   └── Tabs.jsx
│   │
│   ├── layouts/
│   │   ├── AppLayout.jsx
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   │
│   ├── dashboard/
│   │   ├── StatsCard.jsx
│   │   ├── ActivityChart.jsx
│   │   ├── RecentTickets.jsx
│   │   └── QuickActions.jsx
│   │
│   ├── tickets/
│   │   ├── TicketList.jsx
│   │   ├── TicketCard.jsx
│   │   ├── TicketDetail.jsx
│   │   ├── TicketForm.jsx
│   │   └── TicketFilters.jsx
│   │
│   ├── chat/
│   │   └── ChatWindow.jsx
│   │
│   ├── notifications/
│   │   └── NotificationCenter.jsx
│   │
│   ├── users/
│   │   ├── UserList.jsx
│   │   └── UserProfile.jsx
│   │
│   ├── remote/
│   │   └── RemoteViewer.jsx
│   │
│   └── settings/
│       ├── ThemeToggle.jsx
│       └── ProfileSettings.jsx
│
├── context/
│   ├── AuthContext.jsx
│   ├── ThemeContext.jsx
│   └── WebSocketContext.jsx
│
├── hooks/
│   ├── useAuth.js
│   ├── useTheme.js
│   ├── useWebSocket.js
│   ├── useNotifications.js
│   ├── useOfflineSync.js
│   └── useLocalStorage.js
│
├── pages/
│   ├── Login.jsx
│   ├── Home.jsx
│   ├── Dashboard.jsx
│   ├── Tickets.jsx
│   ├── TicketDetail.jsx
│   ├── Connections.jsx
│   ├── RemoteSession.jsx
│   ├── Users.jsx
│   ├── Profile.jsx
│   ├── Settings.jsx
│   ├── Reports.jsx
│   └── History.jsx
│
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── ticketService.js
│   ├── userService.js
│   ├── websocketService.js
│   └── offlineService.js
│
├── store/
│   ├── authStore.js
│   ├── themeStore.js
│   ├── notificationStore.js
│   └── connectionStore.js
│
├── utils/
│   ├── constants.js
│   ├── helpers.js
│   ├── validators.js
│   ├── formatters.js
│   └── permissions.js
│
├── styles/
│   └── animations.css
│
├── App.jsx
├── main.jsx
└── index.css

```

## ✅ Checklist de Configuración

- [ ] Instalar dependencias con `npm install`
- [ ] Crear archivo `.env` con variables necesarias
- [ ] Verificar que el backend está ejecutándose en `http://localhost:8080`
- [ ] Iniciar servidor con `npm run dev`
- [ ] Acceder a `http://localhost:5173`
- [ ] Probar login con credenciales de prueba
- [ ] Verificar que WebSocket se conecta correctamente
- [ ] Probar diferentes roles (Admin, Técnico, Cliente)

## 🔌 API Endpoints Esperados

El proyecto espera que el backend expose estos endpoints:

### Autenticación
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/register`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`
- `POST /api/auth/refresh-token`

### Tickets
- `GET /api/tickets`
- `GET /api/tickets/:id`
- `POST /api/tickets`
- `PUT /api/tickets/:id`
- `POST /api/tickets/:id/close`
- `POST /api/tickets/:id/assign`

### Usuarios
- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

### WebSocket Events
- `connect`
- `disconnect`
- `message`
- `notification`
- `ticket-update`
- `connection-started`
- `connection-ended`

## 🎨 Personalización

### Cambiar Colores Primarios
Edita `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: {
        500: '#tu-color',
        600: '#tu-color',
        700: '#tu-color',
      }
    }
  }
}
```

### Cambiar Tema por Defecto
Edita `src/context/ThemeContext.jsx`:
```js
const prefersDark = true // true para oscuro, false para claro
```

### Cambiar Timeout de Sesión
Edita `.env`:
```env
VITE_SESSION_TIMEOUT=3600000  # 1 hora en milisegundos
```

## 🧪 Testing

Para agregar tests:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

Luego crea archivos `.test.jsx` en los componentes.

## 📱 PWA (Progressive Web App)

Para convertir en PWA, instala:
```bash
npm install vite-plugin-pwa
```

Y configura en `vite.config.js`.

## 🔐 Seguridad

Recuerda:
- Nunca commiteés archivos `.env` con datos sensibles
- Usa HTTPS en producción
- Valida siempre en servidor
- Implementa CORS correctamente
- Usa tokens JWT con expiración
- Implementa rate limiting en backend

## 🚀 Deployment

### Vercel
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# Sube la carpeta 'dist' a Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "dev"]
```

## 📚 Recursos Útiles

- [Documentación React](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Socket.io Client](https://socket.io/docs/v4/client-api/)

## 🐛 Troubleshooting

### "Cannot find module '@components'"
Asegúrate de que `vite.config.js` tiene los alias configurados correctamente.

### WebSocket no conecta
Verifica que:
- El backend está ejecutándose
- La URL en `.env` es correcta
- El CORS está habilitado en el backend

### Tailwind CSS no funciona
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Puerto 5173 en uso
```bash
npm run dev -- --port 3000
```

## 💡 Tips & Tricks

1. **Usar React DevTools**: Instala la extensión del navegador
2. **Keyboard Shortcuts**: `Ctrl+K` para búsqueda en navegación
3. **Dark Mode**: Automático según preferencia del sistema
4. **Offline**: Los cambios se sincronizarán cuando regrese la conexión
5. **Performance**: Usa React DevTools para analizar renders

## 🎯 Próximos Pasos

1. [ ] Conectar con un backend real
2. [ ] Implementar pruebas unitarias
3. [ ] Agregar más validaciones
4. [ ] Implementar analytics
5. [ ] Agregar más idiomas (i18n)
6. [ ] Optimizar imágenes
7. [ ] Implementar caching mejorado

---

¡Listo para comenzar! Si tienes preguntas, consulta la documentación o contacta al equipo de desarrollo.
