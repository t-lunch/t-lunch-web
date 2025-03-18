import React from 'react';
import styles from './PageTitle.module.scss'; 

const PageTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <h1 className={styles["main-page__title"]}>{children}</h1>;
};

export default PageTitle;
