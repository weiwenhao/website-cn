'use client';

import { usePathname } from 'next/navigation';

export function LanguageSwitcher() {
  const pathname = usePathname();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const englishSiteBaseUrl = 'https://naxlang.org';

  // When served under /cn on the main origin, a plain relative anchor jumps cleanly back into the English app
  // (including preview deployments). When deployed standalone (e.g. nature-lang.cn), link to the English domain.
  const targetHref = basePath
    ? pathname || '/'
    : new URL(pathname, englishSiteBaseUrl).toString();

  return (
    <a
      href={targetHref}
      className="p-2 hover:text-primary flex items-center justify-center"
      style={{ fontWeight: 500, fontSize: 17 }}
    >
      <span className="inline-block align-middle">EN</span>
    </a>
  );
}