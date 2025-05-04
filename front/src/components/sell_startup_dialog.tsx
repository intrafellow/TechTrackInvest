import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';

interface SellStartupDialogProps {
  open: boolean;
  onClose: () => void;
  onSell: () => void;
  startupName: string;
  salePrice: number;
}

const SellStartupDialog: React.FC<SellStartupDialogProps> = ({
  open,
  onClose,
  onSell,
  startupName,
  salePrice
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      onClick={(e) => {
        console.log('Клик по SellStartupDialog');
        e.stopPropagation();
      }}
    >
      <DialogTitle>
        <Typography
          sx={{
            fontFamily: 'Lettersano Full, sans-serif',
            fontWeight: 700,
            fontSize: '2.08vh',
            color: '#413545'
          }}
        >
          Продажа стартапа
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ marginBottom: '2vh' }}>
          <Typography
            sx={{
              fontFamily: 'Raleway, sans-serif',
              fontSize: '1.82vh',
              color: '#413545',
              marginBottom: '1vh'
            }}
          >
            Вы собираетесь продать стартап "{startupName}"
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Raleway, sans-serif',
              fontSize: '1.82vh',
              color: '#413545'
            }}
          >
            Цена продажи: {salePrice} ₽
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            color: '#65558F',
            borderColor: '#65558F',
            fontFamily: 'Raleway, sans-serif',
            fontWeight: 300,
            '&:hover': {
              borderColor: '#65558F',
              backgroundColor: 'rgba(101, 85, 143, 0.04)'
            }
          }}
        >
          Отмена
        </Button>
        <Button
          onClick={onSell}
          variant="contained"
          sx={{
            backgroundColor: '#E8DEF8',
            color: '#4A4459',
            fontFamily: 'Raleway, sans-serif',
            fontWeight: 300,
            '&:hover': {
              backgroundColor: '#E8DEF8',
              opacity: 0.9
            }
          }}
        >
          Продать
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SellStartupDialog; 