/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        darkBlue: "hsl(212, 24%, 26%)",
        lightGrey: "hsl(228, 33%, 97%)",
        moderateBlue: "hsl(238, 40%, 52%)",
      },
    },
  },
  plugins: [],
};
