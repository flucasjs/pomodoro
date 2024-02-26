/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
      },
      colors: {
        "background": "hsl(var(--color-background) / <alpha-value>)",
        "foreground": "hsl(var(--color-foreground) / <alpha-value>)",
        "primary": "hsl(var(--color-primary) / <alpha-value>)",
        "secondary": "hsl(var(--color-secondary) / <alpha-value>)",
      },
      fontFamily: {
        "kumbh-sans": "var(--kumbh-sans)",
        "roboto-slab": "var(--roboto-slab)",
        "space-mono": "var(--space-mono)",
      },
      backgroundImage: {
        "gradient-linear": "linear-gradient(315deg, #2E325A 0%, #0E112A 100%)",
      },
      boxShadow: {
        "dark-blue":
          "5px 5px 20px 0px rgba(18, 21, 48, 0.7), 15px 10px 20px 0px rgba(18, 21, 48, 0.6), 40px 20px 20px 0px rgba(18, 21, 48, 0.4), 50px 40px 20px 0px rgba(18, 21, 48, 0.2), -5px -5px 20px 0px rgba(39, 44, 90, 1), -25px -15px 30px 0px rgba(39, 44, 90, 0.4), -35px -20px 30px 15px rgba(39, 44, 90, 0.3), -50px -25px 30px 0px rgba(39, 44, 90, 0.05)",
      },
    },
  },
  plugins: [],
};
