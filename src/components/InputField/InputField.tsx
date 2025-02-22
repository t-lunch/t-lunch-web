import React from "react";
import { FieldError } from "react-hook-form";
import styles from "./InputField.module.scss";

interface InputFieldProps {
  type?: string;
  placeholder: string;
  error?: FieldError;
  register: any;
}

const InputField: React.FC<InputFieldProps> = ({ type = "text", placeholder, error, register }) => {
  return (
    <div className={styles["input-wrapper"]}>
      <input type={type} placeholder={placeholder} className={error ? styles["input-error"] : ""} {...register} />
      {error && <span className={styles["error-message"]}>{error.message || "Это поле обязательно"}</span>}
    </div>
  );
};

export default InputField;
