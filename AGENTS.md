# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router routes (server/client components). Example: `app/docs/[slug]/page.tsx`.
- `components/`: Reusable UI in PascalCase (e.g., `NavBar.tsx`, `CodeBlock.tsx`).
- `lib/`: Utilities and data loaders in camelCase (e.g., `mdx.ts`, `content.ts`).
- `content/`: MDX/Markdown content. Prefer kebab-case filenames (e.g., `getting-started.mdx`).
- `public/`: Static assets served at root (`/images/...`).
- Root configs: `next.config.mjs`, `tailwind.config.ts`, `eslint.config.mjs`, `tsconfig.json`, `globals.css`.

## Build, Test, and Development Commands
- `pnpm dev`: Start local dev server with hot reload.
- `pnpm build`: Production build (`.next/` output).
- `pnpm start`: Run the production server (after build).
- `pnpm lint`: Lint TypeScript/JS/React using Next.js ESLint config.

## Coding Style & Naming Conventions
- Language: TypeScript + React 19, Next.js App Router.
- Indentation: 2 spaces; max line length follow ESLint defaults.
- Components: PascalCase files and exported names.
- Helpers: camelCase; one module per concern in `lib/`.
- Content: MDX in `content/` with kebab-case filenames and frontmatter.
- Styling: Tailwind CSS; prefer utility classes over ad‑hoc CSS. Global styles in `globals.css`.

## Testing Guidelines
- No formal test suite is configured. Use `pnpm lint` and `pnpm build` as pre-submit checks.
- If adding tests, prefer Playwright for E2E (`@playwright/test`) and colocate config at repo root.

## Commit & Pull Request Guidelines
- Commit messages: follow Conventional Commits (e.g., `feat:`, `fix:`, `docs:`, `chore:`). Optional scopes: `docs(donate): ...`.
- Keep commits focused and atomic; include rationale where non-obvious.
- Pull Requests should include: concise description, screenshots for UI changes, and links to related issues/content.
- Run `pnpm lint && pnpm build` locally before opening a PR.

## Security & Configuration Tips
- Place secrets in `.env.local` (never commit). Access via `process.env.*`.
- Do not import server-only code into client components. Keep data-fetching utilities in `lib/` and route handlers in `app/`.
