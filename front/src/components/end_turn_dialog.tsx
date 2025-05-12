import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Divider,
  LinearProgress,
  Button,
  Box
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { sessionAPI, monthAPI } from '../api/apiClient';

interface EndTurnDialogProps {
  open: boolean;
  onClose: () => void;
  currentMonth: number;
}

const EndTurnDialog: React.FC<EndTurnDialogProps> = ({ open, onClose, currentMonth }) => {
  const [progress1, setProgress1] = useState(0);
  const [progress2, setProgress2] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (open) {
      // Сброс прогресса при открытии
      setProgress1(0);
      setProgress2(0);
      
      // Анимация первого прогресс-бара
      const timer1 = setInterval(() => {
        setProgress1((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(timer1);
            return 100;
          }
          return Math.min(oldProgress + 2, 100);
        });
      }, 50);

      // Анимация второго прогресс-бара
      const timer2 = setInterval(() => {
        setProgress2((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(timer2);
            return 100;
          }
          return Math.min(oldProgress + 1, 100);
        });
      }, 50);

      return () => {
        clearInterval(timer1);
        clearInterval(timer2);
      };
    }
  }, [open]);

  const handleEndTurn = async () => {
    try {
      const response = await sessionAPI.endTurn();
      if (response.success) {
        setCurrentMonth(response.monthCount);
        setStepCount(response.stepCount);
        onClose();
        navigate(location.pathname, { state: { monthChanged: true } });
      }
    } catch (error) {
      console.error('Ошибка при завершении хода:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#EAEAF0',
          borderRadius: '8px',
          padding: '20px'
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
          Идет сверка документов за прошедший месяц
        </Typography>
        
        <Divider sx={{ marginBottom: '24px', backgroundColor: '#CAC4D0' }} />
        
        <Box sx={{ marginBottom: '32px' }}>
          <Typography
            sx={{
              fontFamily: 'Raleway',
              fontWeight: 300,
              color: '#2C2C2C',
              marginBottom: '8px'
            }}
          >
            Происходит анализ ваших решений
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress1}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#CAC4D0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#444A6B'
              }
            }}
          />
        </Box>

        <Box sx={{ marginBottom: '32px' }}>
          <Typography
            sx={{
              fontFamily: 'Raleway',
              fontWeight: 300,
              color: '#2C2C2C',
              marginBottom: '8px'
            }}
          >
            Происходит расчет вашей прибыли
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress2}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#CAC4D0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#444A6B'
              }
            }}
          />
        </Box>

        <Button
          variant="contained"
          onClick={handleEndTurn}
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
          Перейти в следующий месяц
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EndTurnDialog; 