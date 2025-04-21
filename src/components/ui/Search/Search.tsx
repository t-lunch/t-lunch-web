import React from "react";
import styles from "./Search.module.scss";

const Search = ({
  value,
  onChange,
  placeholder = "Поиск",
  className = "",
  ...props
}) => {
  return (
    <div className={`${styles['search-input-container']} ${className}`}>
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
        width="1.5rem"
        height="1.5rem"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.68 17.182a7.75 7.75 0 0 1-12.427-6.18 7.75 7.75 0 1 1 13.848 4.784l2.718 2.737a1.495 1.495 0 0 1 0 2.116l-.352.36-3.786-3.817Zm1.072-6.18a5.75 5.75 0 1 1-11.498 0 5.75 5.75 0 1 1 11.498 0Z"
          fill="currentColor"
        ></path>
      </svg>

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={styles['search-input']}
        {...props}
      />
    </div>
  );
};

export default Search;
