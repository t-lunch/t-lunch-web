import React from "react";
import styles from "./SectionLabel.module.scss";
import clsx from "classnames";

interface SectionLabelProps {
  children: string;
  className?: string;
}

const SectionLabel: React.FC<SectionLabelProps> = ({ children, className }) => {
  return <div className={clsx(styles["section-label"], className && styles[className])}>{children}</div>;
};

export default SectionLabel;