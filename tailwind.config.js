/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        thistle: "#cdb4db",
        "pastel-petal": "#ffc8dd",
        "baby-pink": "#ffafcc",
        "icy-blue": "#bde0fe",
        "sky-blue": "#a2d2ff",
      },
    },
  },
  plugins: [],
};
