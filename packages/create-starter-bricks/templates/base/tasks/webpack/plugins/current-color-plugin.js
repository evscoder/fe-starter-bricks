const currentColorPlugin = {
    name: 'currentColorPlugin',
    description:
        'Processes colors separately for every symbol',

    fn: () => {
        const walk = (node, callback) => {
            callback(node);

            node.children?.forEach(child => {
                walk(child, callback);
            });
        };

        const normalize = value => {
            return value?.trim().toLowerCase();
        };

        const isColor = value => {
            const color = normalize(value);

            return Boolean(
                color
                && color !== 'none'
                && color !== 'transparent'
                && color !== 'currentcolor'
            );
        };

        const getStyleValue = (style, property) => {
            if (!style) {
                return null;
            }

            const expression = new RegExp(
                `(?:^|;)\\s*${property}\\s*:\\s*([^;]+)`,
                'i'
            );

            return style.match(expression)?.[1]?.trim() || null;
        };

        const replaceStyleColor = (
            style,
            property
        ) => {
            const expression = new RegExp(
                `((?:^|;)\\s*${property}\\s*:)\\s*([^;]+)`,
                'gi'
            );

            return style.replace(
                expression,
                (match, prefix, value) => {
                    return isColor(value)
                        ? `${prefix}currentColor`
                        : match;
                }
            );
        };

        const processSymbol = symbol => {
            const colors = new Set();
            let containsStroke = false;

            /*
             * Analyze only the current symbol.
             */
            walk(symbol, node => {
                if (
                    node.type !== 'element'
                    || !node.attributes
                ) {
                    return;
                }

                const {
                    fill,
                    stroke,
                    style = ''
                } = node.attributes;

                const styleFill = getStyleValue(
                    style,
                    'fill'
                );

                const styleStroke = getStyleValue(
                    style,
                    'stroke'
                );

                if (
                    isColor(stroke)
                    || isColor(styleStroke)
                ) {
                    containsStroke = true;
                }

                [
                    fill,
                    stroke,
                    styleFill,
                    styleStroke
                ].forEach(color => {
                    if (isColor(color)) {
                        colors.add(normalize(color));
                    }
                });
            });

            const isMulticolor = colors.size > 1;

            walk(symbol, node => {
                if (
                    node.type !== 'element'
                    || !node.attributes
                ) {
                    return;
                }

                const { attributes } = node;

                if (
                    node.name === 'svg'
                    || node.name === 'symbol'
                ) {
                    delete attributes.width;
                    delete attributes.height;
                }

                const style = attributes.style || '';

                const styleFill = getStyleValue(
                    style,
                    'fill'
                );

                const styleStroke = getStyleValue(
                    style,
                    'stroke'
                );

                /*
                 * Single-color icon:
                 * replace fill/stroke with currentColor.
                 */
                if (!isMulticolor) {
                    if (
                        isColor(attributes.fill)
                    ) {
                        attributes.fill = 'currentColor';
                    }

                    if (
                        isColor(attributes.stroke)
                    ) {
                        attributes.stroke = 'currentColor';
                    }

                    if (attributes.style) {
                        attributes.style = replaceStyleColor(
                            attributes.style,
                            'fill'
                        );

                        attributes.style = replaceStyleColor(
                            attributes.style,
                            'stroke'
                        );
                    }
                }

                /*
                 * The path has no fill or stroke,
                 * and the icon itself is not outlined.
                 */
                if (
                    node.name === 'path'
                    && !containsStroke
                    && attributes.fill == null
                    && attributes.stroke == null
                    && styleFill == null
                    && styleStroke == null
                ) {
                    attributes.fill = 'currentColor';
                }
            });
        };

        return {
            root: {
                exit(root) {
                    const symbols = [];

                    walk(root, node => {
                        if (
                            node.type === 'element'
                            && node.name === 'symbol'
                        ) {
                            symbols.push(node);
                        }
                    });

                    /*
                     * Process each symbol independently.
                     */
                    if (symbols.length) {
                        symbols.forEach(processSymbol);

                        return;
                    }

                    /*
                     * Fallback for cases where SVGO processes
                     * the source SVG before a symbol is created.
                     */
                    processSymbol(root);
                }
            }
        };
    }
};

export default currentColorPlugin;
