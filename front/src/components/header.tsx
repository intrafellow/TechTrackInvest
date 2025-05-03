import React, { useState, useEffect } from 'react';
import { Box, Typography, Tooltip, Button } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import boy from '../icons/boy.png'; 
import file from '../icons/file.png';
import wallet from '../icons/wallet.png';
import chat from '../icons/chat.png';
import logo from '../icons/logo.png';
import tea from '../icons/tea.png';
import calender from '../icons/calender.png';
import { sessionAPI, userAPI } from '../api/apiClient';
import StatsDialog from './stats_dialog';

const navItems = [
  { label: 'Экспертиза', icon: file, type: 'expertise' },
  { label: 'Финансы', icon: wallet, type: 'money' },
  { label: 'Репутация', icon: chat, type: 'reputation' },
];

const MONTHS: { [key: number]: string } = {
  0: 'Январь',
  1: 'Февраль',
  2: 'Март',
  3: 'Апрель',
  4: 'Май',
  5: 'Июнь',
  6: 'Июль',
  7: 'Август',
  8: 'Сентябрь',
  9: 'Октябрь',
  10: 'Ноябрь',
  11: 'Декабрь'
};

interface SessionData {
  stepCount: number;
  monthId: number;
  stepsLeft: number;
  money: number;
  reputation: number;
  expertise: number;
}

interface HeaderProps {
  currentMonth?: number;
}

