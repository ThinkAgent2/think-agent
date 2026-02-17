import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

export async function POST(request: Request) {
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return NextResponse.json({ error: 'GitHub config missing' }, { status: 500 });
  }

  const body = await request.json();
  const username = (body?.username as string | undefined)?.trim();

  if (!username) {
    return NextResponse.json({ error: 'Username required' }, { status: 400 });
  }

  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/collaborators/${encodeURIComponent(username)}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({ permission: 'pull' }),
  });

  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json({ error: text || 'GitHub invite failed' }, { status: response.status });
  }

  return NextResponse.json({ success: true });
}
