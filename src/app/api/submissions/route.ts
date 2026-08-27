import { queryInternalDatabase } from '@/server-lib/internal-db-query';
import { NextResponse } from 'next/server';

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
  problem?: string;
  why_now?: string;
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
      'problem',
      'why_now',
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
         pitch_deck_url, problem, why_now, strategic_fit, consent, quick_scan_tag)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
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
        body.problem ?? '',
        body.why_now ?? '',
        body.strategic_fit ?? [],
        body.consent ?? false,
        quickScanTag,
      ],
    );

    return NextResponse.json(result[0], { status: 201 });
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
              round_size, amount_committed, pitch_deck_url, problem, why_now,
              strategic_fit, consent, status, notes, quick_scan_tag, submitted_at
       FROM pitch_submissions
       ORDER BY submitted_at DESC`,
      [],
    );
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
