import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Fetch user points from Supabase
    const { data, error } = await supabase
      .from('user')
      .select('points')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Return user points
    return NextResponse.json({ points: data?.points || 0 });
  } catch (error) {
    console.error('Error fetching user points:', error);
    return NextResponse.json({ error: 'Failed to fetch user points' }, { status: 500 });
  }
}
