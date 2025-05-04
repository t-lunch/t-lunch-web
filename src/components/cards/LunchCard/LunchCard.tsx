import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { joinLunchThunk } from "../../../store/slices/lunchesSlice";
import { AppDispatch } from "../../../store/store";
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
  id: string
  place: string
  time: string
  participants: number
  creatorId: string
  creatorName: string
  participantsList: Participant[]
}

interface LunchCardProps {
  lunch: Lunch
}

const isLunchPassed = (lunchTime?: string) => {
  if (!lunchTime) return false
  const [h, m] = lunchTime.split(":").map(Number)
  const now = new Date()
  const dt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m)
  return now > dt
}

const LunchCard: React.FC<LunchCardProps> = ({ lunch }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const currentUserId = useSelector((s: RootState) => s.auth.userId)

  const passed = isLunchPassed(lunch.time)
  const isJoined = lunch.participantsList.some(p => p.id === currentUserId)
  const isCreator = lunch.creatorId === currentUserId

  const handleJoin = async () => {
    try {
      await dispatch(joinLunchThunk(lunch.id)).unwrap()
      // After successful connection, redirect the dinner page
      navigate(`/lunch/${lunch.id}`)
    } catch (err) {
      console.error("Не удалось присоединиться", err)
      // You can show the user error
    }
  }

  const handleView = () => {
    navigate(`/lunch/${lunch.id}`)
  }

  let button
  if (passed) {
    // Lunch has passed -only viewing
    button = (
      <Button onClick={handleView}>
        Посмотреть информацию
      </Button>
    )
  } else if (isCreator) {
    // You are the creator -only view
    button = (
      <Button onClick={handleView}>
        Посмотреть информацию
      </Button>
    )
  } else if (isJoined) {
    // Already participant — look +, for example, leave
    button = (
      <Button onClick={handleView}>
        Посмотреть информацию
      </Button>
    )
  } else {
    // You can join
    button = (
      <Button onClick={handleJoin}>
        Присоединиться
      </Button>
    )
  }

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
      {button}
    </div>
  )
}

export default LunchCard
