import React, { useState } from 'react';
import { Card, Typography, Button, Box } from '@mui/material';
import itIcon from '../icons/IT.png';
import medtechIcon from '../icons/Med.png';
import greentechIcon from '../icons/Green.png';
import spacetechIcon from '../icons/Space.png';

interface VerticalCardProps {
  title: string;
  subtitle: string;
  description: string;
  image?: string;
}

const getIconBySubtitle = (subtitle: string): string => {
  switch (subtitle) {
    case 'IT':
      return itIcon;
    case 'MedTech':
      return medtechIcon;
    case 'GreenTech':
      return greentechIcon;
    case 'SpaceTech':
      return spacetechIcon;
    default:
      return itIcon;
  }
};

const VerticalCard: React.FC<VerticalCardProps> = ({ title, subtitle, description, image }) => {
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);
  const backgroundImage = image || getIconBySubtitle(subtitle);

  const handleClick = () => setActive(!active);

  const inactiveGradient = 'linear-gradient(135deg, #6D3F91, #9B6BC4)';
  const activeGradient = 'linear-gradient(135deg, #B07BDA, #D1B2EB)';

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        width: '35vh',
        height: '63.5vh',
        borderRadius: '1.29vh',
        background: active ? activeGradient : inactiveGradient,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        boxShadow: hovered || active ? '0 0 1.2vh rgba(0,0,0,0.2)' : 'none',
        cursor: 'default',
        transition: 'all 0.3s ease',
        transform: hovered || active ? 'scale(1.05)' : 'scale(1)',
        padding: '1.3vh',
        marginBottom: '3.125vh',
        alignSelf: 'flex-start'
      }}
    >
      <Box>
        <Box sx={{ width: '100%', textAlign: 'left' }}>
          <Typography
            sx={{
              fontFamily: 'Lettersano Full, sans-serif',
              fontWeight: 700,
              fontSize: '2.08vh',
              color: '#F8F9FA'
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 400,
              fontSize: '1.82vh',
              color: '#F8F9FA'
            }}
          >
            {subtitle}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 'calc(100% + 2.6vh)',
            marginLeft: '-1.3vh',
            marginRight: '-1.3vh',
            height: '20vh',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            marginTop: '1.3vh'
          }}
        />

        <Box
          sx={{
            marginTop: '2.08vh',
            textAlign: 'left',
            borderRadius: '1vh',
            padding: '1vh',
            color: '#EAEAF0'
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Lettersano Full, sans-serif',
              fontWeight: 700,
              fontSize: '2.08vh',
              color: '#F8F9FA'
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 400,
              fontSize: '1.5vh',
              marginTop: '4.16vh',
              color: '#EAEAF0'
            }}
          >
            {description}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: '1vh' }}>
        <Button
          variant="contained"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          sx={{
            backgroundColor: active ? '#929292' : '#7A9E8A',
            color: '#EAEAF0',
            textTransform: 'none',
            borderRadius: '50vh',
            padding: '0.8vh 2.4vh',
            height: '7vh',
            fontSize: '1.5vh',
            fontFamily: 'Raleway, sans-serif',
            '&:hover': {
              backgroundColor: active ? '#7f7f7f' : '#688c79'
            },
            flex: 1
          }}
        >
          {active ? 'Посещено' : 'Посетить'}
        </Button>
      </Box>
    </Card>
  );
};

export default VerticalCard;
