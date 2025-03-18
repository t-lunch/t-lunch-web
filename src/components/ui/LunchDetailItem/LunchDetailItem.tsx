import styles from "./LunchDetailItem.module.scss";

interface LunchProp {
  value: string;
  iconSrc: string; 
}

const LunchDetailItem: React.FC<LunchProp> = ({ value, iconSrc }) => {
  return (
    <li className={styles["lunch-item"]}>
      <img src={iconSrc} alt={value} className={styles["lunch-item__icon"]} />
      <p className={styles["lunch-item__text"]}>{value}</p>
    </li>
  );
};

export default LunchDetailItem;
