import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Full Lettersano',
      'Raleway',
      'sans-serif'
    ].join(','),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Full Lettersano';
          src: url('/fonts/Full Lettersano.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        @font-face {
          font-family: 'Raleway';
          src: url('/fonts/Raleway-Regular.woff2') format('woff2'),
               url('/fonts/Raleway-Regular.woff') format('woff');
          font-weight: 400;
          font-style: normal;
        }
        @font-face {
          font-family: 'Raleway';
          src: url('/fonts/Raleway-Bold.woff2') format('woff2'),
               url('/fonts/Raleway-Bold.woff') format('woff');
          font-weight: 700;
          font-style: normal;
        }
        @font-face {
          font-family: 'Raleway';
          src: url('/fonts/Raleway-SemiBold.woff2') format('woff2'),
               url('/fonts/Raleway-SemiBold.woff') format('woff');
          font-weight: 600;
          font-style: normal;
        }
      `
    }
  }
});

export default theme; 