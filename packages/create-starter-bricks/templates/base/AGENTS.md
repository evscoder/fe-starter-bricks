# AGENTS.md — Starter Bricks

## Frontend rules
1. Add custom CSS only when existing components, UI styles, and Tailwind utilities are insufficient.
2. Do not create directories or files using placeholder names such as `<page-name>`, `page`, `component`, or `example`. Replace them with names describing the actual page or component.
3. Use the existing `container` class to define the width, maximum width, horizontal centering, and horizontal page padding of section content.
4. Do not manually reproduce the container width using classes such as `max-w-*`, `mx-auto`, or page-level `px-*` when the existing `container` class should be used.
5. For full-width backgrounds, apply the background to the outer section and place the content inside a `container`:
    ```twig
    <section class="bg-[#F5F6F8] py-10">
        <div class="container">
            {# Section content #}
        </div>
    </section>
    ```
6. Do not nest `container` elements. Before adding the class, inspect the parent template and components to determine whether the content is already inside a container.
7. Components must not define the global page width themselves. Page-level or section-level layout should provide the `container`, while components should normally use `w-full` and adapt to the available width.
8. Use a custom width instead
