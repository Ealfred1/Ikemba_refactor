/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // GSAP Awwwards Palette (Earth Tones)
                'earth-black': '#222123',
                'earth-main-bg': '#232224',
                'earth-white': '#ffffff',
                'earth-dark-brown': '#523122',
                'earth-mid-brown': '#a26833',
                'earth-light-brown': '#e3a458',
                'earth-red-brown': '#7f3b2d',
                'earth-yellow-brown': '#a26833',
                'earth-milk-yellow': '#e3d3bc',
                'earth-red': '#a02128',
                'earth-milk': '#faeade',

                // Starbucks Palette (Greens)
                'starbucks-green': '#4f8b69',
                'starbucks-dark-green': '#3a6b52',
                'starbucks-bg': '#4f8b69',

                // Ikemba Legacy (Dark/Blue)
                'ikemba-primary': '#00040f',
                'ikemba-secondary': '#00f6ff',
                'ikemba-dimWhite': 'rgba(255, 255, 255, 0.7)',
                'ikemba-dimBlue': 'rgba(9, 151, 124, 0.1)',
                'ikemba-gold': '#EDC452',
            },
            fontFamily: {
                'sans': ['Poppins', 'sans-serif'],
                'serif': ['Playfair Display', 'serif'],
                'aboreto': ['Aboreto', 'cursive'],
                'bebas': ['Bebas Neue', 'sans-serif'],
                'antonio': ['Antonio', 'sans-serif'],
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
                'bounce-slow': 'bounce 3s infinite',
                'float': 'float 6s ease-in-out infinite',
                'show-content': 'showContent 0.5s 1s ease-in-out 1 forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                showContent: {
                    'from': {
                        transform: 'translateY(-30px)',
                        filter: 'blur(10px)',
                        opacity: '0',
                    },
                    'to': {
                        transform: 'translateY(0)',
                        filter: 'blur(0px)',
                        opacity: '1',
                    },
                },
            },
        },
    },
    plugins: [],
}
