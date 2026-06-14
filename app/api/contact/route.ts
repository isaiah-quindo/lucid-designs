import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import {
  studioNotificationEmail,
  userConfirmationEmail,
} from '@/lib/email-templates'

type Body = {
  name: string
  email: string
  project?: string
  brief: string
  plan?: string
}

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

export async function POST(req: Request) {
  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON' },
      { status: 400 },
    )
  }

  const { name, email, brief } = body
  if (!name || !email || !brief) {
    return NextResponse.json(
      { ok: false, error: 'Missing required fields' },
      { status: 400 },
    )
  }

  if (!resend) {
    console.warn(
      '[contact] RESEND_API_KEY not set — logging payload instead of sending.',
      body,
    )
    return NextResponse.json({ ok: true, delivered: false })
  }

  const from = process.env.RESEND_FROM ?? 'Lucid Designs <onboarding@resend.dev>'
  const studioInbox = (
    process.env.RESEND_TO ?? 'hello@luciddesigns.com.au,isaiah.quindo@gmail.com'
  )
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const studioEmail = studioNotificationEmail(body)
  const userEmail = userConfirmationEmail(body)

  try {
    // Studio notification — the critical one. If this fails, we surface an error.
    const { error: studioError } = await resend.emails.send({
      from,
      to: studioInbox,
      subject: studioEmail.subject,
      html: studioEmail.html,
      text: studioEmail.text,
      replyTo: email,
    })
    if (studioError) {
      console.error('[contact] Resend studio notification error', studioError)
      return NextResponse.json(
        { ok: false, error: 'Email delivery failed' },
        { status: 502 },
      )
    }
  } catch (err) {
    console.error('[contact] Resend studio notification exception', err)
    return NextResponse.json(
      { ok: false, error: 'Email delivery failed' },
      { status: 502 },
    )
  }

  // User confirmation — best-effort. Log failures, don't fail the request.
  try {
    const { error: userError } = await resend.emails.send({
      from,
      to: [email],
      subject: userEmail.subject,
      html: userEmail.html,
      text: userEmail.text,
    })
    if (userError) {
      console.warn('[contact] Resend user confirmation error', userError)
    }
  } catch (err) {
    console.warn('[contact] Resend user confirmation exception', err)
  }

  return NextResponse.json({ ok: true, delivered: true })
}
