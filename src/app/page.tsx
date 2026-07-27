'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createSubmission } from '@/client-lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

function SectionHeader({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-semibold shrink-0">
        {number}
      </div>
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive mt-1">{message}</p>;
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
      // Scroll to first error
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
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold mb-3">Pitch Received!</h1>
          <p className="text-muted-foreground text-pretty mb-8">
            Thank you for submitting your pitch. We review every submission carefully and will get
            back to you within 5 business days if there&apos;s a fit.
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
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Submit Your Pitch</h1>
        <p className="text-muted-foreground text-pretty">
          We review every submission within 5 business days. Fields marked with{' '}
          <span className="text-destructive">*</span> are required.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Section 1: Your Info */}
        <Card>
          <CardHeader className="pb-2">
            <SectionHeader number={1} title="Your Info" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div data-error={!!errors.founderName}>
              <Label htmlFor="founderName">
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
              <Label htmlFor="founderEmail">
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
              <Label htmlFor="founderLinkedin">LinkedIn URL</Label>
              <Input
                id="founderLinkedin"
                className="mt-1.5"
                placeholder="https://linkedin.com/in/janesmith"
                value={form.founderLinkedin}
                onChange={(e) => set('founderLinkedin', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="coFounders">Co-founder Names</Label>
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

        {/* Section 2: Your Company */}
        <Card>
          <CardHeader className="pb-2">
            <SectionHeader number={2} title="Your Company" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div data-error={!!errors.companyName}>
              <Label htmlFor="companyName">
                Company Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="companyName"
                className="mt-1.5"
                placeholder="Acme Inc."
                value={form.companyName}
                onChange={(e) => set('companyName', e.target.value)}
              />
              <FieldError message={errors.companyName} />
            </div>

            <div>
              <Label htmlFor="companyWebsite">Website</Label>
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
                <Label htmlFor="companyLocation">
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
                <Label htmlFor="foundedYear">Year Founded</Label>
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

        {/* Section 3: The Pitch */}
        <Card>
          <CardHeader className="pb-2">
            <SectionHeader number={3} title="The Pitch" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div data-error={!!errors.oneLiner}>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="oneLiner">
                  One-liner <span className="text-destructive">*</span>
                </Label>
                <span className="text-xs text-muted-foreground">
                  {form.oneLiner.length}/100
                </span>
              </div>
              <Input
                id="oneLiner"
                className=""
                placeholder="The Stripe for B2B payments in Southeast Asia"
                maxLength={100}
                value={form.oneLiner}
                onChange={(e) => set('oneLiner', e.target.value)}
              />
              <FieldError message={errors.oneLiner} />
            </div>

            <div data-error={!!errors.description}>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <span className="text-xs text-muted-foreground">
                  {form.description.length}/500
                </span>
              </div>
              <Textarea
                id="description"
                className="resize-none"
                rows={4}
                placeholder="Tell us more about the problem you're solving, your solution, and why now..."
                maxLength={500}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
              />
              <FieldError message={errors.description} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div data-error={!!errors.industry}>
                <Label>
                  Industry <span className="text-destructive">*</span>
                </Label>
                <Select value={form.industry} onValueChange={(v) => set('industry', v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRY_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.industry} />
              </div>

              <div data-error={!!errors.market}>
                <Label>
                  Target Market <span className="text-destructive">*</span>
                </Label>
                <Select value={form.market} onValueChange={(v) => set('market', v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select market" />
                  </SelectTrigger>
                  <SelectContent>
                    {MARKET_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.market} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Traction */}
        <Card>
          <CardHeader className="pb-2">
            <SectionHeader number={4} title="Traction" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div data-error={!!errors.stage}>
                <Label>
                  Stage <span className="text-destructive">*</span>
                </Label>
                <Select value={form.stage} onValueChange={(v) => set('stage', v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGE_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.stage} />
              </div>

              <div data-error={!!errors.arr}>
                <Label>
                  ARR <span className="text-destructive">*</span>
                </Label>
                <Select value={form.arr} onValueChange={(v) => set('arr', v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select ARR" />
                  </SelectTrigger>
                  <SelectContent>
                    {ARR_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.arr} />
              </div>

              <div data-error={!!errors.totalRaised}>
                <Label>
                  Total Raised <span className="text-destructive">*</span>
                </Label>
                <Select value={form.totalRaised} onValueChange={(v) => set('totalRaised', v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select total raised" />
                  </SelectTrigger>
                  <SelectContent>
                    {TOTAL_RAISED_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.totalRaised} />
              </div>

              <div data-error={!!errors.teamSize}>
                <Label>
                  Team Size <span className="text-destructive">*</span>
                </Label>
                <Select value={form.teamSize} onValueChange={(v) => set('teamSize', v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEAM_SIZE_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.teamSize} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Pitch Deck */}
        <Card>
          <CardHeader className="pb-2">
            <SectionHeader number={5} title="Pitch Deck" />
            <CardDescription className="text-xs">
              Share a link to your pitch deck (Google Drive, Dropbox, DocSend, Notion, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div data-error={!!errors.pitchDeckUrl}>
              <Label htmlFor="pitchDeckUrl">
                Pitch Deck URL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="pitchDeckUrl"
                className="mt-1.5"
                placeholder="https://drive.google.com/..."
                value={form.pitchDeckUrl}
                onChange={(e) => set('pitchDeckUrl', e.target.value)}
              />
              <FieldError message={errors.pitchDeckUrl} />
            </div>

            <div>
              <Label>How did you hear about us?</Label>
              <Select value={form.howHeard} onValueChange={(v) => set('howHeard', v)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {HOW_HEARD_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting…
            </>
          ) : (
            'Submit Pitch'
          )}
        </Button>
      </form>
    </div>
  );
}
