
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",  // Adjust paths based on where your React files are located
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        bgcolor: '#F8F9FD',// Add your custom color here
        primary: '#5D90F4',
        fontcolor: '#3D4142',
        customgrey: '#828487', 
        greylight: '#A0A0A0',
      },
    },
  },
  plugins: [],
};

