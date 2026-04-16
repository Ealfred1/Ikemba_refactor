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
                // Lekki Mart Cyber Palette
                'lekki-lime': '#A4E600',
                'lekki-black': '#000000',
                'lekki-dark': '#121212',
                'lekki-gray': '#1A1A1A',
                'lekki-light': '#F5F7F5',

                // Aliases for compatibility
                'lekkimart-dark': '#000000',
                'lekkimart-primary': '#A4E600',
                'lekkimart-secondary': '#A4E600',
                'lekkimart-accent': '#A4E600',
                'lekkimart-offwhite': '#F5F7F5',

                'earth-black': '#000000',
                'earth-milk': '#F5F7F5',
                'earth-dark-brown': '#000000',
                'earth-mid-brown': '#A4E600',
                'earth-light-brown': '#A4E600',
            },
            fontFamily: {
                'sans': ['Poppins', 'sans-serif'],
                'serif': ['Playfair Display', 'serif'],
                'antonio': ['Antonio', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'show-content': 'showContent 0.5s ease-in-out forwards',
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
