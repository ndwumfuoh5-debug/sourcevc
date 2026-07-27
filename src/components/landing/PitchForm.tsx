"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createSubmission } from "@/client-lib/api-client";

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

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[11px] tracking-[0.15em] uppercase font-medium text-black/50 mb-2">
      {children}
      {required && <span className="text-black ml-1">*</span>}
    </label>
  );
}

function Input({ error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <div>
      <input
        {...props}
        className={`w-full px-4 py-3 border text-sm text-black placeholder-black/25 bg-white focus:outline-none focus:border-black transition-colors ${
          error ? "border-red-400" : "border-gray-200"
        }`}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SelectField({ error, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }) {
  return (
    <div>
      <select
        {...props}
        className={`w-full px-4 py-3 border text-sm text-black bg-white focus:outline-none focus:border-black transition-colors appearance-none cursor-pointer ${
          error ? "border-red-400" : "border-gray-200"
        }`}
      >
        {children}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function Textarea({ error, maxLength, value, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
  const len = typeof value === "string" ? value.length : 0;
  return (
    <div>
      <textarea
        {...props}
        value={value}
        maxLength={maxLength}
        className={`w-full px-4 py-3 border text-sm text-black placeholder-black/25 bg-white focus:outline-none focus:border-black transition-colors resize-none ${
          error ? "border-red-400" : "border-gray-200"
        }`}
      />
      <div className="flex justify-between mt-1">
        {error ? <p className="text-xs text-red-500">{error}</p> : <span />}
        {maxLength && (
          <p className={`text-xs ml-auto ${len >= maxLength ? "text-red-500" : "text-black/30"}`}>
            {len}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}

function SectionDivider({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-4 py-4 border-t border-gray-100">
      <span className="text-[10px] tracking-widest text-black/25 font-medium">{number}</span>
      <span className="text-[11px] tracking-[0.2em] uppercase font-medium text-black/50">{label}</span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

function SuccessState({ email, onReset }: { email: string; onReset: () => void }) {
  return (
    <div className="text-center py-16 px-4">
      {/* Checkmark */}
      <div className="w-12 h-12 border-2 border-black flex items-center justify-center mx-auto mb-8">
        <Check size={20} className="text-black" />
      </div>
      <h3 className="text-3xl font-black tracking-tight lowercase text-black mb-4">
        pitch received.
      </h3>
      <p className="text-gray-500 max-w-sm mx-auto leading-relaxed text-pretty text-sm">
        Thank you for sharing your vision. Every submission is personally reviewed
        — expect a response within 2 weeks. Confirmation sent to{" "}
        <span className="font-medium text-black">{email}</span>.
      </p>
      <button
        onClick={onReset}
        className="mt-10 text-xs tracking-widest uppercase text-black/40 hover:text-black underline underline-offset-4 transition-colors"
      >
        Submit another pitch
      </button>
    </div>
  );
}

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
    if (!form.founder_name.trim()) e.founder_name = "Required";
    if (!form.founder_email.trim()) {
      e.founder_email = "Required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.founder_email)) {
      e.founder_email = "Enter a valid email";
    }
    if (!form.company_name.trim()) e.company_name = "Required";
    if (!form.one_liner.trim()) e.one_liner = "Required";
    else if (form.one_liner.length > 120) e.one_liner = "120 characters max";
    if (!form.sector) e.sector = "Required";
    if (!form.stage) e.stage = "Required";
    if (!form.round_size) e.round_size = "Required";
    if (!form.pitch_deck_url.trim()) e.pitch_deck_url = "Required";
    if (!form.problem.trim()) e.problem = "Required";
    else if (form.problem.length < 50) e.problem = "At least 50 characters";
    if (!form.why_now.trim()) e.why_now = "Required";
    if (!form.consent) e.consent = "Consent required to submit";
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
        onReset={() => { setForm(emptyForm); setSubmitted(false); setSubmittedEmail(""); }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-1">

      <SectionDivider number="01" label="About You" />
      <div className="space-y-4 pt-2 pb-4">
        <div>
          <Label required>Founder Name</Label>
          <Input type="text" placeholder="Jane Smith" value={form.founder_name}
            onChange={(e) => set("founder_name", e.target.value)} error={errors.founder_name} />
        </div>
        <div>
          <Label required>Email Address</Label>
          <Input type="email" placeholder="jane@company.com" value={form.founder_email}
            onChange={(e) => set("founder_email", e.target.value)} error={errors.founder_email} />
        </div>
        <div>
          <Label>LinkedIn URL</Label>
          <Input type="url" placeholder="https://linkedin.com/in/janesmith" value={form.founder_linkedin}
            onChange={(e) => set("founder_linkedin", e.target.value)} />
        </div>
      </div>

      <SectionDivider number="02" label="Your Company" />
      <div className="space-y-4 pt-2 pb-4">
        <div>
          <Label required>Company Name</Label>
          <Input type="text" placeholder="Acme Health" value={form.company_name}
            onChange={(e) => set("company_name", e.target.value)} error={errors.company_name} />
        </div>
        <div>
          <Label>Website</Label>
          <Input type="url" placeholder="https://acmehealth.com" value={form.company_website}
            onChange={(e) => set("company_website", e.target.value)} />
        </div>
        <div>
          <Label required>One-line description</Label>
          <Input type="text" placeholder="We help hospitals reduce readmissions using AI." value={form.one_liner}
            onChange={(e) => set("one_liner", e.target.value)} error={errors.one_liner} maxLength={120} />
          <p className={`text-xs mt-1 text-right ${form.one_liner.length > 110 ? "text-red-500" : "text-black/30"}`}>
            {form.one_liner.length}/120
          </p>
        </div>
      </div>

      <SectionDivider number="03" label="The Deal" />
      <div className="space-y-4 pt-2 pb-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label required>Sector</Label>
            <SelectField value={form.sector} onChange={(e) => set("sector", e.target.value)} error={errors.sector}>
              <option value="">Select sector…</option>
              {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
            </SelectField>
          </div>
          <div>
            <Label required>Stage</Label>
            <SelectField value={form.stage} onChange={(e) => set("stage", e.target.value)} error={errors.stage}>
              <option value="">Select stage…</option>
              {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
            </SelectField>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label required>Round Size Being Raised</Label>
            <SelectField value={form.round_size} onChange={(e) => set("round_size", e.target.value)} error={errors.round_size}>
              <option value="">Select range…</option>
              {ROUND_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </SelectField>
          </div>
          <div>
            <Label>Amount Committed So Far</Label>
            <SelectField value={form.amount_committed} onChange={(e) => set("amount_committed", e.target.value)}>
              <option value="">Select…</option>
              {AMOUNT_COMMITTED.map((s) => <option key={s} value={s}>{s}</option>)}
            </SelectField>
          </div>
        </div>
      </div>

      <SectionDivider number="04" label="Your Pitch" />
      <div className="space-y-4 pt-2 pb-4">
        <div>
          <Label required>Pitch Deck URL</Label>
          <Input type="url" placeholder="https://docsend.com/view/..." value={form.pitch_deck_url}
            onChange={(e) => set("pitch_deck_url", e.target.value)} error={errors.pitch_deck_url} />
          <p className="mt-2 text-xs text-black/30">
            DocSend, Google Drive, or Dropbox link · Private and confidential
          </p>
        </div>
        <div>
          <Label required>What problem are you solving?</Label>
          <Textarea placeholder="Describe the core problem your company addresses…" value={form.problem}
            onChange={(e) => set("problem", e.target.value)} rows={4} maxLength={500} error={errors.problem} />
        </div>
        <div>
          <Label required>Why now?</Label>
          <Textarea placeholder="What makes this the right moment to build this company?" value={form.why_now}
            onChange={(e) => set("why_now", e.target.value)} rows={3} maxLength={300} error={errors.why_now} />
        </div>
      </div>

      <SectionDivider number="05" label="Consent" />
      <div className="pt-3 pb-6">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-0.5 flex-shrink-0">
            <input type="checkbox" checked={form.consent} onChange={(e) => set("consent", e.target.checked)} className="sr-only" />
            <div className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${
              form.consent ? "bg-black border-black" : errors.consent ? "border-red-400" : "border-gray-300 group-hover:border-black"
            }`}>
              {form.consent && <Check size={11} className="text-white" />}
            </div>
          </div>
          <span className="text-sm text-gray-600 leading-relaxed">
            I consent to my information and materials being stored and reviewed for investment consideration purposes.
          </span>
        </label>
        {errors.consent && <p className="mt-1.5 text-xs text-red-500 ml-8">{errors.consent}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting || !form.consent}
        className="w-full bg-black hover:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold tracking-widest uppercase py-4 rounded-full transition-colors flex items-center justify-center gap-2"
      >
        {submitting ? (
          <><Loader2 size={14} className="animate-spin" /> Submitting…</>
        ) : (
          "Submit your pitch →"
        )}
      </button>
    </form>
  );
}
