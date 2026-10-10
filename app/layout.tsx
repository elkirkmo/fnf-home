import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Jost } from "next/font/google";
import BackgroundVideo from "./components/BackgroundVideo";
import "./globals.css";

// Futura is commercial, so it can't be bundled. Devices that ship it (macOS,
// iOS) use it; everyone else gets Jost, a free typeface modelled on Futura.
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Friday Night Films",
  description:
    "Friday Night Films is a film production company offering grip & electric and post-production services.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <BackgroundVideo />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
