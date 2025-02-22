import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import FormLabel from "../FormLabel/FormLabel";
import styles from "./SelectField.module.scss";

interface SelectFieldProps {
  label: string;
  options: { value: string; label: string }[];
  register: UseFormRegisterReturn;
  error?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, options, register, error }) => {
  return (
    <div className={styles["select-wrapper"]}>
      <FormLabel>{label}</FormLabel>
      <select {...register} className={error ? styles["input-error"] : styles.select}>
        <option value="">Выберите {label.toLowerCase()}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className={styles["error-message"]}>{error.message || "Это поле обязательно"}</span>}
    </div>
  );
};

export default SelectField;
