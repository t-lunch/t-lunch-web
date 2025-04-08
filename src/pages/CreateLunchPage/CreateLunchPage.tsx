import React, { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLunch } from "../../api/lunchesAPI";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../components/ui/PageTitle/PageTitle";
import Container from "../../components/layout/Container/Container";
import Button from "../../components/ui/Button/Button";
import SectionLabel from "../../components/ui/SectionLabel/SectionLabel";
import InputField from "../../components/layout/InputField/InputField";
import styles from "./CreateLunchPage.module.scss";

const getTimeIntervals = () => {
  const intervals: string[] = [];
  const now = new Date();
  const start = new Date(now);
  start.setMinutes(Math.ceil(now.getMinutes() / 15) * 15, 0, 0);
  const end = new Date();
  end.setHours(22, 0, 0, 0);

  while (start <= end) {
    intervals.push(
      start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
    );
    start.setMinutes(start.getMinutes() + 15);
  }
  return intervals;
};

interface SelectableButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  activeClassName: string;
  inactiveClassName: string;
  type?: "button" | "submit" | "reset";
}

const SelectableButton: React.FC<SelectableButtonProps> = ({
  active,
  onClick,
  children,
  activeClassName,
  inactiveClassName,
  type = "button",
}) => {
  return (
    <button
      type={type}
      className={active ? activeClassName : inactiveClassName}
      onClick={onClick}
    >
      {children}
    </button>
  );
};



const CreateLunchPage: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState("");
  const [place, setPlace] = useState<"kitchen" | "custom">("kitchen");
  const [note, setNote] = useState("");
  const navigate = useNavigate();
  const times = useMemo(() => getTimeIntervals(), []);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createLunch,
    onSuccess: () => {
      // Disability of the request "Lunches" -update of the cache
      queryClient.invalidateQueries(["lunches"]);
      navigate("/");
    },
  });

  const handleSubmit = async () => {
    if (!selectedTime) {
      alert("Выберите время");
      return;
    }
    const newLunch = {
      time: selectedTime,
      place: place === "kitchen" ? "Кухня" : "Своё место",
      note,
    };
    try {
      await mutation.mutateAsync(newLunch);
      navigate("/");
    } catch (error) {
      console.error("Ошибка создания обеда", error);
    }
  };

  return (
    <div className={styles["create-lunch"]}>
      <PageTitle>Создание обеда</PageTitle>
      <Container className={styles["create-lunch__container"]}>
        <SectionLabel>Время</SectionLabel>
        <div className={styles["time-container"]}>
          {times.map((time) => (
            <SelectableButton
              key={time}
              active={time === selectedTime}
              onClick={() => setSelectedTime(time)}
              activeClassName={styles["time-button--selected"]}
              inactiveClassName={styles["time-button"]}
            >
              {time}
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

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={mutation.isLoading}
          emphasized
        >
          Создать
        </Button>
      </Container>
    </div>
  );
};

export default CreateLunchPage;
