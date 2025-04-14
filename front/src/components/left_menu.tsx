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
  gap: '1vh',
  padding: '0 1vh',
  borderRadius: '8px',
  width: '13vh',
  height: '5vh',
  backgroundColor: '#9CA0BA',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  flexShrink: 0,
};

const iconStyle = {
  width: '4vh',
  height: '5vh',
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
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
        width: '16vh',
        padding: '3vh 0',
        alignItems: 'center',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '3vh' }}>
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
                backgroundColor: isActive ? '#EAEAF0' : '#9CA0BA',
                transform: isActive || isHovered ? 'scale(1.07)' : 'scale(1)',
              }}
            >
              <Box sx={{ ...iconStyle, backgroundImage: `url(${icon})` }} />
              <Typography
                sx={{
                  fontSize: '1.3vh',
                  fontFamily: '"Lettersano Full Regular", sans-serif',
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
          gap: '3vh',
          mb: '2.4vh',
        }}
      >
        <Box
          onMouseEnter={() => setHovered('Завершить ход')}
          onMouseLeave={() => setHovered(null)}
          onClick={() => setActive('Завершить ход')}
          sx={{
            ...buttonBaseStyle,
            backgroundColor: active === 'Завершить ход' ? '#EAEAF0' : '#9CA0BA',
            transform:
              active === 'Завершить ход' || hovered === 'Завершить ход'
                ? 'scale(1.07)'
                : 'scale(1)',
          }}
        >
          <Box
            sx={{
              ...iconStyle,
              backgroundImage: `url(${time})`,
            }}
          />
          <Typography
            sx={{
              fontSize: '1.5vh',
              fontFamily: '"Lettersano Full Regular", sans-serif',
            }}
          >
            Завершить ход
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
