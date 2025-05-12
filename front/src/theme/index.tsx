import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Raleway, sans-serif',
    h1: {
      fontFamily: 'Lettersano Full, sans-serif',
    },
    h2: {
      fontFamily: 'Lettersano Full, sans-serif',
    },
    h3: {
      fontFamily: 'Lettersano Full, sans-serif',
    },
    h4: {
      fontFamily: 'Lettersano Full, sans-serif',
    },
    h5: {
      fontFamily: 'Lettersano Full, sans-serif',
    },
    h6: {
      fontFamily: 'Lettersano Full, sans-serif',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Lettersano Full';
          src: url('/fonts/Lettersano Full.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        @font-face {
          font-family: 'Raleway';
          src: url('/fonts/Raleway-Regular.ttf') format('truetype');
          font-weight: 400;
          font-style: normal;
        }
        @font-face {
          font-family: 'Raleway';
          src: url('/fonts/Raleway-SemiBold.ttf') format('truetype');
          font-weight: 600;
          font-style: normal;
        }
        @font-face {
          font-family: 'Raleway';
          src: url('/fonts/Raleway-Bold.ttf') format('truetype');
          font-weight: 700;
          font-style: normal;
        }
      `
    }
  }
});

export default theme; 