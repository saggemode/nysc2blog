/** @type {import('tailwindcss').Config} */
const { spacing } = require("tailwindcss/defaultTheme");
const { red, blue, neutral } = require("tailwindcss/colors");
module.exports = {
  //mode: "jit",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    fontFamily: {
      Poppins: ["Poppins", "sans-serif"],
      roboto: ["Roboto", "sans-serif"],
    },
    extend: {
      gridTemplateColumns: {
        sidebar: "300px auto", //for sidebar layout
        "sidebar-collapsed": "64px auto", //for collapsed sidebar layout
      },
      colors: {
        blue: {
          light: "#0a81ab",
          dark: "#0c4271",
          accent: blue["400"],
          primary: "white",
          secondary: "#b6bbb6",
          background: "#1a1a1a",
          "main-red": red["400"],
          "border-primary": neutral["700"],
          "border-secondary": neutral["400"],
        },
        animation: {
          fade: "fade 300ms ease-in-out",
        },
        keyframes: {
          fade: {
            from: {
              opacity: 0,
            },
            to: {
              opacity: 1,
            },
          },
        },
      },

      boxShadow: {
        2: "0 1px 3px 0 rgb(11 17 29 / 98%), 0 1px 2px 0 rgb(9 18 35 / 90%)",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.700"),
            a: {
              color: theme("colors.yellow.500"),
              "&:hover": {
                color: theme("colors.yellow.700"),
              },
              code: { color: theme("colors.yellow.400") },
            },
            pre: {
              backgroundColor: theme("colors.gray.900"),
              color: theme("colors.gray.50"),
            },
            "h1,h2,h3,h4": {
              "scroll-margin-top": spacing[32],
            },
            code: { color: theme("colors.yellow.500") },
            "blockquote p:first-of-type::before": false,
            "blockquote p:last-of-type::after": false,
          },
        },

        dark: {
          css: {
            color: theme("colors.gray.50"),
            a: {
              color: theme("colors.yellow.500"),
              "&:hover": {
                color: theme("colors.yellow.700"),
              },
              code: { color: theme("colors.yellow.400") },
            },
            blockquote: {
              borderLeftColor: theme("colors.gray.100"),
              color: theme("colors.gray.300"),
            },
            pre: {
              backgroundColor: theme("colors.gray.300"),
              color: theme("colors.gray.900"),
            },
            "h1,h2,h3,h4": {
              color: theme("colors.white"),
              "scroll-margin-top": spacing[32],
            },
            hr: { borderColor: theme("colors.gray.700") },
            ol: {
              li: {
                "&:before": { color: theme("colors.gray.500") },
              },
            },
            ul: {
              li: {
                "&:before": { backgroundColor: theme("colors.gray.500") },
              },
            },
            strong: { color: theme("colors.gray.300") },
            thead: {
              color: theme("colors.gray.100"),
            },
            tbody: {
              tr: {
                borderBottomColor: theme("colors.gray.700"),
              },
            },
          },
        },
      }),
    },
    screens: {
      xxs: "375px",
      xs: "425px",
      sm: "640px",
      md: "780px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },

  variants: {
    extend: {
      typography: ["dark"],
      boxShadow: ["dark"],
    },
  },

  plugins: [
    //require("@tailwindcss/line-clamp"),

    require("@tailwindcss/typography")({
      modifiers: [],
    }),
    ({ addVariant }) => {
      addVariant("inner", "& > *");
    },
  ],
};
