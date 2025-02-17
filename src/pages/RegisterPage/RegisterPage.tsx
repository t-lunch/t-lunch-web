import React from 'react';
import { useForm } from 'react-hook-form';
import { register as registerAPI } from '../../api/authAPI';
import { useNavigate } from 'react-router-dom';


interface RegisterFormInputs {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  telegram: string;
  office: number;
}

const RegisterPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      await registerAPI(data);
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  }
  
  return (
    <div className="register-page">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="Имя" {...register('firstName', { required: true })} />
        {errors.firstName && <span>Обязательное поле</span>}
        <input placeholder="Фамилия" {...register('lastName', { required: true })} />
        {errors.lastName && <span>Обязательное поле</span>}
        <input placeholder="Логин" {...register('username', { required: true })} />
        {errors.username && <span>Обязательное поле</span>}
        <input type="password" placeholder="Пароль" {...register('password', { required: true, minLength: 6 })} />
        {errors.password && <span>Пароль должен быть минимум 6 символов</span>}
        <input placeholder="Telegram" {...register('telegram', { required: true })} />
        {errors.telegram && <span>Обязательное поле</span>}
        <select {...register('office', { required: true })}>
          <option value="">Выберите офис</option>
          <option value="office1">Office 1</option>
          <option value="office2">Office 2</option>
        </select>
        {errors.office && <span>Обязательное поле</span>}
        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  )
}

export default RegisterPage;