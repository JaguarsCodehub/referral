import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Authorization header missing' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Token missing' }, { status: 401 });
  }

  // Verify the token with Supabase
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    console.error('Error verifying token or user not found:', error);
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { twitter_username, discord_username } = await req.json();

    // Update user data in Supabase
    const { error: updateError } = await supabase
      .from('user')
      .update({ twitter_username, discord_username })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating user data:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'User data updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
