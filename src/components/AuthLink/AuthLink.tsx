import React from "react";
import { Link } from "react-router-dom";
import styles from "./AuthLink.module.scss";

interface AuthLinkProps {
  text: string;
  linkText: string;
  to: string;
}

const AuthLink: React.FC<AuthLinkProps> = ({ text, linkText, to }) => {
  return (
    <div className={styles.authLink}>
      <span>{text} <Link to={to} className={styles.link}>{linkText}</Link></span>
    </div>
  );
};

export default AuthLink;
