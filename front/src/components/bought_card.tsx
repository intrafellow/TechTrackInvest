import React, { useState } from 'react';
import { Card, Typography } from '@mui/material';
import itIcon from '../icons/IT.png';
import medtechIcon from '../icons/Med.png';
import greentechIcon from '../icons/Green.png';
import spacetechIcon from '../icons/Space.png';

interface HorizontalCardProps {
  title: string;
  subtitle: string;
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

const HorizontalCard: React.FC<HorizontalCardProps> = ({ title, subtitle, image }) => {
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);
  const backgroundImage = image || getIconBySubtitle(subtitle);

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setActive(!active)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: { xs: 'calc(100% - 2vh)', sm: '37.6vh' },
        height: '8vh',
        margin: '0vh',
        padding: 0,
        borderRadius: '1.29vh',
        backgroundColor: active ? '#F8F9FA' : '#9CA0BA',
        boxShadow: hovered && !active ? '0 0 1.2vh rgba(0,0,0,0.2)' : 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: hovered || active ? 'scale(1.05)' : 'scale(1)',
        transformOrigin: 'center center',
        position: 'relative',
        zIndex: hovered || active ? 2 : 1
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: '0.78vh',
          flex: 1,
          minWidth: 0,
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Lettersano Full, sans-serif',
            fontWeight: 700,
            fontSize: '2.08vh',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
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
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: '#413545',
          }}
        >
          {subtitle}
        </Typography>
      </div>

      <div
        style={{
          width: '10.4vh',
          height: '100%',
          borderTopRightRadius: '1.29vh',
          borderBottomRightRadius: '1.29vh',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          flexShrink: 0,
        }}
      />
    </Card>
  );
};

export default HorizontalCard;
