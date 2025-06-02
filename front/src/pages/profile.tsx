import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Link,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import boyAvatar from '../icons/boy.png';
import logo from '../icons/logo.png';
import { sessionAPI, userAPI } from '../api/apiClient';
import { sendYMGoal } from '../utils/metrics';

declare global {
  interface Window {
    ym?: (...args: any[]) => void;
  }
}

export {};

interface UserProfile {
  email: string;
  login: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startGameDialogOpen, setStartGameDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await userAPI.getProfile();
        setUserData(profile);
      } catch (err) {
        setError('Ошибка при загрузке профиля');
        console.error('Ошибка при загрузке профиля:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleStartGame = async () => {
    setStartGameDialogOpen(true);
  };

  const handleStartNewGame = async () => {
    try {
      sendYMGoal('StartGameClick');
      await sessionAPI.start();
      navigate('/game_field');
    } catch (error) {
      console.error('Ошибка при создании сессии:', error);
    }
    setStartGameDialogOpen(false);
  };

  const handleContinueGame = async () => {
    try {
      sendYMGoal('loadGame');
      await sessionAPI.load();
      navigate('/game_field');
    } catch (error) {
      console.error('Ошибка при загрузке сессии:', error);
    }
    setStartGameDialogOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ 
        width: '100vw', 
        minHeight: '100vh', 
        backgroundColor: '#585C87', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <CircularProgress sx={{ color: '#F6F7FF' }} />
      </Box>
    );
  }

  if (error || !userData) {
    return (
      <Box sx={{ 
        width: '100vw', 
        minHeight: '100vh', 
        backgroundColor: '#585C87', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        color: '#F6F7FF'
      }}>
        <Typography>{error || 'Не удалось загрузить профиль'}</Typography>
      </Box>
    );
  }

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
            {userData.login}
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

      <Dialog
        open={startGameDialogOpen}
        onClose={() => setStartGameDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#59618C',
            color: '#F6F7FF',
            fontFamily: 'Raleway, sans-serif',
          },
        }}
      >
        <DialogTitle sx={{ fontSize: '2vh' }}>Начать игру</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: '1.6vh', mb: 2 }}>
            Выберите способ начала игры:
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: '1vh 2vh 2vh' }}>
          <Button
            onClick={handleStartNewGame}
            variant="contained"
            sx={{
              backgroundColor: '#737EB5',
              color: '#F6F7FF',
              '&:hover': { backgroundColor: '#5f6999' },
              fontSize: '1.4vh',
              textTransform: 'none',
            }}
          >
            Начать без сохранения
          </Button>
          <Button
            onClick={handleContinueGame}
            variant="contained"
            sx={{
              backgroundColor: '#585C87',
              color: '#F6F7FF',
              '&:hover': { backgroundColor: '#4a4d75' },
              fontSize: '1.4vh',
              textTransform: 'none',
            }}
          >
            Продолжить игру
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage; 