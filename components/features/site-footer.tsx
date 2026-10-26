import Link from "next/link";
import { Github, Twitter } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-semibold mb-3">关于作者</h3>
            <p className="text-sm text-muted-foreground">I&apos;m Hacker.</p>
            <div className="mt-2 space-y-2 text-sm text-muted-foreground">
              <div>
                <span>Email: </span>
                <a
                  href="mailto:wwhacker@qq.com"
                  className="hover:text-primary"
                >
                  wwhacker@qq.com
                </a>
              </div>
              <div>
                <span>GitHub: </span>
                <a
                  href="https://github.com/weiwenhao"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  @weiwenhao
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/docs/get-started"
                  className="text-sm hover:text-primary"
                >
                  Get Started
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/naxlang/nax/tree/master/tests/features/cases"
                  className="text-sm hover:text-primary"
                >
                  Examples
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/weiwenhao/website"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-primary"
                >
                  Edit on GitHub
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">社交媒体</h3>
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/naxlang/nax"
                target="_blank"
                className="hover:text-primary"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://x.com/nature_lang"
                target="_blank"
                className="hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-sm">微信讨论组:</span>
                <span className="text-sm text-muted-foreground">nature-lang</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            豫ICP备2025125748号-1
          </a>
        </div>
      </div>
    </footer>
  );
}
