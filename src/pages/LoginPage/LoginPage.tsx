import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../../store/authSlice";
import { login as loginAPI } from "../../api/authAPI";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import LinkText from "../../components/LinkText/LinkText";
import AuthLink from "../../components/AuthLink/AuthLink";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
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
  const [serverError, setServerError] = useState<string | null>(null);
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
    } catch (error: any) {
      setServerError(error.message);
    }
  };

  return (
    <div className={styles["login-container"]}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Авторизация</h2>

        <InputField
          placeholder="Ваш логин"
          register={register("username", { required: true })}
          error={errors.username}
        />

        <InputField
          type="password"
          placeholder="Ваш пароль"
          register={register("password", { required: true })}
          error={errors.password}
        />

        
        <div className={styles["error-link-container"]}>
          <ErrorMessage error={serverError ? { message: serverError } : null}/>
          <LinkText text="Забыли пароль?" to="/forgot-password" />
        </div>


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
