import Link from "next/link";
import { CodeSnippet } from "@/components/features/home/code-snippet";

type Tone = "paper" | "ink" | "red";

const HEAD: Record<Tone, { index: string; title: string; lead: string }> = {
  paper: { index: "text-nax-red", title: "text-[#111112]", lead: "text-[#4A4A47]" },
  ink: { index: "text-nax-red", title: "text-white", lead: "text-zinc-400" },
  red: { index: "text-white/70", title: "text-white", lead: "text-white/90" },
};

// Every section opens the same way: a large index number, then the title. No rules, the structure comes from boxes.
export function SectionHead({
  index,
  title,
  lead,
  tone = "paper",
}: {
  index: string;
  title: string;
  lead?: React.ReactNode;
  tone?: Tone;
}) {
  const c = HEAD[tone];
  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-4 lg:grid-cols-12">
      <div className={`text-6xl font-bold leading-none tracking-[-0.04em] lg:col-span-3 ${c.index}`}>{index}</div>
      <div className="lg:col-span-9">
        <h2 className={`text-balance text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-[56px] ${c.title}`}>{title}</h2>
        {lead && <p className={`mt-6 max-w-3xl text-pretty text-[17px] leading-[1.9] ${c.lead}`}>{lead}</p>}
      </div>
    </div>
  );
}

function Chip({ children }: { children: string }) {
  return (
    <span className="border border-[#111112]/20 bg-[#F6F5F2] px-2.5 py-1.5 font-mono text-[12px] leading-none text-[#2F3437]">
      {children}
    </span>
  );
}

// The first three cards are the site's original ones, texts unchanged; the fourth is the two run modes, worded as a list of noun phrases like the others. They sit on the red band, each in its own box.
const PILLARS = [
  { title: "轻量&简洁&自然", text: "轻量、简洁、一致性的语法设计，轻松掌握并快速上手使用" },
  { title: "安全可靠", text: "强类型、静态分析与编译、内存安全、异常处理，轻松编写安全可靠的软件" },
  {
    title: "高性能",
    text: "高性能 GC 实现、高性能共享栈协程实现、基于 libuv 的网络 IO、使用纯 C 实现的 runtime",
  },
  {
    title: "混合运行模式",
    text: "n 模式的 GC 与协程调度、x 模式的手动内存管理、两种模式的相互调用",
  },
];

export function Pillars() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
      {PILLARS.map((p) => (
        <div key={p.title} className="border-2 border-white/70 p-8">
          <h3 className="text-[24px] font-bold leading-tight text-white">{p.title}</h3>
          <p className="mt-4 text-pretty text-[16px] leading-[1.9] text-white/90">{p.text}</p>
        </div>
      ))}
    </div>
  );
}

const TARGETS = ["linux_amd64", "linux_arm64", "linux_riscv64", "darwin_amd64", "darwin_arm64", "windows_amd64"];

type Feature = { title: string; text: string; span: string; chips?: string[]; code?: string };

// This program was built and run with the current nax: it prints 12.000000.
const FFI_CODE = `import libc

fn main() {
    f64 r = libc.sqrt(144.0)
    println(r) // 12.000000
}`;

const FEATURES: Feature[] = [
  {
    title: "内置并发",
    text: "内置并发原语 go、future、channel 与 select，基于共享栈协程，每秒能够进行数百万次的协程切换",
    span: "lg:col-span-5",
    chips: ["go", "future", "channel", "select"],
  },
  {
    title: "原生工具链",
    text: "直接编译为目标平台的机器码，不依赖 LLVM，自带汇编器以及 ELF、Mach-O、COFF/PE 链接器，支持交叉编译",
    span: "lg:col-span-7",
    chips: TARGETS,
  },
  {
    title: "零开销 C FFI",
    text: "无性能损耗调用 C 标准库函数，也可以链接任意语言构建的静态库",
    span: "lg:col-span-6",
    code: FFI_CODE,
  },
  {
    title: "类型系统与开发工具",
    text: "完善的类型系统，支持 generics、enum、tagged union、interface、nullable(?)、errable(!)。集中式包管理系统 npkg、编辑器 lsp 支持、nax fmt，并支持直接在源码文件中编写测试",
    span: "lg:col-span-6",
    chips: ["generics", "enum", "tagged union", "interface", "nullable(?)", "errable(!)", "npkg", "lsp", "nax fmt", "test"],
  },
];

