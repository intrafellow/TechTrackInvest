import React, { useState } from 'react';
import HorizontalCard from './bought_card';
import VerticalCard from './available_card';
import Event from './event'
import {
  Box,
  Divider,
  Typography,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';

const Field: React.FC = () => {
  const [selected, setSelected] = useState('');
  const [isBlurred, setIsBlurred] = useState(false);

  const handleChange = (event: any) => {
    setSelected(event.target.value);
  };

  const handleOpen = () => {
    setIsBlurred(true);
  };

  const handleClose = () => {
    setIsBlurred(false);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '2vh',
        fontFamily: 'Raleway, sans-serif',
        color: '#E3E6FF',
        filter: isBlurred ? 'blur(5px)' : 'none',
        transition: 'filter 0.3s ease',
      }}
    >
      <Box
        sx={{
          marginTop: '6.3vh',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <FormControl
          sx={{
            backgroundColor: '#EAEAF0',
            borderRadius: '8px',
            fontFamily: 'Raleway, sans-serif',
          }}
        >
          <Select
            style={{ width: '22.22vh', height: '5.19vh' }}
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
            sx={{
              color: '#413545',
              fontFamily: 'Raleway, sans-serif',
              '& fieldset': { border: 'none' },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <MenuItem value="one">IT</MenuItem>
            <MenuItem value="two">GreenTech</MenuItem>
            <MenuItem value="three">MedTech</MenuItem>
            <MenuItem value="four">SpaceTech</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Typography variant="h6" sx={{ marginBottom: '1vh', marginTop: '6vh'}}>
        Купленные стартапы
      </Typography>
      <Divider sx={{ backgroundColor: '#CAC4D0', marginBottom: '2vh' }} />

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2.4vh',
        }}
      >
        <HorizontalCard title="CodeMind AI" subtitle="IT" />
        <HorizontalCard title="GreenFuelX" subtitle="GreenTech" />
        <HorizontalCard title="BioScan Pro" subtitle="MedTech" />
		<HorizontalCard title="BioScan Pro" subtitle="MedTech" />
      </Box>

      <Typography variant="h6" sx={{ marginBottom: '1vh', marginTop: '2vh' }}>
        Доступные стартапы
      </Typography>
      <Divider sx={{ backgroundColor: '#CAC4D0' }} />

      <Box
        sx={{
          marginTop: '3vh',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2.4vh',
        }}
      >
        <VerticalCard
          title="NeuroSync AI"
          subtitle="IT"
          description="Неинвазивный AI-ассистент для мониторинга и коррекции нейронной активности в реальном времени"
        />
        <VerticalCard
          title="EcoPanel"
          subtitle="GreenTech"
          description="Инновационные солнечные панели с высокой КПД и лёгкой интеграцией"
        />
        <VerticalCard
          title="MediTrack"
          subtitle="MedTech"
          description="Платформа отслеживания и анализа медицинских показателей в домашних условиях"
        />
        <Event
          title="OrbitalConnect"
          subtitle="SpaceTech"
          description="Связь нового поколения для спутников на низкой орбите"
        />
      </Box>
    </Box>
  );
};

export default Field;