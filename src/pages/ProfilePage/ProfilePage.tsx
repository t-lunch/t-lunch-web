import React, { useState, useEffect } from "react";
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
  UserProfile,
} from "../../api/userApi";
import styles from "../LoginPage/LoginPage.module.scss";

interface ProfileFormInputs {
  firstName: string;
  lastName: string;
  telegram: string;
  office: string;
}

const ProfilePage: React.FC = () => {
  const userId = useSelector((s: RootState) => s.auth.userId!);
  const [editMode, setEditMode] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    data: initialData,
    isLoading,
    error,
    refetch,
  } = useGetProfileQuery(userId, {
    skip: !userId,
    refetchOnMountOrArgChange: true,
  });

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormInputs>();

  useEffect(() => {
    if (initialData) {
      reset({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        telegram: initialData.telegram,
        office: initialData.office,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: ProfileFormInputs) => {
    setServerError(null);
    try {
      const updated = await updateProfile({ userId, data }).unwrap();
      reset({
        firstName: updated.firstName,
        lastName: updated.lastName,
        telegram: updated.telegram,
        office: updated.office,
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
          readOnly={!editMode}
          {...register("firstName", { required: "Обязательное поле" })}
          error={errors.firstName}
        />

        <FormLabel>Фамилия</FormLabel>
        <InputField
          readOnly={!editMode}
          {...register("lastName", { required: "Обязательное поле" })}
          error={errors.lastName}
        />

        <FormLabel>Telegram</FormLabel>
        <InputField
          readOnly={!editMode}
          {...register("telegram", { required: "Обязательное поле" })}
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

        <ErrorMessage error={serverError ? { message: serverError } : null} />

        {editMode ? (
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Сохраняем..." : "Сохранить"}
          </Button>
        ) : (
          <Button type="button" onClick={() => setEditMode(true)}>
            Сохранить изменения
          </Button>
        )}
      </form>
    </div>
  );
};

export default ProfilePage;
