import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { getLunchById, joinLunch } from "../../api/lunchesAPI";
import PageTitle from "../../components/ui/PageTitle/PageTitle";
import Container from "../../components/layout/Container/Container";
import Button from "../../components/ui/Button/Button";
import SectionLabel from "../../components/ui/SectionLabel/SectionLabel";
import styles from "./LunchInfoPage.module.scss";

interface Lunch {
  id: string;
  time: string;
  place: string;
  note?: string;
  participants: number;
  creator: string;
}

const LunchInfoPage: React.FC = () => {
  const { lunchId } = useParams();
  const navigate = useNavigate();

  const { data: lunch, isLoading, isError } = useQuery({
    queryKey: ["lunch", lunchId],
    queryFn: () => {
      if (!lunchId) {
        return Promise.reject(new Error("Отсутствует идентификатор обеда"));
      }
      return getLunchById(lunchId);
    },
    enabled: Boolean(lunchId),
  });
  
  const mutation = useMutation({
    mutationFn: (id: string) => joinLunch(id),
    onSuccess: () => {
      navigate("/");
    },
  });

  const isLunchPassed = (lunchTime?: string): boolean => {
    if (!lunchTime) return false;
    const [hours, minutes] = lunchTime.split(":").map(Number);
    const now = new Date();
    const lunchDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    );
    return now > lunchDate;
  };
  

  const handleJoin = () => {
    if (!lunchId) return;
    mutation.mutate(lunchId);
  };

  if (isLoading) {
    return <div className={styles["loading"]}>Загрузка...</div>;
  }

  if (isError || !lunch) {
    return <div className={styles["error"]}>Ошибка при загрузке обеда</div>;
  }

  const lunchPassed = isLunchPassed(lunch.time);

  return (
    <div className={styles["lunch-info"]}>
      <PageTitle>Информация об обеде</PageTitle>
      <Container className={styles["lunch-info__container"]}>
        <h2 className={styles["lunch-info__title"]}>
          Обед от {lunch.creator}
        </h2>
        <div className={styles["lunch-info__details"]}>
          <div className={styles["lunch-info__detail-item"]}>
            <span className={styles["lunch-info__icon"]}>⏰</span>
            <span>{lunch.time}</span>
          </div>
          <div className={styles["lunch-info__detail-item"]}>
            <span className={styles["lunch-info__icon"]}>🏠</span>
            <span>{lunch.place}</span>
          </div>
          <div className={styles["lunch-info__detail-item"]}>
            <span className={styles["lunch-info__icon"]}>👥</span>
            <span>{lunch.participants} участника</span>
          </div>
        </div>
        <SectionLabel>Примечания</SectionLabel>
        <div className={styles["lunch-info__note"]}>
          {lunch.note || "Нет примечаний"}
        </div>
        {!lunchPassed && (
          <Button 
            type="button"
            onClick={handleJoin}
            disabled={mutation.isLoading}
            emphasized
          >
            Присоединиться
          </Button>
        )}
      </Container>
    </div>
  );
};

export default LunchInfoPage;
