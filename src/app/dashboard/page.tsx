'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Spinner from '@/components/Spinner';

const Dashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referral_code = searchParams.get('referral_code');
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `/api/getUserPoints?referral_code=${referral_code}`
      );
      const data = await res.json();
      setPoints(data.points);
    };

    if (referral_code) {
      fetchData();
    }
  }, [referral_code]);

  const handleSpinComplete = async (newPoints: number) => {
    setPoints(points + newPoints);

    // Update the user's points in the database
    await fetch('/api/updateUserPoints', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ referral_code, newPoints }),
    });
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Your referral link: {`http://localhost:3000/?ref=${referral_code}`}</p>
      <p>Your points: {points}</p>
      <Spinner onComplete={handleSpinComplete} />
    </div>
  );
};

export default Dashboard;
