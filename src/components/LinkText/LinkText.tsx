import React from "react";
import { Link } from "react-router-dom";
import styles from "./LinkText.module.scss";

interface LinkTextProps {
  text: string;
  to: string;
}

const LinkText: React.FC<LinkTextProps> = ({ text, to }) => {
  return (
    <Link to={to} className={styles.link}>
      {text}
    </Link>
  );
};

export default LinkText;
