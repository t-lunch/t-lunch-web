import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLunches } from "../../api/lunchesAPI";
import PageTitle from "../../components/ui/PageTitle/PageTitle";
import Search from "../../components/ui/Search/Search";
import LunchCard from "../../components/cards/LunchCard/LunchCard";
import styles from "../MainPage/MainPage.module.scss";

interface Lunch {
  id: string;
  time: string;
  place: string;
  participants: number;
  creator: string;
}

const MyLunchesPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const {
    data: lunches,
    isLoading,
    error,
  } = useQuery<Lunch[]>({
    queryKey: ["lunches"],
    queryFn: async () => await getLunches(),
    initialData: [],
  });
  
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Ищем:', searchValue);
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки</div>;

  return (
    <div className={styles["main-page"]}>
      <PageTitle>История обедов</PageTitle>

      <div className={styles["mylunch-page__create"]}>
        <form onSubmit={handleSearchSubmit}>
          <Search
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Поиск по сайту"
          />
        </form>
      </div>

      <div className={styles["lunch-list"]}>
        {lunches?.map((lunch) => (
          <LunchCard key={lunch.id} lunch={{...lunch, buttonText: "Посмотреть подробную информацию"}} />
        ))}
      </div>
    </div>
  );
};

export default MyLunchesPage;
