import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Divider,
  Button,
  Box
} from '@mui/material';

interface DealDialogProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
  startupName: string;
  investmentAmount: number;
  exitConditions: string;
}

const DealDialog: React.FC<DealDialogProps> = ({
  open,
  onClose,
  onAccept,
  startupName,
  investmentAmount,
  exitConditions
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#F7FCF9',
          borderRadius: '12px',
          padding: '24px'
        }
      }}
    >
      <DialogTitle>
        <Typography
          sx={{
            fontFamily: 'Lettersano Full, sans-serif',
            color: '#1D1B20',
            fontSize: '24px',
            textAlign: 'center'
          }}
        >
          Заключение сделки
        </Typography>
        <Divider sx={{ marginTop: '16px', backgroundColor: '#CAC4D0' }} />
      </DialogTitle>
      <DialogContent>
        <Typography
          sx={{
            fontFamily: 'Raleway, sans-serif',
            color: '#49454F',
            fontSize: '16px',
            marginBottom: '24px'
          }}
        >
          Вы встретились с фаундерами {startupName}, чтобы обсудить условия вашего потенциального инвестирования в развитие их продукта.
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Raleway, sans-serif',
            color: '#49454F',
            fontSize: '16px',
            marginBottom: '24px'
          }}
        >
          После продолжительных переговоров, анализа рисков и обсуждения перспектив роста вы смогли прийти к взаимовыгодному соглашению. Команда уверенно презентовала свой план масштабирования, а вы, как опытный инвестор, внесли ценные предложения по улучшению стратегии.
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Raleway, sans-serif',
            color: '#49454F',
            fontSize: '16px',
            marginBottom: '24px'
          }}
        >
          Итоговые условия сделки:
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Raleway, sans-serif',
            color: '#49454F',
            fontSize: '16px',
            marginBottom: '24px'
          }}
        >
          Размер инвестиции: {investmentAmount} ₽
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Raleway, sans-serif',
            color: '#49454F',
            fontSize: '16px',
            marginBottom: '24px'
          }}
        >
          Условия выхода: {exitConditions}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
          <Button
            variant="outlined"
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
            Отказаться
          </Button>
          <Button
            variant="contained"
            onClick={onAccept}
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
            Заключить
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DealDialog; 