// Benchmark charts for the landing page, on the ink band. The numbers are the ones in the nax README (Nax v0.7.2).
// One metric per chart (a time and a memory figure never share an axis). Nax is the one accent
// color, the rest are neutral gray; every bar is labeled at its tip and every chart has a table twin.

type Row = { name: string; value: number; label: string };

type Chart = {
  id: string;
  title: string;
  unit: string;
  better: string;
  rows: Row[];
};

// Three headline figures taken from the charts below.
const STATS = [
  { value: "~73", unit: "ms", label: "1 亿次 C 函数调用（sqrt）", note: "Go 约 2,178 ms" },
  { value: "~969", unit: "MB", label: "100 万协程的内存峰值", note: "Go 约 2,580 MB" },
  { value: "~104,000", unit: "req/s", label: "HTTP 服务", note: "Go 约 90,000，Node.js 约 66,000" },
];

const CHARTS: Chart[] = [
  {
    id: "http",
    title: "HTTP 服务（req/s）",
    unit: "每秒请求数",
    better: "越高越好",
    rows: [
      { name: "Nax", value: 104000, label: "~104,000" },
      { name: "Go", value: 90000, label: "~90,000" },
      { name: "Node.js", value: 66000, label: "~66,000" },
    ],
  },
  {
    id: "coroutine-time",
    title: "100 万协程：创建耗时",
    unit: "毫秒",
    better: "越低越好",
    rows: [
      { name: "Nax", value: 559, label: "~559 ms" },
      { name: "Go", value: 1035, label: "~1,035 ms" },
    ],
  },
  {
    id: "coroutine-memory",
    title: "100 万协程：内存峰值",
    unit: "MB",
    better: "越低越好",
    rows: [
      { name: "Nax", value: 969, label: "~969 MB" },
      { name: "Go", value: 2580, label: "~2,580 MB" },
    ],
  },
  {
    id: "ffi",
    title: "1 亿次 C 函数调用（sqrt）",
    unit: "毫秒",
    better: "越低越好",
    rows: [
      { name: "Nax", value: 73, label: "~73 ms" },
      { name: "Go", value: 2178, label: "~2,178 ms" },
    ],
  },
  {
    id: "fib",
    title: "Fibonacci(45)",
    unit: "秒",
    better: "越低越好",
    rows: [
      { name: "Rust", value: 1.7, label: "~1.7 s" },
      { name: "Nax", value: 2.4, label: "~2.4 s" },
      { name: "Go", value: 2.4, label: "~2.4 s" },
      { name: "Node.js", value: 6.0, label: "~6.0 s" },
    ],
  },
  {
    id: "pi",
    title: "计算 π，10 亿次",
    unit: "毫秒",
    better: "越低越好",
    rows: [
      { name: "Nax", value: 512, label: "~512 ms" },
      { name: "Go", value: 512, label: "~512 ms" },
      { name: "Rust", value: 552, label: "~552 ms" },
      { name: "Node.js", value: 850, label: "~850 ms" },
    ],
  },
];

function BarChart({ chart }: { chart: Chart }) {
  const max = Math.max(...chart.rows.map((r) => r.value));
  return (
    <figure aria-labelledby={`bench-${chart.id}`} className="border border-white/20 p-6 sm:p-7">
      <figcaption>
        <h3 id={`bench-${chart.id}`} className="text-[16px] font-bold text-white">
          {chart.title}
        </h3>
      </figcaption>

      <div aria-hidden="true" className="mt-7 space-y-3.5">
        {chart.rows.map((row) => {
          const isNax = row.name === "Nax";
          return (
            <div key={row.name} className="grid grid-cols-[4rem_1fr] items-center gap-3">
              <span className={`text-[13px] ${isNax ? "font-bold text-white" : "text-zinc-400"}`}>{row.name}</span>
              <div className="flex items-center gap-2.5">
                <div
                  title={`${row.name}: ${row.label} ${chart.unit}`}
                  className={`h-3 min-w-[4px] ${isNax ? "bg-nax-red" : "bg-zinc-600"}`}
                  style={{ width: `${(row.value / max) * 72}%` }}
                />
                <span
                  className={`whitespace-nowrap font-mono text-[12.5px] tabular-nums ${
                    isNax ? "font-semibold text-white" : "text-zinc-400"
                  }`}
                >
                  {row.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <table className="sr-only">
        <caption>
          {chart.title}（{chart.unit}，{chart.better}）
        </caption>
        <thead>
          <tr>
            <th scope="col">语言</th>
            <th scope="col">结果</th>
          </tr>
        </thead>
        <tbody>
          {chart.rows.map((row) => (
            <tr key={row.name}>
              <th scope="row">{row.name}</th>
              <td>{row.label}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

export function Benchmarks() {
  return (
    <div>
      <dl className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.label} className="border-2 border-white p-8">
            <dt className="text-[14px] text-zinc-400">{s.label}</dt>
            <dd className="mt-4">
              <span className="text-[56px] font-bold leading-none tracking-[-0.04em] text-nax-red lg:text-[64px]">{s.value}</span>
              <span className="ml-2 text-lg text-zinc-300">{s.unit}</span>
              <div className="mt-4 text-[15px] text-zinc-400">{s.note}</div>
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {CHARTS.map((chart) => (
          <BarChart key={chart.id} chart={chart} />
        ))}
      </div>

      <p className="mt-8 text-[13px] leading-[1.9] text-zinc-500">
        测试环境：Nax v0.7.2、Go 1.25.5、Rust 1.92.0、Node.js v25.2.0，Linux 虚拟机（aarch64，Apple M4，9 核，8 GB）。
        <br className="hidden sm:inline" />
        完整数据与测试方法见{" "}
        <a
          href="https://github.com/nature-lang/benchmark"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 transition-colors hover:text-nax-red"
        >
          benchmark 仓库
        </a>
        。
      </p>
    </div>
  );
}
