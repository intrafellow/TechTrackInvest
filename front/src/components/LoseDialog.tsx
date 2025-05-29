import React from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Divider
} from '@mui/material';
import { sendYMGoal } from '../utils/metrics';

interface LoseDialogProps {
  open: boolean;
  onClose: () => void;
  gameResultMessage: string | null;
}

const LoseDialog: React.FC<LoseDialogProps> = ({
  open,
  onClose,
  gameResultMessage
}) => {
  const handleClose = () => {
    sendYMGoal('reachGoal','gameLose');
    onClose();
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
            color: '#F44336', // Красный цвет для поражения
            textAlign: 'center',
            marginBottom: '16px'
          }}
        >
          Поражение
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

        <Button
          variant="contained"
          onClick={handleClose}
          sx={{
            width: '100%',
            backgroundColor: '#F44336', // Красный цвет для кнопки
            color: '#F6F7FF',
            fontFamily: 'Raleway',
            fontWeight: 500,
            fontSize: '16px',
            padding: '12px 24px',
            borderRadius: '8px',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#E57373'
            }
          }}
        >
          ОК
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default LoseDialog; 