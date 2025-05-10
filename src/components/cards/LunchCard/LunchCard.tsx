import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import styles from "./LunchCard.module.scss";
import LunchDetailItem from "../../ui/LunchDetailItem/LunchDetailItem";
import image from "../../../assets/images/image 3 (1).svg";
import cooking from "../../../assets/images/icons/cooking.svg";
import time from "../../../assets/images/icons/time.svg";
import people from "../../../assets/images/icons/people.svg";
import Button from "../../ui/Button/Button";

interface Participant { id: string; name: string }
interface Lunch {
  id: string;
  place: string;
  time: string;
  participants: number;
  creatorId: string;
  creatorName: string;
  participantsList: Participant[];
}

interface LunchCardProps {
  lunch: Lunch;
}

const isLunchPassed = (lunchTime?: string) => {
  if (!lunchTime) return false;
  const [h, m] = lunchTime.split(":").map(Number);
  const now = new Date();
  const dt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
  return now > dt;
};

const LunchCard: React.FC<LunchCardProps> = ({ lunch }) => {
  const navigate = useNavigate();
  const currentUserId = useSelector((s: RootState) => s.auth.userId);

  const handleView = () => {
    navigate(`/lunch/${lunch.id}`);
  };

  return (
    <div className={styles["lunch-card"]}>
      <h2 className={styles["lunch-card__title"]}>Обед от {lunch.creatorName}</h2>
      <div className={styles["lunch-card__content"]}>
        <ul className={styles["lunch-card__info"]}>
          <LunchDetailItem value={lunch.place} iconSrc={cooking} />
          <LunchDetailItem value={lunch.time} iconSrc={time} />
          <LunchDetailItem value={`${lunch.participants} участника`} iconSrc={people} />
        </ul>
        <img src={image} alt="Обед" className={styles["lunch-card__image"]} />
      </div>
      <Button onClick={handleView}>Посмотреть информацию</Button>
    </div>
  );
};

export default LunchCard;
