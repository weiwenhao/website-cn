import { Outfit } from "next/font/google";
import { Playground } from "@/components/features/playground";

// The layout loads Outfit at weight 400 only. The labels of the playground need the heavier weights.
const font = Outfit({ weight: ["400", "500", "600", "700"], subsets: ["latin"] });

// Outfit only covers Latin glyphs, so name the CJK faces explicitly instead of leaving it to the browser default.
const CJK = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", "Source Han Sans SC", sans-serif';

export default function PlaygroundPage() {
  return (
    <div className={font.className} style={{ fontFamily: `${font.style.fontFamily}, ${CJK}` }}>
      <Playground />
    </div>
  );
}
