/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        growFromBottom: {
          "0%": {
            opacity: "0",
            transform: "translateY(100%) scaleY(0.95)",
            transformOrigin: "bottom",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scaleY(1)",
            transformOrigin: "bottom",
          },
        },
        shrinkToBottom: {
          "0%": {
            opacity: "1",
            transform: "translateY(0) scaleY(1)",
            transformOrigin: "bottom",
          },
          "100%": {
            opacity: "0",
            transform: "translateY(100%) scaleY(0.95)",
            transformOrigin: "bottom",
          },
        },
        dotPulse: {
          "0%, 80%, 100%": { transform: "scale(0.6)", opacity: "0.3" },
          "40%": { transform: "scale(1)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        growFromBottom: "growFromBottom 200ms ease-out forwards",
        shrinkToBottom: "shrinkToBottom 200ms ease-in forwards",
        dotPulse: "dotPulse 1.2s infinite ease-in-out",
        "fade-in": "fadeIn 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
