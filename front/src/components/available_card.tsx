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
    case 'IT': return itIcon;
    case 'MedTech': return medtechIcon;
    case 'GreenTech': return greentechIcon;
    case 'SpaceTech': return spacetechIcon;
    default: return itIcon;
  }
};

const VerticalCard: React.FC<VerticalCardProps> = ({ title, subtitle, description, image }) => {
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [expertiseDone, setExpertiseDone] = useState(false);
  const backgroundImage = image || getIconBySubtitle(subtitle);

  const isHighlighted = active || expertiseDone;

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        width: { xs: 'calc(100% - 4vh)', sm: '35vh' },
        height: '63.5vh',
        borderRadius: '1.29vh',
        background: isHighlighted
          ? 'linear-gradient(135deg, #e5e5e5 0%, #ffffff 100%)'
          : 'linear-gradient(135deg, #9092a1 0%, #c4c5d1 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        boxShadow: hovered ? '0 0 1.2vh rgba(0,0,0,0.2)' : 'none',
        cursor: 'default',
        transition: 'all 0.3s ease',
        transform: hovered || isHighlighted ? 'scale(1.05)' : 'scale(1)',
        transformOrigin: 'center center',
        position: 'relative',
        zIndex: hovered || isHighlighted ? 2 : 1,
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
            color: '#413545'
          }}
        >
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
          onClick={(e) => {
            e.stopPropagation();
            setExpertiseDone(prev => !prev);
          }}
          sx={{
            borderColor: '#79747E',
            color: '#65558F',
            textTransform: 'none',
            borderRadius: '50vh',
            padding: '0.8vh 2.4vh',
            fontSize: '1.5vh',
            fontFamily: 'Raleway',
            '&:hover': { borderColor: '#65558F', color: '#65558F' },
            flex: 1
          }}
        >
          {expertiseDone ? 'Экспертиза произведена' : 'Заказать экспертизу'}
        </Button>

        <Button
          variant="contained"
          onClick={(e) => {
            e.stopPropagation();
            setActive(prev => !prev);
          }}
          sx={{
            backgroundColor: active ? '#929292' : '#7A9E8A',
            color: '#F8F9FA',
            textTransform: 'none',
            borderRadius: '50vh',
            padding: '0.8vh 2.4vh',
            fontSize: '1.5vh',
            fontFamily: 'Raleway, sans-serif',
            '&:hover': { backgroundColor: active ? '#7f7f7f' : '#688c79' },
            flex: 1
          }}
        >
          {active ? 'Сделка заключена' : 'Заключить сделку'}
        </Button>
      </Box>
    </Card>
  );
};

export default VerticalCard;
