# Frontend Starter

A ready-to-use frontend distribution for multipage websites, CMS templates, Symfony views, email templates, and static frontend integration.

It comes with Gulp 4, Webpack 5, SCSS, PostCSS, Tailwind CSS, template compilation, image processing, SVG/PNG sprites, and BrowserSync.

## Quick Start

```bash
npm install
npm start
```

Local server:

- `http://localhost:4200/`
- `http://localhost:4200/index.html`

## Commands

```bash
npm start
```

Starts the development server, builds the project, and watches templates, styles, scripts, and assets.

```bash
npm run build
```

Builds the production version into the `build` folder.

```bash
npm run lint
```

Runs ESLint for files in `src`.

## Structure

- `src/templates` — pages, layouts, and template components.
- `src/styles` — project SCSS styles.
- `src/js` or `src/ts` — project scripts.
- `src/assets` — images, SVG files, favicons, and other static files.
- `build` — build output.
- `user.config.js` — main project configuration.

## Configuration

The main build options are defined in `user.config.js`.

Commonly changed options:

- `templateEngine` — template engine: `pug`, `nunjucks`, or `twig`.
- `typeScript` — enables TypeScript builds.
- `folderBuild` — build output folder.
- `assetsBuild` — path for compiled assets.
- `serverIndexPage` — development server entry page.
- `emailsBuild` — enables email template builds.
- `optimizeImages` — enables image optimization.
- `spritePng` — enables PNG sprite generation.

## Email Templates

If email template builds are enabled, the output is available in `build/emails`.

Example local URL:

```text
http://localhost:4200/emails/address.html
```

## Requirements

- Node.js `>= 20.12.0`
- npm, Yarn, pnpm, or Bun
