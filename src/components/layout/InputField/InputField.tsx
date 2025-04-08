import React from "react";
import styles from "./InputField.module.scss";
import ErrorMessage from "../../forms/ErrorMessage/ErrorMessage";

interface InputFieldProps {
  placeholder: string;
  register?: any;
  error?: { message?: string } | null;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ placeholder, register, error, type = "text", onChange, value }) => {
  return (
    <div className={styles["input-wrapper"]}>
      <input
        type={type}
        placeholder={placeholder}
        className={`${error ? styles["input-error"] : ""}`}
        {...register}
        value={value}
        onChange={onChange}
      />
      <ErrorMessage error={error} />
    </div>
  );
};

export default InputField;
