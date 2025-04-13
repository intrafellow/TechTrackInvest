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
        height: '12%',
      }}
    >
      {/* Левая часть: Лого + Очки действий */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '7vh' }}>
        <Box
          sx={{
            width: '10vh',
            height: '8vh',
            backgroundImage: `url(${logo})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            marginLeft: '2.5vh',
          }}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '1vh',
            padding: '0.5vh 1.5vh',
            backgroundColor: '#9CA0BA',
            borderRadius: '1vh',
            width: '18vh',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: '4.5vh',
              height: '4.5vh',
              backgroundImage: `url(${tea})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          />
          <Typography
            sx={{
              color: '#FFFFFF',
              fontSize: '1.5vh',
              fontFamily: '"Lettersano Full Regular", sans-serif',
              whiteSpace: 'nowrap',
            }}
          >
            Очки действий
          </Typography>
          <Typography
            sx={{
              color: '#FFFFFF',
              fontSize: '2.5vh',
              fontFamily: '"Lettersano Full Regular", sans-serif',
              marginLeft: '1vh',
            }}
          >
            3
          </Typography>
        </Box>
      </Box>

      {/* Центр: Навигация */}
      <Box sx={{ display: 'flex', gap: '3vh', alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}>
        {navItems.map(({ label, icon }) => (
          <Box key={label} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              sx={{
                width: '10vh',
                height: '8vh',
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
                fontSize: '1.3vh',
                fontFamily: '"Lettersano Full Regular", sans-serif',
                marginTop: '1vh',
              }}
            >
              {label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Правая часть: Календарь + Профиль */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4vh' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '2vh',
            padding: '0.5vh 1.5vh',
            backgroundColor: '#9CA0BA',
            borderRadius: '1vh',
            width: '20vh',
          }}
        >
          <Box
            sx={{
              width: '5vh',
              height: '5vh',
              backgroundImage: `url(${calender})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          />
          <Typography
            sx={{
              color: '#FFFFFF',
              fontSize: '2.5vh',
              fontFamily: '"Lettersano Full Regular", sans-serif',
            }}
          >
            Январь
          </Typography>
        </Box>

        <Box
          sx={{
            width: '10vh',
            height: '8vh',
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
