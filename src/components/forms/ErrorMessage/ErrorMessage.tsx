import React from "react";
import styles from "./ErrorMessage.module.scss";

interface ErrorObject {
  message?: string;
}

interface ErrorMessageProps {
  error?: ErrorObject | string | null;
  className?: string; 
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, className }) => {
  let errorText = "";

  if (typeof error === "string") {
    errorText = error;
  } else if (error && typeof error === "object") {
    errorText = error.message?.trim() ? error.message : "Это поле обязательно";
  }

  // console.log("ErrorMessage received error:", error);

  return (
    <div className={`${styles["error-container"]} ${className || ""}`.trim()}>
      {errorText && <span className={styles["error-message"]}>{errorText}</span>}
    </div>
  );
};

export default ErrorMessage;
