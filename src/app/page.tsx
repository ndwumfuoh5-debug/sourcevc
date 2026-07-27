'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, ArrowRight, HeartPulse } from 'lucide-react';
import { toast } from 'sonner';
import { createSubmission } from '@/client-lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  ARR_OPTIONS,
  HOW_HEARD_OPTIONS,
  INDUSTRY_OPTIONS,
  MARKET_OPTIONS,
  STAGE_OPTIONS,
  TEAM_SIZE_OPTIONS,
  TOTAL_RAISED_OPTIONS,
} from '@/shared/models/pitch-submission';

interface FormData {
  founderName: string;
  founderEmail: string;
  founderLinkedin: string;
  coFounders: string;
  companyName: string;
  companyWebsite: string;
  companyLocation: string;
  foundedYear: string;
  oneLiner: string;
  description: string;
  industry: string;
  market: string;
  stage: string;
  arr: string;
  totalRaised: string;
  teamSize: string;
  pitchDeckUrl: string;
  howHeard: string;
}

interface FormErrors {
  founderName?: string;
  founderEmail?: string;
  companyName?: string;
  companyLocation?: string;
  oneLiner?: string;
  description?: string;
  industry?: string;
  market?: string;
  stage?: string;
  arr?: string;
  totalRaised?: string;
  teamSize?: string;
  pitchDeckUrl?: string;
}

const EMPTY_FORM: FormData = {
  founderName: '',
  founderEmail: '',
  founderLinkedin: '',
  coFounders: '',
  companyName: '',
  companyWebsite: '',
  companyLocation: '',
  foundedYear: '',
  oneLiner: '',
  description: '',
  industry: '',
  market: '',
  stage: '',
  arr: '',
  totalRaised: '',
  teamSize: '',
  pitchDeckUrl: '',
  howHeard: '',
};

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validate(form: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.founderName.trim()) errors.founderName = 'Founder name is required.';
  if (!form.founderEmail.trim()) {
    errors.founderEmail = 'Email is required.';
  } else if (!validateEmail(form.founderEmail)) {
    errors.founderEmail = 'Please enter a valid email address.';
  }
  if (!form.companyName.trim()) errors.companyName = 'Company name is required.';
  if (!form.companyLocation.trim()) errors.companyLocation = 'Location is required.';
  if (!form.oneLiner.trim()) errors.oneLiner = 'One-liner is required.';
  if (!form.description.trim()) errors.description = 'Description is required.';
  if (!form.industry) errors.industry = 'Please select an industry.';
  if (!form.market) errors.market = 'Please select a target market.';
  if (!form.stage) errors.stage = 'Please select a stage.';
  if (!form.arr) errors.arr = 'Please select your ARR.';
  if (!form.totalRaised) errors.totalRaised = 'Please select total raised.';
  if (!form.teamSize) errors.teamSize = 'Please select team size.';
  if (!form.pitchDeckUrl.trim()) errors.pitchDeckUrl = 'Pitch deck URL is required.';
  return errors;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive mt-1">{message}</p>;
}

function SectionLabel({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 border border-primary/20">
        {number}
      </div>
      <h2 className="text-sm font-semibold tracking-wide uppercase text-primary/80">{title}</h2>
    </div>
  );
}

