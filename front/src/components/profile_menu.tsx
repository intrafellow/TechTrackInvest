import React, { useState } from 'react';
import { Box, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { sessionAPI } from '../api/apiClient';

interface ProfileMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ anchorEl, onClose }) => {
  const navigate = useNavigate();
  const [exitDialogOpen, setExitDialogOpen] = useState(false);

  const handleProfileClick = () => {
    onClose();
    navigate('/profile');
  };

  const handleExitClick = () => {
    onClose();
    setExitDialogOpen(true);
  };

  const handleExitWithoutSave = async () => {
    try {
      await sessionAPI.finish();
      navigate('/profile');
    } catch (error) {
      console.error('Ошибка при завершении сессии:', error);
    }
    setExitDialogOpen(false);
  };

  const handleExitWithSave = async () => {
    try {
      navigate('/profile');
    } catch (error) {
      console.error('Ошибка при сохранении сессии:', error);
    }
    setExitDialogOpen(false);
  };

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        PaperProps={{
          sx: {
            backgroundColor: '#59618C',
            color: '#F6F7FF',
            '& .MuiMenuItem-root': {
              fontFamily: 'Raleway, sans-serif',
              fontSize: '1.6vh',
              '&:hover': {
                backgroundColor: '#737EB5',
              },
            },
          },
        }}
      >
        <MenuItem onClick={handleProfileClick}>Перейти в ЛК</MenuItem>
        <MenuItem onClick={handleExitClick}>Завершить игру</MenuItem>
      </Menu>

      <Dialog
        open={exitDialogOpen}
        onClose={() => setExitDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#59618C',
            color: '#F6F7FF',
            fontFamily: 'Raleway, sans-serif',
          },
        }}
      >
        <DialogTitle sx={{ fontSize: '2vh' }}>Завершение игры</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: '1.6vh', mb: 2 }}>
            Вы действительно хотите завершить игру? Выберите способ сохранения:
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: '1vh 2vh 2vh' }}>
          <Button
            onClick={handleExitWithSave}
            variant="contained"
            sx={{
              backgroundColor: '#737EB5',
              color: '#F6F7FF',
              '&:hover': { backgroundColor: '#5f6999' },
              fontSize: '1.4vh',
              textTransform: 'none',
            }}
          >
            Сохранить и выйти
          </Button>
          <Button
            onClick={handleExitWithoutSave}
            variant="contained"
            sx={{
              backgroundColor: '#585C87',
              color: '#F6F7FF',
              '&:hover': { backgroundColor: '#4a4d75' },
              fontSize: '1.4vh',
              textTransform: 'none',
            }}
          >
            Выйти без сохранения
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfileMenu; 