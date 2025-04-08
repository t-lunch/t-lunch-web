import React from "react";
import styles from "./SectionLabel.module.scss";

interface SectionLabelProps {
  children: string;
}

const SectionLabel: React.FC<SectionLabelProps> = ({ children }) => {
  return <div className={styles["section-label"]}>{children}</div>;
};

export default SectionLabel;