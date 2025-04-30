import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import mic from '../icons/mic.png';
import start from '../icons/start.png';
import time from '../icons/time.png';

const navItems = [
  { label: 'Стартапы', icon: start },
  { label: 'Мероприятия', icon: mic },
];

const buttonBaseStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '0.5vh',
  padding: '0 0.5vh',
  borderRadius: '0.3vh',
  backgroundColor: '#9CA0BA',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  flexShrink: 0,
};

const Sidebar: React.FC = () => {
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#535C94',
        width: { xs: '8vh', sm: '9vh', md: '10vh' },
        padding: { xs: '1vh 0.3vh', sm: '1.5vh 0.4vh', md: '2vh 0.5vh' },
        alignItems: 'center',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: '1vh', sm: '1.5vh', md: '2vh' } }}>
        {navItems.map(({ label, icon }) => {
          const isActive = active === label;
          const isHovered = hovered === label;
          return (
            <Box
              key={label}
              onMouseEnter={() => setHovered(label)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setActive(label)}
              sx={{
                ...buttonBaseStyle,
                width: { xs: '7vh', sm: '8vh', md: '9vh' },
                height: { xs: '3vh', sm: '3.5vh', md: '4vh' },
                backgroundColor: isActive ? '#EAEAF0' : '#9CA0BA',
                transform: isActive || isHovered ? 'scale(1.07)' : 'scale(1)',
              }}
            >
              <Box 
                sx={{ 
                  width: { xs: '2vh', sm: '2.2vh', md: '2.5vh' },
                  height: { xs: '2vh', sm: '2.2vh', md: '2.5vh' },
                  backgroundImage: `url(${icon})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }} 
              />
              <Typography
                sx={{
                  fontSize: { xs: '0.8vh', sm: '0.9vh', md: '1vh' },
                  fontFamily: 'Lettersano Full, sans-serif',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Box
        sx={{
          marginTop: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: '1vh', sm: '1.5vh', md: '2vh' },
          mb: { xs: '1vh', sm: '1.5vh', md: '2vh' },
        }}
      >
        <Box
          onMouseEnter={() => setHovered('Завершить ход')}
          onMouseLeave={() => setHovered(null)}
          onClick={() => setActive('Завершить ход')}
          sx={{
            ...buttonBaseStyle,
            width: { xs: '7vh', sm: '8vh', md: '9vh' },
            height: { xs: '3vh', sm: '3.5vh', md: '4vh' },
            backgroundColor: active === 'Завершить ход' ? '#EAEAF0' : '#9CA0BA',
            transform:
              active === 'Завершить ход' || hovered === 'Завершить ход'
                ? 'scale(1.07)'
                : 'scale(1)',
          }}
        >
          <Box
            sx={{
              width: { xs: '2vh', sm: '2.2vh', md: '2.5vh' },
              height: { xs: '2vh', sm: '2.2vh', md: '2.5vh' },
              backgroundImage: `url(${time})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          />
          <Typography
            sx={{
              fontSize: { xs: '0.8vh', sm: '0.9vh', md: '1vh' },
              fontFamily: 'Lettersano Full, sans-serif',
              whiteSpace: 'nowrap',
            }}
          >
            Завершить
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
