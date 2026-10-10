import type { Metadata } from "next";
import Link from "next/link";

import Header from "../components/Header";

export const metadata: Metadata = {
  title: "Portfolio | Friday Night Films",
};

export default function Portfolio() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-between py-24 text-white">
      <Header title="Portfolio" tagline="Friday Night Films" />
      {/* Placeholder until the portfolio content is decided. */}
      <div className="w-full max-w-5xl px-6 text-center sm:text-left">
        <p className="text-lg opacity-80">Work samples coming soon.</p>
        <Link
          href="/"
          className="group mt-6 inline-block text-sm opacity-70 transition-opacity hover:opacity-100"
        >
          <span className="inline-block transition-transform group-hover:-translate-x-1 motion-reduce:transform-none">
            &lt;-
          </span>{" "}
          Home
        </Link>
      </div>
    </main>
  );
}
