// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  Link,
  OutlinedInput,
  FormControl,
  FormLabel
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const LoginPage: React.FC = () => {
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
        padding: 0,
        '@media (max-width: 768px)': {
          minHeight: '100vh'
        },
        '@media (max-width: 480px)': {
          minHeight: '100vh'
        }
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: '4vh', sm: '5vh', md: '6vh' },
          fontWeight: 600,
          marginBottom: 4,
          textAlign: 'center',
          color: '#F6F7FF',
          '@media (max-width: 344px) and (max-height: 882px)': {
            fontSize: '3vh', // Уменьшаем размер шрифта на этом разрешении
          },
        }}
      >
        Добро пожаловать
      </Typography>

      <Box
        sx={{
          width: '90%',
          maxWidth: 500,
          minWidth: 300,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          '@media (min-width:900px) and (max-width:915px) and (min-height:1360px)': {
            width: '85%'
          },
          '@media (min-width:1023px) and (max-width:1025px) and (min-height:1360px)': {
            width: '80%'
          }
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
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#000000'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#000000'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#000000'
              },
              '&.Mui-focused': {
                color: '#000000'
              },
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
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#000000'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#000000'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#000000'
              },
              '&.Mui-focused': {
                color: '#000000'
              },
              '@media (min-width:900px) and (max-width:1025px)': {
                fontSize: '1.7vh',
                height: '5.8vh'
              }
            }}
          />
        </FormControl>

        <Box sx={{ textAlign: 'right', mt: -2, mb: 1 }}>
          <Link
            href="#"
            underline="none"
            sx={{
              fontFamily: 'Raleway',
              fontWeight: 300,
              fontSize: '1.8vh',
              color: '#F6F7FF',
              cursor: 'pointer'
            }}
          >
            Забыли пароль?
          </Link>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
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
              '@media (min-width:900px) and (max-width:1025px)': {
                fontSize: '1.4vh',
                height: '5.5vh'
              },
              '&:hover': { backgroundColor: '#5f6999' }
            }}
          >
            Войти
          </Button>

          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#585C87',
              color: '#F6F7FF',
              fontFamily: 'Raleway',
              fontWeight: 600,
              fontSize: { xs: '1.6vh', sm: '1.8vh', md: '2vh' },
              height: '6.5vh',
              boxShadow: 'none',
              '@media (min-width:900px) and (max-width:1025px)': {
                fontSize: '1.4vh',
                height: '5.5vh'
              },
              '&:hover': { backgroundColor: '#4a4d75' }
            }}
          >
            Создать аккаунт
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
