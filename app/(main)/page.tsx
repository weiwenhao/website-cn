import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/features/code-block";
import { Gamepad2, Bot, Cog, Globe } from "lucide-react";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <main>
        {/* hero */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* 左侧内容 */}
            <div className="flex flex-col gap-8">
              <div className="space-y-6">
                <h1 className="text-5xl font-bold text-nature-red">
                  Nature ...
                </h1>

                <p className="text-2xl leading-relaxed text-gray-800 dark:text-gray-200">
                  通用开源编程语言与编译器，期望为开发者提供
                  <span className="font-semibold">简洁优雅</span>
                  的开发体验，能够
                  <span className="font-semibold">简单高效</span>
                  构建出安全可靠的跨平台软件。
                </p>
                <p></p>
                <p></p>
                <p></p>
              </div>

              <div className="flex items-center gap-6">
                <Button
                  size="lg"
                  className="bg-nature-red hover:bg-nature-red/80 text-white px-8 py-6 text-lg rounded-md shadow-lg flex items-center gap-2"
                  asChild
                >
                  <Link href="/docs/get-started" rel="noopener noreferrer">
                    快速开始
                  </Link>
                </Button>
                <span className="text-gray-600 dark:text-gray-400">or</span>
                <Link
                  href="/playground"
                  className="text-nature-red hover:text-nature-red/90 text-lg font-medium hover:underline"
                >
                  在浏览器中尝试
                </Link>
              </div>
            </div>

            {/* 右侧代码展示 */}
            <div className="rounded-lg border bg-card text-card-foreground shadow">
              <CodeBlock />
            </div>
          </div>
        </div>

        {/* 主要特性 */}
        <div className="w-full bg-gray-50 dark:bg-gray-900">
          <section className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-center mb-12">为什么选择 Nature?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg border bg-white dark:bg-gray-800">
                <h3 className="text-xl font-semibold mb-4">简洁&自然</h3>
                <p className="text-gray-600 dark:text-gray-300">简洁、自然、一致性的语法设计，即使编程初学者也能够轻松掌握，快速上手。</p>
              </div>
              <div className="p-6 rounded-lg border bg-white dark:bg-gray-800">
                <h3 className="text-xl font-semibold mb-4">交叉编译</h3>
                <p className="text-gray-600 dark:text-gray-300">不依赖 llvm 和虚拟机，直接编译为目标平台机器码，并支持交叉编译</p>
              </div>
              <div className="p-6 rounded-lg border bg-white dark:bg-gray-800">
                <h3 className="text-xl font-semibold mb-4">高性能</h3>
                <p className="text-gray-600 dark:text-gray-300">高性能 GC 实现、高性能共享栈协程实现、纯 C 实现的 runtime</p>
              </div>
            </div>
            <div className="text-center text-gray-400 mt-4">点击快速开始查看更多特性支持......</div>
          </section>
        </div>

        {/* 应用场景 */}
        <div className="w-full bg-white dark:bg-gray-800">
          <section className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-center mb-12">应用场景</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Gamepad2 className="w-6 h-6 text-nature-red" />
                  <h3 className="text-lg font-semibold">游戏开发</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">游戏引擎和游戏开发</p>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Bot className="w-6 h-6 text-nature-red" />
                  <h3 className="text-lg font-semibold">计算机科学</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">AI 和 计算机科学应用</p>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Cog className="w-6 h-6 text-nature-red" />
                  <h3 className="text-lg font-semibold">系统编程</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">操作系统和物联网</p>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="w-6 h-6 text-nature-red" />
                  <h3 className="text-lg font-semibold">Web 开发</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">现代网络应用程序</p>
              </div>
            </div>
          </section>
        </div>

        {/* 赞助商部分 */}
        <div className="w-full bg-gray-50 dark:bg-gray-900">
          <section className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-center mb-12">Supported By</h2>

            <div className="flex justify-center items-center gap-8">
              <Link
                href="https://github.com/linky6565"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80 flex flex-row items-center gap-2" 
              >
                <img
                  src="https://github.com/linky6565.png"
                  alt="linky6565 logo"
                  className="h-12 w-12 rounded-full"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">linky6565</span>
              </Link>
              <Link
                href="https://www.jetbrains.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80"
              >
                <img
                  src="https://resources.jetbrains.com/storage/products/company/brand/logos/jetbrains.png"
                  alt="JetBrains logo"
                  className="h-12"
                />
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
