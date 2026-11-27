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

export default function Home() {
  return (
    <div className="overflow-x-clip bg-white text-[#2F3437]">
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
          <SectionHead index="05" title="赞助商" />
          <div className="mt-12">
            <Sponsors />
          </div>
        </div>
      </section>
    </div>
  );
}
