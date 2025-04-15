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

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setActive(!active)}
      sx={{
        width: '35vh',
        height: '63.5vh',
        borderRadius: '1.29vh',
        backgroundColor: active ? '#F8F9FA' : '#B0B1BD',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        boxShadow: hovered && !active ? '0 0 1.2vh rgba(0,0,0,0.2)' : 'none',
        cursor: 'pointer',
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
              fontFamily: 'Lettersano Full Regular, sans-serif',
              fontWeight: 700,
              fontSize: '2.08vh',
              color: '#413545',
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 400,
              fontSize: '1.82vh',
              color: '#413545',
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
            marginTop: '1.3vh',
          }}
        />

        <Box sx={{ marginTop: '2.08vh', color: '#413545', textAlign: 'left' }}>
          <Typography
            sx={{
              fontFamily: 'Lettersano Full Regular, sans-serif',
              fontWeight: 700,
              fontSize: '2.08vh',
              color: '#413545'
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 400,
              fontSize: '1.5vh',
              marginTop: '4.16vh'
            }}
          >
            {description}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: '1vh' }}>
        <Button
          variant="outlined"
          sx={{
            borderColor: '#79747E',
            color: '#65558F',
            textTransform: 'none',
            borderRadius: '50vh',
            padding: '0.8vh 2.4vh',
            fontSize: '1.5vh',
            fontFamily: 'Raleway, sans-serif',
            '&:hover': { borderColor: '#65558F', color: '#65558F' },
            flex: 1
          }}
        >
          Заказать экспертизу
        </Button>

        <Button
          variant="contained"
          sx={{
            backgroundColor: '#7A9E8A',
            color: '#F8F9FA',
            textTransform: 'none',
            borderRadius: '50vh',
            padding: '0.8vh 2.4vh',
            fontSize: '1.5vh',
            fontFamily: 'Raleway, sans-serif',
            '&:hover': { backgroundColor: '#688c79' },
            flex: 1
          }}
        >
          Заключить сделку
        </Button>
      </Box>
    </Card>
  );
};

export default VerticalCard;