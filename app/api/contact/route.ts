import { NextResponse } from 'next/server'

type Body = {
  name: string
  email: string
  project?: string
  brief: string
  plan?: string
}

export async function POST(req: Request) {
  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, email, brief } = body
  if (!name || !email || !brief) {
    return NextResponse.json(
      { ok: false, error: 'Missing required fields' },
      { status: 400 },
    )
  }

  // TODO: wire this to an email service (Resend, Postmark, etc.)
  // For now we just log on the server so the form has a working endpoint.
  console.log('[contact]', body)

  return NextResponse.json({ ok: true })
}
