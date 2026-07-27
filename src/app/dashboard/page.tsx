'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import {
  ExternalLink,
  Search,
  Trash2,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  buildSubmissionsKey,
  deleteSubmission,
  updateSubmissionStatus,
  useSubmissions,
  type SubmissionFilters,
} from '@/client-lib/api-client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  ARR_OPTIONS,
  INDUSTRY_OPTIONS,
  STAGE_OPTIONS,
  STATUS_COLORS,
  STATUS_LABELS,
  STATUS_OPTIONS,
  type PitchSubmission,
  type SubmissionStatus,
} from '@/shared/models/pitch-submission';

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function StatusBadge({ status }: { status: SubmissionStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

// ─── Detail Sheet ────────────────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}

function SubmissionSheet({
  submission,
  open,
  onClose,
  onStatusChange,
}: {
  submission: PitchSubmission | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: SubmissionStatus, notes: string) => Promise<void>;
}) {
  const [notes, setNotes] = useState('');
  const [savedIndicator, setSavedIndicator] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync notes when submission changes
  const prevIdRef = useRef<string | null>(null);
  if (submission && submission.id !== prevIdRef.current) {
    prevIdRef.current = submission.id;
    setNotes(submission.notes ?? '');
    setSavedIndicator(false);
  }

  function handleNotesChange(value: string) {
    setNotes(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (!submission) return;
      try {
        await onStatusChange(submission.id, submission.status, value);
        setSavedIndicator(true);
        setTimeout(() => setSavedIndicator(false), 2000);
      } catch {
        toast.error('Failed to save notes.');
      }
    }, 800);
  }

  async function handleStatusChange(status: SubmissionStatus) {
    if (!submission) return;
    try {
      await onStatusChange(submission.id, status, notes);
    } catch {
      toast.error('Failed to update status.');
    }
  }

  if (!submission) return null;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl">{submission.companyName}</SheetTitle>
          <p className="text-sm text-muted-foreground text-pretty">{submission.oneLiner}</p>
        </SheetHeader>

        {/* Status selector */}
        <div className="mb-6">
          <Label className="text-xs text-muted-foreground mb-2 block">Status</Label>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                  submission.status === s
                    ? `${STATUS_COLORS[s]} border-transparent ring-2 ring-offset-1 ring-primary/30`
                    : 'border-border bg-background text-muted-foreground hover:bg-muted'
                }`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Pitch deck */}
        <div className="mb-6">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => window.open(submission.pitchDeckUrl, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Pitch Deck
          </Button>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-muted-foreground">Internal Notes</Label>
            {savedIndicator && (
              <span className="text-xs text-green-600 dark:text-green-400">Saved ✓</span>
            )}
          </div>
          <Textarea
            className="resize-none text-sm"
            rows={4}
            placeholder="Add your notes here…"
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
          />
        </div>

        {/* Details */}
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Founder
            </p>
            <div className="space-y-2">
              <DetailRow label="Name" value={submission.founderName} />
              <DetailRow label="Email" value={submission.founderEmail} />
              {submission.founderLinkedin && (
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">LinkedIn</p>
                  <a
                    href={submission.founderLinkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {submission.founderLinkedin}
                  </a>
                </div>
              )}
              <DetailRow label="Co-founders" value={submission.coFounders} />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Company
            </p>
            <div className="space-y-2">
              <DetailRow label="Name" value={submission.companyName} />
              {submission.companyWebsite && (
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Website</p>
                  <a
                    href={submission.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {submission.companyWebsite}
                  </a>
                </div>
              )}
              <DetailRow label="Location" value={submission.companyLocation} />
              <DetailRow
                label="Founded"
                value={submission.foundedYear ? String(submission.foundedYear) : null}
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Pitch
            </p>
            <div className="space-y-2">
              <DetailRow label="Industry" value={submission.industry} />
              <DetailRow label="Market" value={submission.market} />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Description</p>
                <p className="text-sm text-pretty">{submission.description}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Traction
            </p>
            <div className="grid grid-cols-2 gap-2">
              <DetailRow label="Stage" value={submission.stage} />
              <DetailRow label="ARR" value={submission.arr} />
              <DetailRow label="Total Raised" value={submission.totalRaised} />
              <DetailRow label="Team Size" value={submission.teamSize} />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Meta
            </p>
            <div className="space-y-2">
              <DetailRow label="Submitted" value={formatDate(submission.createdAt)} />
              <DetailRow
                label="Reviewed"
                value={submission.reviewedAt ? formatDate(submission.reviewedAt) : null}
              />
              <DetailRow label="How they heard" value={submission.howHeard} />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <Card className={`border-border/70 shadow-sm ${accent ? 'bg-primary text-primary-foreground' : ''}`}>
      <CardHeader className="pb-1 pt-4 px-4">
        <CardTitle className={`text-xs font-semibold uppercase tracking-wider ${accent ? 'opacity-70' : 'text-muted-foreground'}`}>
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <p className="text-3xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

const ALL_VALUE = '__all__';

export default function DashboardPage() {
  const [filters, setFilters] = useState<SubmissionFilters>({});
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const swrKey = buildSubmissionsKey(filters);
  const { data: submissions, isLoading } = useSubmissions(filters);

  const filtered = useMemo(() => {
    if (!submissions) return [];
    if (!search.trim()) return submissions;
    const q = search.toLowerCase();
    return submissions.filter(
      (s) =>
        s.companyName.toLowerCase().includes(q) ||
        s.founderName.toLowerCase().includes(q) ||
        s.founderEmail.toLowerCase().includes(q),
    );
  }, [submissions, search]);

  const stats = useMemo(() => {
    const all = submissions ?? [];
    return {
      total: all.length,
      pending: all.filter((s) => s.status === 'pending').length,
      interested: all.filter((s) => s.status === 'interested').length,
      follow_up: all.filter((s) => s.status === 'follow_up').length,
      pass: all.filter((s) => s.status === 'pass').length,
    };
  }, [submissions]);

  const selected = useMemo(
    () => filtered.find((s) => s.id === selectedId) ?? null,
    [filtered, selectedId],
  );

  const handleStatusChange = useCallback(
    async (id: string, status: SubmissionStatus, notes: string) => {
      try {
        await updateSubmissionStatus(id, { status, notes });
      } catch {
        toast.error('Failed to update submission.');
        throw new Error('update failed');
      }
    },
    [],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteSubmission(id);
        if (selectedId === id) setSelectedId(null);
      } catch {
        toast.error('Failed to delete submission.');
      }
    },
    [selectedId],
  );

  function setFilter(key: keyof SubmissionFilters, value: string) {
    setFilters((prev) => ({
      ...prev,
      [key]: value === ALL_VALUE ? undefined : value,
    }));
  }

  return (
    <div className="space-y-6 py-2">
      {/* Page title */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-1">
          Healthworx Capital · Nana Dwumfuoh
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Pitch Submissions</h1>
        <p className="text-sm text-muted-foreground mt-1">Review and manage incoming pitches from healthcare founders.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard label="Total" value={stats.total} accent />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Interested" value={stats.interested} />
        <StatCard label="Follow Up" value={stats.follow_up} />
        <StatCard label="Pass" value={stats.pass} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            className="pl-9"
            placeholder="Search company or founder…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select
          value={filters.status ?? ALL_VALUE}
          onValueChange={(v) => setFilter('status', v)}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>All statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.stage ?? ALL_VALUE}
          onValueChange={(v) => setFilter('stage', v)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>All stages</SelectItem>
            {STAGE_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.industry ?? ALL_VALUE}
          onValueChange={(v) => setFilter('industry', v)}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>All industries</SelectItem>
            {INDUSTRY_OPTIONS.map((i) => (
              <SelectItem key={i} value={i}>
                {i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.arr ?? ALL_VALUE}
          onValueChange={(v) => setFilter('arr', v)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="ARR" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>All ARR</SelectItem>
            {ARR_OPTIONS.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[220px]">Company</TableHead>
              <TableHead>Founder</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>ARR</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-16 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <p className="font-medium">No submissions found</p>
                    <p className="text-xs">
                      {search || Object.values(filters).some(Boolean)
                        ? 'Try adjusting your filters.'
                        : 'Submissions will appear here once founders apply.'}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((submission) => (
                <TableRow
                  key={submission.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedId(submission.id)}
                >
                  <TableCell>
                    <p className="font-medium truncate max-w-[180px]">{submission.companyName}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                      {submission.oneLiner}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm truncate max-w-[140px]">{submission.founderName}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                      {submission.founderEmail}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{submission.stage}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{submission.arr}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{submission.industry}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={submission.status} />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(submission.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div
                      className="flex items-center justify-end gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="View pitch deck"
                        onClick={() => window.open(submission.pitchDeckUrl, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Change status">
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {STATUS_OPTIONS.map((s) => (
                            <DropdownMenuItem
                              key={s}
                              onClick={() =>
                                handleStatusChange(submission.id, s, submission.notes ?? '')
                              }
                              className={submission.status === s ? 'font-medium' : ''}
                            >
                              {STATUS_LABELS[s]}
                              {submission.status === s && (
                                <span className="ml-auto text-primary">✓</span>
                              )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        title="Delete submission"
                        onClick={() => handleDelete(submission.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Detail sheet */}
      <SubmissionSheet
        submission={selected}
        open={!!selectedId}
        onClose={() => setSelectedId(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}