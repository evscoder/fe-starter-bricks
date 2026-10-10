---
title: "From My Work Build Setup to an Open-Source CLI: Fe Starter Bricks for Multi-Page Sites (Twig, Pug, Nunjucks, MJML)"
published: false
description: "An interactive CLI that generates a frontend project from a shared base and the layers you choose: Twig, Pug or Nunjucks, JS or TS, optional MJML emails."
tags: webdev, javascript, opensource, showdev
# canonical_url: PASTE THE LINK TO THE HABR VERSION HERE AFTER IT IS PUBLISHED
---

In my day-to-day work I build multi-page sites and frontend interfaces on my own build setup. It was never a boilerplate that you pick up from an old project and clean out. It was a single tool that kept evolving: first templates and SCSS, then scripts, image optimization, sprites, and later email templates.

The trouble started when projects needed different sets of features: Twig in one, Pug or Nunjucks in another, TypeScript here, plain JavaScript there. The setup was turning into a pile of conditions and exceptions.

So I split it into a shared base plus pluggable layers and extracted it into a separate CLI. That's **Fe Starter Bricks**: it asks four questions (template engine, JS or TS, whether you need MJML emails, folder name) and assembles a project from a common base and the layers you picked.

In this post I'll cover how it works, why it uses Gulp and Webpack instead of Vite, and which kinds of projects it fits (and which it doesn't).

![Template engine selection in the CLI](https://github.com/evscoder/fe-starter-bricks/raw/master/docs/images/cli.png)

## Quick start

You need Node.js `>= 20.12.0`.

```bash
npm create starter-bricks@latest
```

The CLI asks four questions:

| Setting | Options | Default |
| --- | --- | --- |
| Folder name | e.g. `my-new-project` | `my-new-project` |
| Template engine | Twig, Pug, Nunjucks | Twig |
| Scripts | TypeScript or JavaScript | TypeScript |
| Email templates | Add MJML or skip | Skip |

Then the usual:

```bash
cd my-new-project
npm install
npm start
```

The site opens at `http://localhost:4200/`, and BrowserSync reloads the page when files change. The generator also works via `npx`, `yarn create`, `pnpm create` and `bun create`.

![Generated project with TypeScript and MJML](https://github.com/evscoder/fe-starter-bricks/raw/master/docs/images/generated.png)

## How generation works: a base and layers

Templates in the repository are split by purpose:

```text
packages/create-starter-bricks/templates/
├── base/
├── template-twig/
├── template-pug/
├── template-nunjucks/
├── template-js/
├── template-ts/
└── template-mjml/
```

`base` holds the shared structure and build configuration; the other folders hold files for a specific choice. For Twig + TypeScript + MJML, the generator copies the base, then the Twig, TypeScript and MJML layers on top, writes your choices to `user.config.js`, and updates the name in `package.json`.

The point is that the shared build is maintained in one place, instead of keeping a separate full starter for every combination of technologies.

## Why Gulp and Webpack instead of Vite

This is the first question I expect, so let me answer it up front.

The setup grew out of practice. The result of my work is a set of HTML pages that a backend then serves or a CMS picks up. For that workflow I need server-side template engines with layouts and components, image, SVG and sprite processing, and emails in the same environment. Gulp 4 and Webpack 5 covered these needs, each with its own responsibility: Gulp handles templates and assets, Webpack bundles scripts and styles. I didn't want to rewrite a working setup on another tool just for the sake of it.

For styles there's SCSS, PostCSS and Tailwind CSS support, and ESLint and Stylelint for code checks.

If you're building an SPA or a React/Vue app, use Vite or a ready-made framework; this tool isn't for you. Fe Starter Bricks is about something narrower: a starter for building pages that will later be integrated with a backend, with Twig as the default.

## What kinds of projects it fits

Corporate sites, multi-page layouts, CMS themes, Symfony views, static frontend integration. Twig is the default because of PHP and Symfony projects: the template syntax will feel familiar.

Note that the generator creates a **frontend starter and a local build**. Integrating it with a server application remains a separate task.

## What's inside a generated project

```text
my-new-project/
├── src/
│   ├── assets/          # images, SVG, favicon, static files
│   ├── js/ or ts/       # chosen scripts layer
│   ├── styles/          # SCSS
│   └── templates/       # pages, layouts, components
│       └── emails/      # if MJML is selected
├── build/               # build output
├── user.config.js
└── package.json
```

Commands:

```bash
npm start        # build, local server, file watching
npm run build    # production build into build/
npm run lint     # ESLint over src/ with auto-fix
```

`npm run lint` runs ESLint with `--fix`, so it can modify your source files, and warnings count as failures.

The main settings live in `user.config.js`: `templateEngine`, `typeScript`, `emailsBuild`, `folderBuild`, `assetsBuild`, `serverIndexPage`, `optimizeImages` and `spritePng` (PNG sprites are off by default).

## MJML emails next to the site

Sign-up confirmations, password resets, notifications: emails are often built together with the site, so MJML can be enabled right away. Sources go to `src/templates/emails/`, and compiled HTML goes to `build/emails/`. After `npm start`, an example is available at:

```text
http://localhost:4200/emails/address.html
```

Sending emails and connecting to a mail service are not part of the project.

## Limitations

- Changing `templateEngine` or `typeScript` in `user.config.js` after generation switches the build settings but doesn't copy the files of the other layer. Choose your technologies when you create the project.
- Layers are separated at the source-file level. The shared `package.json` is copied as a whole, so dependencies of all tools may end up installed regardless of your choice.
- A build made of several tools needs configuration and dependency maintenance. Pick it when the provided workflows are actually useful to you.
- Cross-browser testing, accessibility, performance and email rendering in mail clients remain your responsibility.

## Try it

The project is MIT-licensed: [GitHub repository](https://github.com/evscoder/fe-starter-bricks), package [on npm](https://www.npmjs.com/package/create-starter-bricks).

The easiest way to evaluate it: generate a project, move over one page with a shared layout, styles and a small script, and see how the development loop feels. Issues and stars are welcome, and comments about which template engines or layers are missing are even better.
