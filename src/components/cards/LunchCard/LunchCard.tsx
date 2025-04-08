import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LunchCard.module.scss";
import LunchDetailItem from "../../ui/LunchDetailItem/LunchDetailItem";
import image from "../../../assets/images/image 3 (1).svg";
import cooking from "../../../assets/images/icons/cooking.svg";
import time from "../../../assets/images/icons/time.svg";
import people from "../../../assets/images/icons/people.svg";
import Button from "../../ui/Button/Button";

interface Lunch {
  id: string;
  place: string;
  time: string;
  participants: number;
  creator: string;
  buttonText: string;
}

interface LunchCardProps {
  lunch: Lunch;
}

const LunchCard: React.FC<LunchCardProps> = ({ lunch }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/lunch/${lunch.id}`);
  };

  return (
    <div key={lunch.id} className={styles["lunch-card"]}>
      <h2 className={styles["lunch-card__title"]}>Обед от {lunch.creator}</h2>
      <div className={styles["lunch-card__content"]}>
        <ul className={styles["lunch-card__info"]}>
          <LunchDetailItem value={lunch.place} iconSrc={cooking} />
          <LunchDetailItem value={lunch.time} iconSrc={time} />
          <LunchDetailItem value={`${lunch.participants} участника`} iconSrc={people} />
        </ul>
        <img
          src={image}
          alt="Обед"
          className={styles["lunch-card__image"]}
        />
      </div>
      <Button
        onClick={handleClick}
        style={{ height: "45px", fontWeight: 500, fontSize: ".875rem", color: "#000" }}
      >
        {lunch.buttonText}
      </Button>
    </div>
  );
};

export default LunchCard;
