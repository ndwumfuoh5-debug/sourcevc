/* eslint-disable @next/next/no-img-element */

export default function HomePage() {
  return (
    // Placeholder UI, to be removed by the AI and replaced with what the user wants
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <img src="/vybe-icon-black.svg" alt="" className="h-10 w-10 opacity-30 dark:invert" />
        <h2>Let&apos;s build</h2>
        <p className="text-center text-muted-foreground/60 text-[14px]">
          Type in your first prompt
          <br />
          using the chat on the left
        </p>
      </div>
    </div>
  );
}
