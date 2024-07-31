import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { data, error } = await supabase
    .from('users')
    .select('points')
    .order('points', { ascending: false });

  if (error) {
    return NextResponse.json([], { status: 200 }); // Returning an empty array in case of error
  }

  return NextResponse.json(data, { status: 200 });
}
