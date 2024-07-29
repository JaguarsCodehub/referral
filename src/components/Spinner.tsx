import React, { useState, useEffect } from 'react';
import styles from './Spinner.module.css'; // Import the CSS module

const tiles = [10, 20, 30, 40, 50, 60, 70, 80];

const Spinner = ({ onComplete }) => {
  const [selectedTile, setSelectedTile] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [spinCooldown, setSpinCooldown] = useState(false);

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
    setSpinning(true);
    setSelectedTile(null);
  };

  return (
    <div className={styles.spinnerContainer}>
      <div className={`${styles.spinner} ${spinning ? styles.spinning : ''}`}>
        {tiles.map((points, index) => (
          <div
            key={index}
            className={`${styles.tile} ${selectedTile === index ? styles.selected : ''
              }`}
          >
            {points}
          </div>
        ))}
      </div>
      <button
        id='spinner-button'
        className='bg-white text-black'
        onClick={handleSpin}
        disabled={spinning || spinCooldown}
      >
        {spinning ? 'Spinning...' : 'Spin'}
      </button>
    </div>
  );
};

export default Spinner;
