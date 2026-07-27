import { NextRequest, NextResponse } from 'next/server';
import { queryInternalDatabase } from '@/server-lib/internal-db-query';
import type { PitchSubmission } from '@/shared/models/pitch-submission';

type DbRow = {
  id: string;
  created_at: string;
  updated_at: string;
  founder_name: string;
  founder_email: string;
  founder_linkedin: string | null;
  co_founders: string | null;
  company_name: string;
  company_website: string | null;
  company_location: string;
  founded_year: number | null;
  one_liner: string;
  description: string;
  market: string;
  industry: string;
  stage: string;
  arr: string;
  total_raised: string;
  team_size: string;
  pitch_deck_url: string;
  how_heard: string | null;
  status: string;
  notes: string | null;
  reviewed_at: string | null;
};

function mapRow(row: DbRow): PitchSubmission {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    founderName: row.founder_name,
    founderEmail: row.founder_email,
    founderLinkedin: row.founder_linkedin,
    coFounders: row.co_founders,
    companyName: row.company_name,
    companyWebsite: row.company_website,
    companyLocation: row.company_location,
    foundedYear: row.founded_year,
    oneLiner: row.one_liner,
    description: row.description,
    market: row.market,
    industry: row.industry,
    stage: row.stage,
    arr: row.arr,
    totalRaised: row.total_raised,
    teamSize: row.team_size,
    pitchDeckUrl: row.pitch_deck_url,
    howHeard: row.how_heard,
    status: row.status as PitchSubmission['status'],
    notes: row.notes,
    reviewedAt: row.reviewed_at,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const stage = searchParams.get('stage');
  const industry = searchParams.get('industry');
  const arr = searchParams.get('arr');

  const conditions: string[] = [];
  const params: string[] = [];
  let paramIndex = 1;

  if (status) {
    conditions.push(`status = $${paramIndex++}`);
    params.push(status);
  }
  if (stage) {
    conditions.push(`stage = $${paramIndex++}`);
    params.push(stage);
  }
  if (industry) {
    conditions.push(`industry = $${paramIndex++}`);
    params.push(industry);
  }
  if (arr) {
    conditions.push(`arr = $${paramIndex++}`);
    params.push(arr);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const sql = `SELECT * FROM pitch_submissions ${where} ORDER BY created_at DESC`;

  const rows = (await queryInternalDatabase(sql, params)) as DbRow[];
  return NextResponse.json(rows.map(mapRow));
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    founderName: string;
    founderEmail: string;
    founderLinkedin?: string;
    coFounders?: string;
    companyName: string;
    companyWebsite?: string;
    companyLocation: string;
    foundedYear?: number;
    oneLiner: string;
    description: string;
    market: string;
    industry: string;
    stage: string;
    arr: string;
    totalRaised: string;
    teamSize: string;
    pitchDeckUrl: string;
    howHeard?: string;
  };

  const sql = `
    INSERT INTO pitch_submissions (
      founder_name, founder_email, founder_linkedin, co_founders,
      company_name, company_website, company_location, founded_year,
      one_liner, description, market, industry, stage,
      arr, total_raised, team_size, pitch_deck_url, how_heard
    ) VALUES (
      $1, $2, $3, $4,
      $5, $6, $7, $8,
      $9, $10, $11, $12, $13,
      $14, $15, $16, $17, $18
    )
    RETURNING *
  `;

  const params = [
    body.founderName,
    body.founderEmail,
    body.founderLinkedin ?? null,
    body.coFounders ?? null,
    body.companyName,
    body.companyWebsite ?? null,
    body.companyLocation,
    body.foundedYear ?? null,
    body.oneLiner,
    body.description,
    body.market,
    body.industry,
    body.stage,
    body.arr,
    body.totalRaised,
    body.teamSize,
    body.pitchDeckUrl,
    body.howHeard ?? null,
  ];

  const rows = (await queryInternalDatabase(sql, params)) as DbRow[];
  const row = rows[0];
  if (!row) {
    return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 });
  }
  return NextResponse.json(mapRow(row), { status: 201 });
}
