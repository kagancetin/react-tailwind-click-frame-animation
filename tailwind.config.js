/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./playground/**/*.{js,ts,jsx,tsx,html}"
  ],
  theme: {
    extend: {
      keyframes: {
        "frame-ping": {
          "0%": { transform: "scale(0.8)", opacity: "1" },
          "75%, 100%": { transform: "scale(2.2)", opacity: "0" },
        },
        "frame-ripple": {
          "0%": { transform: "scale(0)", opacity: "0.8" },
          "100%": { transform: "scale(3)", opacity: "0" },
        },
        "frame-burst": {
          "0%": { transform: "scale(0.5) rotate(0deg)", opacity: "1" },
          "100%": { transform: "scale(1.8) rotate(45deg)", opacity: "0" },
        },
      },
      animation: {
        "frame-ping": "frame-ping 0.6s cubic-bezier(0, 0, 0.2, 1) forwards",
        "frame-ripple": "frame-ripple 0.75s ease-out forwards",
        "frame-burst": "frame-burst 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
