import Link from "next/link";

import Header from "./components/Header";
import { frostedGlass } from "./components/styles";

type Section = {
  title: string;
  description: string;
  href?: string;
};

const sections: Section[] = [
  {
    title: "Grip & Electric",
    description: "Crew and equipment for lighting and rigging on set",
  },
  {
    title: "Post-Production",
    description: "Editing and finishing, from first cut to final delivery",
  },
  {
    title: "Portfolio",
    description: "Work we've shot, lit, and finished",
    href: "/portfolio",
  },
];

const cardClassName = "rounded-lg border border-transparent px-5 py-4";

function SectionCard({ title, description, href }: Section) {
  const body = (
    <>
      <h2 className="mb-3 text-2xl font-semibold">
        {title}{" "}
        {href && (
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            →
          </span>
        )}
      </h2>
      <p className="m-0 max-w-[30ch] text-sm text-balance opacity-70">
        {description}
      </p>
    </>
  );

  return href ? (
    <Link
      href={href}
      className={`group ${cardClassName} transition-colors hover:border-neutral-700 hover:bg-neutral-800/30`}
    >
      {body}
    </Link>
  ) : (
    <div className={cardClassName}>{body}</div>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-between py-24 text-white">
      <Header
        title="Friday Night Films"
        tagline="Film production"
        detail="Award-winning pre, prod and post since 2007"
      />
      <nav className={`w-full py-6 ${frostedGlass}`}>
        <div className="mx-auto grid w-full max-w-5xl gap-2 px-6 text-center sm:grid-cols-3 sm:text-left">
          {sections.map((section) => (
            <SectionCard key={section.title} {...section} />
          ))}
        </div>
      </nav>
    </main>
  );
}
