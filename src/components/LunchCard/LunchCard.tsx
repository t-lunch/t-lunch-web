import React from "react";
import styles from "./LunchCard.module.scss";

interface Lunch {
  id: string;
  place: string;
  time: string;
  participants: number;
  creator: string;
}

interface LunchCardProps {
  lunch: Lunch;
}

const LunchCard: React.FC<LunchCardProps> = ({ lunch }) => {
  return (
    <div key={lunch.id} className={styles["lunch-card"]}>
      <img
        src="https://via.placeholder.com/100"
        alt="Обед"
        className={styles["lunch-card__image"]}
      />

      <h2 className={styles["lunch-card__title"]}>Обед от {lunch.creator}</h2>

      <div className={styles["lunch-card__info"]}>
        <p>{lunch.place}</p>
        <p>{lunch.time}</p>
        <p>{lunch.participants} участника</p>
      </div>

      <button className={styles["join-button"]}>Присоединиться</button>
    </div>
  );
};

export default LunchCard;
