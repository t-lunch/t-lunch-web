import React, { useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createLunchThunk, fetchLunchesThunk } from "../../store/slices/lunchesSlice"
import { RootState, AppDispatch } from "../../store/store"
import { useNavigate } from "react-router-dom"
import PageTitle from "../../components/ui/PageTitle/PageTitle"
import Container from "../../components/layout/Container/Container"
import Button from "../../components/ui/Button/Button"
import SectionLabel from "../../components/ui/SectionLabel/SectionLabel"
import InputField from "../../components/layout/InputField/InputField"
import styles from "./CreateLunchPage.module.scss"

const getTimeIntervals = () => {
  const intervals: string[] = []
  const now = new Date()
  const start = new Date(now)
  start.setMinutes(Math.ceil(now.getMinutes() / 15) * 15, 0, 0)
  const endToday = new Date(now)
  endToday.setHours(22, 0, 0, 0)

  while (start <= endToday) {
    intervals.push(
      start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
    )
    start.setMinutes(start.getMinutes() + 15)
  }

  if (now.getHours() >= 23 && now.getMinutes() >= 30) {
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    const endTomorrow = new Date(tomorrow)
    endTomorrow.setHours(2, 0, 0, 0)
    while (tomorrow <= endTomorrow) {
      intervals.push(
        tomorrow.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
      )
      tomorrow.setMinutes(tomorrow.getMinutes() + 15)
    }
  }

  return intervals
}

interface SelectableButtonProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  activeClassName: string
  inactiveClassName: string
}

const SelectableButton: React.FC<SelectableButtonProps> = ({
  active,
  onClick,
  children,
  activeClassName,
  inactiveClassName,
}) => (
  <button
    type="button"
    className={active ? activeClassName : inactiveClassName}
    onClick={onClick}
  >
    {children}
  </button>
)

const CreateLunchPage: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState("")
  const [place, setPlace] = useState<"kitchen" | "custom">("kitchen")
  const [note, setNote] = useState("")
  const [participants, setParticipants] = useState(1)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const times = useMemo(() => getTimeIntervals(), [])

  const creatorId = useSelector((s: RootState) => s.auth.userId)!
  const creatorName = useSelector((s: RootState) => s.auth.userName)! 

  const handleSubmit = async () => {
    if (!selectedTime) {
      alert("Выберите время")
      return
    }

    await dispatch(
      createLunchThunk({
        time: selectedTime,
        place: place === "kitchen" ? "Кухня" : "Своё место",
        note,
        participants,
        creatorId,
        creatorName,
      })
    ).unwrap()

    dispatch(fetchLunchesThunk())
    navigate("/")
  }

  return (
    <div className={styles["create-lunch"]}>
      <PageTitle>Создание обеда</PageTitle>
      <Container className="page-container">
        <SectionLabel>Время</SectionLabel>
        <div className={styles["time-container"]}>
          {times.map((t) => (
            <SelectableButton
              key={t}
              active={t === selectedTime}
              onClick={() => setSelectedTime(t)}
              activeClassName={styles["time-button--selected"]}
              inactiveClassName={styles["time-button"]}
            >
              {t}
            </SelectableButton>
          ))}
        </div>

        <SectionLabel>Место</SectionLabel>
        <div className={styles["time-container"]}>
          <SelectableButton
            active={place === "kitchen"}
            onClick={() => setPlace("kitchen")}
            activeClassName={styles["time-button--selected"]}
            inactiveClassName={styles["time-button"]}
          >
            Кухня
          </SelectableButton>
          <SelectableButton
            active={place === "custom"}
            onClick={() => setPlace("custom")}
            activeClassName={styles["time-button--selected"]}
            inactiveClassName={styles["time-button"]}
          >
            Своё место
          </SelectableButton>
        </div>

        <SectionLabel>Примечания</SectionLabel>
        <div className={styles["note-container"]}>
          <InputField
            type="text"
            placeholder="Место сбора и т.п."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <SectionLabel>Участники</SectionLabel>
        <div className={styles["participants-container"]}>
          <InputField
            type="number"
            placeholder="Количество участников"
            value={participants.toString()}
            onChange={(e) => setParticipants(Number(e.target.value))}
            min={1}
          />
        </div>

        <Button type="button" onClick={handleSubmit} emphasized>
          Создать
        </Button>
      </Container>
    </div>
  )
}

export default CreateLunchPage
