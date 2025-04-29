import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../icons/logo.png';

const FirstPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#585C87',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Raleway, sans-serif',
        color: '#FFFFFF',
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          position: 'absolute',
          top: 0,
          right: 0,
          padding: { xs: 1.5, sm: 2 },
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={{
            width: { xs: '9vh', sm: '10vh', md: '10vh' },
            height: { xs: '7.5vh', sm: '8.5vh', md: '9vh' },
            objectFit: 'contain',
            transition: 'all 0.3s ease-in-out',
            '@media (min-width:768px) and (max-width:1024px)': {
              width: '8.5vh',
              height: '7.5vh',
              position: 'absolute',
              right: '2vh',
              top: '2vh'
            },
          }}
        />
      </Box>

      <Box
        sx={{
          pl: { xs: '4vw', sm: '6vw', md: '6vw' },
          pr: { xs: '4vw', sm: 0 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1
        }}
      >
        <Box sx={{ textAlign: 'left' }}>
          <Typography sx={{
            fontFamily: 'Raleway',
            fontSize: { xs: '4vh', sm: '6vh', md: '8vh' },
            fontWeight: 600,
            color: '#FFFFFF',
            lineHeight: 1,
            '@media (min-width:1023px) and (max-width:1025px) and (max-height:601px)': { fontSize: '7vh' },
            '@media (min-width:768px) and (max-width:1024px)': { fontSize: '5vh' },
            '@media (min-width:390px) and (max-width:450px)': { fontSize: '3.2vh' },
            '@media (max-width:389px)': { fontSize: '3vh' },
            '@media (min-width:340px) and (max-width:350px)': { fontSize: '2.7vh' },
            '@media (min-width:850px) and (max-width:860px)': { fontSize: '4.7vh' }
          }}>
            ЗАХВАТИ
          </Typography>
          <Typography sx={{
            fontFamily: 'Raleway',
            fontSize: { xs: '4vh', sm: '6vh', md: '8vh' },
            fontWeight: 600,
            color: '#C1CBFF',
            lineHeight: 1,
            '@media (min-width:1023px) and (max-width:1025px) and (max-height:601px)': { fontSize: '7vh' },
            '@media (min-width:768px) and (max-width:1024px)': { fontSize: '5vh' },
            '@media (min-width:390px) and (max-width:450px)': { fontSize: '3.2vh' },
            '@media (max-width:389px)': { fontSize: '3vh' },
            '@media (min-width:340px) and (max-width:350px)': { fontSize: '2.7vh' },
            '@media (min-width:850px) and (max-width:860px)': { fontSize: '4.7vh' }
          }}>
            РАЗНЕСИ
          </Typography>
          <Typography sx={{
            fontFamily: 'Raleway',
            fontSize: { xs: '4vh', sm: '6vh', md: '8vh' },
            fontWeight: 600,
            color: '#DEC3E6',
            lineHeight: 1,
            '@media (min-width:1023px) and (max-width:1025px) and (max-height:601px)': { fontSize: '7vh' },
            '@media (min-width:768px) and (max-width:1024px)': { fontSize: '5vh' },
            '@media (min-width:390px) and (max-width:450px)': { fontSize: '3.2vh' },
            '@media (max-width:389px)': { fontSize: '3vh' },
            '@media (min-width:340px) and (max-width:350px)': { fontSize: '2.7vh' },
            '@media (min-width:850px) and (max-width:860px)': { fontSize: '4.7vh' }
          }}>
            УНИЧТОЖЬ
          </Typography>
          <Typography sx={{
            fontFamily: 'Raleway',
            fontSize: { xs: '4vh', sm: '6vh', md: '8vh' },
            fontWeight: 600,
            color: '#FFFFFF',
            lineHeight: 1,
            '@media (min-width:1023px) and (max-width:1025px) and (max-height:601px)': { fontSize: '7vh' },
            '@media (min-width:768px) and (max-width:1024px)': { fontSize: '5vh' },
            '@media (min-width:390px) and (max-width:450px)': { fontSize: '3.2vh' },
            '@media (max-width:389px)': { fontSize: '3vh' },
            '@media (min-width:340px) and (max-width:350px)': { fontSize: '2.7vh' },
            '@media (min-width:850px) and (max-width:860px)': { fontSize: '4.7vh' }
          }}>
            ИНВЕСТИРУЙ ИЛИ <span style={{ color: '#E4B0B0' }}>УМРИ</span>
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'left', mt: 3 }}>
          <Typography sx={{
            fontFamily: 'Full Lettersano',
            fontSize: { xs: '2.4vh', sm: '2.6vh', md: '2.8vh' },
            color: 'rgba(255,255,255,0.7)',
            '@media (min-width:1023px) and (max-width:1025px) and (max-height:601px)': { fontSize: '3.5vh' },
            '@media (min-width:768px) and (max-width:1024px)': { fontSize: '2.5vh' },
            '@media (min-width:390px) and (max-width:450px)': { fontSize: '2.3vh' },
            '@media (max-width:389px)': { fontSize: '2.2vh' },
            '@media (min-width:340px) and (max-width:350px)': { fontSize: '2vh' },
            '@media (min-width:850px) and (max-width:860px)': { fontSize: '2.3vh' }
          }}>
            <strong>ДОМИНИРУЙ</strong> на рынках,
          </Typography>
          <Typography sx={{
            fontFamily: 'Full Lettersano',
            fontSize: { xs: '2.4vh', sm: '2.6vh', md: '2.8vh' },
            color: 'rgba(255,255,255,0.7)',
            '@media (min-width:1023px) and (max-width:1025px) and (max-height:601px)': { fontSize: '3.5vh' },
            '@media (min-width:768px) and (max-width:1024px)': { fontSize: '2.5vh' },
            '@media (min-width:390px) and (max-width:450px)': { fontSize: '2.3vh' },
            '@media (max-width:389px)': { fontSize: '2.2vh' },
            '@media (min-width:340px) and (max-width:350px)': { fontSize: '2vh' },
            '@media (min-width:850px) and (max-width:860px)': { fontSize: '2.3vh' }
          }}>
            <strong>СОКРУШАЙ</strong> конкурентов
          </Typography>
        </Box>

        <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{
              width: { xs: '28vh', sm: '30vh', md: '30vh' },
              height: { xs: '6vh', sm: '6.5vh', md: '6.5vh' },
              backgroundColor: '#737EB5',
              color: '#FFFFFF',
              fontSize: { xs: '2vh', sm: '2.3vh', md: '2.3vh' },
              fontWeight: 600,
              fontFamily: 'Raleway',
              textTransform: 'none',
              borderRadius: '8px',
              transition: 'all 0.3s ease-in-out',
              '&:hover': { backgroundColor: '#5f6999' }
            }}
          >
            Начать
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FirstPage;