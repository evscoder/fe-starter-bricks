![package](https://img.shields.io/badge/package-fe--starter--bricks-blue)
![version](https://img.shields.io/badge/version-0.0.0-informational)
![license](https://img.shields.io/badge/license-MIT-green)
![repository](https://img.shields.io/badge/repository-GitHub-181717)
![node](https://img.shields.io/badge/node-20.19.3-339933)
![npm](https://img.shields.io/badge/npm-11.5.1-CB3837)

Create projects from ready-to-use frontend templates.

Template-first frontend starter for multipage websites, CMS themes, Symfony views, email templates, and static frontend integration workflows.

## Quick Start

Use your preferred package manager:

```bash
npm create fe-bricks@latest
```

```bash
npx create-fe-bricks@latest
```

```bash
yarn create fe-bricks@latest
```

```bash
pnpm create fe-bricks@latest
```

```bash
bun create fe-bricks@latest
```

```bash
bunx create-fe-bricks@latest
```

After the project is created:

```bash
cd my-new-project
npm install
npm start
```

## Website Localhost

The development server runs on:

- Website: `http://localhost:4200/`
- Entry page: `http://localhost:4200/index.html`

Email templates are available under `/emails/` after they are built:

- `http://localhost:4200/emails/address.html`

## Requirements

- Node.js `>= 20.12.0`
- npm, Yarn, pnpm, or Bun

## What Gets Generated

The generator creates a project from a shared base template and selected technology layers.

Available template engines:

- Pug
- Nunjucks
- Twig

Available script setups:

- JavaScript
- TypeScript

The generated project includes:

- Gulp 4 build pipeline
- Webpack 5 bundling
- SCSS and PostCSS setup
- Tailwind CSS support
- MJML email templates
- SVG and PNG sprite support
- Image optimization
- BrowserSync development server
- ESLint and Stylelint configuration

## License

MIT
