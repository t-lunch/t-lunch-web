import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import InputField from "../../components/layout/InputField/InputField";
import FormLabel from "../../components/forms/FormLabel/FormLabel";
import Button from "../../components/ui/Button/Button";
import SelectField from "../../components/forms/SelectField/SelectField";
import ErrorMessage from "../../components/forms/ErrorMessage/ErrorMessage";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../../api/userApi";
import styles from "../LoginPage/LoginPage.module.scss";

interface ProfileFormInputs {
  firstName: string;
  lastName: string;
  telegram: string;
  office: string;
  passwordConfirm: string;
}

const ProfilePage: React.FC = () => {
  const userId = useSelector((s: RootState) => s.auth.userId!);
  const [editMode, setEditMode] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: initialData, isLoading, error } = useGetProfileQuery(userId, {
    skip: !userId,
  });
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormInputs>({
    defaultValues: {
      firstName: "",
      lastName: "",
      telegram: "",
      office: "",
      passwordConfirm: "",
    },
  });

  const passwordRef = useRef<HTMLInputElement>(null);

  // Как только initialData придёт — сбрасываем форму
  useEffect(() => {
    if (initialData) {
      reset({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        telegram: initialData.telegram,
        office: initialData.office,
        passwordConfirm: "",
      });
    }
  }, [initialData, reset]);

  // Фокус на пароль при редактировании
  useEffect(() => {
    if (editMode) {
      setTimeout(() => passwordRef.current?.focus(), 0);
    }
  }, [editMode]);

  const onSubmit = async (data: ProfileFormInputs) => {
    setServerError(null);

    // проверяем пароль
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const me: any = users.find((u: any) => u.username === userId);
    if (!me) {
      setServerError("Пользователь не найден");
      return;
    }
    if (data.passwordConfirm !== me.password) {
      setServerError("Неверный пароль");
      return;
    }

    // обновляем
    try {
      const updated = await updateProfile({
        userId,
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          telegram: data.telegram,
          office: data.office,
        },
      }).unwrap();

      reset({
        firstName: updated.firstName,
        lastName: updated.lastName,
        telegram: updated.telegram,
        office: updated.office,
        passwordConfirm: "",
      });
      setEditMode(false);
    } catch (err: any) {
      setServerError(err.message || "Ошибка сервера");
    }
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (error || !initialData) return <div>Ошибка загрузки профиля</div>;

  return (
    <div className={styles["register-page"]}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Профиль</h2>

        <FormLabel>Имя</FormLabel>
        <InputField
          placeholder={initialData.firstName}
          readOnly={!editMode}
          register={register("firstName", { required: "Обязательное поле" })}
          error={errors.firstName}
        />

        <FormLabel>Фамилия</FormLabel>
        <InputField
          placeholder={initialData.lastName}
          readOnly={!editMode}
          register={register("lastName", { required: "Обязательное поле" })}
          error={errors.lastName}
        />

        <FormLabel>Telegram</FormLabel>
        <InputField
          placeholder={initialData.telegram}
          readOnly={!editMode}
          register={register("telegram", { required: "Обязательное поле" })}
          error={errors.telegram}
        />

        <SelectField
          label="Офис"
          options={[
            { value: "office1", label: "Office 1" },
            { value: "office2", label: "Office 2" },
          ]}
          register={register("office", { required: "Обязательное поле" })}
          error={errors.office ? { message: errors.office.message } : null}
          disabled={!editMode}
        />

        {editMode && (
          <>
            <FormLabel>Подтвердите пароль</FormLabel>
            <InputField
              type="password"
              placeholder="Текущий пароль"
              register={register("passwordConfirm", {
                required: "Укажите пароль",
              })}
              error={errors.passwordConfirm}
              readOnly={false}
            />
          </>
        )}

        <ErrorMessage error={serverError ? { message: serverError } : null} />

        {editMode ? (
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Сохраняем..." : "Сохранить изменения"}
          </Button>
        ) : (
          <Button type="button" onClick={() => setEditMode(true)}>
            Редактировать профиль
          </Button>
        )}
      </form>
    </div>
  );
};

export default ProfilePage;
