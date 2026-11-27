import { Outfit } from "next/font/google";
import { Benchmarks } from "@/components/features/home/bench";
import { Hero } from "@/components/features/home/hero";
import {
  Features,
  Pillars,
  ProjectList,
  SectionHead,
  Sponsors,
  UseCases,
} from "@/components/features/home/sections";

// The layout loads Outfit at weight 400 only. The landing page needs the heavier weights for its headings.
const font = Outfit({ weight: ["400", "500", "600", "700"], subsets: ["latin"] });

// Outfit only covers Latin glyphs, so name the CJK faces explicitly instead of leaving it to the browser default.
const CJK = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", "Source Han Sans SC", sans-serif';

// Hero entrance: one short fade-up per block. The ring of the special sponsor shows the whole spectrum, and
// the spectrum flows along it. All of it is skipped when the visitor prefers reduced motion.
const MOTION = `
.nax-rainbow {
  background-image: linear-gradient(90deg, #ED4845, #F59E0B, #FACC15, #22C55E, #06B6D4, #3B82F6, #8B5CF6, #EC4899, #ED4845);
  background-size: 150px 100%;
  background-repeat: repeat-x;
}
@media (prefers-reduced-motion: no-preference) {
  @keyframes nax-rise {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: none; }
  }
  .nax-rise {
    animation: nax-rise 700ms cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: calc(var(--i, 0) * 80ms);
  }
  @keyframes nax-flow {
    to { background-position: 150px 0; }
  }
  .nax-rainbow {
    animation: nax-flow 4s linear infinite;
  }
}
`;

export default function Home() {
  return (
    <div
      className={`${font.className} overflow-x-clip bg-white text-[#2F3437]`}
      style={{ fontFamily: `${font.style.fontFamily}, ${CJK}` }}
    >
      <style>{MOTION}</style>

      <Hero />

      {/* 01 pillars: the red band continues the red panel of the hero */}
      <section className="bg-[#D93A36] py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <SectionHead index="01" title="为什么选择 Nax?" tone="red" />
          <div className="mt-14">
            <Pillars />
          </div>
        </div>
      </section>

      {/* 02 benchmarks */}
      <section className="bg-[#111112] py-20 text-white lg:py-28">
        <div className="container mx-auto px-4">
          <SectionHead
            index="02"
            title="基准测试"
            lead="与 Go、Rust、Node.js 在同一环境下对比。Nax 以红色标出，数值轴均从零开始。"
            tone="ink"
          />
          <div className="mt-14">
            <Benchmarks />
          </div>
        </div>
      </section>

      {/* 03 features */}
      <section className="bg-[#F6F5F2] py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <SectionHead index="03" title="语言特性" />
          <div className="mt-14">
            <Features />
          </div>
        </div>
      </section>

      {/* 04 use cases and projects */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <SectionHead index="04" title="应用场景" />
          <div className="mt-14">
            <UseCases />
          </div>
          <h3 className="mt-20 text-2xl font-bold text-[#111112]">使用 Nax 构建的项目</h3>
          <div className="mt-6">
            <ProjectList />
          </div>
        </div>
      </section>

      {/* 05 sponsors */}
      <section className="bg-[#F6F5F2] py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <SectionHead index="05" title="Sponsors" />
          <div className="mt-12">
            <Sponsors />
          </div>
        </div>
      </section>
    </div>
  );
}
