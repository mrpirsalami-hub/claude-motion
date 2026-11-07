import { continueRender, delayRender, staticFile } from "remotion";

// Persian font (Vazirmatn), bundled locally in public/fonts so rendering
// works offline. Arabic subset covers Persian letters; Latin covers digits/English.
export const fontFamily = "Vazirmatn, sans-serif";

const weights = [400, 700, 900];
const subsets = {
  arabic: "U+0600-06FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE80-FEFC",
  latin: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
};

const handle = delayRender("Loading Vazirmatn font");
Promise.all(
  Object.entries(subsets).flatMap(([subset, range]) =>
    weights.map(async (w) => {
      const face = new FontFace(
        "Vazirmatn",
        `url(${staticFile(`fonts/vazirmatn-${subset}-${w}-normal.woff2`)}) format("woff2")`,
        { weight: String(w), unicodeRange: range },
      );
      await face.load();
      document.fonts.add(face);
    }),
  ),
)
  .then(() => continueRender(handle))
  .catch((err) => {
    console.error("Font load failed", err);
    continueRender(handle);
  });

// Central palette: change here and every scene follows.
export const colors = {
  bg: "#0B0D14",
  panel: "#151927",
  text: "#F4F6FB",
  muted: "#8B93A7",
  accent: "#FF7A45",
  accent2: "#5B8CFF",
};

export const FPS = 30;
