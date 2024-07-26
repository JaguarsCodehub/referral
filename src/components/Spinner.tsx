import React, { useState, useEffect } from 'react';
import styles from './Spinner.module.css'; // Create a CSS module for styling

const tiles = [10, 20, 30, 40, 50, 60, 70, 80];

const Spinner = ({ onComplete }: { onComplete: (points: number) => void }) => {
  const [selectedTile, setSelectedTile] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (spinning) {
      const timer = setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * tiles.length);
        setSelectedTile(randomIndex);
        onComplete(tiles[randomIndex]);
        setSpinning(false);
      }, 3000); // Spin for 3 seconds

      return () => clearTimeout(timer);
    }
  }, [spinning, onComplete]);

  const handleSpin = () => {
    setSpinning(true);
    setSelectedTile(null);
  };

  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}>
        {tiles.map((points, index) => (
          <div
            key={index}
            className={`${styles.tile} ${
              selectedTile === index ? styles.selected : ''
            }`}
          >
            {points}
          </div>
        ))}
      </div>
      <button id='spinner-button' onClick={handleSpin} disabled={spinning}>
        {spinning ? 'Spinning...' : 'Spin'}
      </button>
    </div>
  );
};

export default Spinner;
