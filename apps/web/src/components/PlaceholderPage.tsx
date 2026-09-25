import type { ReactNode } from "react";

type PlaceholderPageProps = {
  title: string;
  children?: ReactNode;
};

export function PlaceholderPage({ title, children }: PlaceholderPageProps) {
  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8">
      <h1 className="font-display text-4xl leading-none font-semibold tracking-[-0.03em]">
        {title}
      </h1>
      <p className="mt-3 text-ash">Temporary page while the site is set up.</p>
      {children}
    </section>
  );
}
