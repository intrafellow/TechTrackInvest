import React from 'react';
import { Box, Typography } from '@mui/material';
import boy from '../icons/boy.png'; 
import file from '../icons/file.png';
import wallet from '../icons/wallet.png';
import chat from '../icons/chat.png';
import logo from '../icons/logo.png';
import tea from '../icons/tea.png';
import calender from '../icons/calender.png';

const navItems = [
  { label: 'Экспертиза', icon: file },
  { label: 'Финансы', icon: wallet },
  { label: 'Репутация', icon: chat },
];

const Header: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#535C94',
        color: '#413545',
        width: '100%',
        height: { xs: '7vh', sm: '8vh', md: '9vh' },
        padding: { xs: '0.3vh', sm: '0.5vh', md: '1vh' },
        gap: { xs: '0.3vh', sm: '0.5vh', md: '1vh' }
      }}
    >
      {/* Левая часть: Лого + Очки действий */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: { xs: '0.5vh', sm: '1vh', md: '2vh' },
        minWidth: 'fit-content'
      }}>
        <Box
          sx={{
            width: { xs: '5vh', sm: '6vh', md: '7vh' },
            height: { xs: '3vh', sm: '4vh', md: '5vh' },
            backgroundImage: `url(${logo})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            marginLeft: { xs: '0.3vh', sm: '0.5vh', md: '1vh' },
          }}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3vh',
            padding: { xs: '0.2vh 0.3vh', sm: '0.3vh 0.5vh', md: '0.4vh 0.8vh' },
            backgroundColor: '#9CA0BA',
            borderRadius: '0.3vh',
            width: { xs: '8vh', sm: '10vh', md: '12vh' },
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: { xs: '2vh', sm: '2.5vh', md: '3vh' },
              height: { xs: '2vh', sm: '2.5vh', md: '3vh' },
              backgroundImage: `url(${tea})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          />
          <Typography
            sx={{
              color: '#413545',
              fontSize: { xs: '0.8vh', sm: '0.9vh', md: '1vh' },
              fontFamily: '"Lettersano Full Regular", sans-serif',
              whiteSpace: 'nowrap',
            }}
          >
            Очки
          </Typography>
          <Typography
            sx={{
              color: '#FFFFFF',
              fontSize: { xs: '1.2vh', sm: '1.4vh', md: '1.6vh' },
              fontFamily: '"Lettersano Full Regular", sans-serif',
              marginLeft: '0.3vh',
            }}
          >
            3
          </Typography>
        </Box>
      </Box>

      {/* Центр: Навигация */}
      <Box sx={{ 
        display: 'flex', 
        gap: { xs: '0.5vh', sm: '1vh', md: '1.5vh' }, 
        alignItems: 'center',
        justifyContent: 'center',
        flex: { xs: '0 1 auto', md: '1' }
      }}>
        {navItems.map(({ label, icon }) => (
          <Box key={label} sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            minWidth: { xs: '5vh', sm: '6vh', md: '7vh' }
          }}>
            <Box
              sx={{
                width: { xs: '5vh', sm: '6vh', md: '7vh' },
                height: { xs: '3vh', sm: '4vh', md: '5vh' },
                backgroundImage: `url(${icon})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            />
            <Typography
              sx={{
                color: '#9CA0BA',
                fontSize: { xs: '0.7vh', sm: '0.8vh', md: '0.9vh' },
                fontFamily: '"Lettersano Full Regular", sans-serif',
                marginTop: '0.3vh',
              }}
            >
              {label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Правая часть: Календарь + Профиль */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: { xs: '0.5vh', sm: '1vh', md: '1.5vh' },
        minWidth: 'fit-content'
      }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: '0.3vh', sm: '0.5vh', md: '0.8vh' },
            padding: { xs: '0.2vh 0.3vh', sm: '0.3vh 0.5vh', md: '0.4vh 0.8vh' },
            backgroundColor: '#9CA0BA',
            borderRadius: '0.3vh',
            width: { xs: '10vh', sm: '12vh', md: '14vh' },
          }}
        >
          <Box
            sx={{
              width: { xs: '2.5vh', sm: '3vh', md: '3.5vh' },
              height: { xs: '2.5vh', sm: '3vh', md: '3.5vh' },
              backgroundImage: `url(${calender})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          />
          <Typography
            sx={{
              color: '#413545',
              fontSize: { xs: '1.2vh', sm: '1.4vh', md: '1.6vh' },
              fontFamily: '"Lettersano Full Regular", sans-serif',
            }}
          >
            Янв
          </Typography>
        </Box>

        <Box
          sx={{
            width: { xs: '5vh', sm: '6vh', md: '7vh' },
            height: { xs: '3vh', sm: '4vh', md: '5vh' },
            borderRadius: '50%',
            backgroundImage: `url(${boy})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Header;