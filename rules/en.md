<p align="right">
    <a href="../README.md">Back to Readme</a>
</p>

<p style="text-align: center">
    <img width="200" height="auto" src="../src/assets/img/Logo.svg" title="Starter Boilerplate" alt="Starter Boilerplate" align="center"> <h1 style="font-weight: bold; display: inline-block; vertical-align: middle;">Fe Starter Bricks</h1>
</p>

#### A modular builder for frontend development based on Gulp 4 and Webpack 5, including tools:
- Template engines: Pug, Nunjucks, MJML, JSON.
- Emitty plugin for incremental template building.
- Scss preprocessor.
- Build system with Gulp 4 and Webpack 5.
- Support for pure ESM packages or ES modules.
- Support for JavaScript with ES6 and Next syntax or TypeScript Next.
- Husky. ESLint auto-fix on commit, major version bump on push.
- Babel.
- ESLint.
- SVG sprites.
- PNG sprites with Retina support.
- User settings.

  #### Advantages of the builder:
- Incremental Pug template building is used. No template caching is involved, which significantly speeds up compilation. As the project grows, build speed remains consistent because only the components that change are recompiled.
- Ability to import styles both in JavaScript and via `scss use`.
- Option to choose between two template engines: Pug or Nunjucks.
- Automatic sprite generation from SVG icons — just drop in an icon and the sprite will be generated.
- TypeScript support. Autocompletion, type checking, and enhanced code safety are available out of the box.
- TailwindCSS support. Utility classes, Tailwind configuration, and plugins are fully integrated into the project.
- The build system is easy to keep up to date, which simplifies future migrations. With the help of webpack configuration, it can be extended using various plugins.
- The build system is independent of the global environment — only Node.js needs to be installed.

#### Structure project
```commandline
src/                        # Root project folder
├── components/             # Interface components and pug configs
│   ├── layout/             # Common layouts (header, footer, containers)
│   ├── ui/                 # UI elements (buttons, forms, inputs, etc.)
│   ├── head/               # Blocks for <head> (meta tags, favicon, SEO)
│   ├── concat.json         # Config for script/style concatenation
│   ├── config.pug          # Main pug configuration
│   ├── mixins.pug          # Reusable pug mixins
│   └── scripts.pug         # Script includes for templates
│
├── js/                     # JavaScript logic
│   ├── modules/            # Core project modules (sliders, menus, etc.)
│   ├── fn/                 # Utility functions
│   ├── api/                # API integrations
│   ├── vendor/             # Third-party libraries
│   └── styles.js           # JavaScript entry point for Main SCSS file and plugins styles
│   └── main.js             # Main JavaScript entry point
│
├── pages/                  # Project pages
│   ├── templates/          # Pug templates for specific pages
│   └── index.pug           # Main (home) page
│
├── styles/                 # Project styling
│   └── include/            # SCSS partials
│   └── plugins/            # SCSS plugins           
│
├── styles.scss             # Main SCSS file
```
