import React from "react";
import "./FormLabel.module.scss";

interface FormLabelProps {
  children: React.ReactNode;
}

const FormLabel: React.FC<FormLabelProps> = ({ children }) => {
  return <h3>{children}</h3>;
};

export default FormLabel;
