import React from 'react';
import styles from './index.module.css';

interface LoadingSpinnerProps {
  size?: number;
  animationDuration?: string;
  segmentColor?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 80,
  animationDuration = '4s',
  segmentColor
}) => {
  const segments = Array.from({ length: 8 }, (_, i) => (
    <div
      key={i}
      className={styles.segment}
      style={{
        animationDelay: `${(parseFloat(animationDuration) / 8) * i}s`,
        animationDuration: animationDuration,
        color: segmentColor || undefined
      }}
    />
  ));

  return (
    <div className={styles.spinnerContainer}>
      <div
        className={styles.spinner}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {segments}
        <div
          className={styles.centerCircle}
          style={{
            width: `28px`,
            height: `28px`,
            backgroundColor: "var(--gray-main)",
          }}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;