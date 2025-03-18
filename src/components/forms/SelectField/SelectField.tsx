import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import FormLabel from "../FormLabel/FormLabel";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import styles from "./SelectField.module.scss";

interface SelectFieldProps {
  label: string;
  options: { value: string; label: string }[];
  register: UseFormRegisterReturn;
  error?: { message?: string } | null;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, options, register, error }) => {
  return (
    <div className={styles["select-wrapper"]}>
      <FormLabel>{label}</FormLabel>
      <select {...register} className={`${styles.select} ${error ? styles["input-error"] : ""}`}>
        <option value="">Выберите {label.toLowerCase()}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ErrorMessage error={error} />
    </div>
  );
};

export default SelectField;
