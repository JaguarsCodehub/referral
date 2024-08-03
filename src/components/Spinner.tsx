// Spinner.tsx
import React, { useState, useEffect } from 'react';
import styles from './Spinner.module.css';

const tiles = [100, 200, 300, 500, 600, 700, 1000, 900];

type SpinnerProps = {
  onComplete: (points: number) => void;
};

const Spinner: React.FC<SpinnerProps> = ({ onComplete }) => {
  const [selectedTile, setSelectedTile] = useState<number | null>(null);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [spinCooldown, setSpinCooldown] = useState<boolean>(false);

  useEffect(() => {
    const lastSpinTime = localStorage.getItem('lastSpinTime');
    if (lastSpinTime) {
      const now = new Date().getTime();
      const cooldownPeriod = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const timeElapsed = now - parseInt(lastSpinTime, 10);

      if (timeElapsed < cooldownPeriod) {
        setSpinCooldown(true);
        const remainingTime = cooldownPeriod - timeElapsed;
        setTimeout(() => setSpinCooldown(false), remainingTime);
      }
    }
  }, []);

  useEffect(() => {
    if (spinning) {
      const timer = setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * tiles.length);
        setSelectedTile(randomIndex);
        onComplete(tiles[randomIndex]);
        setSpinning(false);
        setSpinCooldown(true);
        localStorage.setItem('lastSpinTime', new Date().getTime().toString());
        setTimeout(() => setSpinCooldown(false), 24 * 60 * 60 * 1000); // Disable button for 24 hours
      }, 3000); // Spin for 3 seconds

      return () => clearTimeout(timer);
    }
  }, [spinning, onComplete]);

  const handleSpin = () => {
    if (!spinCooldown) {
      setSpinning(true);
      setSelectedTile(null);
    }
  };

  return (
    <div className={styles.spinnerContainer}>
      <div className={`${styles.spinner} ${spinning ? styles.spinning : ''}`}>
        {tiles.map((points, index) => (
          <div
            key={index}
            className={`${styles.tile} ${selectedTile === index ? styles.selected : ''}`}
            style={{
              transform: `rotate(${(360 / tiles.length) * index}deg) translate(80px)`,
            }}
          >
            {points}
          </div>
        ))}
      </div>
      <div className="justify-center items-center">
        <button
          id="spinner-button"
          className="bg-purple-800 text-white p-2 rounded mt-4"
          onClick={handleSpin}
          disabled={spinning || spinCooldown}
        >
          {spinning ? 'Spinning...' : 'Spin Your Luck'}
        </button>
      </div>
    </div>
  );
};

export default Spinner;
