import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { twitter_username, discord_username, referred_by } = await req.json();

  // Generate a unique referral code
  const referral_code = Math.random().toString(36).substring(2, 15);

  // Set initial points: Welcome points (500) + Signup points (100)
  let initialPoints = 100;

  // Insert the new user
  const { data, error } = await supabase
    .from('users')
    .insert([{ twitter_username, discord_username, referral_code, referred_by, points: initialPoints }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Update points for the referrer
  if (referred_by) {
    const { data: referrerData, error: referrerError } = await supabase
      .from('users')
      .select('points')
      .eq('referral_code', referred_by)
      .single();

    if (referrerError) {
      return NextResponse.json(
        { error: referrerError.message },
        { status: 500 }
      );
    }

    const newPoints = (referrerData?.points || 0) + 100;

    const { error: updateError } = await supabase
      .from('users')
      .update({ points: newPoints })
      .eq('referral_code', referred_by);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
  }

  return NextResponse.json(data, { status: 200 });
}
