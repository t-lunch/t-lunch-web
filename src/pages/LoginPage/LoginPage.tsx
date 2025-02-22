import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../../store/authSlice";
import { login as loginAPI } from "../../api/authAPI";
import InputField from "../../components/InputField/InputField";
import FormLabel from "../../components/FormLabel/FormLabel";
import Button from "../../components/Button/Button";
import LinkText from "../../components/LinkText/LinkText";
import AuthLink from "../../components/AuthLink/AuthLink";
import styles from "./LoginPage.module.scss";

interface LoginFormInputs {
  username: string;
  password: string;
}

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await loginAPI(data);
      const { accessToken, refreshToken, userId } = response.data;
      dispatch(setCredentials({ accessToken, refreshToken, userId }));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      navigate("/");
    } catch (error) {
      console.error("login error:", error);
    }
  };

  return (
    <div className={styles["login-container"]}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Авторизация</h2>

        <FormLabel>Логин</FormLabel>
        <InputField
          placeholder="Ваш логин"
          register={register("username", { required: true })}
          error={errors.username}
        />

        <FormLabel>Пароль</FormLabel>
        <InputField
          type="password"
          placeholder="Ваш пароль"
          register={register("password", { required: true })}
          error={errors.password}
        />

        <LinkText text="Забыли пароль?" to="/forgot-password" />

        <Button type="submit" disabled={isSubmitting}>
          Войти
        </Button>

        <AuthLink
          text="Нет аккаунта?"
          linkText="Зарегистрироваться"
          to="/register"
        />
      </form>
    </div>
  );
};

export default LoginPage;
