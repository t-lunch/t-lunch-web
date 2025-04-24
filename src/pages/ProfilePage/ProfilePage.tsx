import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import InputField from "../../components/layout/InputField/InputField";
import FormLabel from "../../components/forms/FormLabel/FormLabel";
import Button from "../../components/ui/Button/Button";
import SelectField from "../../components/forms/SelectField/SelectField";
import ErrorMessage from "../../components/forms/ErrorMessage/ErrorMessage";
import { useGetProfileQuery } from "../../api/userApi";
import styles from "../LoginPage/LoginPage.module.scss";

interface ProfileFormInputs {
  firstName: string;
  lastName: string;
  username: string;
  telegram: string;
  office: string;
}

const ProfilePage: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.userId);
  const [editMode, setEditMode] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: initialData, isLoading, error } = useGetProfileQuery(userId!, { skip: !userId });

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ProfileFormInputs>({});

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: ProfileFormInputs) => {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const idx = users.findIndex((u: { username: string }) => u.username === userId);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...data };
        localStorage.setItem("users", JSON.stringify(users));
        reset(data);
        setEditMode(false);
        setServerError(null);
      }
    } catch (error) {
      setServerError(error instanceof Error ? error.message : String(error));
    }
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (error || !initialData) return <div>Ошибка загрузки профиля</div>;

  return (
    <div className={styles["register-page"]}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Профиль</h2>
        <FormLabel>Имя</FormLabel>
        {editMode ? (
          <InputField
            placeholder="Введите имя"
            register={register("firstName", { required: true })}
            error={errors.firstName}
          />
        ) : (
          <div>{initialData.firstName}</div>
        )}

        <FormLabel>Фамилия</FormLabel>
        {editMode ? (
          <InputField
            placeholder="Введите фамилию"
            register={register("lastName", { required: true })}
            error={errors.lastName}
          />
        ) : (
          <div>{initialData.lastName}</div>
        )}

        <FormLabel>Логин</FormLabel>
        <div>{initialData.username}</div>

        <FormLabel>Telegram</FormLabel>
        {editMode ? (
          <InputField
            placeholder="Введите Telegram"
            register={register("telegram", { required: true })}
            error={errors.telegram}
          />
        ) : (
          <div>{initialData.telegram}</div>
        )}

        <SelectField
          label="Офис"
          options={[
            { value: "office1", label: "Office 1" },
            { value: "office2", label: "Office 2" },
          ]}
          register={register("office", { required: "Обязательное поле" })}
          error={errors.office ? { message: errors.office.message } : null}
        />

        <ErrorMessage error={serverError ? { message: serverError } : null} />

        {editMode ? (
          <Button type="submit" disabled={isSubmitting}>Сохранить</Button>
        ) : (
          <Button type="button" onClick={() => setEditMode(true)}>Редактировать</Button>
        )}
      </form>
    </div>
  );
};

export default ProfilePage;
