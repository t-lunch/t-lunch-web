import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../Container/Container';
import styles from './Header.module.scss';
import Logo from '../../ui/Logo';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <Container className={styles['header__container']}>
        <Logo />
        <nav className={styles['header__nav']}>
          <ul>
            <li>
              <Link to="/my-lunches">Мои обеды</Link>
            </li>
            <li>
              <Link to="/profile">Личный кабинет</Link>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
};

export default Header;
