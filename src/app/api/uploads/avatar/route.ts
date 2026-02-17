import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const BUCKET = 'avatars';

export async function POST(request: Request) {
  const body = await request.json();
  const path = body?.path as string | undefined;
  const contentType = body?.contentType as string | undefined;
  const dataUrl = body?.dataUrl as string | undefined;

  if (!path || !contentType || !dataUrl) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const base64 = dataUrl.split(',')[1];
  if (!base64) {
    return NextResponse.json({ error: 'Invalid data url' }, { status: 400 });
  }

  const buffer = Buffer.from(base64, 'base64');

  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType,
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);

  return NextResponse.json({ data: { publicUrl: urlData.publicUrl } });
}
