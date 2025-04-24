import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchLunchesThunk, joinLunchThunk } from "../../store/slices/lunchesSlice"
import { RootState, AppDispatch } from "../../store/store"
import { useParams } from "react-router-dom"
import PageTitle from "../../components/ui/PageTitle/PageTitle"
import Container from "../../components/layout/Container/Container"
import Button from "../../components/ui/Button/Button"
import SectionLabel from "../../components/ui/SectionLabel/SectionLabel"
import LunchDetailItem from "../../components/ui/LunchDetailItem/LunchDetailItem"
import cooking from "../../assets/images/icons/cooking.svg"
import timeIcon from "../../assets/images/icons/time.svg"
import people from "../../assets/images/icons/people.svg"
import telegram from "../../assets/images/icons/tg.png"
import styles from "./LunchInfoPage.module.scss"

const isLunchPassed = (lunchTime?: string) => {
  if (!lunchTime) return false
  const [h, m] = lunchTime.split(":").map(Number)
  const now = new Date()
  const dt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m)
  return now > dt
}

const LunchInfoPage: React.FC = () => {
  const { lunchId } = useParams<{ lunchId: string }>()
  const dispatch = useDispatch<AppDispatch>()

  const list = useSelector((s: RootState) => s.lunches.list)
  const loadingList = useSelector((s: RootState) => s.lunches.loadingList)
  const currentUserId = useSelector((s: RootState) => s.auth.user?.id)
  const currentUserName = useSelector((s: RootState) => s.auth.user?.name)

  const [participantsCount, setParticipantsCount] = useState(0)

  useEffect(() => {
    dispatch(fetchLunchesThunk())
  }, [dispatch])

  const lunch = list.find((l) => l.id === lunchId)

  useEffect(() => {
    if (lunch) {
      setParticipantsCount(lunch.participants)
    }
  }, [lunch])

  if (loadingList) {
    return <div className={styles.loading}>Загрузка...</div>
  }

  if (!lunch) {
    return <div className={styles.error}>Ошибка при загрузке обеда</div>
  }

  const passed = isLunchPassed(lunch.time)
  const isJoined = lunch.participantsList.some((p) => p.id === currentUserId)
  const isCreator = lunch.creatorId === currentUserId || lunch.creatorName === currentUserName

  const handleJoin = async () => {
    await dispatch(joinLunchThunk(lunch.id)).unwrap()
    setParticipantsCount((prev) => prev + 1)
  }

  return (
    <div className={styles["lunch-info"]}>
      <PageTitle>Информация об обеде</PageTitle>
      <Container className="page-container">
        <h2 className={styles["lunch-info__title"]}>Обед от {lunch.creatorName}</h2>
        <ul className={styles["lunch-info__details"]}>
          <LunchDetailItem value={lunch.place} iconSrc={cooking} />
          <LunchDetailItem value={lunch.time} iconSrc={timeIcon} />
          <LunchDetailItem value={`${participantsCount} участника`} iconSrc={people} />
        </ul>

        <SectionLabel>Примечания</SectionLabel>
        <div className={styles["lunch-info__note"]}>
          {lunch.note || "Нет примечаний"}
        </div>

        <SectionLabel>Участники</SectionLabel>
        <ul className={styles["lunch-info__participants"]}>
          {lunch.participantsList.map((p) => (
            <LunchDetailItem
              key={p.id}
              value={p.name}
              iconSrc={telegram}
              className="lunch-info__item"
            />
          ))}
        </ul>

        {passed ? (
          <div className={styles.passed}>Обед уже прошёл</div>
        ) : (
          !isCreator && !isJoined && (
            <Button type="button" onClick={handleJoin} emphasized>
              Присоединиться
            </Button>
          )
        )}
      </Container>
    </div>
  )
}

export default LunchInfoPage
