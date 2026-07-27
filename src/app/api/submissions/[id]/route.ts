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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as { status?: string; notes?: string };

  const setClauses: string[] = ['updated_at = NOW()'];
  const queryParams: (string | null | number)[] = [];
  let paramIndex = 1;

  if (body.status !== undefined) {
    setClauses.push(`status = $${paramIndex++}`);
    queryParams.push(body.status);
    // Set reviewed_at when status changes away from pending
    if (body.status !== 'pending') {
      setClauses.push(`reviewed_at = NOW()`);
    }
  }

  if (body.notes !== undefined) {
    setClauses.push(`notes = $${paramIndex++}`);
    queryParams.push(body.notes);
  }

  queryParams.push(id);
  const idParam = paramIndex;

  const sql = `
    UPDATE pitch_submissions
    SET ${setClauses.join(', ')}
    WHERE id = $${idParam}
    RETURNING *
  `;

  const rows = (await queryInternalDatabase(sql, queryParams)) as DbRow[];
  const row = rows[0];
  if (!row) {
    return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
  }
  return NextResponse.json(mapRow(row));
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await queryInternalDatabase('DELETE FROM pitch_submissions WHERE id = $1', [id]);
  return NextResponse.json({ success: true });
}
