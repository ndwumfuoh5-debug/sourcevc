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
  stage?: string;
  round_size?: string;
  amount_committed?: string | null;
  pitch_deck_url?: string;
  problem?: string;
  why_now?: string;
  consent?: boolean;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubmissionBody;

    const required: (keyof SubmissionBody)[] = [
      'founder_name',
      'founder_email',
      'company_name',
      'one_liner',
      'sector',
      'stage',
      'round_size',
      'pitch_deck_url',
      'problem',
      'why_now',
    ];

    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 },
        );
      }
    }

    if (!body.consent) {
      return NextResponse.json(
        { error: 'Consent is required' },
        { status: 400 },
      );
    }

    const result = await queryInternalDatabase(
      `INSERT INTO pitch_submissions
        (founder_name, founder_email, founder_linkedin, company_name, company_website,
         one_liner, sector, stage, round_size, amount_committed, pitch_deck_url,
         problem, why_now, consent)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       RETURNING id, company_name, founder_email`,
      [
        body.founder_name ?? '',
        body.founder_email ?? '',
        body.founder_linkedin ?? null,
        body.company_name ?? '',
        body.company_website ?? null,
        body.one_liner ?? '',
        body.sector ?? '',
        body.stage ?? '',
        body.round_size ?? '',
        body.amount_committed ?? null,
        body.pitch_deck_url ?? '',
        body.problem ?? '',
        body.why_now ?? '',
        body.consent ?? false,
      ],
    );

    return NextResponse.json(result[0], { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await queryInternalDatabase(
      `SELECT id, founder_name, founder_email, founder_linkedin, company_name,
              company_website, one_liner, sector, stage, round_size, amount_committed,
              pitch_deck_url, problem, why_now, consent, status, notes, submitted_at
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
