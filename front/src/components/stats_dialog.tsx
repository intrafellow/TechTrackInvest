import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Divider,
  Button,
  Box,
  Tooltip
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

interface SessionData {
  stepCount: number;
  monthId: number;
  stepsLeft: number;
  money: number;
  reputation: number;
  expertise: number;
}

interface StatsDialogProps {
  open: boolean;
  onClose: () => void;
  type: 'expertise' | 'money' | 'reputation';
  data: {
    expertise: { [key: string]: number };
    money: { cash: number; investment: number; total: number };
    reputation: number;
  };
  previousData: {
    expertise: { [key: string]: number };
    money: { cash: number; investment: number; total: number };
    reputation: number;
  };
  loading: boolean;
  sessionData: SessionData;
}

const StatsDialog: React.FC<StatsDialogProps> = ({ open, onClose, type, data, previousData, loading, sessionData }) => {
  const getTrendIcon = (current: number, previous: number | undefined) => {
    if (previous === undefined) return null;
    const diff = current - previous;
    if (diff > 0) return <TrendingUpIcon sx={{ color: '#4CAF50' }} />;
    if (diff < 0) return <TrendingDownIcon sx={{ color: '#F44336' }} />;
    return <TrendingFlatIcon sx={{ color: '#FFC107' }} />;
  };

  const getTooltipText = (current: number, previous: number | undefined) => {
    if (previous === undefined) return null;
    const diff = current - previous;
    if (previous === 0) return `Изменение: ${diff > 0 ? '+' : ''}${diff}`;
    const percentage = ((diff / previous) * 100).toFixed(1);
    return `Изменение: ${diff > 0 ? '+' : ''}${diff} (${percentage}%)`;
  };

  const getTitle = () => {
    switch (type) {
      case 'expertise': return 'Экспертность';
      case 'money': return 'Финансы';
      case 'reputation': return 'Репутация';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'expertise':
        return 'Экспертность — это показатель вашего глубокого понимания различных сфер рынка, позволяющий принимать обоснованные инвестиционные решения.';
      case 'money':
        return 'Финансы — это основа ваших инвестиционных возможностей. Они отражают вашу платежеспособность, уровень риска и свободу действий на рынке. Управление активами и пассивами напрямую влияет на вашу способность заключать сделки, поддерживать стартапы и переживать кризисы.';
      case 'reputation':
        return 'Репутация — это ключевой фактор в мире инвестиций, влияющий на вашу способность заключать сделки на более выгодных условиях. Чем выше ваша репутация, тем больше доверия вам оказывают партнеры, стартапы и другие игроки рынка. Это позволяет вам получать эксклюзивные предложения, лучшие финансовые условия и преимущества при ведении переговоров.';
    }
  };

  const getNicheName = (nicheId: string): string => {
    const nicheMap: { [key: string]: string } = {
      '1': 'IT',
      '2': 'GreenTech',
      '3': 'MedTech',
      '4': 'SpaceTech'
    };
    return nicheMap[nicheId] || nicheId;
  };

  const renderContent = () => {
    switch (type) {
      case 'expertise':
        if (!data.expertise || Object.keys(data.expertise).length === 0) {
          return <Typography sx={{ color: '#B00020', fontFamily: 'Raleway, sans-serif', fontWeight: 300 }}>Нет данных</Typography>;
        }
        return (
          <>
            {Object.entries(data.expertise).map(([nicheId, value]) => {
              const previousValue = previousData?.expertise?.[nicheId] || 0;
              const trendIcon = getTrendIcon(Number(value), Number(previousValue));
              const tooltipText = getTooltipText(Number(value), Number(previousValue));
              return (
                <Box key={nicheId} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography
                    sx={{
                      fontFamily: 'Raleway, sans-serif',
                      fontWeight: 300,
                      color: '#010101',
                      fontSize: { xs: '1.6vh', sm: '1.8vh', md: '2vh' },
                    }}
                  >
                    Рейтинг вашей экспертности в {nicheId}: {value}
                  </Typography>
                  {trendIcon && tooltipText && (
                    <Tooltip title={tooltipText}>
                      <span>{trendIcon}</span>
                    </Tooltip>
                  )}
                </Box>
              );
            })}
          </>
        );
      case 'money':
        if (!data.money || (data.money.cash === 0 && data.money.investment === 0 && data.money.total === 0)) {
          return <Typography sx={{ color: '#B00020', fontFamily: 'Raleway, sans-serif', fontWeight: 300 }}>Нет данных</Typography>;
        }
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography
                sx={{
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 300,
                  color: '#010101',
                  fontSize: { xs: '1.6vh', sm: '1.8vh', md: '2vh' },
                }}
              >
                Наличные средства: {data.money?.cash || 0} ₽
              </Typography>
              {getTrendIcon(data.money.cash, previousData?.money?.cash) && (
                <Tooltip title={getTooltipText(data.money.cash, previousData?.money?.cash)}>
                  <span>{getTrendIcon(data.money.cash, previousData?.money?.cash)}</span>
                </Tooltip>
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography
                sx={{
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 300,
                  color: '#010101',
                  fontSize: { xs: '1.6vh', sm: '1.8vh', md: '2vh' },
                }}
              >
                Инвестиции: {data.money?.investment || 0} ₽
              </Typography>
              {getTrendIcon(data.money.investment, previousData?.money?.investment) && (
                <Tooltip title={getTooltipText(data.money.investment, previousData?.money?.investment)}>
                  <span>{getTrendIcon(data.money.investment, previousData?.money?.investment)}</span>
                </Tooltip>
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography
                sx={{
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 300,
                  color: '#010101',
                  fontSize: { xs: '1.6vh', sm: '1.8vh', md: '2vh' },
                }}
              >
                Общий капитал: {data.money?.total || 0} ₽
              </Typography>
              {getTrendIcon(data.money.total, previousData?.money?.total) && (
                <Tooltip title={getTooltipText(data.money.total, previousData?.money?.total)}>
                  <span>{getTrendIcon(data.money.total, previousData?.money?.total)}</span>
                </Tooltip>
              )}
            </Box>
          </>
        );
      case 'reputation':
        if (!data.reputation || data.reputation === 0) {
          return <Typography sx={{ color: '#B00020', fontFamily: 'Raleway, sans-serif', fontWeight: 300 }}>Нет данных</Typography>;
        }
        const previousReputation = previousData?.reputation || 0;
        const trendIcon = getTrendIcon(Number(data.reputation), Number(previousReputation));
        const tooltipText = getTooltipText(Number(data.reputation), Number(previousReputation));
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                sx={{
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 300,
                  color: '#010101',
                  fontSize: { xs: '1.6vh', sm: '1.8vh', md: '2vh' },
                }}
              >
                Рейтинг вашей репутации: {data.reputation}
              </Typography>
              {trendIcon && tooltipText && (
                <Tooltip title={tooltipText}>
                  <span>{trendIcon}</span>
                </Tooltip>
              )}
            </Box>
          </>
        );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#BABDCF',
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
            color: '#1D1B20',
            fontSize: { xs: '2vh', sm: '2.5vh', md: '3vh' },
            textAlign: 'center'
          }}
        >
          {getTitle()}
        </Typography>
        <Divider sx={{ marginTop: '1vh', backgroundColor: '#CAC4D0' }} />
      </DialogTitle>
      <DialogContent>
        <Typography
          sx={{
            fontFamily: 'Raleway, sans-serif',
            fontWeight: 300,
            color: '#49454F',
            fontSize: { xs: '1.6vh', sm: '1.8vh', md: '2vh' },
            marginBottom: '2vh'
          }}
        >
          {getDescription()}
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Raleway, sans-serif',
            fontWeight: 300,
            color: '#49454F',
            fontSize: { xs: '1.6vh', sm: '1.8vh', md: '2vh' },
            marginBottom: '2vh'
          }}
        >
          Ваши текущие показатели:
        </Typography>
        {renderContent()}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2vh' }}>
          <Button
            onClick={onClose}
            sx={{
              backgroundColor: '#E8DEF8',
              color: '#4A4459',
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 300,
              fontSize: { xs: '1.6vh', sm: '1.8vh', md: '2vh' },
              textTransform: 'none',
              borderRadius: '50vh',
              padding: '0.8vh 2.4vh',
              '&:hover': {
                backgroundColor: '#E8DEF8',
                opacity: 0.9
              }
            }}
          >
            Хорошо
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default StatsDialog; 