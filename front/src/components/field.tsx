import React, { useState } from 'react';
import {
  Box,
  Divider,
  Typography,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';

const Field: React.FC = () => {
  const [selected, setSelected] = useState(''); // Изначально пустое значение
  const [isBlurred, setIsBlurred] = useState(false); // Состояние для блюра

  const handleChange = (event: any) => {
    setSelected(event.target.value);
  };

  const handleOpen = () => {
    setIsBlurred(true); // Включаем блюр, когда открывается список
  };

  const handleClose = () => {
    setIsBlurred(false); // Отключаем блюр, когда закрывается список
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: '#444A6B',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '2vh',
        fontFamily: 'Raleway, sans-serif',
        color: '#E3E6FF',
        filter: isBlurred ? 'blur(5px)' : 'none', // Применяем блюр к экрану
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
		    style={{
			width: '22.22vh',
            height: '5.19vh',}}
            value={selected}
            onChange={handleChange}
            onOpen={handleOpen} // Включаем блюр при открытии
            onClose={handleClose} // Отключаем блюр при закрытии
            displayEmpty
            renderValue={(value) => {
              if (!value) {
                return <Typography style={{display: "flex", justifyContent: "center"}} sx={{ color: '#413545' }}>Выберите отрасль</Typography>;
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

      <Typography variant="h6" sx={{ marginBottom: '1vh', marginTop: '6vh' }}>
        Купленные стартапы
      </Typography>
      <Divider sx={{ backgroundColor: '#CAC4D0', marginBottom: '2vh' }} />

      <Typography variant="h6" sx={{ marginBottom: '1vh', marginTop: '23vh' }}>
        Доступные стартапы
      </Typography>
      <Divider sx={{ backgroundColor: '#CAC4D0' }} />

      <Box
        sx={{
          marginTop: '3vh',
          display: 'flex',
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Здесь появятся кнопки и дивидеры с текстом */}
      </Box>
    </Box>
  );
};

export default Field;