export default function SubmitPitchPage() {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function set(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstErrorEl = document.querySelector('[data-error="true"]');
      firstErrorEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSubmitting(true);
    try {
      await createSubmission({
        founderName: form.founderName,
        founderEmail: form.founderEmail,
        founderLinkedin: form.founderLinkedin || undefined,
        coFounders: form.coFounders || undefined,
        companyName: form.companyName,
        companyWebsite: form.companyWebsite || undefined,
        companyLocation: form.companyLocation,
        foundedYear: form.foundedYear ? parseInt(form.foundedYear, 10) : undefined,
        oneLiner: form.oneLiner,
        description: form.description,
        market: form.market,
        industry: form.industry,
        stage: form.stage,
        arr: form.arr,
        totalRaised: form.totalRaised,
        teamSize: form.teamSize,
        pitchDeckUrl: form.pitchDeckUrl,
        howHeard: form.howHeard || undefined,
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Nav */}
        <nav className="border-b border-border/60 bg-card/80 backdrop-blur-sm px-6 py-4 flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary">
            <HeartPulse className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-foreground">Healthworx</span>
        </nav>

        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-6">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/20">
                <CheckCircle2 className="w-9 h-9 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-semibold mb-3 tracking-tight">Pitch Received</h1>
            <p className="text-muted-foreground text-pretty mb-8 leading-relaxed">
              Thank you for sharing your vision. We review every submission personally and will reach
              out within 5 business days if there&apos;s a fit.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setForm(EMPTY_FORM);
                setErrors({});
                setSubmitted(false);
              }}
            >
              Submit another pitch
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-10 border-b border-border/60 bg-card/90 backdrop-blur-sm px-6 py-4 flex items-center gap-2.5">
        <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary">
          <HeartPulse className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-semibold text-sm tracking-tight text-foreground">Healthworx</span>
      </nav>

      {/* Hero */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-2xl mx-auto px-6 py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60 mb-4">
            Nana Dwumfuoh · Healthworx Capital
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-5">
            Submit Your Pitch
          </h1>
          <p className="text-lg opacity-75 text-pretty max-w-prose leading-relaxed">
            Backing the next generation of healthcare solutions. Every submission is reviewed
            personally — tell us your story.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <p className="text-xs text-muted-foreground mb-8">
          Fields marked <span className="text-destructive font-medium">*</span> are required. We
          respond within 5 business days.
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Section 1 */}
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-0 pt-6 px-6">
              <SectionLabel number={1} title="Your Info" />
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              <div data-error={!!errors.founderName}>
                <Label htmlFor="founderName" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Founder Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="founderName"
                  className="mt-1.5"
                  placeholder="Jane Smith"
                  value={form.founderName}
                  onChange={(e) => set('founderName', e.target.value)}
                />
                <FieldError message={errors.founderName} />
              </div>

              <div data-error={!!errors.founderEmail}>
                <Label htmlFor="founderEmail" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="founderEmail"
                  type="email"
                  className="mt-1.5"
                  placeholder="jane@startup.com"
                  value={form.founderEmail}
                  onChange={(e) => set('founderEmail', e.target.value)}
                />
                <FieldError message={errors.founderEmail} />
              </div>

              <div>
                <Label htmlFor="founderLinkedin" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">LinkedIn URL</Label>
                <Input
                  id="founderLinkedin"
                  className="mt-1.5"
                  placeholder="https://linkedin.com/in/janesmith"
                  value={form.founderLinkedin}
                  onChange={(e) => set('founderLinkedin', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="coFounders" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Co-founder Names</Label>
                <Input
                  id="coFounders"
                  className="mt-1.5"
                  placeholder="John Doe, Alex Kim"
                  value={form.coFounders}
                  onChange={(e) => set('coFounders', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 2 */}
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-0 pt-6 px-6">
              <SectionLabel number={2} title="Your Company" />
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              <div data-error={!!errors.companyName}>
                <Label htmlFor="companyName" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Company Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="companyName"
                  className="mt-1.5"
                  placeholder="Acme Health Inc."
                  value={form.companyName}
                  onChange={(e) => set('companyName', e.target.value)}
                />
                <FieldError message={errors.companyName} />
              </div>

              <div>
                <Label htmlFor="companyWebsite" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Website</Label>
                <Input
                  id="companyWebsite"
                  className="mt-1.5"
                  placeholder="https://acme.com"
                  value={form.companyWebsite}
                  onChange={(e) => set('companyWebsite', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div data-error={!!errors.companyLocation}>
                  <Label htmlFor="companyLocation" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Location <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="companyLocation"
                    className="mt-1.5"
                    placeholder="San Francisco, CA"
                    value={form.companyLocation}
                    onChange={(e) => set('companyLocation', e.target.value)}
                  />
                  <FieldError message={errors.companyLocation} />
                </div>
                <div>
                  <Label htmlFor="foundedYear" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Year Founded</Label>
                  <Input
                    id="foundedYear"
                    type="number"
                    className="mt-1.5"
                    placeholder="2023"
                    min={1900}
                    max={new Date().getFullYear()}
                    value={form.foundedYear}
                    onChange={(e) => set('foundedYear', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3 */}
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-0 pt-6 px-6">
              <SectionLabel number={3} title="The Pitch" />
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              <div data-error={!!errors.oneLiner}>
                <div className="flex items-center justify-between mb-1.5">
                  <Label htmlFor="oneLiner" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    One-liner <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-xs text-muted-foreground">{form.oneLiner.length}/100</span>
                </div>
                <Input
                  id="oneLiner"
                  placeholder="The Stripe for remote patient monitoring"
                  maxLength={100}
                  value={form.oneLiner}
                  onChange={(e) => set('oneLiner', e.target.value)}
                />
                <FieldError message={errors.oneLiner} />
              </div>

              <div data-error={!!errors.description}>
                <div className="flex items-center justify-between mb-1.5">
                  <Label htmlFor="description" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-xs text-muted-foreground">{form.description.length}/500</span>
                </div>
                <Textarea
                  id="description"
                  className="resize-none"
                  rows={4}
                  placeholder="Tell us about the problem you're solving, your solution, and why now…"
                  maxLength={500}
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                />
                <FieldError message={errors.description} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div data-error={!!errors.industry}>
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Industry <span className="text-destructive">*</span>
                  </Label>
                  <Select value={form.industry} onValueChange={(v) => set('industry', v)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRY_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError message={errors.industry} />
                </div>
                <div data-error={!!errors.market}>
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Target Market <span className="text-destructive">*</span>
                  </Label>
                  <Select value={form.market} onValueChange={(v) => set('market', v)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select market" />
                    </SelectTrigger>
                    <SelectContent>
                      {MARKET_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError message={errors.market} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4 */}
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-0 pt-6 px-6">
              <SectionLabel number={4} title="Traction" />
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="grid grid-cols-2 gap-4">
                <div data-error={!!errors.stage}>
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Stage <span className="text-destructive">*</span>
                  </Label>
                  <Select value={form.stage} onValueChange={(v) => set('stage', v)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {STAGE_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError message={errors.stage} />
                </div>

                <div data-error={!!errors.arr}>
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    ARR <span className="text-destructive">*</span>
                  </Label>
                  <Select value={form.arr} onValueChange={(v) => set('arr', v)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select ARR" />
                    </SelectTrigger>
                    <SelectContent>
                      {ARR_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError message={errors.arr} />
                </div>

                <div data-error={!!errors.totalRaised}>
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Total Raised <span className="text-destructive">*</span>
                  </Label>
                  <Select value={form.totalRaised} onValueChange={(v) => set('totalRaised', v)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select total raised" />
                    </SelectTrigger>
                    <SelectContent>
                      {TOTAL_RAISED_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError message={errors.totalRaised} />
                </div>

                <div data-error={!!errors.teamSize}>
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Team Size <span className="text-destructive">*</span>
                  </Label>
                  <Select value={form.teamSize} onValueChange={(v) => set('teamSize', v)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEAM_SIZE_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError message={errors.teamSize} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 5 */}
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-0 pt-6 px-6">
              <SectionLabel number={5} title="Pitch Deck" />
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              <p className="text-xs text-muted-foreground -mt-2">
                Share a link to your deck — Google Drive, Dropbox, DocSend, or Notion all work.
              </p>
              <div data-error={!!errors.pitchDeckUrl}>
                <Label htmlFor="pitchDeckUrl" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Pitch Deck URL <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="pitchDeckUrl"
                  className="mt-1.5"
                  placeholder="https://drive.google.com/…"
                  value={form.pitchDeckUrl}
                  onChange={(e) => set('pitchDeckUrl', e.target.value)}
                />
                <FieldError message={errors.pitchDeckUrl} />
              </div>

              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">How did you hear about us?</Label>
                <Select value={form.howHeard} onValueChange={(v) => set('howHeard', v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {HOW_HEARD_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            size="lg"
            className="w-full font-semibold tracking-wide"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                Send Your Pitch
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border/50 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex items-center justify-center w-5 h-5 rounded bg-primary/80">
              <HeartPulse className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground tracking-wide">HEALTHWORX</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Nana Dwumfuoh · Backing the next generation of healthcare solutions
          </p>
        </div>
      </div>
    </div>
  );
}
