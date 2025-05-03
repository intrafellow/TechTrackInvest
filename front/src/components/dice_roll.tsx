import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';

interface DiceRollProps {
  value: number;
  isRolling?: boolean;
  onRollEnd?: () => void;
}

const DiceRoll: React.FC<DiceRollProps> = ({ value, isRolling = false, onRollEnd }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRolling) {
      let ticks = 0;
      intervalRef.current = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
        ticks++;
        if (ticks > 15) { // 15 тиков = ~1 сек
          if (intervalRef.current) clearInterval(intervalRef.current);
          setDisplayValue(value);
          if (onRollEnd) setTimeout(onRollEnd, 100);
        }
      }, 60);
    } else {
      setDisplayValue(value);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRolling, value, onRollEnd]);

  return (
    <Box
      sx={{
        width: '10vh',
        height: '10vh',
        backgroundColor: '#E8DEF8',
        borderRadius: '2vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        margin: '0 1vh'
      }}
    >
      <Typography
        sx={{
          fontFamily: 'Lettersano Full, sans-serif',
          fontSize: '6vh',
          color: '#F6F7FF',
          fontWeight: 700
        }}
      >
        {displayValue}
      </Typography>
    </Box>
  );
};

export default DiceRoll; 