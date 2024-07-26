import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { referral_code, newPoints } = await req.json();

  // Fetch the current points
  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('points')
    .eq('referral_code', referral_code)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  // Update the user's points
  const updatedPoints = (user.points || 0) + newPoints;
  const { error: updateError } = await supabase
    .from('users')
    .update({ points: updatedPoints })
    .eq('referral_code', referral_code);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ points: updatedPoints }, { status: 200 });
}