export function Features() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12">
      {FEATURES.map((f) => (
        <div key={f.title} className={`flex flex-col border-2 border-[#111112] bg-white p-8 sm:p-10 ${f.span}`}>
          <h3 className="text-2xl font-bold text-[#111112]">{f.title}</h3>
          <p className="mt-4 text-pretty text-[16px] leading-[1.9] text-[#4A4A47]">{f.text}</p>
          {f.code && (
            <div className="mt-auto pt-7">
              <div className="overflow-x-auto border border-[#111112]/15 bg-[#F6F5F2] px-5 py-4">
                <CodeSnippet code={f.code} theme="light" className="text-[12.5px] leading-[1.75]" />
              </div>
            </div>
          )}
          {f.chips && (
            <div className="mt-auto flex flex-wrap gap-2 pt-7">
              {f.chips.map((chip) => (
                <Chip key={chip}>{chip}</Chip>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// The four use cases are the site's original copy.
const USE_CASES = [
  { title: "服务端应用", text: "API、命令行、MCP 服务、网络中间件" },
  { title: "系统编程", text: "操作系统、物联网、容器系统" },
  { title: "游戏开发", text: "游戏引擎和游戏开发" },
  { title: "探索可能性", text: "数据库、编程教学、GUI、计算机科学 ..." },
];

export function UseCases() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {USE_CASES.map(({ title, text }, i) => (
        <div key={title} className="border-2 border-[#111112] p-7">
          <div className="font-mono text-[13px] font-medium text-nax-red">{String(i + 1).padStart(2, "0")}</div>
          <h3 className="mt-3 text-[26px] font-bold leading-tight text-[#111112]">{title}</h3>
          <p className="mt-3 text-pretty text-[16px] leading-[1.85] text-[#4A4A47]">{text}</p>
        </div>
      ))}
    </div>
  );
}

// Names and descriptions follow the project list in the site navigation.
const PROJECTS = [
  { name: "Dbdriver", text: "mysql/postgresql/redis 驱动", href: "https://github.com/weiwenhao/dbdriver" },
  { name: "API Framework", text: "RESTful API 示例，亦可作为 API 框架使用", href: "https://github.com/weiwenhao/emoji-api" },
  { name: "Parker", text: "轻量打包工具", href: "https://github.com/weiwenhao/parker" },
  { name: "Llama.n", text: "Llama2 模型 nax 语言实现", href: "https://github.com/weiwenhao/llama.n" },
  { name: "Tetris Game", text: "俄罗斯方块游戏，适用于 macOS", href: "https://github.com/weiwenhao/tetris" },
  { name: "Playground Server", text: "Playground 服务端 API 实现", href: "https://github.com/weiwenhao/playground" },
];

export function ProjectList() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {PROJECTS.map((p) => (
        <a
          key={p.name}
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start justify-between gap-4 border-2 border-[#111112] px-7 py-5 transition-colors hover:border-nax-red"
        >
          <div>
            <div className="text-xl font-bold text-[#111112] transition-colors group-hover:text-nax-red">{p.name}</div>
            <div className="mt-1 text-[15px] leading-relaxed text-[#6B6A67]">{p.text}</div>
          </div>
          <span aria-hidden className="mt-0.5 text-xl text-[#111112] transition-colors group-hover:text-nax-red">
            ↗
          </span>
        </a>
      ))}
    </div>
  );
}

function Sponsor({ name, special = false }: { name: string; special?: boolean }) {
  const chip = (
    <Link
      href={`https://github.com/${name}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2.5 rounded-full bg-white py-1.5 pl-1.5 pr-4 ${
        special ? "" : "border-2 border-[#111112] transition-colors hover:border-nax-red"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`https://github.com/${name}.png`} alt={`${name} logo`} className="h-9 w-9 rounded-full" />
      <span className="font-mono text-[13px] text-[#2F3437]">{name}</span>
    </Link>
  );

  // The special sponsor wears a ring of the whole color spectrum instead of the ink border; `.nax-rainbow` is defined in the page's <style>.
  return special ? <div className="nax-rainbow rounded-full p-[3px]">{chip}</div> : chip;
}

export function Sponsors() {
  return (
    <div className="flex flex-col items-center gap-7">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className="text-sm text-[#6B6A67]">特别赞助：</span>
        <Sponsor name="linky6565" special />
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {["cn-lang", "zhangchunlin", "mmachatschek", "infinilabs"].map((name) => (
          <Sponsor key={name} name={name} />
        ))}
      </div>
    </div>
  );
}
