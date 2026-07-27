"use client";

import { useState, useMemo, useCallback } from "react";
import { Search, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useSubmissions,
  updateSubmissionStatus,
  type PitchSubmission,
} from "@/client-lib/api-client";
import { SubmissionSheet } from "@/components/dashboard/SubmissionSheet";
import { toast } from "sonner";

// ─── Constants ────────────────────────────────────────────────────────────────

const SECTORS = [
  "Digital Health",
  "AI / ML in Healthcare",
  "Payer-Provider Tech",
  "Biotech / Pharma",
  "Medical Devices",
  "Health & Wellness",
  "Mental Health",
  "Genomics & Diagnostics",
  "Health Data & Infrastructure",
  "Other",
];

const STAGES = ["Pre-Seed", "Seed", "Series A", "Series B+"];

const STATUS_OPTIONS: { value: PitchSubmission["status"]; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "reviewing", label: "Reviewing" },
  { value: "meeting_scheduled", label: "Meeting Scheduled" },
  { value: "passed", label: "Passed" },
];

const STATUS_BADGE: Record<PitchSubmission["status"], { bg: string; text: string; label: string }> = {
  pending: { bg: "bg-gray-100", text: "text-gray-600", label: "Pending" },
  reviewing: { bg: "bg-blue-50", text: "text-blue-700", label: "Reviewing" },
  meeting_scheduled: { bg: "bg-green-50", text: "text-green-700", label: "Meeting Scheduled" },
  passed: { bg: "bg-rose-50", text: "text-rose-700", label: "Passed" },
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  count,
  accent,
}: {
  label: string;
  count: number;
  accent: string;
}) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 p-5 border-l-4 ${accent}`}>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-3xl font-bold text-gray-900 tracking-tight">{count}</p>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PitchSubmission["status"] }) {
  const s = STATUS_BADGE[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: submissions, isLoading, error } = useSubmissions();

  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Stats
  const stats = useMemo(() => {
    const all = submissions ?? [];
    return {
      total: all.length,
      pending: all.filter((s) => s.status === "pending").length,
      reviewing: all.filter((s) => s.status === "reviewing").length,
      meeting_scheduled: all.filter((s) => s.status === "meeting_scheduled").length,
      passed: all.filter((s) => s.status === "passed").length,
    };
  }, [submissions]);

  // Filtered list
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return (submissions ?? []).filter((s) => {
      if (q && !s.company_name.toLowerCase().includes(q) && !s.founder_name.toLowerCase().includes(q)) return false;
      if (sectorFilter !== "all" && s.sector !== sectorFilter) return false;
      if (stageFilter !== "all" && s.stage !== stageFilter) return false;
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      return true;
    });
  }, [submissions, search, sectorFilter, stageFilter, statusFilter]);

  const selectedSubmission = useMemo(
    () => (submissions ?? []).find((s) => s.id === selectedId) ?? null,
    [submissions, selectedId],
  );

  const hasFilters = search || sectorFilter !== "all" || stageFilter !== "all" || statusFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setSectorFilter("all");
    setStageFilter("all");
    setStatusFilter("all");
  };

  const openSheet = useCallback((id: string) => {
    setSelectedId(id);
    setSheetOpen(true);
  }, []);

  const handleStatusChange = useCallback(
    async (id: string, status: PitchSubmission["status"]) => {
      try {
        await updateSubmissionStatus(id, status);
      } catch {
        toast.error("Failed to update status");
      }
    },
    [],
  );

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 bg-[#14532D] rounded flex items-center justify-center text-white text-xs font-bold">
              N
            </span>
            <h1 className="text-base font-semibold text-gray-900 tracking-tight">
              Deal Flow Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {stats.pending > 0 && (
              <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                {stats.pending} new
              </span>
            )}
            <span className="text-xs text-gray-400 hidden md:block">{today}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard label="Total" count={stats.total} accent="border-l-gray-300" />
          <StatCard label="Pending" count={stats.pending} accent="border-l-gray-400" />
          <StatCard label="Reviewing" count={stats.reviewing} accent="border-l-blue-400" />
          <StatCard label="Meeting Scheduled" count={stats.meeting_scheduled} accent="border-l-green-500" />
          <StatCard label="Passed" count={stats.passed} accent="border-l-rose-400" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search company or founder…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 placeholder-gray-400"
            />
          </div>

          {/* Sector */}
          <Select value={sectorFilter} onValueChange={setSectorFilter}>
            <SelectTrigger className="w-44 h-9 text-sm border-gray-200">
              <SelectValue placeholder="All sectors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sectors</SelectItem>
              {SECTORS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* Stage */}
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-36 h-9 text-sm border-gray-200">
              <SelectValue placeholder="All stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All stages</SelectItem>
              {STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* Status */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 h-9 text-sm border-gray-200">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors px-2 py-1.5"
            >
              <X size={14} />
              Clear
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-gray-400 text-sm">Loading submissions…</div>
          ) : error ? (
            <div className="p-12 text-center text-red-500 text-sm">Failed to load submissions.</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">
              {hasFilters ? "No submissions match your filters." : "No submissions yet."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Founder</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Sector</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Stage</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Round</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Submitted</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((sub) => (
                  <TableRow
                    key={sub.id}
                    className="cursor-pointer hover:bg-gray-50/60 transition-colors"
                    onClick={() => openSheet(sub.id)}
                  >
                    <TableCell className="font-medium text-gray-900 text-sm">
                      <div>
                        <p className="font-semibold">{sub.company_name}</p>
                        {sub.company_website && (
                          <p className="text-xs text-gray-400 truncate max-w-[140px]">{sub.company_website}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      <div>
                        <p>{sub.founder_name}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[140px]">{sub.founder_email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 hidden md:table-cell">
                      <span className="text-xs">{sub.sector}</span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 hidden lg:table-cell">{sub.stage}</TableCell>
                    <TableCell className="text-sm text-gray-600 hidden lg:table-cell">{sub.round_size}</TableCell>
                    <TableCell>
                      <StatusBadge status={sub.status} />
                    </TableCell>
                    <TableCell className="text-xs text-gray-400 hidden md:table-cell">
                      {new Date(sub.submitted_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={sub.status}
                        onValueChange={(v) => handleStatusChange(sub.id, v as PitchSubmission["status"])}
                      >
                        <SelectTrigger className="h-7 w-32 text-xs border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value} className="text-xs">
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Row count */}
        {!isLoading && !error && filtered.length > 0 && (
          <p className="text-xs text-gray-400 text-right">
            Showing {filtered.length} of {submissions?.length ?? 0} submissions
          </p>
        )}
      </div>

      {/* Detail Sheet */}
      <SubmissionSheet
        submission={selectedSubmission}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}
