// The PODIUM display face is a demo release: it renders a "DEMO" watermark glyph
// instead of & - / and +. Render those characters in Inter so headings stay clean.
const BROKEN = /([&\-/+])/;

export default function PodiumText({ children }) {
  return String(children)
    .split(BROKEN)
    .map((part, i) =>
      BROKEN.test(part) ? (
        <span key={i} className="font-inter font-bold">
          {part}
        </span>
      ) : (
        part
      ),
    );
}
