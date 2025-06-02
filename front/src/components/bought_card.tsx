import React, { useState, useEffect } from 'react';
import { Card, Typography } from '@mui/material';
import it from '../icons/IT.png';
import med from '../icons/Med.png';
import green from '../icons/Green.png';
import space from '../icons/Space.png';
import StartupStatisticsDialog from './startup_statistics_dialog';
import SellStartupDialog from './sell_startup_dialog';
import { startupsAPI, userAPI } from '../api/apiClient';
import { useNavigate } from 'react-router-dom';

const NICHE_MAP: { [key: string]: { id: string; name: string; icon: string } } = {
  'IT': { id: 'IT', name: 'IT', icon: it },
  'GreenTech': { id: 'GreenTech', name: 'GreenTech', icon: green },
  'MedTech': { id: 'MedTech', name: 'MedTech', icon: med },
  'SpaceTech': { id: 'SpaceTech', name: 'SpaceTech', icon: space }
};

interface BoughtCardProps {
  title: string;
  subtitle: string;
  resourceId: string;
  onSell?: () => void;
}

const BoughtCard: React.FC<BoughtCardProps> = ({
  title,
  subtitle,
  resourceId,
  onSell
}) => {
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isStatisticsDialogOpen, setIsStatisticsDialogOpen] = useState(false);
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);
  const [statistics, setStatistics] = useState<any>(null);
  const [previousStatistics, setPreviousStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<{ cash: number; total: number; investment: number }>({ 
    cash: 0, 
    total: 0,
    investment: 0 
  });
  const navigate = useNavigate();
  const nicheInfo = NICHE_MAP[subtitle] || NICHE_MAP['IT'];
  const backgroundImage = nicheInfo.icon;

  // Загружаем начальный баланс
  useEffect(() => {
    const loadBalance = async () => {
      try {
        const moneyData = await userAPI.getMoney();
        const newBalance = {
          cash: moneyData.cash,
          investment: moneyData.investment,
          total: moneyData.cash + moneyData.investment // Общий капитал = наличные + инвестиции
        };
        setBalance(newBalance);
        localStorage.setItem('balance', JSON.stringify(newBalance));
      } catch (err) {
        // В демо-режиме проверяем сохраненный баланс или устанавливаем начальный
        const savedBalance = localStorage.getItem('balance');
        const newBalance = savedBalance ? JSON.parse(savedBalance) : {
          cash: 100000,
          investment: 50000,
          total: 150000 // Начальный общий капитал = начальные наличные + начальные инвестиции
        };
        setBalance(newBalance);
        if (!savedBalance) {
          localStorage.setItem('balance', JSON.stringify(newBalance));
        }
      }
    };
    loadBalance();

    // Подписываемся на обновления баланса
    const handleBalanceUpdate = (event: CustomEvent) => {
      setBalance(event.detail);
    };
    window.addEventListener('balanceUpdate', handleBalanceUpdate as EventListener);
    return () => {
      window.removeEventListener('balanceUpdate', handleBalanceUpdate as EventListener);
    };
  }, []);

  const handleClick = async () => {
    console.log('Клик по карточке:', { title, resourceId });
    try {
      setLoading(true);
      setError(null);
      
      // Пробуем получить данные из API
      try {
        console.log('Запрос статистики для стартапа:', resourceId);
        const response = await startupsAPI.getStatistics(resourceId);
        console.log('Получена статистика:', response);
        
        // Обновляем состояние в правильном порядке
        const newStatistics = {
          salePrice: response.salePrice,
          lastMonthRevenue: response.lastMonthRevenue,
          expenses: response.expenses,
          team: response.team,
          budget: response.budget,
          progress: response.progress,
          reputation: response.reputation,
          stage: response.stage
        };
        
        console.log('Устанавливаем новую статистику:', newStatistics);
        setStatistics(newStatistics);
        setPreviousStatistics(null);
        
        // Ждем обновления состояния
        await new Promise(resolve => setTimeout(resolve, 0));
        
        console.log('Открываем диалог статистики');
        setIsStatisticsDialogOpen(true);
      } catch (apiError) {
        // Если API недоступен, используем демо-данные
        console.log('API недоступен, используем демо-режим');
        
        // Демо-данные с падением некоторых характеристик
        const demoStatistics = {
          salePrice: 1500000,
          lastMonthRevenue: 180000,
          expenses: 200000,
          team: 8,
          budget: 300000,
          progress: 60,
          reputation: 70,
          stage: "Стабилизация"
        };

        const demoPreviousStatistics = {
          lastMonthRevenue: 250000,
          expenses: 150000,
          team: 12,
          budget: 500000,
          progress: 75,
          reputation: 85
        };

        console.log('Устанавливаем демо-статистику:', demoStatistics);
        setStatistics(demoStatistics);
        setPreviousStatistics(demoPreviousStatistics);
        
        // Ждем обновления состояния
        await new Promise(resolve => setTimeout(resolve, 0));
        
        console.log('Открываем диалог статистики (демо)');
        setIsStatisticsDialogOpen(true);
      }
    } catch (err) {
      console.error('Ошибка при загрузке статистики:', err);
      setError('Ошибка при загрузке статистики');
    } finally {
      setLoading(false);
    }
  };

  // Добавляем useEffect для отслеживания изменений состояния
  useEffect(() => {
    console.log('Состояние изменилось:', {
      statistics,
      isStatisticsDialogOpen,
      hasStatistics: !!statistics
    });
  }, [statistics, isStatisticsDialogOpen]);

  const handleSell = async () => {
    try {
      // Показываем диалог подтверждения
      setIsSellDialogOpen(true);
    } catch (err) {
      setError('Ошибка при подготовке к продаже');
      console.error('Error preparing to sell:', err);
    }
  };

  const handleConfirmSell = async () => {
    try {
      console.log('Начало продажи стартапа:', { resourceId, statistics });
      
      // Вызываем API для продажи
      const result = await startupsAPI.sell(resourceId);
      
      if (!result.success) {
        throw new Error(result.errorMessage || 'Ошибка при продаже стартапа');
      }

      // Обновляем баланс после продажи
      try {
        const balanceData = await userAPI.getMoney();
        window.dispatchEvent(new CustomEvent('balanceUpdate', { detail: balanceData }));
      } catch (err) {
        console.error('Ошибка при обновлении баланса:', err);
      }
      
      // Закрываем оба диалога
      setIsSellDialogOpen(false);
      setIsStatisticsDialogOpen(false);
      
      // Вызываем callback для обновления списка
      if (onSell) {
        console.log('Вызываем callback onSell');
        onSell();
      }
      
      // Перенаправляем на поле игры
      console.log('Перенаправляем на /first-month');
      navigate('/game_field');
    } catch (err) {
      console.error('Ошибка при продаже стартапа:', err);
      setError('Ошибка при продаже стартапа');
    }
  };

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: { xs: 'calc(100% - 2vh)', sm: '37.6vh' },
          height: '8vh',
          margin: '0vh',
          padding: 0,
          borderRadius: '1.29vh',
          backgroundColor: active ? '#F8F9FA' : '#9CA0BA',
          boxShadow: hovered && !active ? '0 0 1.2vh rgba(0,0,0,0.2)' : 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          transform: hovered || active ? 'scale(1.05)' : 'scale(1)',
          transformOrigin: 'center center',
          position: 'relative',
          zIndex: hovered || active ? 2 : 1
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={(e) => {
          console.log('Клик по карточке:', { title, resourceId });
          e.stopPropagation();
          handleClick();
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingLeft: '0.78vh',
            flex: 1,
            minWidth: 0,
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Lettersano Full, sans-serif',
              fontWeight: 700,
              fontSize: '2.08vh',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: '#413545',
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 400,
              fontSize: '1.82vh',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: '#413545',
            }}
          >
            {nicheInfo.name}
          </Typography>
        </div>

        <div
          style={{
            width: '10.4vh',
            height: '100%',
            borderTopRightRadius: '1.29vh',
            borderBottomRightRadius: '1.29vh',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            flexShrink: 0,
          }}
        />
      </Card>

      {console.log('Рендеринг диалогов:', {
        hasStatistics: !!statistics,
        isStatisticsDialogOpen,
        statistics
      })}

      {statistics && (
        <StartupStatisticsDialog
          open={isStatisticsDialogOpen}
          onClose={() => {
            console.log('Закрытие диалога статистики');
            setIsStatisticsDialogOpen(false);
          }}
          onSell={handleSell}
          startupName={title}
          statistics={statistics}
          previousStatistics={previousStatistics}
        />
      )}

      {isSellDialogOpen && statistics && (
        <SellStartupDialog
          open={isSellDialogOpen}
          onClose={() => setIsSellDialogOpen(false)}
          onSell={handleConfirmSell}
          startupName={title}
          salePrice={statistics.salePrice}
        />
      )}
    </>
  );
};

export default BoughtCard;
