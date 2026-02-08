<p align="right">
    <a href="rules/en.md">English</a>
</p>

<p style="text-align: center">
    <img width="200" height="auto" src="src/assets/img/Logo.svg" title="Starter Boilerplate" alt="Starter Boilerplate" align="center"> <h1 style="font-weight: bold; display: inline-block; vertical-align: middle;">Fe Starter Bricks</h1>
</p>

Модульный конструктор для фронтенд-разработки на основе Gulp 4 и Webpack 5, включающий инструменты:
- Шаблонизаторы Pug, Nunjucks, Twig, MJML, JSON.
- Плагин Emitty для инкрементальной сборки шаблонов.
- Препроцессор Scss, Tailwind CSS.
- Система сборки Gulp 4 и Webpack 5.
- Поддержка чистых ESM-пакетов или ES-модулей.
- Поддержка JavaScript с синтаксисом ES6 и Next либо TypeScript Next.
- Husky. Автоисправление Eslint при commit, обновление мажорной версии при push.
- Babel.
- Eslint.
- SVG-спрайты.
- PNG-спрайты и поддержка Retina-дисплеев.
- Пользовательские настройки.

#### Преимущества сборщика:

- Используется инкрементальная сборка шаблонов. Здесь не применяется кэширование шаблонов, что значительно ускоряет процесс. По мере роста проекта скорость сборки сохраняется, так как пересобираются только изменённые компоненты.
- Возможность выбора между шаблонизаторами: Pug, Nunjucks, Twig.
- Интегрирован шаблонизатор MJML для сборки писем.
- Возможность импортировать стили как в JavaScript, так и через scss @use.
- Генерация спрайта из SVG-иконок: достаточно добавить иконку, и спрайт автоматически сгенерируется.
- Поддержка TypeScript. Автодополнение, проверки типов и улучшенная безопасность кода доступны из коробки.
- Поддержка TailwindCSS. Доступны utility-классы, Tailwind-конфигурация и плагины, полностью интегрированные в проект.
- Сборщик легко поддерживать в актуальном состоянии, что упрощает дальнейшие миграции, а при помощи конфигурации webpack можно расширять сборку различными плагинами.
- Сборщик не зависим от глобального окружения, необходим только установленный Node.js.

#### Структура проекта
```commandline
src/                       # Корневая папка проекта
├── components/            # Компоненты интерфейса и конфиги для шаблонов
│   ├── layout/            # Общие лэйауты (шапка, подвал, контейнеры)
│   ├── ui/                # UI-элементы (кнопки, формы, инпуты и т.д.)
│   ├── head/              # Блоки для <head> (мета-теги, favicon, SEO)
│   ├── concat.json        # Конфигурация для сборки/конкатенации скриптов
│   ├── config.pug         # Главный конфиг pug-шаблонов
│   ├── mixins.pug         # Pug-миксины для переиспользуемых шаблонов
│   └── scripts.pug        # Подключение js-скриптов в шаблонах
│
├── js/                    # JavaScript логика
│   ├── modules/           # Основные модули проекта
│   ├── fn/                # Утилиты/функции
│   ├── api/               # Работа с API
│   ├── vendor/            # Сторонние библиотеки
│   └── styles.js          # Точка входа для для стилей проекта
│   └── main.js            # Точка входа для JS
│
├── pages/                 # Страницы проекта
│   ├── templates/         # Pug-шаблоны для отдельных страниц
│   └── index.pug          # Главная страница
│
├── styles/                # Стилизация проекта
│   └── include/           # Подключаемые SCSS-части
│   └── plugins/           # Подключаемые SCSS-плагины
│
├── styles.scss            # Главный SCSS файл проекта
```

#### Пользовательские настройки
```commandline
| Option | Type | Default | Description |
|------|------|---------|------------|
| PROJECT_VERSION | `string \| null` | `null` | Версия проекта (`"1.0"` по умолчанию) |
| BACKUP | `boolean` | `true` | Создавать бэкап перед сборкой |
| EMAILS_BUILD | `boolean` | `true` | Включить сборку писем |
| FOLDER_BUILD | `string` | `build` | Папка результата сборки |
| SERVER_INDEX_PAGE | `string` | `index.html` | Точка входа dev-сервера |
| OPTIMIZE_IMAGES | `boolean` | `true` | Оптимизация изображений |
| PNG_OPTIMIZE | `boolean` | `true` | Оптимизация PNG |
| PNG_SPRITE | `boolean` | `true` | Генерация PNG-спрайтов |
| typeScript | `boolean` | `false` | Поддержка TypeScript |
| sourcemaps | `boolean` | `false` | Source maps |
| sourceFolder | `string` | `src` | Исходная папка |
| developer | `string` | `dev` | Текущее окружение |
| assets | `string` | `dev/assets` | Путь к ассетам |
| styleFileName | `string` | `styles` | Имя CSS-файла |
| imageFolderName | `string` | `img` | Папка изображений |
| templatePreproc | `pug \| nunjucks \| twig` | `pug` | Шаблонизатор |
| cssMinify | `boolean` | `true` | Минификация CSS |
| htmlMinify | `boolean` | `false` | Минификация HTML |
```

#### Переменные, доступные в шаблонах.
```commandline
| Option | Type | Default | Description |
|------|------|---------|------------|
| version | `string` | `""` | Версия проекта |
| symbolsInject | `boolean` | `false` | Автоинжект SVG symbols |
| pathPrefix | `string` | `__static__` | Префикс путей к ассетам |
```

#### Форматирование.
```commandline
| Option                  | Type      | Default | Description                   |
| ----------------------- | --------- | ------- | ----------------------------- |
| `indent_char`           | `string`  | `' '`   | Indentation character         |
| `indent_size`           | `number`  | `4`     | Indentation size              |
| `indent_level`          | `number`  | `1`     | Initial indentation level     |
| `preserve_newlines`     | `boolean` | `true`  | Preserve existing line breaks |
| `max_preserve_newlines` | `number`  | `1`     | Maximum preserved empty lines |
```

####  <a href="LICENSE">The MIT License</a>

## Requirements
* Node >= 16.15.1 or latest version
* Gulp cli >= 2.3.0

## Guide
#### Install dependencies
```commandline
npm install
```

#### Initial husky
```commandline
npx husky init - option
```

#### Start local and hot-reloads
```commandline
npm start
```

#### Local server
[http://localhost:4200/](http://localhost:4200/)

#### Create build
```commandline
npm run build
```
