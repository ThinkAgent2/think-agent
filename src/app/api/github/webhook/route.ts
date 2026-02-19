import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

function verifySignature(req: NextRequest, body: string): boolean {
  if (!GITHUB_WEBHOOK_SECRET) return false;
  const signature = req.headers.get('x-hub-signature-256');
  if (!signature) return false;
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', GITHUB_WEBHOOK_SECRET);
  const digest = `sha256=${hmac.update(body).digest('hex')}`;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  if (!verifySignature(req, body)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = req.headers.get('x-github-event');
  if (event !== 'pull_request') {
    return NextResponse.json({ ok: true });
  }

  const payload = JSON.parse(body);
  if (!payload.pull_request || !payload.pull_request.merged) {
    return NextResponse.json({ ok: true });
  }

  const email = payload.pull_request.user?.email || payload.sender?.email;
  if (!email) {
    return NextResponse.json({ ok: true, reason: 'no email in payload' });
  }

  const supabase = createAdminClient();
  await supabase
    .from('users')
    .update({ pr_merged: true })
    .eq('email', email);

  return NextResponse.json({ ok: true });
}
