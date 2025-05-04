import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Tooltip
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

interface StartupStatisticsDialogProps {
  open: boolean;
  onClose: () => void;
  onSell: () => void;
  startupName: string;
  statistics: {
    salePrice: number;
    lastMonthRevenue: number;
    expenses: number;
    team: number;
    budget: number;
    progress: number;
    reputation: number;
    stage: string;
  };
  previousStatistics?: {
    lastMonthRevenue: number;
    expenses: number;
    team: number;
    budget: number;
    progress: number;
    reputation: number;
  };
}


const demoMonthId = 1; // для февраля

const StatisticItem: React.FC<{
  label: string;
  value: number;
  previousValue?: number;
  format?: (value: number) => string;
}> = ({ label, value, previousValue, format = (v) => v.toString() }) => {
  const getTrendIcon = () => {
    if (previousValue === undefined) return null;
    const diff = value - previousValue;
    if (diff > 0) return <TrendingUpIcon sx={{ color: '#4CAF50' }} />;
    if (diff < 0) return <TrendingDownIcon sx={{ color: '#F44336' }} />;
    return <TrendingFlatIcon sx={{ color: '#FFC107' }} />;
  };

  const getTooltipText = () => {
    if (previousValue === undefined) return null;
    const diff = value - previousValue;
    if (previousValue === 0) return `Изменение: ${diff > 0 ? '+' : ''}${diff}`;
    const percentage = ((diff / previousValue) * 100).toFixed(1);
    return `Изменение: ${diff > 0 ? '+' : ''}${diff} (${percentage}%)`;
  };

  const trendIcon = getTrendIcon();
  const tooltipText = getTooltipText();

  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        sx={{
          fontFamily: 'Raleway, sans-serif',
          fontSize: '1.5vh',
          color: '#413545',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        {label}
        {trendIcon && tooltipText && (
          <Tooltip title={tooltipText}>
            <span>{trendIcon}</span>
          </Tooltip>
        )}
      </Typography>
      <Typography
        sx={{
          fontFamily: 'Lettersano Full, sans-serif',
          fontWeight: 700,
          fontSize: '1.8vh',
          color: '#413545'
        }}
      >
        {format(value)}
      </Typography>
    </Box>
  );
};

const StartupStatisticsDialog: React.FC<StartupStatisticsDialogProps> = ({
  open,
  onClose,
  onSell,
  startupName,
  statistics,
  previousStatistics
}) => {
  console.log('StartupStatisticsDialog рендерится:', {
    open,
    startupName,
    statistics,
    previousStatistics
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value}%`;
  };

  const formatTeam = (value: number) => {
    return `${value} чел.`;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      onClick={(e) => {
        console.log('Клик по StartupStatisticsDialog');
        e.stopPropagation();
      }}
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: '#F7FCF9',
          borderRadius: '12px',
          margin: { xs: '1vh', sm: '2vh', md: '3vh' },
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: { xs: '90%', sm: '80%', md: '70%' }
        }
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
          Статистика стартапа "{startupName}"
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ marginBottom: '2vh' }}>
          <Grid container spacing={3}>
            <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <StatisticItem
                label="Цена продажи"
                value={statistics.salePrice}
                format={formatCurrency}
              />
              <StatisticItem
                label="Доход за последний месяц"
                value={statistics.lastMonthRevenue}
                previousValue={previousStatistics?.lastMonthRevenue}
                format={formatCurrency}
              />
              <StatisticItem
                label="Расходы"
                value={statistics.expenses}
                previousValue={previousStatistics?.expenses}
                format={formatCurrency}
              />
            </Grid>
            <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <StatisticItem
                label="Команда"
                value={statistics.team}
                previousValue={previousStatistics?.team}
                format={formatTeam}
              />
              <StatisticItem
                label="Бюджет"
                value={statistics.budget}
                previousValue={previousStatistics?.budget}
                format={formatCurrency}
              />
              <StatisticItem
                label="Прогресс"
                value={statistics.progress}
                previousValue={previousStatistics?.progress}
                format={formatPercentage}
              />
              <StatisticItem
                label="Репутация"
                value={statistics.reputation}
                previousValue={previousStatistics?.reputation}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Typography
              sx={{
                fontFamily: 'Raleway, sans-serif',
                fontSize: '1.5vh',
                color: '#413545'
              }}
            >
              Стадия развития: {statistics.stage}
            </Typography>
          </Box>
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
          Закрыть
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

export default StartupStatisticsDialog;
