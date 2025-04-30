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
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap&subset=cyrillic');
        
        @font-face {
          font-family: 'Lettersano Full';
          src: url('/fonts/Lettersano Full.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
      `
    }
  }
});

export default theme; 