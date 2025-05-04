import React from 'react';
import { Box, Typography } from '@mui/material';

interface DiceRollProps {
  value: number;
  isRolling: boolean;
}

const DiceRoll: React.FC<DiceRollProps> = ({ value, isRolling }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1
      }}
    >
      <Box
        sx={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #E8DEF8 0%, #F3E5F5 100%)',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          position: 'relative',
          transform: isRolling ? 'rotate(360deg)' : 'rotate(0deg)',
          transition: 'transform 1s ease-in-out',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.3) 50%, transparent 55%)',
            borderRadius: '12px',
          }
        }}
      >
        <Typography
          sx={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#413545',
            fontFamily: 'Raleway, sans-serif',
            zIndex: 1
          }}
        >
          {value}
        </Typography>
      </Box>
      <Typography
        sx={{
          fontSize: '18px',
          color: '#E3E6FF',
          fontFamily: 'Raleway, sans-serif',
          textAlign: 'center',
          fontWeight: 600,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          background: 'linear-gradient(135deg, #E8DEF8 0%, #F3E5F5 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          padding: '4px 12px',
          borderRadius: '8px',
          border: '1px solid rgba(232, 222, 248, 0.3)'
        }}
      >
        d20
      </Typography>
    </Box>
  );
};

export default DiceRoll; 