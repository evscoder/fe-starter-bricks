# 🚀 Fe Starter Bricks

![npm](https://img.shields.io/npm/v/fe-starter-bricks)
![license](https://img.shields.io/badge/license-MIT-green)
![build](https://img.shields.io/github/actions/workflow/status/evscoder/fe-starter-bricks/ci.yml)

> **Frontend starter for template-driven projects**\
> Multipage websites, email templates, SSR-ready frontend with Pug,
> Twig, Nunjucks, MJML, SCSS, Tailwind, TypeScript.

------------------------------------------------------------------------

## ✨ Why this project

Most modern tools are SPA-first.\
This starter is **template-first**.

Perfect for: - Pug / Twig / Nunjucks projects - multipage websites -
MJML emails - Symfony / CMS integration

------------------------------------------------------------------------

## 🔥 Features

- ⚡ Gulp 4 + Webpack 5 architecture
- 🧩 Template engines:
    - Pug
    - Nunjucks
    - Twig
    - MJML (emails)
- 🎨 SCSS + Tailwind CSS support
- 🧠 TypeScript ready
- 🚀 Incremental template rebuild (Emitty)
- 🖼 SVG + PNG sprites generation
- 🔍 ESLint + Stylelint
- 📦 Production optimization (minification, images, etc.)
- 🔁 BrowserSync live reload

------------------------------------------------------------------------

## Requirements
```
* Node latest version
* Gulp cli >= 2.3.0
```
------------------------------------------------------------------------

## 🚀 Quick Start

``` bash
git clone https://github.com/evscoder/fe-starter-bricks.git
cd fe-starter-bricks

npm install
npm start
```

------------------------------------------------------------------------

#### Configuration Options
```commandline
| Option              | Type                      | Default        | Description                                                       |
| ------------------- | ------------------------- | ------------   | ----------------------------------------------------------------- |
| `projectVersion`    | `string \| null`          | `null`         | Project version. If `null`, the default version (`"1.0"`) is used |
| `backupBuild`       | `boolean`                 | `false`        | Create backup files before build                                  |
| `emailsBuild`       | `boolean`                 | `true`         | Enable emails build pipeline                                      |
| `folderBuild`       | `string`                  | `build`        | Output build folder name                                          |
| `serverIndexPage`   | `string`                  | `index.html`   | Entry HTML file for the dev server                                |
| `optimizeImages`    | `boolean`                 | `true`         | Enable image optimization                                         |
| `optimizePng`       | `boolean`                 | `true`         | Optimize PNG images                                               |
| `spritePng`         | `boolean`                 | `false`        | Generate PNG sprites                                              |
| `typeScript`        | `boolean`                 | `true`         | Enable TypeScript support                                         |
| `sourcemaps`        | `boolean`                 | `false`        | Generate source maps                                              |
| `sourceFolder`      | `string`                  | `src`          | Source directory name                                             |
| `assetsBuild`       | `string`                  | `build/assets` | Assets folder path                                                |
| `styleFileName`     | `string`                  | `styles`       | Base name for the compiled CSS file                               |
| `imageFolderName`   | `string`                  | `img`          | Images folder name                                                |
| `templateEngine`    | `pug \| nunjucks \| twig` | `pug`          | Template engine                                             |
| `htmlMinify`        | `boolean`                 | `false`        | Minify HTML output                                                |
```

------------------------------------------------------------------------

## 🗺 Roadmap

-   CLI
-   examples
-   plugins
-   docs site
-   vite adapter

------------------------------------------------------------------------

## 🤝 Contributing

PRs welcome 🚀

------------------------------------------------------------------------

## ⭐ Support

Give a star if useful!
