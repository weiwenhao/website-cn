import Link from 'next/link';
import Image from 'next/image';
import { Github, Heart } from 'lucide-react';
import { LandingNav } from "@/components/features/landing-nav";
import { LanguageSwitcher } from "@/components/features/language-switcher";

export function Header() {
  return (<header className="border-b">
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center">
          {/* the horizontal lockup: the unchanged icon and the wordmark outlined from Outfit Bold in the brand red, drawn together */}
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/logo-horizontal.svg`}
            alt="Nax Logo"
            width={99}
            height={36}
            priority
          />
        </Link>
        <LandingNav />

      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <Link
          href="https://github.com/naxlang/nax"
          target="_blank"
          className="p-2 hover:text-primary"
        >
          <Github className="h-5 w-5" />
        </Link>
        {/* same look as the primary button of the landing page, scaled to the header */}
        <Link
          href="/docs/donate"
          className="inline-flex h-10 items-center gap-1.5 border-2 border-nax-red bg-nax-red px-4 text-[14px] font-semibold text-white transition hover:bg-[#D93A36] active:scale-[0.98]"
        >
          <Heart className="h-4 w-4" />
          <span>捐赠</span>
        </Link>
      </div>
    </div>
  </header>);
} 