const Header: React.FC<HeaderProps> = ({ currentMonth = 0 }) => {
  const [sessionData, setSessionData] = useState<SessionData>({
    stepCount: 0,
    monthId: 0,
    stepsLeft: 0,
    money: 0,
    reputation: 0,
    expertise: 0
  });
  const [previousSessionData, setPreviousSessionData] = useState<SessionData>({
    stepCount: 0,
    monthId: 0,
    stepsLeft: 0,
    money: 0,
    reputation: 0,
    expertise: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState<{ [key: string]: boolean }>({
    expertise: false,
    money: false,
    reputation: false
  });
  const [statsData, setStatsData] = useState<{
    expertise: { [key: string]: number };
    money: { cash: number; investment: number; total: number };
    reputation: number;
  }>({
    expertise: {},
    money: { cash: 0, investment: 0, total: 0 },
    reputation: 0
  });
  const [previousStatsData, setPreviousStatsData] = useState<{
    expertise: { [key: string]: number };
    money: { cash: number; investment: number; total: number };
    reputation: number;
  }>({
    expertise: {},
    money: { cash: 0, investment: 0, total: 0 },
    reputation: 0
  });

  // Демо-данные для разных месяцев
  interface DemoMonthData {
    expertise: { [key: string]: number };
    money: { cash: number; investment: number; total: number };
    reputation: number;
  }

  const demoData: { [key: number]: DemoMonthData } = {
    0: { // Январь
      expertise: {
        "Технологии": 50,
        "Медицина": 30,
        "Образование": 20
      },
      money: {
        cash: 100000,
        investment: 50000,
        total: 150000
      },
      reputation: 40
    },
    1: { // Февраль
      expertise: {
        "Технологии": 60,
        "Медицина": 35,
        "Образование": 25
      },
      money: {
        cash: 120000,
        investment: 60000,
        total: 180000
      },
      reputation: 30
    },
    2: { // Март
      expertise: {
        "Технологии": 70,
        "Медицина": 40,
        "Образование": 30
      },
      money: {
        cash: 150000,
        investment: 80000,
        total: 230000
      },
      reputation: 35
    },
    3: { // Апрель
      expertise: {
        "Технологии": 80,
        "Медицина": 45,
        "Образование": 35
      },
      money: {
        cash: 180000,
        investment: 100000,
        total: 280000
      },
      reputation: 40
    },
    4: { // Май
      expertise: {
        "Технологии": 90,
        "Медицина": 50,
        "Образование": 40
      },
      money: {
        cash: 200000,
        investment: 120000,
        total: 320000
      },
      reputation: 45
    },
    5: { // Июнь
      expertise: {
        "Технологии": 100,
        "Медицина": 55,
        "Образование": 45
      },
      money: {
        cash: 250000,
        investment: 150000,
        total: 400000
      },
      reputation: 50
    }
  };

  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  useEffect(() => {
    const loadSessionData = async () => {
      try {
        // Загружаем реальные данные из API
        const [reputationData, moneyData, expertiseData] = await Promise.all([
          userAPI.getReputation(),
          userAPI.getMoney(),
          userAPI.getExpertise()
        ]);

        // Обновляем текущие данные
        setStatsData({
          expertise: expertiseData.map || {},
          money: moneyData || { cash: 0, investment: 0, total: 0 },
          reputation: reputationData.reputation || 0
        });

        // Обновляем данные сессии
        const expertiseValues = expertiseData.map ? Object.values(expertiseData.map) : [];
        const totalExpertise = expertiseValues.reduce<number>((sum: number, value: unknown) => {
          const numValue = typeof value === 'number' ? value : 0;
          return sum + numValue;
        }, 0);

        setSessionData({
          stepCount: 0,
          monthId: currentMonth,
          stepsLeft: 5,
          money: moneyData.total || 0,
          reputation: reputationData.reputation || 0,
          expertise: totalExpertise
        });

        console.log('Загруженные данные:', {
          reputation: reputationData,
          money: moneyData,
          expertise: expertiseData
        });
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        // В случае ошибки используем демо-данные как запасной вариант
        setStatsData({
          expertise: demoData[currentMonth]?.expertise || {},
          money: demoData[currentMonth]?.money || { cash: 0, investment: 0, total: 0 },
          reputation: demoData[currentMonth]?.reputation || 0
        });
      } finally {
        setLoading(false);
      }
    };
    loadSessionData();
  }, [currentMonth]);

  // Добавляем обработчик события для обновления баланса
  useEffect(() => {
    const handleBalanceUpdate = (event: CustomEvent) => {
      const { cash, investment, total } = event.detail;
      setStatsData((prev) => ({
        ...prev,
        money: {
          cash,
          investment,
          total
        }
      }));
    };

    const handleStatsUpdate = (event: CustomEvent) => {
      const { reputation, expertise, stepsLeft } = event.detail;
      
      // Обновляем данные статистики
      setStatsData((prev) => {
        // Создаем новый объект экспертизы, сохраняя предыдущие значения
        const newExpertise = { ...prev.expertise };
        
        // Обновляем значения для каждой ниши
        Object.entries(expertise as { [key: string]: number }).forEach(([nicheId, value]) => {
          // Преобразуем ID ниши в название
          const nicheName = getNicheName(nicheId);
          if (nicheName) {
            newExpertise[nicheName] = (newExpertise[nicheName] || 0) + value;
          }
        });

        return {
          ...prev,
          reputation,
          expertise: newExpertise
        };
      });

      // Обновляем данные сессии
      setSessionData(prev => ({
        ...prev,
        stepsLeft,
        reputation,
        expertise: Object.values(expertise as { [key: string]: number }).reduce((sum: number, value: number) => sum + value, 0)
      }));

      console.log('Обновление статистики:', {
        reputation,
        expertise,
        stepsLeft
      });
    };

    // Функция для получения названия ниши по ID
    const getNicheName = (nicheId: string): string | null => {
      const nicheMap: { [key: string]: string } = {
        'niche-1': 'GreenTech',
        'niche-2': 'MedTech',
        'niche-3': 'SpaceTech',
        'niche-4': 'IT'
      };
      return nicheMap[nicheId] || null;
    };

    window.addEventListener('balanceUpdate', handleBalanceUpdate as EventListener);
    window.addEventListener('statsUpdate', handleStatsUpdate as EventListener);
    return () => {
      window.removeEventListener('balanceUpdate', handleBalanceUpdate as EventListener);
      window.removeEventListener('statsUpdate', handleStatsUpdate as EventListener);
    };
  }, []);

  const handleStatClick = (type: string) => {
    setDialogOpen(prev => ({ ...prev, [type]: true }));
  };
  const handleDialogClose = (type: string) => {
    setDialogOpen(prev => ({ ...prev, [type]: false }));
  };

  const calculatedMonth = getCurrentMonth(sessionData.stepCount);
  const displayMonth = currentMonth ?? calculatedMonth;

  const getTrendIcon = (current: number, previous: number) => {
    if (previous === undefined) return null;
    const diff = current - previous;
    if (diff > 0) return <TrendingUpIcon sx={{ color: '#4CAF50', fontSize: '1.2vh' }} />;
    if (diff < 0) return <TrendingDownIcon sx={{ color: '#F44336', fontSize: '1.2vh' }} />;
    return <TrendingFlatIcon sx={{ color: '#FFC107', fontSize: '1.2vh' }} />;
  };

  const getTooltipText = (current: number, previous: number) => {
    if (previous === undefined) return null;
    const diff = current - previous;
    if (previous === 0) return `Изменение: ${diff > 0 ? '+' : ''}${diff}`;
    const percentage = ((diff / previous) * 100).toFixed(1);
    return `Изменение: ${diff > 0 ? '+' : ''}${diff} (${percentage}%)`;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
      }}
    >
      {/* Основной хедер */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#59618C',
          color: '#413545',
          width: '100%',
          height: { xs: '8vh', sm: '9vh', md: '10vh' },
          padding: { xs: '1vh 0.3vh', sm: '1.5vh 0.4vh', md: '2vh 0.5vh' },
          gap: { xs: '0.3vh', sm: '0.5vh', md: '1vh' }
        }}
      >
        {/* Левая часть: Лого + Очки действий */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: '0.5vh', sm: '1vh', md: '2vh' },
          minWidth: 'fit-content'
        }}>
          <Box
            sx={{
              width: { xs: '5vh', sm: '6vh', md: '7vh' },
              height: { xs: '3vh', sm: '4vh', md: '5vh' },
              backgroundImage: `url(${logo})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3vh',
              padding: { xs: '0.2vh 0.3vh', sm: '0.3vh 0.5vh', md: '0.4vh 0.8vh' },
              backgroundColor: '#9CA0BA',
              borderRadius: '0.3vh',
              width: { xs: '8vh', sm: '10vh', md: '12vh' },
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: { xs: '2vh', sm: '2.5vh', md: '3vh' },
                height: { xs: '2vh', sm: '2.5vh', md: '3vh' },
                backgroundImage: `url(${tea})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            />
            <Typography
              sx={{
                color: '#413545',
                fontSize: { xs: '0.8vh', sm: '0.9vh', md: '1vh' },
                fontFamily: 'Lettersano Full, sans-serif',
                whiteSpace: 'nowrap',
              }}
            >
              Очки
            </Typography>
            <Typography
              sx={{
                color: '#FFFFFF',
                fontSize: { xs: '1.2vh', sm: '1.4vh', md: '1.6vh' },
                fontFamily: 'Lettersano Full, sans-serif',
                marginLeft: '0.3vh',
              }}
            >
              {loading ? '...' : sessionData.stepsLeft}
            </Typography>
          </Box>
        </Box>

        {/* Центр: Навигация */}
        <Box sx={{ 
          display: 'flex', 
          gap: { xs: '0.5vh', sm: '1vh', md: '1.5vh' }, 
          alignItems: 'center',
          justifyContent: 'center',
          flex: { xs: '0 1 auto', md: '1' }
        }}>
          {navItems.map(({ label, icon, type }) => (
            <Box key={label} sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              minWidth: { xs: '5vh', sm: '6vh', md: '7vh' },
              cursor: 'pointer'
            }} onClick={() => handleStatClick(type)}>
              <Box
                sx={{
                  width: { xs: '5vh', sm: '6vh', md: '7vh' },
                  height: { xs: '3vh', sm: '4vh', md: '5vh' },
                  backgroundImage: `url(${icon})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              />
              <Typography
                sx={{
                  color: '#9CA0BA',
                  fontSize: { xs: '0.7vh', sm: '0.8vh', md: '0.9vh' },
                  fontFamily: 'Lettersano Full, sans-serif',
                  marginTop: { xs: '0.5vh', sm: '0.6vh', md: '0.7vh' },
                }}
              >
                {label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Правая часть: Календарь + Профиль */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: '0.5vh', sm: '1vh', md: '1.5vh' },
          minWidth: 'fit-content'
        }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: '0.3vh', sm: '0.5vh', md: '0.8vh' },
              padding: { xs: '0.2vh 0.3vh', sm: '0.3vh 0.5vh', md: '0.4vh 0.8vh' },
              backgroundColor: '#9CA0BA',
              borderRadius: '0.3vh',
              width: { xs: '10vh', sm: '12vh', md: '14vh' },
            }}
          >
            <Box
              sx={{
                width: { xs: '2.5vh', sm: '3vh', md: '3.5vh' },
                height: { xs: '2.5vh', sm: '3vh', md: '3.5vh' },
                backgroundImage: `url(${calender})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            />
            <Typography
              sx={{
                color: '#413545',
                fontSize: { xs: '1.2vh', sm: '1.4vh', md: '1.6vh' },
                fontFamily: 'Lettersano Full, sans-serif',
                display: 'none',
                '@media (min-width: 900px)': {
                  display: 'block'
                }
              }}
            >
              {loading ? '...' : MONTHS[displayMonth]}
            </Typography>
            <Typography
              sx={{
                color: '#413545',
                fontSize: { xs: '1.2vh', sm: '1.4vh', md: '1.6vh' },
                fontFamily: 'Lettersano Full, sans-serif',
                display: 'block',
                '@media (min-width: 900px)': {
                  display: 'none'
                }
              }}
            >
              {loading ? '...' : MONTHS[displayMonth].slice(0, 3)}
            </Typography>
          </Box>
          <Box
            sx={{
              width: { xs: '5vh', sm: '6vh', md: '7vh' },
              height: { xs: '3vh', sm: '4vh', md: '5vh' },
              borderRadius: '50%',
              backgroundImage: `url(${boy})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          />
        </Box>

        {/* Диалоги поверх, внешний вид не меняется */}
        {navItems.map(({ type }) => (
          <StatsDialog
            key={type}
            open={dialogOpen[type]}
            onClose={() => handleDialogClose(type)}
            type={type as 'expertise' | 'money' | 'reputation'}
            data={statsData}
            previousData={previousStatsData}
            loading={loading}
            sessionData={sessionData}
          />
        ))}
      </Box>
    </Box>
  );
};

function getCurrentMonth(stepCount: number): number {
  return stepCount % 12;
}

export default Header;