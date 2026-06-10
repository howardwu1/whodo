import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('whodo_session')?.value;
  
  return NextResponse.json({
    hasCookie: !!sessionToken,
    cookieLength: sessionToken?.length ?? 0,
    cookieFirstChars: sessionToken?.substring(0, 8) ?? 'none',
  });
}
