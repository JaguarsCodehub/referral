'use client';

import { useEffect, useState } from 'react';

interface User {
  twitter_username: string;
  points: number;
}

const Leaderboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('/api/getLeaderboard');
        const data = await res.json();

        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setError('Failed to fetch leaderboard.');
        }
      } catch (err) {
        setError('An error occurred while fetching the leaderboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold">Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container bg-black h-screen py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white p-4 rounded-sm shadow-md inline-block">
          <span className='font-semibold'>Leaderboard</span>
        </h1>
      </div>
      <div className="bg-purple-600 text-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-purple-800 text-left text-xs uppercase font-semibold">
              <th className="px-5 py-3 border-b border-purple-500">Rank</th>
              <th className="px-5 py-3 border-b border-purple-500">Player Username</th>
              <th className="px-5 py-3 border-b border-purple-500">Points</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-purple-500">
            {users.map((user, index) => (
              <tr key={index} className="hover:bg-purple-700">
                <td className="px-5 py-4">{index + 1}</td>
                <td className="px-5 py-4">{user.twitter_username}</td>
                <td className="px-5 py-4">{user.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
