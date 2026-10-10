import { frostedGlass } from "./styles";

type HeaderProps = {
  title: string;
  tagline: string;
  detail?: string;
};

export default function Header({ title, tagline, detail }: HeaderProps) {
  return (
    <header
      className={`w-full px-6 py-10 text-right text-white sm:px-20 ${frostedGlass}`}
    >
      <h1 className="text-5xl font-semibold tracking-tight text-balance sm:text-7xl lg:text-8xl">
        {title}
      </h1>
      <p className="mt-2 text-xl sm:text-2xl">{tagline}</p>
      {detail && <p className="mt-1 text-base opacity-80 sm:text-lg">{detail}</p>}
    </header>
  );
}
