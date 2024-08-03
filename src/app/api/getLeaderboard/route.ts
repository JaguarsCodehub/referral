// pages/api/getLeaderboard.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

const getLeaderboard = async (req: NextApiRequest, res: NextApiResponse) => {
  const { data, error } = await supabase
    .from('users')
    .select('twitter_username, points')
    .order('points', { ascending: false });

  if (error) {
    return res.status(500).json({ message: 'Error fetching leaderboard data.' });
  }

  return res.status(200).json(data);
};

export default getLeaderboard;
