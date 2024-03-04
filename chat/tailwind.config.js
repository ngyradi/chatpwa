/** @type {import('tailwindcss').Config} */
export const content = [
  './src/**/*.{html,ts}'
]
export const theme = {
  extend: {
    fontFamily: {
      // 'sans': ['SFMono-regular'],
    },
    colors: {
      bg: '#F0F2F5',
      card: '#E4EAED',
      chips: '#CAD4DB',
      navbar: '#CAD4DB',
      modal: '#CAD4DB',
      text: '#222222',
      error: '#FF0000',
      content: '#EEF2FF'
    }
  }
}
export const plugins = []
