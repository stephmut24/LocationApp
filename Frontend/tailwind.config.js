import withMT from "@material-tailwind/html/utils/withMT";

export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts}"
  ],
  theme: {
    extend: {
      colors: {
        urgence: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        medical: {
          red: '#dc2626',
          blue: '#2563eb',
          white: '#ffffff',
        }
      }
    },
  },
  plugins: [],
});