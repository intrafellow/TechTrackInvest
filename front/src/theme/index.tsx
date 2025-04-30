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
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap&subset=cyrillic');
        
        @font-face {
          font-family: 'Full Lettersano';
          src: url('/fonts/Full Lettersano.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
      `
    }
  }
});

export default theme; 