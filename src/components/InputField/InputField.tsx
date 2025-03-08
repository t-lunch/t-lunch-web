import React from "react";
import styles from "./InputField.module.scss";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

interface InputFieldProps {
  placeholder: string;
  register: any;
  error?: { message?: string } | null;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({ placeholder, register, error, type = "text" }) => {
  return (
    <div className={styles["input-wrapper"]}>
      <input
        type={type}
        placeholder={placeholder}
        className={`${error ? styles["input-error"] : ""}`}
        {...register}
      />
      <ErrorMessage error={error} />
    </div>
  );
};

export default InputField;
