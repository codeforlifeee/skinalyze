/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}", 
    "./components/**/*.{js,jsx,ts,tsx}", 
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./services/**/*.{js,jsx,ts,tsx}", 
    "./utils/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E3F2FD',
          100: '#BBDEFB',
          500: '#2196F3',
          600: '#1976D2',
          700: '#1565C0',
        },
        success: {
          50: '#E8F5E8',
          500: '#4CAF50',
          600: '#43A047',
        },
        warning: {
          500: '#FF9800',
          600: '#F57C00',
        },
        error: {
          500: '#f44336',
          600: '#d32f2f',
        },
        gray: {
          50: '#f5f5f5',
          100: '#f0f0f0',
          200: '#e0e0e0',
          300: '#ddd',
          400: '#999',
          500: '#666',
          600: '#555',
          700: '#333',
          800: '#2c2c2c',
          900: '#1c1c1c',
        }
      },
      fontFamily: {
        'sans': ['System'],
      },
    },
  },
  plugins: [],
}