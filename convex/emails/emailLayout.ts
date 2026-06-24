// ── UpharVilla Email Shared Layout ──────────────────────────────────────────
// All emails use this base so they look identical to the website brand.
// Primary: #ad8de9 (lavender purple)  Pink: #e87fa6  Dark text: #1a1a2e
//
// Logo is served from the live site — works in all email clients.

import { env } from "../env";

const BASE_URL = env.SITE_URL;
const LOGO_URL = `${BASE_URL}/logo2.png`;

// Brand tokens — exact values from globals.css
export const B = {
  primary: "#ad8de9",
  primaryDark: "#9370d8",
  pink: "#e87fa6",
  pinkLight: "#fce7f0",
  bg: "#faf9ff",
  white: "#ffffff",
  border: "#ede9f8",
  textDark: "#1a1a2e",
  textMid: "#4a4a6a",
  textLight: "#8b8ba0",
  green: "#22c55e",
  greenBg: "#f0fdf4",
  greenBorder: "#bbf7d0",
  amber: "#f59e0b",
  amberBg: "#fffbeb",
  amberBorder: "#fde68a",
} as const;

// ── Header with logo ──────────────────────────────────────────────────────────
export function emailHeader(tagline: string): string {
  return `
  <tr>
    <td style="background:${B.primary};padding:32px 40px 28px;text-align:center;">
      <img src="${LOGO_URL}" alt="UpharVilla" width="180" height="36"
           style="display:block;margin:0 auto 12px;width:180px;height:36px;image-rendering: -webkit-optimize-contrast;" />
      <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.88);font-family:Poppins,Arial,sans-serif;letter-spacing:0.3px;">${tagline}</p>
    </td>
  </tr>`;
}

// ── Footer ────────────────────────────────────────────────────────────────────
export function emailFooter(): string {
  return `
  <tr>
    <td style="background:#f3f0fb;padding:24px 40px;text-align:center;border-top:1px solid ${B.border};">
      <p style="margin:0 0 6px;font-size:12px;color:${B.textLight};font-family:Poppins,Arial,sans-serif;">
        © ${new Date().getFullYear()} UpharVilla · The House of Gifts
      </p>
      <p style="margin:0;font-size:12px;color:${B.textLight};font-family:Poppins,Arial,sans-serif;">
        Questions? <a href="mailto:support@upharvilla.in" style="color:${B.primary};text-decoration:none;">support@upharvilla.in</a>
        &nbsp;·&nbsp;
        <a href="${BASE_URL}" style="color:${B.primary};text-decoration:none;">Visit Store</a>
      </p>
    </td>
  </tr>`;
}

// ── CTA Button ────────────────────────────────────────────────────────────────
export function ctaButton(label: string, href: string): string {
  return `
  <table cellpadding="0" cellspacing="0" style="margin:24px auto 0;">
    <tr>
      <td style="background:${B.primary};border-radius:10px;text-align:center;">
        <a href="${href}"
           style="display:inline-block;padding:13px 32px;color:#ffffff;font-family:Poppins,Arial,sans-serif;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:0.3px;">
          ${label}
        </a>
      </td>
    </tr>
  </table>`;
}

// ── Info row (label + value) ───────────────────────────────────────────────
export function infoRow(label: string, value: string): string {
  return `
  <tr>
    <td style="font-family:Poppins,Arial,sans-serif;font-size:13px;color:${B.textLight};padding:4px 0;width:40%;">${label}</td>
    <td style="font-family:Poppins,Arial,sans-serif;font-size:13px;color:${B.textDark};font-weight:600;padding:4px 0;text-align:right;">${value}</td>
  </tr>`;
}

// ── Full email wrapper ─────────────────────────────────────────────────────
export function emailWrapper(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>UpharVilla</title>
</head>
<body style="margin:0;padding:0;background:${B.bg};font-family:Poppins,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${B.bg};padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="background:${B.white};border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(173,141,233,0.12);max-width:600px;width:100%;">
          ${body}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
