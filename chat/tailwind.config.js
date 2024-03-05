/** @type {import('tailwindcss').Config} */
export const content = [
  './src/**/*.{html,ts}'
]
export const theme = {
  extend: {
    colors: {
      bg: '#F0F2F5',
      card: '#dae9f1',
      chips: '#CAD4DB',
      sidebar: '#e9f1f7',
      text: '#222222',
      error: '#FF0000',
      content: '#EEF2FF'
    },
    minHeight: {
      '7/10': '70vh',
      '5/10': '50vh'
    },
    maxHeight: {
      '7/10': '70vh',
      '5/10': '50vh'
    }
  }
}
export const plugins = []
