import React from 'react';
import styles from './InfoBanner.module.css';

interface InfoBannerProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

const InfoBanner: React.FC<InfoBannerProps> = ({ message, type = 'info' }) => {
  return (
    <div className={`${styles.banner} ${styles[type]}`}>
      {message}
    </div>
  );
};

export default InfoBanner;