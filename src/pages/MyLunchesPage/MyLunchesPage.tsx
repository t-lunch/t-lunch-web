import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { getLunches } from "../../api/lunchesAPI"
import PageTitle from "../../components/ui/PageTitle/PageTitle"
import Search from "../LunchInfoPage/Search/Search"
import LunchCard from "../../components/cards/LunchCard/LunchCard"
import styles from "../MainPage/MainPage.module.scss"

interface Lunch {
  id: string
  time: string
  place: string
  participants: number
  creatorId: string
  creatorName: string
  participantsList: { id: string; name: string }[]
}

const MyLunchesPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState("")
  const currentUserId = useSelector((s: RootState) => s.auth.userId)

  const {
    data: lunches = [],
    isLoading,
    error,
  } = useQuery<Lunch[]>({
    queryKey: ["lunches"],
    queryFn: async () => await getLunches(),
  })

  const filtered = lunches.filter(
    l =>
      l.participantsList.some(p => p.id === currentUserId) &&
      (l.place.includes(searchValue) || l.creatorName.includes(searchValue))
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  if (isLoading) return <div>Загрузка...</div>
  if (error) return <div>Ошибка загрузки</div>

  return (
    <div className={styles["main-page"]}>
      <PageTitle>Мои обеды</PageTitle>
      <div className={styles["mylunch-page__create"]}>
        <form onSubmit={handleSearchSubmit}>
          <Search
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Поиск по обедам"
          />
        </form>
      </div>
      <div className={styles["lunch-list"]}>
        {filtered.map(lunch => (
          <LunchCard key={lunch.id} lunch={lunch} />
        ))}
      </div>
    </div>
  )
}

export default MyLunchesPage
