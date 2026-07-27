"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createSubmission } from "@/client-lib/api-client";

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

const ROUND_SIZES = [
  "Under $500K",
  "$500K–$1M",
  "$1M–$3M",
  "$3M–$5M",
  "$5M–$10M",
  "$10M+",
];

const AMOUNT_COMMITTED = [
  "Nothing yet",
  "Under $100K",
  "$100K–$500K",
  "$500K–$1M",
  "$1M+",
  "Fully committed (looking for strategic)",
];

// ─── Form State ───────────────────────────────────────────────────────────────

interface FormData {
  founder_name: string;
  founder_email: string;
  founder_linkedin: string;
  company_name: string;
  company_website: string;
  one_liner: string;
  sector: string;
  stage: string;
  round_size: string;
  amount_committed: string;
  pitch_deck_url: string;
  problem: string;
  why_now: string;
  consent: boolean;
}

const emptyForm: FormData = {
  founder_name: "",
  founder_email: "",
  founder_linkedin: "",
  company_name: "",
  company_website: "",
  one_liner: "",
  sector: "",
  stage: "",
  round_size: "",
  amount_committed: "",
  pitch_deck_url: "",
  problem: "",
  why_now: "",
  consent: false,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

function FieldInput({
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <div>
      <input
        {...props}
        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-gray-900 placeholder-gray-400 bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 ${
          error ? "border-red-400" : "border-gray-200"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function FieldSelect({
  error,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }) {
  return (
    <div>
      <select
        {...props}
        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-gray-900 bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 appearance-none cursor-pointer ${
          error ? "border-red-400" : "border-gray-200"
        }`}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function FieldTextarea({
  error,
  maxLength,
  value,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
  const len = typeof value === "string" ? value.length : 0;
  return (
    <div>
      <textarea
        {...props}
        value={value}
        maxLength={maxLength}
        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-gray-900 placeholder-gray-400 bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 resize-none ${
          error ? "border-red-400" : "border-gray-200"
        }`}
      />
      <div className="flex justify-between mt-1">
        {error ? <p className="text-xs text-red-500">{error}</p> : <span />}
        {maxLength && (
          <p className={`text-xs ml-auto ${len >= maxLength ? "text-red-500" : "text-gray-400"}`}>
            {len}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-green-700 whitespace-nowrap">
        {children}
      </p>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

// ─── Success State ────────────────────────────────────────────────────────────

function SuccessState({
  email,
  onReset,
}: {
  email: string;
  onReset: () => void;
}) {
  return (
    <div className="text-center py-12 px-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="text-green-600" size={32} />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
        Pitch received.
      </h3>
      <p className="text-gray-500 max-w-sm mx-auto leading-relaxed text-pretty">
        Thank you for sharing your vision. I personally review every submission
        and aim to respond within 2 weeks. You&apos;ll receive a confirmation at{" "}
        <span className="font-medium text-gray-700">{email}</span>.
      </p>
      <button
        onClick={onReset}
        className="mt-8 text-sm text-green-700 hover:text-green-800 underline underline-offset-2 transition-colors"
      >
        Submit another pitch
      </button>
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

export function PitchForm() {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const set = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.founder_name.trim()) e.founder_name = "Name is required";
    if (!form.founder_email.trim()) {
      e.founder_email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.founder_email)) {
      e.founder_email = "Enter a valid email address";
    }
    if (!form.company_name.trim()) e.company_name = "Company name is required";
    if (!form.one_liner.trim()) {
      e.one_liner = "One-liner is required";
    } else if (form.one_liner.length > 120) {
      e.one_liner = "Must be 120 characters or fewer";
    }
    if (!form.sector) e.sector = "Please select a sector";
    if (!form.stage) e.stage = "Please select a stage";
    if (!form.round_size) e.round_size = "Please select a round size";
    if (!form.pitch_deck_url.trim()) e.pitch_deck_url = "Pitch deck URL is required";
    if (!form.problem.trim()) {
      e.problem = "Please describe the problem";
    } else if (form.problem.length < 50) {
      e.problem = "Please provide at least 50 characters";
    }
    if (!form.why_now.trim()) e.why_now = "Please explain why now";
    if (!form.consent) e.consent = "Consent is required to submit";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await createSubmission({
        founder_name: form.founder_name,
        founder_email: form.founder_email,
        founder_linkedin: form.founder_linkedin || null,
        company_name: form.company_name,
        company_website: form.company_website || null,
        one_liner: form.one_liner,
        sector: form.sector,
        stage: form.stage,
        round_size: form.round_size,
        amount_committed: form.amount_committed || null,
        pitch_deck_url: form.pitch_deck_url,
        problem: form.problem,
        why_now: form.why_now,
        consent: form.consent,
      });
      setSubmittedEmail(form.founder_email);
      setSubmitted(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <SuccessState
        email={submittedEmail}
        onReset={() => {
          setForm(emptyForm);
          setSubmitted(false);
          setSubmittedEmail("");
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Section 1 — About You */}
      <div>
        <SectionHeading>About You</SectionHeading>
        <div className="space-y-4">
          <div>
            <FieldLabel required>Founder Name</FieldLabel>
            <FieldInput
              type="text"
              placeholder="Jane Smith"
              value={form.founder_name}
              onChange={(e) => set("founder_name", e.target.value)}
              error={errors.founder_name}
            />
          </div>
          <div>
            <FieldLabel required>Email Address</FieldLabel>
            <FieldInput
              type="email"
              placeholder="jane@company.com"
              value={form.founder_email}
              onChange={(e) => set("founder_email", e.target.value)}
              error={errors.founder_email}
            />
          </div>
          <div>
            <FieldLabel>LinkedIn Profile URL</FieldLabel>
            <FieldInput
              type="url"
              placeholder="https://linkedin.com/in/janesmith"
              value={form.founder_linkedin}
              onChange={(e) => set("founder_linkedin", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Section 2 — Your Company */}
      <div>
        <SectionHeading>Your Company</SectionHeading>
        <div className="space-y-4">
          <div>
            <FieldLabel required>Company Name</FieldLabel>
            <FieldInput
              type="text"
              placeholder="Acme Health"
              value={form.company_name}
              onChange={(e) => set("company_name", e.target.value)}
              error={errors.company_name}
            />
          </div>
          <div>
            <FieldLabel>Company Website</FieldLabel>
            <FieldInput
              type="url"
              placeholder="https://acmehealth.com"
              value={form.company_website}
              onChange={(e) => set("company_website", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel required>One-line description</FieldLabel>
            <FieldInput
              type="text"
              placeholder="We help hospitals reduce readmissions using AI-powered discharge planning."
              value={form.one_liner}
              onChange={(e) => set("one_liner", e.target.value)}
              error={errors.one_liner}
              maxLength={120}
            />
            <p className={`text-xs mt-1 text-right ${form.one_liner.length > 110 ? "text-red-500" : "text-gray-400"}`}>
              {form.one_liner.length}/120
            </p>
          </div>
        </div>
      </div>

      {/* Section 3 — The Deal */}
      <div>
        <SectionHeading>The Deal</SectionHeading>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel required>Sector</FieldLabel>
              <FieldSelect
                value={form.sector}
                onChange={(e) => set("sector", e.target.value)}
                error={errors.sector}
              >
                <option value="">Select sector…</option>
                {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
              </FieldSelect>
            </div>
            <div>
              <FieldLabel required>Stage</FieldLabel>
              <FieldSelect
                value={form.stage}
                onChange={(e) => set("stage", e.target.value)}
                error={errors.stage}
              >
                <option value="">Select stage…</option>
                {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </FieldSelect>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel required>Round Size Being Raised</FieldLabel>
              <FieldSelect
                value={form.round_size}
                onChange={(e) => set("round_size", e.target.value)}
                error={errors.round_size}
              >
                <option value="">Select range…</option>
                {ROUND_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
              </FieldSelect>
            </div>
            <div>
              <FieldLabel>Amount Committed So Far</FieldLabel>
              <FieldSelect
                value={form.amount_committed}
                onChange={(e) => set("amount_committed", e.target.value)}
              >
                <option value="">Select…</option>
                {AMOUNT_COMMITTED.map((s) => <option key={s} value={s}>{s}</option>)}
              </FieldSelect>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4 — Your Pitch */}
      <div>
        <SectionHeading>Your Pitch</SectionHeading>
        <div className="space-y-4">
          <div>
            <FieldLabel required>Pitch Deck URL</FieldLabel>
            <FieldInput
              type="url"
              placeholder="https://docsend.com/view/..."
              value={form.pitch_deck_url}
              onChange={(e) => set("pitch_deck_url", e.target.value)}
              error={errors.pitch_deck_url}
            />
            <p className="mt-1.5 text-xs text-gray-400">
              Share a link to your deck (DocSend, Google Drive, Dropbox, etc.)
            </p>
            <p className="mt-1 text-xs text-gray-400 flex items-center gap-1">
              <span>🔒</span> Your link is private and only visible to me.
            </p>
          </div>
          <div>
            <FieldLabel required>What problem are you solving?</FieldLabel>
            <FieldTextarea
              placeholder="Describe the core problem your company addresses…"
              value={form.problem}
              onChange={(e) => set("problem", e.target.value)}
              rows={4}
              maxLength={500}
              error={errors.problem}
            />
          </div>
          <div>
            <FieldLabel required>Why now?</FieldLabel>
            <FieldTextarea
              placeholder="What makes this the right moment to build this company?"
              value={form.why_now}
              onChange={(e) => set("why_now", e.target.value)}
              rows={3}
              maxLength={300}
              error={errors.why_now}
            />
          </div>
        </div>
      </div>

      {/* Section 5 — Consent */}
      <div className="pt-2">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-0.5 flex-shrink-0">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(e) => set("consent", e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                form.consent
                  ? "bg-[#14532D] border-[#14532D]"
                  : errors.consent
                    ? "border-red-400 bg-white"
                    : "border-gray-300 bg-white group-hover:border-green-600"
              }`}
            >
              {form.consent && <Check size={12} className="text-white" />}
            </div>
          </div>
          <span className="text-sm text-gray-600 leading-relaxed">
            I consent to my information and materials being stored and reviewed
            by the recipient for investment consideration purposes.
          </span>
        </label>
        {errors.consent && (
          <p className="mt-1.5 text-xs text-red-500 ml-8">{errors.consent}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting || !form.consent}
        className="w-full bg-[#14532D] hover:bg-[#166534] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-green-900/20 hover:scale-[1.01] flex items-center justify-center gap-2 text-base"
      >
        {submitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Submitting…
          </>
        ) : (
          "Submit Your Pitch →"
        )}
      </button>
    </form>
  );
}
