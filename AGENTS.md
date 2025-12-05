# Repository Guidelines

## Project Structure & Module Organization
- Root entry point: `index.html` renders the landing content; shared layout assets live under `files/assets`.
- Styles and scripts: author SCSS in `files/assets/scss`, compiled CSS resides in `files/assets/css`; custom JS modules live in `files/assets/js`.
- Components: reusable HTML fragments and layout pieces sit in `files/components`; page-level templates live in `files/pages`.
- Build/config: automation and tooling are in `gulpfile.mjs`, `config/serve.js`, and `eslint.config.mjs`. Static assets (fonts, images, media, JSON) are under `files/assets/{fonts,img,video,json,mp3}`.

## Build, Test, and Development Commands
- Install dependencies: `npm install` (required before any build tasks).
- Local dev server (HTML/JS/CSS hot reload via nodemon): `nodemon --ext html,js,css,scss ./config/serve.js`.
- Asset pipeline with browser preview: `gulp -browser` (adds live build of SCSS/JS and serves compiled assets); append `-sync` for BrowserSync refreshes.
- Default asset build without browser: `gulp` (compiles SCSS, optimizes assets, lints JSON; adjust tasks in `gulpfile.mjs` if needed).

## Coding Style & Naming Conventions
- Indentation: 4 spaces; prefer snake_case for variables and filenames where applicable.
- Strings: use double quotes in JS/JSON/HTML attributes.
- SCSS: keep variables and mixins in dedicated partials; avoid deep nesting beyond three levels.
- Linting: ESLint configured in `eslint.config.mjs`; run via the gulp lint task when available (see `gulpfile.mjs`).
- HTML: keep `base` href accurate for asset resolution; store shared fragments in `files/components` and import consistently.

## Testing Guidelines
- Automated tests are not configured; rely on manual verification in the browser after each change.
- Validate pages load with correct asset paths and that SCSS builds cleanly via `gulp`.
- If adding tests, colocate under a `tests` folder and name files `*.spec.js`; document new commands in `package.json`.

## Commit & Pull Request Guidelines
- Commit messages: use concise, action-oriented subjects (e.g., `Add header navigation layout`, `Fix gulp build watch paths`); reference issue IDs where relevant.
- Keep commits focused on a single concern (style update, build fix, asset addition).
- Pull requests should include: summary of changes, steps to validate (commands run, pages to check), known issues or TODOs, and screenshots for visible UI updates.
- Ensure `.gitignore` is present (rename `gitignore` to `.gitignore` if missing) and avoid committing generated artifacts in `files/assets/css` or build outputs.
