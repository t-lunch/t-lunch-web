import React from "react";
import { useForm } from "react-hook-form";
import { register as registerAPI } from "../../api/authAPI";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/InputField/InputField";
import FormLabel from "../../components/FormLabel/FormLabel";
import Button from "../../components/Button/Button";
import AuthLink from "../../components/AuthLink/AuthLink";
import SelectField from "../../components/SelectField/SelectField";

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
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      await registerAPI(data);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>

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

        <Button type="submit" disabled={isSubmitting}>Зарегистрироваться</Button>

        <AuthLink text="Уже есть аккаунт?" linkText="Войти" to="/login" />
      </form>
    </div>
  );
};

export default RegisterPage;
