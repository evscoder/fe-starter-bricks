# Starter Bricks

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

- `src/templates` — FSD layers and page entry points.
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

## Source architecture

The template directories follow these FSD responsibilities:

| Layer | Responsibility |
| --- | --- |
| `layouts` | Shared document layouts |
| `pages` | Entry templates that compose complete pages for compilation |
| `widgets` | Independent page blocks, such as the header, footer, and home hero |
| `features` | User actions and scenarios; add slices when needed |
| `entities` | Business entities; add slices when needed |
| `shared` | Reusable template UI and helpers |

`features` and `entities` are intentionally absent until the project needs them.
Use `ui`, `model`, `api`, `lib`, and `config` segments according to a slice's needs.
Consume widgets through their `index` entry points. Slices should depend on lower
layers, without importing sibling slices. Shared document layouts live in
`templates/layouts`; no template `app` directory is used.

For this multipage starter, `templates/pages` remains the compiler input. Page
entries extend `layouts` as a deliberate template-engine convention and compose
widgets inside layout blocks. Only page entries produce HTML; partials stay in
other layers. Template JSON data lives beside its owner and is merged by the build.

JavaScript, TypeScript, and SCSS retain their existing directory structure.

Optional MJML sources use `templates/emails/pages` for complete emails,
`templates/emails/shared` for common head and font definitions, and
`templates/emails/widgets` for reusable blocks. Email assets remain in
`templates/emails/assets`; output remains in `build/emails`.

### Template build helpers

`tasks/template/plugins/template-dependencies.js` tracks static template references
for Twig, Pug, and Nunjucks. Development builds update the dependency graph for
changed files and compile affected pages. Dynamic references trigger a full page
rebuild. JSON and template configuration changes also rebuild all pages.

`generate-static-path.js` replaces the configured asset prefix with a relative
path based on each output page's depth. An empty prefix leaves contents unchanged.
