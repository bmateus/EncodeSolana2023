import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

import RhymeExtended from "./fonts/RhymeExtended.9b182cf4.woff";

// A custom theme for this app
const theme = createTheme({
  typography: {
    fontFamily: "RhymeExtended, Arial",
  },
  components: {
    MuiCssBaseline: {
        styleOverrides: `
          @font-face {
            font-family: 'RhymeExtended';
            font-style: normal;
            font-display: swap;
            font-weight: 400;
            src: local('RhymeExtended'), local('RhymeExtended-Regular'), url(${RhymeExtended}) format('woff2');
            unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
          }
        `,
      },
  },
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
