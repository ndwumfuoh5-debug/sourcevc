"use client";

import { PitchForm } from "./PitchForm";

export function SubmitSection() {
  return (
    <section id="submit" className="bg-[#FAFAF9] py-24 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-700 mb-4">
            Submit Your Pitch
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Share your vision.
          </h2>
          <p className="text-gray-500 text-lg">
            Fill out the form below — I personally review every submission.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <PitchForm />
        </div>
      </div>
    </section>
  );
}
