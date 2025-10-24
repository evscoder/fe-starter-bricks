/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{html,ts,pug,njk}'
    ],
    theme: {
        extend: {
            screens: {
                'xs': '374px',
                'sm': '576px',
                'md': '768px',
                'lg': '1024px',
                'xl': '1200px',
                '2xl': '1366px',
                '3xl': '1920px'
            }
        }
    },
    plugins: []
};
