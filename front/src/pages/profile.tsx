import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Link
} from '@mui/material';
import boyAvatar from '../icons/boy.png';
import logo from '../icons/logo.png';
import { sessionAPI } from '../api/apiClient';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  // Временные данные пользователя
  const userData = {
    email: 'ya@ya.ru',
    username: 'testuser'
  };

  const handleStartGame = async () => {
    try {
      await sessionAPI.start();
      navigate('/first-month');
    } catch (error) {
      console.error('Ошибка при создании сессии:', error);
    }
  };

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
        fontFamily: 'Raleway, sans-serif',
        color: '#F6F7FF',
        padding: 0
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          position: 'absolute',
          top: 0,
          right: 0,
          padding: { xs: '1.5vh', sm: '2vh' }
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={{
            width: { xs: '9vh', sm: '10vh', md: '10vh' },
            height: { xs: '7.5vh', sm: '8.5vh', md: '9vh' },
            objectFit: 'contain',
            transition: 'all 0.3s ease-in-out',
            '@media (min-width:768px) and (max-width:1024px)': {
              width: '8.5vh',
              height: '7.5vh',
              position: 'absolute',
              right: '2vh',
              top: '2vh'
            }
          }}
        />
      </Box>

      <Box
        sx={{
          width: '90%',
          maxWidth: 500,
          minWidth: 300,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3
        }}
      >
        <Avatar
          src={boyAvatar}
          alt="User Avatar"
          sx={{
            width: { xs: '20vh', sm: '25vh', md: '30vh' },
            height: { xs: '20vh', sm: '25vh', md: '30vh' },
            border: '4px solid #737EB5',
            marginBottom: 2
          }}
        />

        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Typography
            sx={{
              fontSize: { xs: '2.4vh', sm: '2.6vh', md: '2.8vh' },
              color: '#F6F7FF',
              fontWeight: 'bold',
              marginBottom: 1
            }}
          >
            {userData.email}
          </Typography>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/change_email')}
            sx={{
              color: '#C1CBFF',
              textDecoration: 'none',
              fontSize: { xs: '1.8vh', sm: '2vh', md: '2.2vh' },
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Сменить email
          </Link>
        </Box>

        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Typography
            sx={{
              fontSize: { xs: '2.4vh', sm: '2.6vh', md: '2.8vh' },
              color: '#F6F7FF',
              fontWeight: 'bold',
              marginBottom: 1
            }}
          >
            {userData.username}
          </Typography>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/change_username')}
            sx={{
              color: '#C1CBFF',
              textDecoration: 'none',
              fontSize: { xs: '1.8vh', sm: '2vh', md: '2.2vh' },
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Сменить логин
          </Link>
        </Box>

        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleStartGame}
            sx={{
              backgroundColor: '#737EB5',
              color: '#F6F7FF',
              fontFamily: 'Raleway',
              fontWeight: 600,
              fontSize: { xs: '1.6vh', sm: '1.8vh', md: '2vh' },
              height: '6.5vh',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#5f6999' }
            }}
          >
            Начать играть
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('/change_password')}
            sx={{
              backgroundColor: '#585C87',
              color: '#F6F7FF',
              fontFamily: 'Raleway',
              fontWeight: 600,
              fontSize: { xs: '1.6vh', sm: '1.8vh', md: '2vh' },
              height: '6.5vh',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#4a4d75' }
            }}
          >
            Сменить пароль
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage; 