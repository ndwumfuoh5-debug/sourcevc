import { queryInternalDatabase } from '@/server-lib/internal-db-query';
import { NextResponse } from 'next/server';

// ─── Config ───────────────────────────────────────────────────────────────────

// TODO: Set ADMIN_EMAIL env var to receive admin notifications
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'ndsourced@gmail.com';
// TODO: Set RESEND_API_KEY env var to enable emails
const RESEND_API_KEY = process.env.RESEND_API_KEY ?? 're_FfLEE2Fx_J6SWA4yHEGLL3auBNupA8srK';
const FROM_EMAIL = 'onboarding@resend.dev'; // switch to submissions@ndc.vc once domain is verified

// ─── Email helpers ────────────────────────────────────────────────────────────

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) return; // silently skip until key is configured
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    });
  } catch (e) {
    console.error('Email send failed:', e);
  }
}

interface SubmissionBody {
  founder_name?: string;
  founder_email?: string;
  founder_linkedin?: string | null;
  company_name?: string;
  company_website?: string | null;
  one_liner?: string;
  sector?: string;
  arr_bucket?: string;
  fda_clearance?: string;
  stage?: string;
  round_size?: string;
  amount_committed?: string | null;
  pitch_deck_url?: string;
  strategic_fit?: string[];
  consent?: boolean;
}

// ─── Auto-tagging logic ───────────────────────────────────────────────────────

const WASTE_COMPLIANCE_COST_TAGS = new Set([
  "Reducing administrative / operational waste",
  "Regulatory & compliance automation",
  "Cost containment / affordability",
  "Fraud / waste / abuse detection",
]);

function computeQuickScanTag(body: SubmissionBody): string {
  const arr = body.arr_bucket ?? "";
  const fda = body.fda_clearance ?? "";
  const fit = body.strategic_fit ?? [];

  const arrOk = arr === "$1M–$5M" || arr === "$5M+";
  const fdaOk = fda === "No";
  const themeCount = fit.filter((f) => WASTE_COMPLIANCE_COST_TAGS.has(f)).length;
  const themeOk = themeCount >= 2;

  if (arrOk && fdaOk && themeOk) return "Core fit";
  if (arr === "Pre-revenue" || fda === "Yes" || themeCount === 0) return "Outside current focus";
  return "Possible fit";
}

// ─── POST — create submission ─────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubmissionBody;

    const required: (keyof SubmissionBody)[] = [
      'founder_name',
      'founder_email',
      'company_name',
      'one_liner',
      'sector',
      'arr_bucket',
      'fda_clearance',
      'stage',
      'round_size',
      'pitch_deck_url',
    ];

    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    if (!body.consent) {
      return NextResponse.json({ error: 'Consent is required' }, { status: 400 });
    }

    const quickScanTag = computeQuickScanTag(body);

    const result = await queryInternalDatabase(
      `INSERT INTO pitch_submissions
        (founder_name, founder_email, founder_linkedin, company_name, company_website,
         one_liner, sector, arr_bucket, fda_clearance, stage, round_size, amount_committed,
         pitch_deck_url, strategic_fit, consent, quick_scan_tag)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       RETURNING id, company_name, founder_email`,
      [
        body.founder_name ?? '',
        body.founder_email ?? '',
        body.founder_linkedin ?? null,
        body.company_name ?? '',
        body.company_website ?? null,
        body.one_liner ?? '',
        body.sector ?? '',
        body.arr_bucket ?? '',
        body.fda_clearance ?? '',
        body.stage ?? '',
        body.round_size ?? '',
        body.amount_committed ?? null,
        body.pitch_deck_url ?? '',
        body.strategic_fit ?? [],
        body.consent ?? false,
        quickScanTag,
      ],
    );

    const row = result[0] as { id: string; company_name: string; founder_email: string };

    // ── Founder acknowledgment (fire-and-forget) ──────────────────────────────
    void sendEmail(
      row.founder_email,
      'We received your submission',
      `<p>Hi ${body.founder_name ?? ''},</p>
       <p>Thanks for sharing. I review submissions on a rolling basis and will follow up if there's a fit.</p>
       <p style="color:#888;font-size:12px;">This is an automated confirmation. Please do not reply to this email.</p>`,
    );

    // ── Admin notification (fire-and-forget) ─────────────────────────────────
    if (ADMIN_EMAIL) {
      void sendEmail(
        ADMIN_EMAIL,
        `New submission: ${row.company_name} — ${quickScanTag}`,
        `<p><strong>Company:</strong> ${body.company_name}</p>
         <p><strong>Founder:</strong> ${body.founder_name} (${body.founder_email})</p>
         <p><strong>ARR:</strong> ${body.arr_bucket}</p>
         <p><strong>Quick-scan:</strong> ${quickScanTag}</p>
         <p><a href="${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/dashboard">View in dashboard</a></p>`,
      );
    }

    return NextResponse.json(row, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// ─── GET — list all submissions ───────────────────────────────────────────────

export async function GET() {
  try {
    const result = await queryInternalDatabase(
      `SELECT id, founder_name, founder_email, founder_linkedin, company_name,
              company_website, one_liner, sector, arr_bucket, fda_clearance, stage,
              round_size, amount_committed, pitch_deck_url,
              strategic_fit, consent, status, notes, quick_scan_tag, submitted_at
       FROM pitch_submissions
       ORDER BY submitted_at DESC`,
      [],
    );
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ e.message || 'Server error' }, { status: 500 });
  }
}
