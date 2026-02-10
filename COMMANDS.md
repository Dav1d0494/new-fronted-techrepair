# 🎯 Comandos Útiles - TechRepair Frontend

## 🚀 Desarrollo

### Instalar dependencias
```bash
npm install
```

### Iniciar servidor de desarrollo
```bash
npm run dev
```
La aplicación estará en `http://localhost:5173`

### Parar servidor
```bash
Ctrl + C
```

## 🔨 Build

### Crear build de producción
```bash
npm run build
```
Genera carpeta `dist/` lista para deployar

### Preview del build
```bash
npm run preview
```

## 📊 Linting

### Ejecutar ESLint
```bash
npm run lint
```

### Ejecutar ESLint con fix
```bash
npm run lint -- --fix
```

## 📦 Gestión de Dependencias

### Instalar paquete específico
```bash
npm install nombre-paquete
```

### Instalar dev dependency
```bash
npm install --save-dev nombre-paquete
```

### Actualizar dependencias
```bash
npm update
```

### Ver dependencias desactualizadas
```bash
npm outdated
```

### Auditar seguridad
```bash
npm audit
npm audit fix
```

## 🌐 Port Management

### Si el puerto 5173 está en uso
```bash
npm run dev -- --port 3000
```

### Ver qué proceso usa un puerto (Windows)
```powershell
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Ver qué proceso usa un puerto (Mac/Linux)
```bash
lsof -i :5173
kill -9 <PID>
```

## 🔄 Git

### Inicializar repositorio
```bash
git init
```

### Clonar repositorio
```bash
git clone <url>
```

### Ver estado
```bash
git status
```

### Agregar cambios
```bash
git add .
```

### Hacer commit
```bash
git commit -m "Descripción de cambios"
```

### Push a remote
```bash
git push origin main
```

### Pull cambios
```bash
git pull origin main
```

### Ver historial
```bash
git log --oneline
```

### Crear rama
```bash
git checkout -b nombre-rama
```

## 🧪 Testing (cuando se agregue)

### Ejecutar tests
```bash
npm test
```

### Tests con coverage
```bash
npm test -- --coverage
```

### Tests en watch mode
```bash
npm test -- --watch
```

## 📈 Performance

### Analizar bundle
```bash
npm install -g rollup-plugin-visualizer
# Agregar a vite.config.js y ejecutar build
```

### Lighthouse audit
```bash
# Usar DevTools del navegador > Lighthouse
```

## 🐛 Debugging

### Chrome DevTools
- Abrir DevTools: `F12` o `Ctrl+Shift+I`
- Sources, Console, Network tabs
- React DevTools extension
- Redux DevTools (si se usa)

### VS Code Debugger
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

## 📝 Editoriales Rápidas

### Formatear código (si tienes Prettier)
```bash
npm install -D prettier
npx prettier --write src/
```

### Ver configuración
```bash
npm list -g
```

### Clean install
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🌍 Deployment

### Vercel
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy
```

### Docker
```bash
docker build -t techrepair .
docker run -p 5173:5173 techrepair
```

## 📚 Ayuda

### Ver versión de npm
```bash
npm --version
```

### Ver versión de Node
```bash
node --version
```

### Info de npm
```bash
npm config list
```

### Ayuda de comando
```bash
npm help <comando>
```

## 🔧 Troubleshooting Commands

### Problema con módulos
```bash
rm -rf node_modules package-lock.json
npm install
```

### Limpiar cache npm
```bash
npm cache clean --force
```

### Actualizar npm
```bash
npm install -g npm@latest
```

### Verificar Node/npm
```bash
node --version
npm --version
```

## 💡 Combinaciones Útiles

### Desarrollo + Watch
```bash
npm run dev
# En otra terminal
npm run lint -- --watch
```

### Build y preview
```bash
npm run build && npm run preview
```

### Development con debugging
```bash
node --inspect-brk node_modules/.bin/vite
```

## 🎯 Quick Workflows

### Workflow típico de desarrollo
```bash
1. npm run dev                  # Iniciar servidor
2. Editar archivos             # En editor
3. Auto-reload en navegador    # Automático
4. npm run lint -- --fix       # Cuando termines
5. git add . && git commit -m ""
6. git push
```

### Workflow antes de deployar
```bash
1. npm run lint
2. npm run build
3. npm run preview
4. Verificar en navegador
5. npm audit
6. Commit y push
```

## 📋 Tareas Frecuentes

### Agregar nueva dependencia
```bash
npm install nombre-paquete
git add package.json package-lock.json
git commit -m "Add: nombre-paquete"
```

### Eliminar dependencia
```bash
npm uninstall nombre-paquete
npm audit fix
```

### Actualizar todas las dependencias
```bash
npm update
npm audit fix
```

### Ver qué cambió
```bash
git diff
git status
```

---

**Tip:** Guarda estos comandos como alias en tu shell para ir más rápido

### Ejemplo de alias .bashrc/.zshrc:
```bash
alias nr="npm run"
alias nd="npm run dev"
alias nb="npm run build"
alias nl="npm run lint"
```

Luego puedes usar:
```bash
nr dev    # en lugar de npm run dev
```
