import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { register as registerAPI } from "../../api/authAPI";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/layout/InputField/InputField";
import FormLabel from "../../components/forms/FormLabel/FormLabel";
import Button from "../../components/ui/Button/Button";
import AuthLink from "../../components/ui/AuthLink/AuthLink";
import SelectField from "../../components/forms/SelectField/SelectField";
import ErrorMessage from "../../components/forms/ErrorMessage/ErrorMessage";
import styles from "../LoginPage/LoginPage.module.scss";

interface RegisterFormInputs {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  telegram: string;
  office: string;
}

const RegisterPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormInputs>();
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      await registerAPI(data);
      navigate("/login");
    } catch (error: any) {
      setServerError(error.message);
    }
  };

  return (
    <div className={styles["register-page"]}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Регистрация</h2>
        
        <FormLabel>Имя</FormLabel>
        <InputField
          placeholder="Введите имя"
          register={register("firstName", { required: true })}
          error={errors.firstName}
        />

        <FormLabel>Фамилия</FormLabel>
        <InputField
          placeholder="Введите фамилию"
          register={register("lastName", { required: true })}
          error={errors.lastName}
        />

        <FormLabel>Логин</FormLabel>
        <InputField
          placeholder="Введите логин"
          register={register("username", { required: true })}
          error={errors.username}
        />

        <FormLabel>Пароль</FormLabel>
        <InputField
          type="password"
          placeholder="Введите пароль"
          register={register("password", { required: true, minLength: 6 })}
          error={errors.password}
        />

        <FormLabel>Telegram</FormLabel>
        <InputField
          placeholder="Введите Telegram"
          register={register("telegram", { required: true })}
          error={errors.telegram}
        />

        <SelectField
          label="Офис"
          options={[
            { value: "office1", label: "Office 1" },
            { value: "office2", label: "Office 2" },
          ]}
          register={register("office", { required: "Обязательное поле" })}
          error={errors.office?.message}
        />

        <ErrorMessage error={serverError ? { message: serverError } : null} />

        <Button type="submit" disabled={isSubmitting}>Зарегистрироваться</Button>

        <AuthLink text="Уже есть аккаунт?" linkText="Войти" to="/login" />
      </form>
    </div>
  );
};

export default RegisterPage;
