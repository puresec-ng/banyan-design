/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: '#004D40',
          accent: '#FF6F00',
          textColor: '#333333',
        },
        fontFamily: {
          lato: ['var(--font-lato)'],
          roboto: ['var(--font-roboto)'],
          montserrat: ['var(--font-montserrat)'],
        },
      },
    },
    plugins: [],
  } 