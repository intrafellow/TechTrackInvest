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

interface StartupExpertise {
  name: string;
  description: string;
  price: number;
  uniqueProductOffer: string;
  lastMonthRevenue: number;
  expenses: number;
  team: number;
  budget: number;
  product: number;
  reputation: number;
  level: number;
  stage: string;
}

interface ExpertiseDialogProps {
  open: boolean;
  onClose: () => void;
  onOrder: () => void;
  ordered: boolean;
  loading: boolean;
  error?: string | null;
  expertiseData?: StartupExpertise | null;
  startupPrice: number;
}

const ExpertiseDialog: React.FC<ExpertiseDialogProps> = ({
  open,
  onClose,
  onOrder,
  ordered,
  loading,
  error,
  expertiseData,
  startupPrice
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
          {ordered ? 'Экспертиза проведена' : 'Заказать экспертизу'}
        </Typography>
        <Divider sx={{ marginTop: '16px', backgroundColor: '#CAC4D0' }} />
      </DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
        )}
        {!ordered ? (
          <>
            <Typography
              sx={{
                fontFamily: 'Raleway, sans-serif',
                color: '#49454F',
                fontSize: '16px',
                marginBottom: '24px'
              }}
            >
              Если вы инвестор, заказ экспертизы на стартап — это важный шаг, чтобы объективно оценить его потенциал и риски. Экспертный анализ даст вам полную картину о финансовых показателях, бизнес-модели и команде стартапа, что позволит избежать необоснованных вложений. Для тех, кто хочет сделать более обоснованные инвестиции, это возможность глубже понять рынок и принять более уверенное решение.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="contained"
                onClick={onOrder}
                disabled={loading}
                sx={{
                  backgroundColor: '#E8DEF8',
                  color: '#4A4459',
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 300,
                  borderRadius: '50vh',
                  px: 4,
                  py: 1.5,
                  fontSize: '16px',
                  '&:hover': {
                    backgroundColor: '#D0BCFF',
                  }
                }}
              >
                {loading ? 'Заказ...' : `Заказать за ${startupPrice.toLocaleString()}₽`}
              </Button>
            </Box>
          </>
        ) : (
          expertiseData && (
            <Box>
              <Typography sx={{ fontFamily: 'Raleway, sans-serif', fontWeight: 700, fontSize: '20px', mb: 2 }}>
                {expertiseData.name}
              </Typography>
              <Typography sx={{ fontFamily: 'Raleway, sans-serif', fontSize: '16px', mb: 2 }}>
                {expertiseData.description}
              </Typography>
              <ul style={{ fontFamily: 'Raleway, sans-serif', fontSize: '16px', marginBottom: 16 }}>
                <li>Уникальное торговое предложение: {expertiseData.uniqueProductOffer}</li>
                <li>Выручка за прошлый месяц: {expertiseData.lastMonthRevenue} ₽</li>
                <li>Расходы: {expertiseData.expenses} ₽</li>
                <li>Команда: {expertiseData.team} человек</li>
                <li>Бюджет: {expertiseData.budget} ₽</li>
                <li>Продукт: {expertiseData.product}</li>
                <li>Репутация: {expertiseData.reputation}</li>
                <li>Уровень: {expertiseData.level}</li>
                <li>Стадия: {expertiseData.stage}</li>
                <li><b>Стоимость экспертизы: {expertiseData.price.toLocaleString()}₽</b></li>
              </ul>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={onClose}
                  sx={{
                    backgroundColor: '#E8DEF8',
                    color: '#4A4459',
                    fontFamily: 'Raleway, sans-serif',
                    fontWeight: 300,
                    borderRadius: '50vh',
                    px: 4,
                    py: 1.5,
                    fontSize: '16px',
                    '&:hover': {
                      backgroundColor: '#D0BCFF',
                    }
                  }}
                >
                  Принять решение
                </Button>
              </Box>
            </Box>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExpertiseDialog; 