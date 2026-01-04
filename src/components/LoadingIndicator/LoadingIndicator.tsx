import React from 'react';
import css from './LoadingIndicator.module.css';

export const LoadingIndicator: React.FC = () => {
  return (
    <div className={css.loaderWrapper}>
      <div className={css.loader}></div>
      <p>Loading...</p>
    </div>
  );
};
