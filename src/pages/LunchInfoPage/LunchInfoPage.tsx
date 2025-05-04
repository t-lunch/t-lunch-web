import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLunchByIdThunk,
  joinLunchThunk,
  leaveLunchThunk,
} from "../../store/slices/lunchesSlice";
import { RootState, AppDispatch } from "../../store/store";
import { useParams, useNavigate } from "react-router-dom";
import PageTitle from "../../components/ui/PageTitle/PageTitle";
import Container from "../../components/layout/Container/Container";
import Button from "../../components/ui/Button/Button";
import SectionLabel from "../../components/ui/SectionLabel/SectionLabel";
import LunchDetailItem from "../../components/ui/LunchDetailItem/LunchDetailItem";
import cooking from "../../assets/images/icons/cooking.svg";
import timeIcon from "../../assets/images/icons/time.svg";
import people from "../../assets/images/icons/people.svg";
import telegram from "../../assets/images/icons/tg.png";
import styles from "./LunchInfoPage.module.scss";

const isLunchPassed = (lunchTime?: string) => {
  if (!lunchTime) return false;
  const [h, m] = lunchTime.split(":").map(Number);
  const now = new Date();
  const dt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
  return now > dt;
};

const LunchInfoPage: React.FC = () => {
  const { lunchId } = useParams<{ lunchId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // We take a detailed lunch from Redux
  const current = useSelector((s: RootState) => s.lunches.current);
  const loadingCurrent = useSelector(
    (s: RootState) => s.lunches.loadingCurrent
  );
  const currentUserId = useSelector((s: RootState) => s.auth.userId);

  // When mounting -load a detailed lunch
  useEffect(() => {
    if (lunchId) {
      dispatch(fetchLunchByIdThunk(lunchId));
    }
  }, [dispatch, lunchId]);

  if (loadingCurrent) {
    return <div className={styles.loading}>Загрузка...</div>;
  }
  if (!current) {
    return <div className={styles.error}>Ошибка при загрузке обеда</div>;
  }

  const passed = isLunchPassed(current.time);
  const isJoined = current.participantsList.some((p) => p.id === currentUserId);
  const isCreator = current.creatorId === currentUserId;

  const handleJoin = async () => {
    try {
      await dispatch(joinLunchThunk(current.id)).unwrap();
    } catch (err: any) {
      if (err.code !== 'ERR_BAD_REQUEST') {
        console.error(err);
        return;
      }
    } finally {
      dispatch(fetchLunchByIdThunk(current.id));
    }
  };


  const handleLeave = async () => {
    try {
      await dispatch(leaveLunchThunk(current.id)).unwrap();
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(fetchLunchByIdThunk(current.id));
    }
  };
  

  const handleEdit = () => {
    navigate(`/lunches/${current.id}/edit`);
  };

  return (
    <div className={styles["lunch-info"]}>
      <PageTitle>Информация об обеде</PageTitle>
      <Container className="page-container">
        <h2 className={styles["lunch-info__title"]}>
          Обед от {current.creatorName}
        </h2>

        <ul className={styles["lunch-info__details"]}>
          <LunchDetailItem value={current.place} iconSrc={cooking} />
          <LunchDetailItem value={current.time} iconSrc={timeIcon} />
          <LunchDetailItem
            value={`${current.participantsList.length} участника`}
            iconSrc={people}
          />
        </ul>

        <SectionLabel>Примечания</SectionLabel>
        <div className={styles["lunch-info__note"]}>
          {current.note || "Нет примечаний"}
        </div>

        <SectionLabel>Участники</SectionLabel>
        <ul className={styles["lunch-info__participants"]}>
          {current.participantsList.map((p) => (
            <LunchDetailItem
              key={p.id}
              value={p.name}
              iconSrc={telegram}
              className="lunch-info__item"
            />
          ))}
        </ul>

        <div className={styles["lunch-info__actions"]}>
          {passed && <div className={styles.passed}>Обед уже прошёл</div>}

          {!passed && isCreator && (
            <Button onClick={handleEdit} emphasized>
              Редактировать обед
            </Button>
          )}

          {!passed && !isCreator && isJoined && (
            <Button onClick={handleLeave} emphasized>
              Покинуть обед
            </Button>
          )}

          {!passed && !isCreator && !isJoined && (
            <Button onClick={handleJoin} emphasized>
              Присоединиться
            </Button>
          )}
        </div>
      </Container>
    </div>
  );
};


export default LunchInfoPage;
