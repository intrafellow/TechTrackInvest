import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button
} from '@mui/material';
import { contractAPI, startupsAPI, monthAPI } from '../api/apiClient';
import DealDialog from '../components/deal_dialog';
import DiceRoll from '../components/dice_roll';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/header';
import LeftMenu from '../components/left_menu';

interface ContractData {
  minPrice: number;
  maxPrice: number;
  startupName: string;
  startupId: string;
  contractId: string;
}

const DealPage: React.FC = () => {
  const { startupId } = useParams<{ startupId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [desiredPrice, setDesiredPrice] = useState<string>('');
  const [diceValue1, setDiceValue1] = useState<number>(0);
  const [diceValue2, setDiceValue2] = useState<number>(0);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [finalCondition, setFinalCondition] = useState<any>(null);
  const [justBought, setJustBought] = useState<any>(null);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const saved = localStorage.getItem('currentMonth');
    return saved ? JSON.parse(saved) : 0;
  });

  useEffect(() => {
    const fetchContractData = async () => {
      if (!startupId) return;
      try {
        setLoading(true);
        const data = await contractAPI.getContract(startupId);
        console.log('Contract data received:', data);
        setContractData({
          ...data,
          startupId,
          contractId: data.contractId || `contract-${startupId}`
        });
        // Обновляем месяц из API, если он есть в ответе
        if (data.currentMonth !== undefined) {
          setCurrentMonth(data.currentMonth);
          localStorage.setItem('currentMonth', JSON.stringify(data.currentMonth));
        }
      } catch (err) {
        console.error('Error fetching contract data:', err);
        // Fallback: рандомные значения если нет БД
        setContractData({
          startupId,
          minPrice: 100000 + Math.floor(Math.random() * 100000),
          maxPrice: 300000 + Math.floor(Math.random() * 200000),
          startupName: 'Demo Startup',
          contractId: `demo-contract-${startupId}`
        });
      } finally {
        setLoading(false);
      }
    };
    fetchContractData();
  }, [startupId]);

  useEffect(() => {
    const fetchMonth = async () => {
      try {
        const data = await monthAPI.getMonthCount();
        setCurrentMonth(data.monthCount);
        localStorage.setItem('currentMonth', JSON.stringify(data.monthCount));
      } catch (e) {
        // fallback: оставляем старое значение
      }
    };
    fetchMonth();
  }, []);

  const handleSubmit = async () => {
    if (!contractData) return;
    try {
      setLoading(true);
      setIsRolling(true);
      console.log('Submitting final condition with:', {
        contractId: contractData.contractId,
        minPrice: contractData.minPrice,
        maxPrice: contractData.maxPrice,
        userOfferedPrice: Number(desiredPrice)
      });
      const response = await contractAPI.getFinalCondition(
        contractData.contractId,
        contractData.minPrice,
        contractData.maxPrice,
        Number(desiredPrice)
      );
      
      console.log('Raw final condition response:', response);
      
      if (!response.success) {
        throw new Error(response.errorMessage || 'Ошибка при получении условий сделки');
      }

      const finalCondition = response.content;
      console.log('Final condition content:', finalCondition);
      
      // Проверяем наличие всех необходимых полей
      if (!finalCondition || typeof finalCondition !== 'object') {
        throw new Error('Некорректный формат ответа');
      }

      const requiredFields = ['finalPrice', 'teamEffect', 'reputationEffect', 'rollResult'];
      const missingFields = requiredFields.filter(field => !(field in finalCondition));
      
      if (missingFields.length > 0) {
        throw new Error(`Отсутствуют обязательные поля: ${missingFields.join(', ')}`);
      }
      
      // Анимация броска кубика
      setDiceValue1(0); // Сбрасываем значение для анимации
      
      // Кубик
      setTimeout(() => {
        setDiceValue1(finalCondition.rollResult);
      }, 1000);
      
      const conditionData = {
        finalPrice: finalCondition.finalPrice,
        teamEffect: finalCondition.teamEffect,
        reputationEffect: finalCondition.reputationEffect,
        rollResult: finalCondition.rollResult
      };
      
      console.log('Setting final condition:', conditionData);
      setFinalCondition(conditionData);
      
      // Ждем завершения анимации перед показом диалога
      setTimeout(() => {
        setIsRolling(false);
        setDialogOpen(true);
      }, 2500);
    } catch (error) {
      console.error('Error getting final condition:', error);
      // Fallback: рандомные значения если нет БД
      const randomPrice = contractData.minPrice + Math.floor(Math.random() * (contractData.maxPrice - contractData.minPrice));
      const randomRoll = 1 + Math.floor(Math.random() * 20);
      
      // Анимация броска кубика для демо-режима
      setDiceValue1(0);
      
      setTimeout(() => {
        setDiceValue1(randomRoll);
      }, 1000);
      
      const fallbackCondition = {
        finalPrice: randomPrice,
        teamEffect: Math.floor(Math.random() * 21) - 10,
        reputationEffect: Math.floor(Math.random() * 21) - 10,
        rollResult: randomRoll
      };
      
      console.log('Using fallback condition:', fallbackCondition);
      setFinalCondition(fallbackCondition);
      
      setTimeout(() => {
        setIsRolling(false);
        setDialogOpen(true);
      }, 2500);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
	navigate('/game_field');
  };

  const handleDialogAccept = async () => {
    if (!finalCondition || !contractData) return;
    try {
      setLoading(true);
      const buyData = {
        resourceId: contractData.startupId,
        finalPrice: finalCondition.finalPrice,
        teamEffect: finalCondition.teamEffect,
        reputationEffect: finalCondition.reputationEffect
      };
      console.log('Attempting to buy startup with data:', buyData);
      
      // Проверяем, что все значения являются числами
      if (typeof buyData.finalPrice !== 'number' || 
          typeof buyData.teamEffect !== 'number' || 
          typeof buyData.reputationEffect !== 'number') {
        throw new Error('Некорректные числовые значения в данных покупки');
      }
      
      await startupsAPI.buy(
        buyData.resourceId,
        buyData.finalPrice,
        buyData.teamEffect,
        buyData.reputationEffect
      );
      // Обновляем очки действий в хедере
      try {
        const stepCountData = await monthAPI.getStepCount();
        window.dispatchEvent(new CustomEvent('stepCountUpdate', { detail: { stepsLeft: stepCountData.stepCount } }));
      } catch (e) { /* ignore */ }
      navigate('/game_field', { state: { justBought: contractData } });
    } catch (err: any) {
      console.error('Error buying startup:', {
        error: err,
        response: err.response?.data,
        status: err.response?.status
      });
      // fallback: демо-режим
      // Обновляем баланс в демо-режиме
      const currentBalance = JSON.parse(localStorage.getItem('balance') || '{"cash": 100000, "total": 150000, "investment": 50000}');
      const newBalance = {
        cash: currentBalance.cash - finalCondition.finalPrice, // Уменьшаем наличные на сумму покупки
        investment: currentBalance.investment + finalCondition.finalPrice, // Увеличиваем инвестиции на сумму покупки
        total: currentBalance.cash - finalCondition.finalPrice + (currentBalance.investment + finalCondition.finalPrice) // Общий капитал = новые наличные + новые инвестиции
      };
      localStorage.setItem('balance', JSON.stringify(newBalance));
      
      // Сохраняем информацию о начальной цене инвестиции
      const investments = JSON.parse(localStorage.getItem('investments') || '{}');
      investments[contractData.startupId] = finalCondition.finalPrice;
      localStorage.setItem('investments', JSON.stringify(investments));
      console.log('Сохранена сумма инвестиций:', {
        startupId: contractData.startupId,
        amount: finalCondition.finalPrice,
        allInvestments: investments
      });
      
      // Отправляем событие об обновлении баланса
      window.dispatchEvent(new CustomEvent('balanceUpdate', { detail: newBalance }));
      navigate('/game_field', { state: { justBought: contractData } });
    } finally {
      setLoading(false);
    }
  };

  // Проверка на валидность желаемой цены
  const isDesiredPriceValid = () => {
    if (!contractData) return false;
    const price = Number(desiredPrice);
    return (
      !isNaN(price) &&
      price >= contractData.minPrice &&
      price <= contractData.maxPrice
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', backgroundColor: '#444A6B', overflow: 'hidden' }}>
      <Header currentMonth={currentMonth} />
      <Box sx={{ display: 'flex', flex: 1, height: 'calc(100vh - 8vh)' }}>
        <LeftMenu onTypeChange={() => {}} disabled={true} />
        <Box
          sx={{
            flexGrow: 1,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: { xs: '1vh', sm: '1.5vh', md: '2vh' },
            fontFamily: 'Raleway, sans-serif',
            color: '#E3E6FF',
            overflow: 'auto',
            position: 'relative',
            backgroundColor: 'transparent'
          }}
        >
          {error && (
            <Typography color="error" sx={{ textAlign: 'center', marginBottom: '2vh', color: '#B00020' }}>{error}</Typography>
          )}
          <Typography
            sx={{
              fontFamily: 'Lettersano Full, sans-serif',
              fontSize: '32px',
              marginBottom: '32px',
              textAlign: 'center',
              color: '#F6F7FF'
            }}
          >
            Заключение сделки
          </Typography>
          <Box sx={{ display: 'flex', gap: '32px', justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <Box
              sx={{
                flex: 1,
                minWidth: '320px',
                maxWidth: '420px',
                padding: '24px',
                backgroundColor: '#F7F2FA',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <TextField
                fullWidth
                label="Минимальная цена"
                value={contractData?.minPrice || ''}
                disabled
                sx={{ marginBottom: '16px' }}
                InputProps={{
                  sx: {
                    fontFamily: 'Raleway, sans-serif',
                    fontWeight: 300
                  }
                }}
              />
              <TextField
                fullWidth
                label="Максимальная цена"
                value={contractData?.maxPrice || ''}
                disabled
                sx={{ marginBottom: '16px' }}
                InputProps={{
                  sx: {
                    fontFamily: 'Raleway, sans-serif',
                    fontWeight: 300
                  }
                }}
              />
              <TextField
                fullWidth
                label="Желаемая цена"
                type="text"
                value={desiredPrice}
                onChange={(e) => {
                  // Разрешаем только цифры
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setDesiredPrice(val);
                }}
                sx={{ marginBottom: '24px' }}
                InputProps={{
                  sx: {
                    fontFamily: 'Raleway, sans-serif',
                    fontWeight: 300
                  },
                  inputProps: {
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                    style: { MozAppearance: 'textfield' }
                  }
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!isDesiredPriceValid()}
                  sx={{
                    backgroundColor: '#7A9E8A',
                    color: '#EAEAF0',
                    fontFamily: 'Raleway, sans-serif',
                    fontWeight: 300,
                    '&:hover': {
                      backgroundColor: '#7A9E8A',
                      opacity: 0.9
                    }
                  }}
                >
                  Предложить условия
                </Button>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '2vh' }}>
              <DiceRoll value={diceValue1} isRolling={isRolling} />
            </Box>
          </Box>
          <DealDialog
            open={dialogOpen}
            onClose={handleDialogClose}
            onAccept={handleDialogAccept}
            startupName={contractData?.startupName || ''}
            investmentAmount={finalCondition?.finalPrice || 0}
            exitConditions="Возможность продажи доли через 5 ходов"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default DealPage; 