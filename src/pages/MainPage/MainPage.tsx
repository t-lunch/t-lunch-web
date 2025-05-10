import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getLunches } from "../../api/lunchesAPI";
import { Link } from "react-router-dom";
import PageTitle from "../../components/ui/PageTitle/PageTitle";
import Button from "../../components/ui/Button/Button";
import LunchCard from "../../components/cards/LunchCard/LunchCard";
import styles from "./MainPage.module.scss";
import { Lunch } from "../../types/lunchesTypes";
import { FixedSizeGrid as Grid } from "react-window";

// Обёртка для внешнего контейнера, чтобы тени не обрезались
const Outer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ style, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      style={{
        ...style,
        overflow: "visible",
      }}
    />
  )
);
Outer.displayName = "Outer";

const PAGE_SIZE = 10;
const ROW_HEIGHT = 300;

const MainPage: React.FC = () => {
  const { data: lunches, isLoading, error, refetch } = useQuery<Lunch[]>({
    queryKey: ["lunches"],
    queryFn: getLunches,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: 10000,
  });

  if (isLoading) return <div className={styles.loader}>Загрузка...</div>;
  if (error)
    return (
      <div className={styles.error}>
        Ошибка загрузки. <Button onClick={() => refetch()}>Повторить</Button>
      </div>
    );

  const items = lunches || [];
  const pageCount = Math.ceil(items.length / PAGE_SIZE);
  const [page, setPage] = React.useState(0);
  const currentItems = items.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const rowCount = Math.ceil(currentItems.length / 2);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);
  React.useLayoutEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.clientWidth);
    }
  }, []);

  return (
    <div className={styles["main-page"]}>
      <PageTitle>Поиск партнёра для обеда</PageTitle>

      <div className={styles["main-page__create"]}>
        <Link to="/create-lunch">
          <Button type="submit" emphasized>
            Создать
          </Button>
        </Link>
      </div>

      <div ref={containerRef} className={styles["lunch-list"]}>
        {width > 0 && (
          <Grid
            columnCount={2}
            columnWidth={Math.floor(width / 2)}
            height={rowCount * ROW_HEIGHT}
            rowCount={rowCount}
            rowHeight={ROW_HEIGHT}
            width={width}
            outerElementType={Outer}
          >
            {({ columnIndex, rowIndex, style }) => {
              const idx = rowIndex * 2 + columnIndex;
              const lunch = currentItems[idx];
              return lunch ? (
                <div style={style}>
                  <LunchCard lunch={lunch} />
                </div>
              ) : null;
            }}
          </Grid>
        )}
      </div>

      {items.length > PAGE_SIZE && (
        <div className={styles.pagination}>
          <Button onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0}>
            Назад
          </Button>
          {Array.from({ length: pageCount }).map((_, i) => (
            <Button
              key={i}
              onClick={() => setPage(i)}
              emphasized={i === page}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            onClick={() => setPage((p) => Math.min(p + 1, pageCount - 1))}
            disabled={page === pageCount - 1}
          >
            Вперёд
          </Button>
        </div>
      )}
    </div>
  );
};

export default MainPage;
