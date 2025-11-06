import React from "react";
import * as Icons from "react-icons/fa";

const Icon = ({ name, size = 20, color = "white" }) => {
  const IconComponent = Icons[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} color={color} />;
};

export default Icon;
