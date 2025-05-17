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
import { monthAPI } from '../api/apiClient';
import WinDialog from './WinDialog';
import LoseDialog from './LoseDialog';

interface EndTurnDialogProps {
  open: boolean;
  onClose: () => void;
  currentMonth: number;
}

const EndTurnDialog: React.FC<EndTurnDialogProps> = ({
  open,
  onClose,
  currentMonth
}) => {
  const [progress1, setProgress1] = useState(0);
  const [progress2, setProgress2] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const [isWinDialogOpen, setIsWinDialogOpen] = useState(false);
  const [isLoseDialogOpen, setIsLoseDialogOpen] = useState(false);
  const [gameResultMessage, setGameResultMessage] = useState<string | null>(null);
  const [totalEarnings, setTotalEarnings] = useState<number | null>(null);

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
      // Вызов API для перехода к следующему месяцу и сброса очков действий
      const response = await monthAPI.endMonth();

      if (response.isVictory) {
        onClose(); // Закрываем EndTurnDialog перед показом WinDialog
        setGameResultMessage(response.gameResultMessage);
        setTotalEarnings(response.totalEarnings);
        setIsWinDialogOpen(true);
      } else if (response.isGameOver) {
        onClose(); // Закрываем EndTurnDialog перед показом LoseDialog
        setGameResultMessage(response.gameResultMessage);
        setIsLoseDialogOpen(true);
      } else {
        // Обновляем очки действий и месяц в хедере
        if (response && typeof response.stepCount === 'number') {
          window.dispatchEvent(new CustomEvent('stepCountUpdate', { detail: { stepsLeft: response.stepCount } }));
        }
        if (response && typeof response.monthId === 'number') {
          window.dispatchEvent(new CustomEvent('monthIdUpdate', { detail: { monthId: response.monthId } }));
        }
        // После успешного перехода, закрываем диалог и обновляем страницу
        onClose();
        navigate('/game_field', {
          state: {
            monthChanged: true,
            justBought: location.state?.justBought, // Сохраняем информацию о купленном стартапе
            monthData: response // Передаем данные о новом месяце
          }
        });
      }
    } catch (error) {
      console.log('API недоступен, используем демо-режим');
      // В демо-режиме используем фиксированные значения
      window.dispatchEvent(new CustomEvent('stepCountUpdate', { detail: { stepsLeft: 5 } }));
      window.dispatchEvent(new CustomEvent('monthIdUpdate', { detail: { monthId: currentMonth + 1 } }));
      onClose();
      navigate('/first-month', {
        state: {
          monthChanged: true,
          isDemo: true,
          justBought: location.state?.justBought // Сохраняем информацию о купленном стартапе
        }
      });
    }
  };

  const handleCloseWinDialog = () => {
    setIsWinDialogOpen(false);
    onClose(); // Закрываем EndTurnDialog
    // Возможно, тут нужен редирект на страницу результатов или главную
    // navigate('/results'); // Пример
  };

  const handleCloseLoseDialog = () => {
    setIsLoseDialogOpen(false);
    onClose(); // Закрываем EndTurnDialog
    // Возможно, тут нужен редирект на страницу результатов или главную
    // navigate('/results'); // Пример
  };

  return (
    <>
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

      <WinDialog
        open={isWinDialogOpen}
        onClose={handleCloseWinDialog}
        gameResultMessage={gameResultMessage}
        totalEarnings={totalEarnings}
      />

      <LoseDialog
        open={isLoseDialogOpen}
        onClose={handleCloseLoseDialog}
        gameResultMessage={gameResultMessage}
      />
    </>
  );
};

export default EndTurnDialog; 