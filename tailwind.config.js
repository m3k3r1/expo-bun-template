/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    fontFamily: {
      'barlow-300': 'Barlow_300Light',
      'barlow-400': 'Barlow_400Regular',
      'barlow-500': 'Barlow_500Medium',
      'barlow-700': 'Barlow_700Bold',
      'barlow-900': 'Barlow_900Black',
    },
    extend: {
      colors: {
        selected: '#F25606',
        card: 'white',
      },
    },
  },
  plugins: [],
}
