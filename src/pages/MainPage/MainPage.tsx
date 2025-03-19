import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getLunches } from "../../api/lunchesAPI";
import { Link } from "react-router-dom";
import PageTitle from "../../components/ui/PageTitle/PageTitle";
import Button from "../../components/ui/Button/Button";
import LunchCard from "../../components/cards/LunchCard/LunchCard";
import styles from "./MainPage.module.scss";

interface Lunch {
  id: string;
  time: string;
  place: string;
  participants: number;
  creator: string;
}

const MainPage: React.FC = () => {
  const { data: lunches, isLoading, error } = useQuery<Lunch[]>({
    queryKey: ["lunches"],
    queryFn: async () => await getLunches(),
    initialData: [],
  });

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки</div>;

  return (
    <div className={styles["main-page"]}>
      <PageTitle>Поиск партнёра для обеда</PageTitle>

      <div className={styles["main-page__create"]}>
        <Link to="/create-lunch">
          <Button
            type="submit"
            style={{
              textTransform: "uppercase",
              fontSize: "1.25rem",
              fontWeight: 700,
              letterSpacing: "0px",
            }}
          >
            Создать
          </Button>
        </Link>
      </div>

      <div className={styles["lunch-list"]}>
        {lunches?.map((lunch) => (
          <LunchCard key={lunch.id} lunch={{...lunch, buttonText: "Присоединиться"}} />
        ))}
      </div>
    </div>
  );
};

export default MainPage;
