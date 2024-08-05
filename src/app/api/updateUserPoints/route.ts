import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { userId, newPoints } = await request.json();

    if (!userId || newPoints === undefined) {
      return NextResponse.json({ error: 'User ID and new points are required' }, { status: 400 });
    }

    // Fetch the current points for the user
    const { data: user, error: fetchError } = await supabase
      .from('user')
      .select('points')
      .eq('id', userId)
      .single();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    // Calculate the updated points
    const updatedPoints = (user?.points || 0) + newPoints;

    // Update the user's points in Supabase
    const { error: updateError } = await supabase
      .from('user')
      .update({ points: updatedPoints })
      .eq('id', userId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return NextResponse.json({ message: 'Points updated successfully' });
  } catch (error) {
    console.error('Error updating user points:', error);
    return NextResponse.json({ error: 'Failed to update user points' }, { status: 500 });
  }
}
