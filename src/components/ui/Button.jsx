// Importo React para poder crear mi componente funcional
import React from "react";

/**
 * Componente: Button
 * -------------------
 * En este archivo creo un botón reutilizable y personalizable
 * que puedo usar en diferentes partes del proyecto.
 * Le agrego propiedades (props) para que sea dinámico:
 * - children: el contenido del botón (texto o ícono)
 * - onClick: la función que se ejecuta al hacer clic
 * - type: el tipo de botón (por defecto es "button")
 * - variant: el estilo del botón (por defecto es "primary")
 * - disabled: si quiero desactivarlo temporalmente
 */
const Button = ({
  children,          // Aquí recibo el texto o ícono que irá dentro del botón
  onClick,           // Aquí recibo la función que se ejecutará al dar clic
  type = "button",   // Defino el tipo de botón (por defecto "button")
  variant = "primary", // Establezco la variante visual (primary, secondary o danger)
  disabled = false,  // Indico si el botón estará deshabilitado o no
}) => {

  // Defino las clases base que quiero que tengan todos mis botones
  const baseStyles =
    "px-4 py-2 rounded-lg font-semibold transition-colors duration-200";

  // Aquí creo un objeto con las variantes de color y estilo para los botones
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",       // Botón principal
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",  // Botón secundario
    danger: "bg-red-600 text-white hover:bg-red-700",          // Botón de acción peligrosa
  };

  // Retorno el elemento button con las clases y propiedades configuradas
  return (
    <button
      type={type}                      // Aplico el tipo de botón
      onClick={onClick}                // Asigno la función del clic
      disabled={disabled}              // Si está deshabilitado, aplico su estado
      className={`${baseStyles} ${variants[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : "" // Cambio el aspecto cuando está deshabilitado
      }`}
    >
      {/* Uso children para mostrar dentro del botón el contenido que yo elija */}
      {children}
    </button>
  );
};

// Exporto mi componente para poder reutilizarlo en otras partes del proyecto
export default Button;
