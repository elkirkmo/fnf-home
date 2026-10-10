"use client";

import { useSyncExternalStore } from "react";

import { FractalOverlay, OVERLAY_NAMES, type OverlayName } from "./overlays";

export type VideoEntry = {
  name: string;
  sources: { url: string; type?: string }[];
  /** Pin an overlay to this video; otherwise one is picked at random. */
  overlay?: OverlayName;
};

type Pick = { video: number; overlay: number };

const randomIndex = (length: number) => Math.floor(Math.random() * length);

// One draw per page load, made on the client so the server render stays
// cacheable; the server snapshot is null so hydration always matches.
// `?video=<name>&overlay=<name>` force a combination for comparing pairings.
let pick: Pick | undefined;
const getPick = (videos: VideoEntry[]): Pick => {
  if (pick) return pick;
  const params = new URLSearchParams(window.location.search);
  const video = videos.findIndex((v) => v.name === params.get("video"));
  const overlay = OVERLAY_NAMES.indexOf(params.get("overlay") as OverlayName);
  pick = {
    video: video >= 0 ? video : randomIndex(videos.length),
    overlay: overlay >= 0 ? overlay : randomIndex(OVERLAY_NAMES.length),
  };
  return pick;
};
const getServerPick = () => null;
const subscribeNever = () => () => {};

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const subscribeReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const getReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;
const getServerReducedMotion = () => true;

export default function RandomBackground({
  videos,
}: {
  videos: VideoEntry[];
}) {
  const picked = useSyncExternalStore(
    subscribeNever,
    () => getPick(videos),
    getServerPick,
  );
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  );

  if (picked === null || videos.length === 0) return null;
  const video = videos[picked.video];
  const overlay = video.overlay ?? OVERLAY_NAMES[picked.overlay];

  return (
    <>
      <video
        // Remount when the motion preference flips so autoplay re-evaluates.
        key={String(reducedMotion)}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay={!reducedMotion}
        preload={reducedMotion ? "metadata" : "auto"}
        playsInline
        loop
        muted
      >
        {video.sources.map(({ url, type }) => (
          <source key={url} src={url} type={type} />
        ))}
      </video>
      <FractalOverlay name={overlay} />
    </>
  );
}
