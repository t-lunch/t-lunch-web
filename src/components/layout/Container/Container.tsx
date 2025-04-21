import React from 'react';
import clsx from 'classnames'; 
import styles from './Container.module.scss';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    <div className={clsx(styles.container, className && styles[className])}>
      {children}
    </div>
  );
};

export default Container;
