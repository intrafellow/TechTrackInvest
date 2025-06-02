import React from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Divider
} from '@mui/material';
import { sendYMGoal } from '../utils/metrics';
import { useNavigate } from 'react-router-dom';

interface WinDialogProps {
  open: boolean;
  onClose: () => void;
  gameResultMessage: string | null;
  totalEarnings: number | null;
}

const WinDialog: React.FC<WinDialogProps> = ({
  open,
  onClose,
  gameResultMessage,
  totalEarnings
}) => {
  const navigate = useNavigate();

  const handleClose = () => {
    sendYMGoal('reachGoal','gameWin');
    onClose();
    navigate('/profile');
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
            color: '#4CAF50', // Зеленый цвет для победы
            textAlign: 'center',
            marginBottom: '16px'
          }}
        >
          Победа!
        </Typography>

        <Divider sx={{ marginBottom: '24px', backgroundColor: '#CAC4D0' }} />

        {gameResultMessage && (
          <Typography
            sx={{
              fontFamily: 'Raleway',
              fontWeight: 400,
              color: '#2C2C2C',
              marginBottom: '16px',
              textAlign: 'center'
            }}
          >
            {gameResultMessage}
          </Typography>
        )}

        {totalEarnings !== null && (
          <Typography
            sx={{
              fontFamily: 'Raleway',
              fontWeight: 500,
              color: '#2C2C2C',
              marginBottom: '24px',
              textAlign: 'center'
            }}
          >
            Общая прибыль: {totalEarnings}
          </Typography>
        )}

        <Button
          variant="contained"
          onClick={handleClose}
          sx={{
            width: '100%',
            backgroundColor: '#4CAF50', // Зеленый цвет для кнопки
            color: '#F6F7FF',
            fontFamily: 'Raleway',
            fontWeight: 500,
            fontSize: '16px',
            padding: '12px 24px',
            borderRadius: '8px',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#66BB6A'
            }
          }}
        >
          Продолжить
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default WinDialog; 