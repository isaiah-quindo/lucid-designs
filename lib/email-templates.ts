type Payload = {
  name: string
  email: string
  project?: string
  brief: string
  plan?: string
}

const SANS = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`
const SERIF = `Georgia, 'Times New Roman', serif`
const SURFACE = '#ffffff'
const PAGE = '#f1ebde'
const INK = '#0a0a0a'
const MUTE = 'rgba(10,10,10,0.6)'
const LINE = 'rgba(10,10,10,0.1)'

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function brand() {
  return `
    <span style="display:inline-block; vertical-align:middle; width:9px; height:9px; background:${INK}; border-radius:50%;"></span>
    <span style="display:inline-block; vertical-align:middle; margin-left:8px; font-size:13px; font-weight:500; color:${INK};">Lucid Designs</span>
  `
}

function shell(args: { title: string; preheader: string; body: string }) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${escapeHtml(args.title)}</title>
</head>
<body style="margin:0; padding:0; background:${PAGE}; font-family:${SANS}; color:${INK};">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; visibility:hidden;">${escapeHtml(args.preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${PAGE}; padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%; background:${SURFACE}; border-radius:16px; border:1px solid ${LINE}; overflow:hidden;">
        ${args.body}
      </table>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%; margin-top:20px;">
        <tr><td align="center" style="font-size:10px; color:rgba(10,10,10,0.45); letter-spacing:0.18em; text-transform:uppercase;">
          Sydney · luciddesigns.com.au
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function detailRow(label: string, value: string) {
  return `<tr>
    <td style="padding:12px 0; border-bottom:1px solid ${LINE}; width:32%; vertical-align:top;">
      <span style="font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color:${MUTE};">${escapeHtml(label)}</span>
    </td>
    <td style="padding:12px 0; border-bottom:1px solid ${LINE}; font-size:14px; line-height:1.5; color:${INK};">
      ${value}
    </td>
  </tr>`
}

export function studioNotificationEmail(p: Payload) {
  const subject = `New brief — ${p.plan || 'No plan'} · ${p.name}`
  const preheader = `${p.plan ? p.plan + ' — ' : ''}${p.name} just sent a brief from luciddesigns.com.au`
  const firstName = p.name.split(/\s+/)[0]

  const body = `
    <tr><td style="padding:36px 40px 0 40px;">
      <table width="100%"><tr>
        <td style="font-size:13px;">${brand()}</td>
        <td align="right" style="font-size:10px; color:${MUTE}; text-transform:uppercase; letter-spacing:0.22em;">Inbound brief</td>
      </tr></table>
    </td></tr>

    <tr><td style="padding:40px 40px 0 40px;">
      <h1 style="margin:0; font-family:${SERIF}; font-size:34px; line-height:1.05; letter-spacing:-0.02em; color:${INK};">
        New brief from ${escapeHtml(firstName)}.
      </h1>
    </td></tr>

    ${p.plan ? `<tr><td style="padding:18px 40px 0 40px;">
      <span style="display:inline-block; font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color:${MUTE}; border:1px solid ${LINE}; border-radius:999px; padding:6px 12px;">
        Plan · ${escapeHtml(p.plan)}
      </span>
    </td></tr>` : ''}

    <tr><td style="padding:28px 40px 0 40px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${LINE};">
        ${detailRow('Name', escapeHtml(p.name))}
        ${detailRow('Email', `<a href="mailto:${escapeHtml(p.email)}" style="color:${INK}; text-decoration:underline; text-underline-offset:3px;">${escapeHtml(p.email)}</a>`)}
        ${p.project ? detailRow('Company', escapeHtml(p.project)) : ''}
      </table>
    </td></tr>

    <tr><td style="padding:36px 40px 0 40px;">
      <div style="font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color:${MUTE}; margin-bottom:14px;">The brief</div>
      <div style="font-size:15px; line-height:1.6; color:${INK}; white-space:pre-wrap; font-family:${SERIF};">${escapeHtml(p.brief)}</div>
    </td></tr>

    <tr><td style="padding:36px 40px 40px 40px;">
      <div style="border-top:1px solid ${LINE}; padding-top:20px; font-size:12px; color:${MUTE};">
        Reply directly to this email to respond to ${escapeHtml(firstName)}.
      </div>
    </td></tr>
  `

  const text = [
    'New project brief',
    '',
    `Plan: ${p.plan || '—'}`,
    `Name: ${p.name}`,
    `Email: ${p.email}`,
    p.project ? `Company: ${p.project}` : null,
    '',
    'Brief:',
    p.brief,
    '',
    '—',
    `Reply directly to this email to respond to ${firstName}.`,
  ]
    .filter((l): l is string => l !== null)
    .join('\n')

  return { subject, html: shell({ title: subject, preheader, body }), text }
}

export function userConfirmationEmail(p: Payload) {
  const firstName = p.name.split(/\s+/)[0]
  const subject = `We've received your brief — Lucid Designs`
  const preheader = `Thanks, ${firstName}. We'll be in touch within two working days.`

  const body = `
    <tr><td style="padding:36px 40px 0 40px;">${brand()}</td></tr>

    <tr><td style="padding:32px 40px 0 40px;">
      <h1 style="margin:0; font-family:${SERIF}; font-size:38px; line-height:1.05; letter-spacing:-0.02em; color:${INK};">
        Thanks, ${escapeHtml(firstName)}.
      </h1>
    </td></tr>

    <tr><td style="padding:20px 40px 0 40px;">
      <p style="margin:0; font-size:16px; line-height:1.65; color:rgba(10,10,10,0.78);">
        We've received your brief and will get back to you within
        <strong style="color:${INK}; font-weight:600;">two working days</strong>.
        If anything comes to mind in the meantime, just reply to this email — it
        comes straight to us.
      </p>
    </td></tr>

    <tr><td style="padding:36px 40px 0 40px;">
      <div style="border-top:1px solid ${LINE}; padding-top:24px;">
        <div style="font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color:${MUTE}; margin-bottom:16px;">
          What you sent
        </div>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${p.plan ? detailRow('Plan', escapeHtml(p.plan)) : ''}
          ${detailRow('Name', escapeHtml(p.name))}
          ${detailRow('Email', escapeHtml(p.email))}
          ${p.project ? detailRow('Company', escapeHtml(p.project)) : ''}
        </table>
      </div>
    </td></tr>

    <tr><td style="padding:28px 40px 0 40px;">
      <div style="font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color:${MUTE}; margin-bottom:14px;">
        Your brief
      </div>
      <div style="font-size:15px; line-height:1.6; color:${INK}; white-space:pre-wrap; font-family:${SERIF}; padding:20px 22px; background:rgba(10,10,10,0.03); border-radius:10px; border:1px solid ${LINE};">${escapeHtml(p.brief)}</div>
    </td></tr>

    <tr><td style="padding:40px 40px 40px 40px;">
      <div style="border-top:1px solid ${LINE}; padding-top:24px; font-size:14px; line-height:1.6; color:rgba(10,10,10,0.75);">
        — The Lucid Designs studio<br />
        <a href="mailto:hello@luciddesigns.com.au" style="color:${MUTE}; text-decoration:none;">hello@luciddesigns.com.au</a>
      </div>
    </td></tr>
  `

  const text = [
    `Thanks, ${firstName}.`,
    '',
    `We've received your brief and will get back to you within two working days.`,
    '',
    `If anything comes to mind in the meantime, just reply to this email.`,
    '',
    '— What you sent —',
    p.plan ? `Plan: ${p.plan}` : null,
    `Name: ${p.name}`,
    `Email: ${p.email}`,
    p.project ? `Company: ${p.project}` : null,
    '',
    'Brief:',
    p.brief,
    '',
    '— The Lucid Designs studio',
    'hello@luciddesigns.com.au',
    'luciddesigns.com.au',
  ]
    .filter((l): l is string => l !== null)
    .join('\n')

  return { subject, html: shell({ title: subject, preheader, body }), text }
}
