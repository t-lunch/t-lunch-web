import React from "react";
import styles from "./Button.module.scss"; 

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  emphasized?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  emphasized,
  className,
  style,
  ...props
}) => {
  const emphasizedStyle: React.CSSProperties = emphasized
    ? {
        textTransform: "uppercase",
        fontSize: "1.25rem",
        fontWeight: 700,
        letterSpacing: "0px",
      }
    : {};

  return (
    <button
      className={`${styles.button} ${className ?? ""}`}
      style={{ ...emphasizedStyle, ...style }}
      {...props}
    >
      {children}
    </button>
  );
};


export default Button;
