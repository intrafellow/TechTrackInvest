import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Box } from '@mui/material';
import it from '../icons/IT.png';
import med from '../icons/Med.png';
import green from '../icons/Green.png';
import space from '../icons/Space.png';
import { startupsAPI, contractAPI, monthAPI } from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import ExpertiseDialog from './expertise_dialog';

const NICHE_MAP: { [key: string]: { id: string; name: string; icon: string } } = {
  'IT': { id: 'IT', name: 'IT', icon: it },
  'GreenTech': { id: 'GreenTech', name: 'GreenTech', icon: green },
  'MedTech': { id: 'MedTech', name: 'MedTech', icon: med },
  'SpaceTech': { id: 'SpaceTech', name: 'SpaceTech', icon: space }
};

interface VerticalCardProps {
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  resourceId: string;
  startupId: string;
  price: number;
  onDealStart: () => void;
  onDealEnd: () => void;
  isDemo?: boolean;
}

const VerticalCard: React.FC<VerticalCardProps> = ({
  title,
  subtitle,
  description,
  image,
  resourceId,
  startupId,
  price,
  onDealStart,
  onDealEnd,
  isDemo = false
}) => {
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [expertiseDone, setExpertiseDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expertiseDialogOpen, setExpertiseDialogOpen] = useState(false);
  const [expertiseOrdered, setExpertiseOrdered] = useState(false);
  const [expertiseLoading, setExpertiseLoading] = useState(false);
  const [expertiseError, setExpertiseError] = useState<string | null>(null);
  const [expertiseData, setExpertiseData] = useState<any>(null);
  const [expertisePrice] = useState(80000);
  const nicheInfo = NICHE_MAP[subtitle] || NICHE_MAP['IT'];
  const backgroundImage = image || nicheInfo.icon;
  const isHighlighted = active || expertiseDone;
  const navigate = useNavigate();

  const handleOpenExpertiseDialog = () => {
    setExpertiseDialogOpen(true);
    setExpertiseError(null);
    setExpertiseLoading(false);
  };

  const handleExpertiseOrder = async () => {
    setExpertiseLoading(true);
    setExpertiseError(null);
    try {
      const data = await startupsAPI.getExpertise(resourceId, expertisePrice);
      if (data.success) {
        setExpertiseData(data.content);
        setExpertiseOrdered(true);
        // Обновляем очки действий после заказа экспертизы
        try {
          const stepCountData = await monthAPI.getStepCount();
          window.dispatchEvent(new CustomEvent('stepCountUpdate', { detail: { stepsLeft: stepCountData.stepCount } }));
        } catch (e) { /* ignore */ }
      } else {
        setExpertiseError(data.errorMessage || 'Ошибка при получении экспертизы');
      }
    } catch (error: any) {
      setExpertiseError(error.response?.data?.message || 'Ошибка при получении экспертизы');
    } finally {
      setExpertiseLoading(false);
    }
  };

  const handleContract = async () => {
    try {
      setLoading(true);
      onDealStart();
      try {
        const contractData = await contractAPI.getContract(resourceId);
        // Обновляем очки действий после начала сделки
        try {
          const stepCountData = await monthAPI.getStepCount();
          window.dispatchEvent(new CustomEvent('stepCountUpdate', { detail: { stepsLeft: stepCountData.stepCount } }));
        } catch (e) { /* ignore */ }
        navigate(`/deal/${startupId}`);
      } catch (apiError) {
        // Если API недоступен, используем демо-режим
        console.log('API недоступен, используем демо-режим');
        navigate(`/deal/${startupId}`, { 
          state: { 
            isDemo: true,
            startupId,
            startupName: title,
            description,
            minPrice: price,
            nicheId: subtitle
          } 
        });
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Ошибка при заключении договора');
    } finally {
      setLoading(false);
      onDealEnd();
    }
  };

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
        console.log('Клик по VerticalCard:', { title, resourceId });
        e.stopPropagation();
      }}
      sx={{
        width: { xs: 'calc(100% - 2vh)', sm: '37.6vh' },
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
      {error && (
        <Typography color="error" sx={{ fontSize: '1.2vh', textAlign: 'center' }}>
          {error}
        </Typography>
      )}

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
          onClick={handleOpenExpertiseDialog}
          disabled={loading || expertiseDone}
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
          onClick={handleContract}
          disabled={loading || active}
          sx={{
            backgroundColor: active ? '#929292' : (isDemo ? '#E8DEF8' : '#7A9E8A'),
            color: '#4A4459',
            textTransform: 'none',
            borderRadius: '50vh',
            padding: '0.8vh 2.4vh',
            fontSize: '1.5vh',
            fontFamily: 'Raleway, sans-serif',
            '&:hover': { backgroundColor: active ? '#7f7f7f' : (isDemo ? '#D0BCFF' : '#688c79') },
            flex: 1
          }}
        >
          {active ? 'Сделка заключена' : 'Заключить сделку'}
        </Button>
      </Box>

      <ExpertiseDialog
        open={expertiseDialogOpen}
        onClose={() => {
          setExpertiseDialogOpen(false);
          setExpertiseError(null);
          setExpertiseLoading(false);
          setExpertiseData(null);
          setExpertiseOrdered(false);
        }}
        onOrder={handleExpertiseOrder}
        ordered={expertiseOrdered}
        loading={expertiseLoading}
        error={expertiseError}
        expertiseData={expertiseData}
        startupPrice={expertisePrice}
      />
    </Card>
  );
};

export default VerticalCard;
