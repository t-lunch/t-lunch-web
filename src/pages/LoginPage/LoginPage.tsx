import React from 'react';
import { useForm } from 'react-hook-form';  
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../../store/authSlice';
import { login as loginAPI } from '../../api/authAPI';
import './LoginPage.module.scss';

interface LoginFormInputs {
  username: string;
  password: string;
}


const LoginPage = () => { 
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
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
  }

  return (
    <div className="login-page">
      <h2>Авторизация</h2>
      <form onSubmit={handleSubmit(onSubmit)}> 
        <input placeholder='Логин' {...register('username', {required: true})} />
        {errors.username && <span>Это поле обязательно</span>}
        <input placeholder='Пароль' type='password' {...register('password', {required: true})} />
        {errors.password && <span>Это поле обязательно</span>}
      </form>
    </div>
  );
}

export default LoginPage;