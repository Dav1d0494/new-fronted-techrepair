import React from "react";
// Usamos useLocation para determinar el elemento activo de forma dinámica
import { Link, useLocation } from "react-router-dom"; 
// Asumiendo que Icon es un componente funcional
import Icon from "./ui/Icon";

// Nota: Eliminamos la prop 'activeRoute' ya que usaremos useLocation()
const Sidebar = () => { 
  const location = useLocation(); // Hook para obtener la ruta actual

  const menuItems = [
    // Añadimos la ruta (path) explícita para la comparación
    { name: "Inicio", icon: "FaHome", path: "/inicio" },
    { name: "Conexiones", icon: "FaNetworkWired", path: "/conexiones" },
    { name: "Historial", icon: "FaHistory", path: "/historial" },
    { name: "Configuración", icon: "FaCog", path: "/configuracion" },
  ];

  return (
    // CAMBIO CLAVE 1: Usar la clase CSS global 'sidebar'.
    // Eliminamos h-screen, flex y justify-between porque '.sidebar' en App.css
    // ya tiene 'min-height: 100vh; display: flex; flex-direction: column;'
    <aside className="sidebar">
      <div>
        {/* Dejamos 'flex items-center gap-3' porque estas clases de utilidad
            solo ayudan a alinear el icono y el título del logo, y no interfieren
            con el estilo principal del sidebar. */}
        <div className="flex items-center gap-3 mb-6">
          <Icon name="FaTools" size={24} color="#6c47ff" /> {/* Usar purple-main */}
          <h2 className="logo-text">TechRepair</h2> {/* Usa la clase logo-text */}
        </div>

        {/* Eliminamos 'space-y-1' porque el margen lo da '.sidebar a' */}
        <nav> 
          {menuItems.map((item) => {
            // Normalizamos y obtenemos la ruta de comparación
            const path = item.path; 
            // Determinamos si la ruta actual comienza con la ruta del ítem
            const isActive = location.pathname.startsWith(path); 

            return (
              <Link
                key={path}
                to={path}
                // CAMBIO CLAVE 2: Solo aplicamos la clase 'active' si corresponde.
                // Todas las demás propiedades de diseño (flex, padding, hover, transition) 
                // son manejadas por la regla CSS '.sidebar a' en App.css.
                className={isActive ? 'active' : ''} 
              >
                {/* Ajustamos el color del icono en función del estado activo */}
                <Icon 
                    name={item.icon} 
                    size={18} 
                    color={isActive ? "#6c47ff" : "#6b7280"} // purple-main o text-muted
                />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Botón de cerrar sesión y versión */}
      <div className="border-t border-gray-200 pt-4"> 
        {/* CAMBIO CLAVE 3: Botón sin clases de Tailwind. '.sidebar button' maneja el estilo */}
        <button> 
          <Icon name="FaSignOutAlt" size={18} color="#6b7280" />
          <span className="font-medium">Cerrar sesión</span>
        </button>
        {/* Clase 'text-muted' definida en App.css */}
        <p className="text-xs text-center text-muted mt-3">Versión 1.0.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
