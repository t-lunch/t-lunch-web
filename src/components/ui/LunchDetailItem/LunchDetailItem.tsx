import styles from "./LunchDetailItem.module.scss";
import clsx from "classnames";

interface LunchProp {
  value: string;
  iconSrc: string; 
  className?: string;
}

const LunchDetailItem: React.FC<LunchProp> = ({ value, iconSrc, className }) => {
  return (
    <li className={clsx(styles["lunch-item"], className && styles[className])}>
      <img src={iconSrc} alt={value} className={styles["lunch-item__icon"]}/>
      <p className={styles["lunch-item__text"]}>{value}</p>
    </li>
  );
};

export default LunchDetailItem;
