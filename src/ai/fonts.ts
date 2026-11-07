import { continueRender, delayRender, staticFile } from "remotion";
// Vazirmatn (Persian) is loaded by ../theme; importing it here registers it.
import "../theme";

// Inter (Latin), bundled in public/fonts so rendering works offline.
const handle = delayRender("Loading Inter font");
Promise.all(
  [400, 600, 700].map(async (w) => {
    const face = new FontFace(
      "Inter",
      `url(${staticFile(`fonts/inter-latin-${w}-normal.woff2`)}) format("woff2")`,
      { weight: String(w) },
    );
    await face.load();
    document.fonts.add(face);
  }),
)
  .then(() => continueRender(handle))
  .catch((err) => {
    console.error("Inter font load failed", err);
    continueRender(handle);
  });
