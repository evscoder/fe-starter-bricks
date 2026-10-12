# Fe Starter Bricks

[![npm version](https://img.shields.io/npm/v/create-starter-bricks)](https://www.npmjs.com/package/create-starter-bricks)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.12.0-339933)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](https://github.com/evscoder/fe-starter-bricks/blob/master/LICENSE)

An interactive CLI that creates a frontend project with your choice of template engine, JavaScript or TypeScript, and optional MJML emails.

Use it for multipage websites, CMS themes, Symfony views, and static frontend integration. Each project combines a shared base template with the technology layers you select.

## Quick start

```bash
npm create starter-bricks@latest
```

The CLI asks for:

| Setting | Choices | Default |
| --- | --- | --- |
| Project folder | A lowercase folder name, such as `my-new-project` | `my-new-project` |
| Template engine | Twig, Pug, or Nunjucks | Twig |
| Scripts | TypeScript or JavaScript | TypeScript |
| Email templates | Include or skip MJML | Skip |

![Illustration of template engine selection in the Fe Starter Bricks CLI](docs/images/cli.png)

*Styled illustration based on the CLI interface.*

Once generation finishes, install dependencies and start development:

```bash
cd my-new-project
npm install
npm start
```

Open [localhost:4200](http://localhost:4200/) in your browser. BrowserSync reloads the page when project files change.

![Illustration of project generation with TypeScript and MJML and the next-step commands](docs/images/generated.png)

*Styled illustration of generation with optional MJML emails enabled.*

### Other package managers

Choose one of these alternatives to the npm command above:

```bash
npx create-starter-bricks@latest
```

```bash
yarn create starter-bricks@latest
```

```bash
pnpm create starter-bricks@latest
```

```bash
bun create starter-bricks@latest
```

```bash
bunx create-starter-bricks@latest
```

## Requirements

- Node.js `>= 20.12.0`.
- npm, Yarn, pnpm, or Bun to run the generator.
- npm to follow the generated project's commands below.

The generator creates the project in the current directory. Use a folder name rather than a path. Names may contain lowercase letters, numbers, dots, hyphens, and underscores; Windows reserved names are rejected. An existing destination folder must be empty.

## Included tooling

| Area | Tools |
| --- | --- |
| Templates | Your selected engine: Twig, Pug, or Nunjucks |
| Build pipeline | Gulp 4 and Webpack 5 |
| Scripts | JavaScript or TypeScript |
| Styles | SCSS, PostCSS, and Tailwind CSS support |
| Development | BrowserSync with file watching and live reload |
| Assets | Image optimization and SVG/PNG sprite support |
| Emails | Optional MJML templates and compilation |
| Code quality | ESLint and Stylelint configuration |

Gulp handles templates and asset processing. Webpack bundles scripts and styles. Build options are stored in `user.config.js`.

## Project commands

Run these commands inside the generated project:

| Command | Purpose |
| --- | --- |
| `npm start` | Build the project, start the local server, and watch for changes |
| `npm run build` | Create the production output in `build/` |
| `npm run lint` | Run ESLint on `src/` with automatic fixes; warnings fail the command |

## Generated structure

```text
my-new-project/
├── src/
│   ├── assets/          # Images, SVG files, favicons, and static assets
│   ├── js/ or ts/      # Selected script layer
│   ├── styles/          # SCSS styles
│   └── templates/       # FSD layers and page entry points
│       └── emails/      # Present when MJML is selected
├── build/               # Generated build output
├── user.config.js       # Build and template settings
└── package.json         # Project dependencies and commands
```

The CLI also copies the build configuration and a README with instructions for the generated project.

## Configuration

Edit `user.config.js` in the generated project to adjust the build:

| Option | Purpose |
| --- | --- |
| `templateEngine` | Selected template engine: `twig`, `pug`, or `nunjucks` |
| `typeScript` | Enable TypeScript compilation |
| `folderBuild` | Output directory; defaults to `build` |
| `assetsBuild` | Compiled assets path; defaults to `build/assets` |
| `serverIndexPage` | Local server entry page; defaults to `index.html` |
| `emailsBuild` | Enable MJML compilation |
| `optimizeImages` | Enable image optimization |
| `spritePng` | Enable PNG sprite generation; disabled by default |

The CLI sets `templateEngine`, `typeScript`, and `emailsBuild` from your answers. Changing these values later does not copy additional template layers into the project.

### Email templates

Choose MJML during setup to include the email sources in `src/templates/emails/`. Compiled HTML is written to `build/emails/`.

After starting development, open an included email such as [localhost:4200/emails/address.html](http://localhost:4200/emails/address.html).

## Repository development

The CLI lives in `packages/create-starter-bricks/`. Its `templates/` directory contains the shared base and separate layers for template engines, scripts, and emails.

To run the local generator from the repository root:

```bash
npm install
npm run dev
```

## License

MIT

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
