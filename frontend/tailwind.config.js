/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#09111f",
        slatepanel: "#132238",
        accent: "#19b4a6",
        danger: "#ef4444",
        warning: "#f59e0b",
      },
      fontFamily: {
        sans: ["Segoe UI", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        panel: "0 20px 80px rgba(8, 15, 27, 0.35)",
      },
    },
  },
  plugins: [],
};

