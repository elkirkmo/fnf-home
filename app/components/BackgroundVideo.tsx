import RandomBackground, { type VideoEntry } from "./RandomBackground";

// Files in /public. Each name needs a .webm and an .mp4; browsers take the
// first source they can play. Listed by hand so the page never depends on
// reading the filesystem at request time. Add `overlay` to pin a pattern.
const entries: Omit<VideoEntry, "sources">[] = [
  { name: "christmas-lights" },
  { name: "egyptian-sunrise" },
  { name: "golden-gate" },
  { name: "jellyfish" },
  { name: "lake-hike" },
  { name: "laundry-spin" },
];

const videos: VideoEntry[] = entries.map((video) => ({
  ...video,
  sources: [
    { url: `/${video.name}.webm`, type: "video/webm" },
    { url: `/${video.name}.mp4`, type: "video/mp4" },
  ],
}));

export default function BackgroundVideo() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-black">
      <RandomBackground videos={videos} />
    </div>
  );
}
