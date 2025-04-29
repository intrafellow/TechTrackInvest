import React, { useState } from 'react';
import { Box, Divider, Typography, FormControl, Select, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import Header from '../components/header';
import LeftMenu from '../components/left_menu';
import VerticalCard from '../components/available_card';
import BoughtCard from '../components/bought_card';
import MobileSlider from '../components/mobile_slider';

const FirstMonthPage: React.FC = () => {
  const [selected, setSelected] = useState('');
  const [isBlurred, setIsBlurred] = useState(false);
  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down('md'));

  const handleChange = (event: any) => {
    setSelected(event.target.value);
  };

  const handleOpen = () => {
    setIsBlurred(true);
  };

  const handleClose = () => {
    setIsBlurred(false);
  };

  const boughtCards = [
    <BoughtCard key="1" title="CodeMind AI" subtitle="IT" />,
    <BoughtCard key="2" title="GreenFuelX" subtitle="GreenTech" />,
    <BoughtCard key="3" title="BioScan Pro" subtitle="MedTech" />,
    <BoughtCard key="4" title="BioScan Pro" subtitle="MedTech" />
  ];

  const availableCards = [
    <VerticalCard
      key="1"
      title="NeuroSync AI"
      subtitle="IT"
      description="Неинвазивный AI-ассистент для мониторинга и коррекции нейронной активности в реальном времени"
    />,
    <VerticalCard
      key="2"
      title="EcoPanel"
      subtitle="GreenTech"
      description="Инновационные солнечные панели с высокой КПД и лёгкой интеграцией"
    />,
    <VerticalCard
      key="3"
      title="MediTrack"
      subtitle="MedTech"
      description="Платформа отслеживания и анализа медицинских показателей в домашних условиях"
    />,
    <VerticalCard
      key="4"
      title="OrbitalConnect"
      subtitle="SpaceTech"
      description="Связь нового поколения для спутников на низкой орбите"
    />
  ];

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#444A6B',
      overflow: 'hidden'
    }}>
      <Header />
      <Box sx={{ 
        display: 'flex', 
        flex: 1,
        height: 'calc(100vh - 8vh)',
        '@media (min-width: 600px)': {
          height: 'calc(100vh - 9vh)'
        },
        '@media (min-width: 900px)': {
          height: 'calc(100vh - 10vh)'
        }
      }}>
        <LeftMenu />
        <Box
          sx={{
            flexGrow: 1,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: { xs: '1vh', sm: '1.5vh', md: '2vh' },
            fontFamily: 'Raleway, sans-serif',
            color: '#E3E6FF',
            filter: isBlurred ? 'blur(5px)' : 'none',
            transition: 'filter 0.3s ease',
            overflow: 'auto'
          }}
        >
          <Box
            sx={{
              marginTop: { xs: '4vh', sm: '4vh', md: '4vh' },
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginBottom: { xs: '4vh', sm: '4vh', md: '4vh' }
            }}
          >
            <FormControl
              sx={{
                backgroundColor: '#EAEAF0',
                borderRadius: '8px',
                fontFamily: 'Raleway, sans-serif',
                width: { xs: '100%', sm: '80%', md: '22.22vh' },
              }}
            >
              <Select
                sx={{
                  height: { xs: '4vh', sm: '4.5vh', md: '5.19vh' },
                  color: '#413545',
                  fontFamily: 'Raleway, sans-serif',
                  '& fieldset': { border: 'none' },
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
                value={selected}
                onChange={handleChange}
                onOpen={handleOpen}
                onClose={handleClose}
                displayEmpty
                renderValue={(value) => {
                  if (!value) {
                    return <Typography style={{ display: "flex", justifyContent: "center" }} sx={{ color: '#413545' }}>Выберите отрасль</Typography>;
                  }
                  switch (value) {
                    case 'one':
                      return 'IT';
                    case 'two':
                      return 'GreenTech';
                    case 'three':
                      return 'MedTech';
                    case 'four':
                      return 'SpaceTech';
                    default:
                      return '';
                  }
                }}
              >
                <MenuItem value="one">IT</MenuItem>
                <MenuItem value="two">GreenTech</MenuItem>
                <MenuItem value="three">MedTech</MenuItem>
                <MenuItem value="four">SpaceTech</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {isMobileOrTablet ? (
            <>
              <MobileSlider title="Купленные стартапы">
                {boughtCards}
              </MobileSlider>

              <Box sx={{ mt: 3 }}>
                <MobileSlider title="Доступные стартапы">
                  {availableCards}
                </MobileSlider>
              </Box>
            </>
          ) : (
            <>
              <Typography 
                variant="h6" 
                sx={{ 
                  marginBottom: '1vh', 
                  marginTop: { xs: '2vh', sm: '3vh', md: '4vh' },
                  color: '#E3E6FF',
                  fontSize: { xs: '1.8vh', sm: '2vh', md: '2.2vh' }
                }}
              >
                Купленные стартапы
              </Typography>
              <Divider sx={{ backgroundColor: '#CAC4D0', marginBottom: '2vh' }} />

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(4, 1fr)'
                  },
                  gap: { xs: '2vh', sm: '2vh', md: '2.4vh' },
                  padding: { xs: '1vh', sm: '0' }
                }}
              >
                {boughtCards}
              </Box>

              <Typography 
                variant="h6" 
                sx={{ 
                  marginBottom: '1vh', 
                  marginTop: { xs: '1.5vh', sm: '2vh', md: '2vh' },
                  color: '#E3E6FF',
                  fontSize: { xs: '1.8vh', sm: '2vh', md: '2.2vh' }
                }}
              >
                Доступные стартапы
              </Typography>
              <Divider sx={{ backgroundColor: '#CAC4D0' }} />

              <Box
                sx={{
                  marginTop: { xs: '1.5vh', sm: '2vh', md: '3vh' },
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(4, 1fr)'
                  },
                  gap: { xs: '2vh', sm: '2vh', md: '2.4vh' },
                  padding: { xs: '1vh', sm: '0' }
                }}
              >
                {availableCards}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FirstMonthPage; 