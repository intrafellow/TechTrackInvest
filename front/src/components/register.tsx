// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
  FormControl,
  FormLabel
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#585C87',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        fontFamily: '"Lettersano Full", sans-serif',
        color: '#F6F7FF',
        padding: 0
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: '4vh', sm: '5vh', md: '6vh' },
          fontWeight: 600,
          marginBottom: 4,
          textAlign: 'center',
          color: '#F6F7FF'
        }}
      >
        Регистрация
      </Typography>

      <Box
        sx={{
          width: '90%',
          maxWidth: 500,
          minWidth: 300,
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}
      >
        <FormControl variant="outlined" fullWidth>
          <FormLabel
            sx={{
              color: '#F6F7FF',
              fontFamily: 'Raleway',
              fontWeight: 'bold',
              fontSize: '1.6vh',
              marginBottom: '4px',
              '&.Mui-focused': {
                color: '#F6F7FF'
              }
            }}
          >
            Email
          </FormLabel>
          <OutlinedInput
            type="email"
            sx={{
              color: '#000000',
              fontFamily: 'Raleway',
              fontWeight: 'normal',
              fontSize: '2vh',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#000000' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#000000' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#000000' },
              '&.Mui-focused': { color: '#000000' },
              '@media (min-width:900px) and (max-width:1025px)': {
                fontSize: '1.7vh',
                height: '5.8vh'
              }
            }}
          />
        </FormControl>

        <FormControl variant="outlined" fullWidth>
          <FormLabel
            sx={{
              color: '#F6F7FF',
              fontFamily: 'Raleway',
              fontWeight: 'bold',
              fontSize: '1.6vh',
              marginBottom: '4px',
              '&.Mui-focused': {
                color: '#F6F7FF'
              }
            }}
          >
            Логин
          </FormLabel>
          <OutlinedInput
            type="text"
            sx={{
              color: '#000000',
              fontFamily: 'Raleway',
              fontWeight: 'normal',
              fontSize: '2vh',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#000000' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#000000' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#000000' },
              '&.Mui-focused': { color: '#000000' },
              '@media (min-width:900px) and (max-width:1025px)': {
                fontSize: '1.7vh',
                height: '5.8vh'
              }
            }}
          />
        </FormControl>

        <FormControl variant="outlined" fullWidth>
          <FormLabel
            sx={{
              color: '#F6F7FF',
              fontFamily: 'Raleway',
              fontWeight: 'bold',
              fontSize: '1.6vh',
              marginBottom: '4px',
              '&.Mui-focused': {
                color: '#F6F7FF'
              }
            }}
          >
            Пароль
          </FormLabel>
          <OutlinedInput
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            sx={{
              color: '#000000',
              fontFamily: 'Raleway',
              fontWeight: 'normal',
              fontSize: '2vh',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#000000' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#000000' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#000000' },
              '&.Mui-focused': { color: '#000000' },
              '@media (min-width:900px) and (max-width:1025px)': {
                fontSize: '1.7vh',
                height: '5.8vh'
              }
            }}
          />
        </FormControl>

        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: '#737EB5',
            color: '#F6F7FF',
            fontFamily: 'Raleway',
            fontWeight: 600,
            fontSize: { xs: '1.6vh', sm: '1.8vh', md: '2vh' },
            height: '6.5vh',
            '&:hover': { backgroundColor: '#5f6999' }
          }}
        >
          Создать аккаунт
        </Button>
      </Box>
    </Box>
  );
};

export default RegisterPage;
