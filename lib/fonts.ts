import { IBM_Plex_Mono, Outfit } from "next/font/google";

export const outfit = Outfit({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
});

export const MONO_FONT_STACK =
  "var(--font-ibm-plex-mono), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
