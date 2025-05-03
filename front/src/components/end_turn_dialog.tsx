import React from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Box
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { gameAPI } from '../api/apiClient';

interface EndTurnDialogProps {
  open: boolean;
  onClose: () => void;
}

const EndTurnDialog: React.FC<EndTurnDialogProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNextMonth = async () => {
    try {
      await gameAPI.nextMonth();
      onClose();
      navigate('/first-month', { 
        state: { 
          monthChanged: true,
          justBought: location.state?.justBought
        } 
      });
    } catch (error) {
      console.log('API недоступен, используем демо-режим');
      onClose();
      navigate('/first-month', { 
        state: { 
          monthChanged: true, 
          isDemo: true, 
          currentMonth: 1,
          justBought: location.state?.justBought
        } 
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#EAEAF0',
          borderRadius: '8px',
          padding: '16px'
        }
      }}
    >
      <DialogContent>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Lettersano Full',
            color: '#1D1B20',
            textAlign: 'center',
            marginBottom: '16px'
          }}
        >
          Ходы закончились
        </Typography>
        
        <Typography
          sx={{
            fontFamily: 'Raleway',
            fontWeight: 300,
            color: '#2C2C2C',
            textAlign: 'center',
            marginBottom: '24px'
          }}
        >
          Завершите ход, чтобы перейти к следующему месяцу
        </Typography>

        <Button
          variant="contained"
          onClick={handleNextMonth}
          sx={{
            width: '100%',
            backgroundColor: '#444A6B',
            color: '#F6F7FF',
            fontFamily: 'Raleway',
            fontWeight: 500,
            fontSize: '16px',
            padding: '12px 24px',
            borderRadius: '8px',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#5A6180'
            }
          }}
        >
          Завершить ход
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EndTurnDialog; 