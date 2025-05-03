import React from 'react';
import { Card, Typography, Box } from '@mui/material';

interface HorizontalCardProps {
  title: string;
  subtitle: string;
}

const HorizontalCard: React.FC<HorizontalCardProps> = ({ title, subtitle }) => {
  return (
    <Card
      sx={{
        width: '100%',
        height: '15vh',
        borderRadius: '1.29vh',
        background: 'linear-gradient(135deg, #e5e5e5 0%, #ffffff 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.3vh',
        marginBottom: '1vh'
      }}
    >
      <Box>
        <Typography
          sx={{
            fontFamily: 'Lettersano Full, sans-serif',
            fontWeight: 700,
            fontSize: '2.08vh',
            color: '#413545'
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Raleway',
            fontWeight: 400,
            fontSize: '1.82vh',
            color: '#413545'
          }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Card>
  );
};

export default HorizontalCard; 