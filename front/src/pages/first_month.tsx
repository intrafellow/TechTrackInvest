import React, { useState, useEffect } from 'react';
import { Box, Divider, Typography, FormControl, Select, MenuItem, useMediaQuery, useTheme, CircularProgress, Button, Tabs, Tab } from '@mui/material';
import Header from '../components/header';
import LeftMenu from '../components/left_menu';
import VerticalCard from '../components/available_card';
import BoughtCard from '../components/bought_card';
import MobileSlider from '../components/mobile_slider';
import EventsList from '../components/event';
import { startupsAPI, conferenceAPI, crisisAPI } from '../api/apiClient';
import { useLocation } from 'react-router-dom';
import EndTurnDialog from '../components/end_turn_dialog';
import CrisisDialog from '../components/crisis_dialog';
import StatsDialog from '../components/stats_dialog';

const NICHE_MAP: { [key: string]: { id: string; name: string } } = {
  'IT': { id: 'IT', name: 'IT' },
  'GreenTech': { id: 'GreenTech', name: 'GreenTech' },
  'MedTech': { id: 'MedTech', name: 'MedTech' },
  'SpaceTech': { id: 'SpaceTech', name: 'SpaceTech' }
};

interface Startup {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryName: string;
  purchased: boolean;
}

interface Event {
  id: number;
  name: string;
  description: string;
  price: number;
  nicheId: string;
}

interface UserStats {
  expertise: { [key: string]: number };
  money: { cash: number; investment: number; total: number };
  reputation: number;
}

const FirstMonthPage: React.FC = () => {
  // Обработчики сделок
  const handleDealStart = () => {
    setIsDealInProgress(true);
  };

  // Функция для проверки появления кризиса
  const checkForCrisis = async () => {
    // Кризис не может появиться во время сделки
    if (!isDealInProgress && hasCrisisThisMonth) {
      try {
        const crisisData = await crisisAPI.getCrisis();
        setCurrentCrisis(crisisData);
        setCrisisDialogOpen(true);
        // После появления кризиса в этом месяце больше кризисов не будет
        setHasCrisisThisMonth(false);
      } catch (error) {
        console.log('API недоступен, используем демо-режим');
        // В демо-режиме используем тестовый кризис
        setCurrentCrisis({
          title: "Технологический кризис",
          description: "В ответ на растущую волну протестов против технологических гигантов, правительство начинает вводить строгие новые регуляции в отношении инновационных стартапов. Новые законы касаются защиты данных пользователей, прозрачности алгоритмов и ограничения искусственного интеллекта в чувствительных отраслях, таких как здравоохранение и финансы.",
          solutions: [
            { id: "1", text: "Адаптироваться к новым требованиям и инвестировать в соответствие" },
            { id: "2", text: "Лоббировать интересы через отраслевые ассоциации" },
            { id: "3", text: "Искать лазейки в законодательстве и продолжать работу как прежде" }
          ]
        });
        setCrisisDialogOpen(true);
        // После появления кризиса в этом месяце больше кризисов не будет
        setHasCrisisThisMonth(false);
      }
    }
  };

  const handleDealEnd = () => {
    setIsDealInProgress(false);
    if (hasCrisisThisMonth) {
      checkForCrisis();
    }
  };

  // Состояния
  const location = useLocation();
  const [selected, setSelected] = useState('');
  const [isBlurred, setIsBlurred] = useState(false);
  const [boughtStartups, setBoughtStartups] = useState<Startup[]>([]);
  const [availableStartups, setAvailableStartups] = useState<Startup[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contentType, setContentType] = useState<'startups' | 'events'>('startups');
  const [currentMonth, setCurrentMonth] = useState(0);
  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [isEndTurnDialogOpen, setIsEndTurnDialogOpen] = useState(false);
  const [crisisDialogOpen, setCrisisDialogOpen] = useState(false);
  const [currentCrisis, setCurrentCrisis] = useState<any>(null);
  const [isDealInProgress, setIsDealInProgress] = useState(false);
  const [hasCrisisThisMonth, setHasCrisisThisMonth] = useState(false);
  const [visitedEvents, setVisitedEvents] = useState<number[]>(() => {
    const saved = localStorage.getItem('visitedEvents');
    return saved ? JSON.parse(saved) : [];
  });
  const [userStats, setUserStats] = useState(() => {
    const saved = localStorage.getItem('userStats');
    return saved ? JSON.parse(saved) : {
      expertise: { '1': 0, '2': 0, '3': 0, '4': 0 },
      reputation: 0,
      money: { cash: 100000, investment: 0, total: 100000 }
    };
  });
  const [conferenceBuff, setConferenceBuff] = useState<{ expertise: { [key: string]: number }, reputation: number, money: number } | null>(null);
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [statsTab, setStatsTab] = useState<'expertise' | 'money' | 'reputation'>('expertise');
  const [prevStats, setPrevStats] = useState<UserStats>({
    expertise: {},
    money: { cash: 0, investment: 0, total: 0 },
    reputation: 0
  });
  const [pendingStatsDialog, setPendingStatsDialog] = useState(false);

  // Тестовые данные для демо-режима
  const demoEvents: Event[] = [
    {
      id: 1,
      name: 'TechCrunch Disrupt 2024',
      description: 'Крупнейшая конференция для стартапов и инвесторов. Возможность завести полезные знакомства и узнать о последних трендах.',
      price: 50000,
      nicheId: '1'
    },
    {
      id: 2,
      name: 'GreenTech Summit',
      description: 'Конференция, посвященная экологическим технологиям и устойчивому развитию. Уникальная возможность познакомиться с лидерами отрасли.',
      price: 35000,
      nicheId: '2'
    }
  ];

  const demoAvailableStartups: Startup[] = [
    {
      id: 'startup-1',
      name: 'AI Assistant Pro',
      description: 'Искусственный интеллект для автоматизации бизнес-процессов',
      price: 1000000,
      categoryName: 'IT',
      purchased: false
    },
    {
      id: 'startup-2',
      name: 'EcoEnergy Solutions',
      description: 'Инновационные решения для возобновляемой энергетики',
      price: 1500000,
      categoryName: 'GreenTech',
      purchased: false
    }
  ];

  useEffect(() => {
    // Проверяем, был ли переход к следующему месяцу
    if (location.state?.monthChanged) {
      if (location.state?.isDemo) {
        setCurrentMonth(location.state.currentMonth ?? 1);
      } else {
        setCurrentMonth(prev => prev + 1);
      }
    }
  }, [location.state]);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        const data = await startupsAPI.getAll();
        let bought = data.purchasedStartups || [];
        let available = data.availableStartups || [];
        
        // Преобразуем данные в нужный формат
        bought = bought.map((s: any) => ({
          id: s.resourceId,
          name: s.name,
          description: s.description,
          price: 1000000, // Установим стандартную цену
          categoryName: s.categoryName,
          purchased: true
        }));

        available = available.map((s: any) => ({
          id: s.resourceId,
          name: s.name,
          description: s.description,
          price: 1000000, // Установим стандартную цену
          categoryName: s.categoryName,
          purchased: false
        }));

        // Если есть демо-стартап (justBought), добавляем его в купленные
        if (location.state && location.state.justBought) {
          const demo = location.state.justBought;
          if (!bought.find((s: Startup) => s.id === demo.startupId)) {
            bought = [
              ...bought,
              {
                id: demo.startupId,
                name: demo.startupName || 'Demo Startup',
                description: demo.description || 'Описание демо-стартапа',
                price: demo.minPrice || 100000,
                categoryName: demo.categoryName || 'IT',
                purchased: true
              }
            ];
          }
        }
        setBoughtStartups(bought);
        setAvailableStartups(available);
        const eventsData = await conferenceAPI.getAll();
        setEvents(eventsData);
      } catch (error: any) {
        // Если API не работает, показываем только демо-стартап
        if (location.state && location.state.justBought) {
          const demo = location.state.justBought;
          setBoughtStartups([
            {
              id: demo.startupId,
              name: demo.startupName || 'Demo Startup',
              description: demo.description || 'Описание демо-стартапа',
              price: demo.minPrice || 100000,
              categoryName: demo.categoryName || 'IT',
              purchased: true
            }
          ]);
        } else {
          setBoughtStartups([]);
        }
        setAvailableStartups([]);
        setEvents([]);
        setError('Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, [location.state]);

  // При переходе к новому месяцу определяем, будет ли кризис
  useEffect(() => {
    if (location.state?.monthChanged) {
      // Всегда устанавливаем кризис в новом месяце
      setHasCrisisThisMonth(true);
    }
  }, [location.state?.monthChanged]);

  // Проверяем кризис при каждом действии, но не во время сделки
  useEffect(() => {
    if (!isDealInProgress) {
      checkForCrisis();
    }
  }, [contentType, selected]);

  // Фильтрация по selected
  const filteredBought = boughtStartups.filter(s => selected === '' || s.categoryName === selected);
  const filteredAvailable = availableStartups.filter(s => selected === '' || s.categoryName === selected);

  const handleSellStartup = async (startupId: string) => {
    try {
      setBoughtStartups(prev => prev.filter(startup => startup.id !== startupId));
    } catch (error) {
      console.error('Error handling startup sale:', error);
    }
  };

  const boughtCards = filteredBought.map(startup => (
    <BoughtCard 
      key={startup.id} 
      title={startup.name} 
      subtitle={startup.categoryName}
      resourceId={startup.id}
      onSell={() => handleSellStartup(startup.id)}
    />
  ));

  const availableCards = filteredAvailable.map(startup => (
    <VerticalCard
      key={startup.id}
      title={startup.name}
      subtitle={startup.categoryName}
      description={startup.description}
      resourceId={startup.id}
      startupId={startup.id}
      price={startup.price}
      onDealStart={handleDealStart}
      onDealEnd={handleDealEnd}
    />
  ));

  const handleTypeChange = (type: 'startups' | 'events') => {
    setContentType(type);
    // Сбрасываем фильтр при смене типа
    setSelected('');
  };

  const handleChange = (event: any) => {
    setSelected(event.target.value);
  };

  const handleOpen = () => {
    setIsBlurred(true);
  };

  const handleClose = () => {
    setIsBlurred(false);
  };

  const handleEndTurn = () => {
    setIsEndTurnDialogOpen(true);
  };

  const handleCrisisSolution = async (solutionId: string) => {
    try {
      await crisisAPI.submitSolution(solutionId);
    } catch (error) {
      console.log('API недоступен, используем демо-режим');
    } finally {
      setCrisisDialogOpen(false);
      setCurrentCrisis(null);
    }
  };

  const handleVisitEvent = (eventId: number) => {
    const event = (events.length > 0 ? events : demoEvents).find((e: Event) => e.id === eventId);
    if (!event) return;
    
    setPrevStats({ ...userStats });
    
    const expertiseBuff = { '3': 5 };
    const reputationBuff = 10;
    const moneyBuff = event.price;
    
    setUserStats((prev: any) => {
      const newExpertise = { ...prev.expertise, '3': (prev.expertise['3'] || 0) + 5 };
      const newReputation = prev.reputation + reputationBuff;
      const newMoney = {
        ...prev.money,
        cash: prev.money.cash - moneyBuff,
        total: prev.money.total - moneyBuff
      };
      const updated = { ...prev, expertise: newExpertise, reputation: newReputation, money: newMoney };
      localStorage.setItem('userStats', JSON.stringify(updated));
      return updated;
    });
    
    setVisitedEvents((prev: number[]) => {
      const updated = [...prev, eventId];
      localStorage.setItem('visitedEvents', JSON.stringify(updated));
      return updated;
    });
    
    setStatsTab('expertise');
    setPendingStatsDialog(true);
  };

  useEffect(() => {
    if (pendingStatsDialog) {
      setStatsDialogOpen(true);
      setPendingStatsDialog(false);
    }
  }, [userStats, pendingStatsDialog]);

  const Field = ({ type, showDividers }: { type: 'startups' | 'events'; showDividers: boolean }) => {
    if (type === 'startups') {
      if (isMobileOrTablet) {
        return (
          <>
            <MobileSlider title="Купленные стартапы">
              {boughtCards}
            </MobileSlider>

            <Box sx={{ mt: 3 }}>
              <MobileSlider title="Доступные стартапы">
                {availableCards.length > 0 ? availableCards : demoAvailableStartups.map(startup => (
                  <VerticalCard
                    key={startup.id}
                    title={startup.name}
                    subtitle={startup.categoryName}
                    description={startup.description}
                    resourceId={startup.id}
                    startupId={startup.id}
                    price={startup.price}
                    onDealStart={handleDealStart}
                    onDealEnd={handleDealEnd}
                    isDemo={true}
                  />
                ))}
              </MobileSlider>
            </Box>
          </>
        );
      }
      return (
        <>
          <Typography 
            variant="h6" 
            sx={{ 
              marginBottom: '1vh', 
              marginTop: { xs: '2vh', sm: '3vh', md: '4vh' },
              color: '#E3E6FF',
              fontSize: { xs: '1.8vh', sm: '2vh', md: '2.2vh' }
            }}
          >
            Купленные стартапы
          </Typography>
          <Divider sx={{ backgroundColor: '#CAC4D0', marginBottom: '2vh' }} />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)'
              },
              gap: { xs: '2vh', sm: '2vh', md: '2.4vh' },
              padding: { xs: '1vh', sm: '0' }
            }}
            onClick={(e) => {
              console.log('Клик по Box с купленными стартапами');
              e.stopPropagation();
            }}
          >
            {boughtCards}
          </Box>

          <Typography 
            variant="h6" 
            sx={{ 
              marginBottom: '1vh', 
              marginTop: { xs: '1.5vh', sm: '2vh', md: '2vh' },
              color: '#E3E6FF',
              fontSize: { xs: '1.8vh', sm: '2vh', md: '2.2vh' }
            }}
          >
            Доступные стартапы
          </Typography>
          <Divider sx={{ backgroundColor: '#CAC4D0' }} />

          <Box
            sx={{
              marginTop: { xs: '1.5vh', sm: '2vh', md: '3vh' },
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)'
              },
              gap: { xs: '2vh', sm: '2vh', md: '2.4vh' },
              padding: { xs: '1vh', sm: '0' }
            }}
          >
            {availableCards.length > 0 ? availableCards : demoAvailableStartups.map(startup => (
              <VerticalCard
                key={startup.id}
                title={startup.name}
                subtitle={startup.categoryName}
                description={startup.description}
                resourceId={startup.id}
                startupId={startup.id}
                price={startup.price}
                onDealStart={handleDealStart}
                onDealEnd={handleDealEnd}
                isDemo={true}
              />
            ))}
          </Box>
        </>
      );
    } else {
      const filteredEvents = (events.length > 0 ? events : demoEvents).filter(e => !visitedEvents.includes(e.id));

      if (isMobileOrTablet) {
        return (
          <MobileSlider title="Мероприятия">
            {[<EventsList key="events" events={filteredEvents} onVisit={handleVisitEvent} visitedEvents={visitedEvents} />]}
          </MobileSlider>
        );
      }
      return (
        <>
          <Typography 
            variant="h6" 
            sx={{ 
              marginBottom: '1vh', 
              marginTop: { xs: '2vh', sm: '3vh', md: '4vh' },
              color: '#E3E6FF',
              fontSize: { xs: '1.8vh', sm: '2vh', md: '2.2vh' }
            }}
          >
            Мероприятия
          </Typography>
          <Divider sx={{ backgroundColor: '#CAC4D0', marginBottom: '2vh' }} />
          <EventsList events={filteredEvents} onVisit={handleVisitEvent} visitedEvents={visitedEvents} />
        </>
      );
    }
  };

  // Для передачи в StatsDialog:
  const previousData = conferenceBuff ? {
    expertise: userStats.expertise,
    money: userStats.money,
    reputation: userStats.reputation,
    conferenceExpertise: conferenceBuff.expertise,
    conferenceReputation: conferenceBuff.reputation,
    conferenceMoney: conferenceBuff.money
  } : undefined;

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#444A6B',
      overflow: 'hidden',
      filter: isEndTurnDialogOpen ? 'blur(5px)' : 'none',
      transition: 'filter 0.3s ease'
    }}>
      <Header currentMonth={currentMonth} />
      <Box sx={{ 
        display: 'flex', 
        flex: 1,
        height: 'calc(100vh - 8vh)',
        '@media (min-width: 600px)': {
          height: 'calc(100vh - 9vh)'
        },
        '@media (min-width: 900px)': {
          height: 'calc(100vh - 10vh)'
        }
      }}>
        <LeftMenu onTypeChange={handleTypeChange} onEndTurn={handleEndTurn} />
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
            filter: isBlurred ? 'blur(5px)' : 'none',
            transition: 'filter 0.3s ease',
            overflow: 'auto',
            position: 'relative'
          }}
        >
          {loading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1000
              }}
            >
              <CircularProgress sx={{ color: '#F6F7FF' }} />
            </Box>
          )}

          {error && (
            <Typography
              color="error"
              sx={{
                textAlign: 'center',
                marginBottom: '2vh',
                color: '#B00020'
              }}
            >
              {error}
            </Typography>
          )}

          <Box
            sx={{
              marginTop: { xs: '4vh', sm: '4vh', md: '4vh' },
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginBottom: { xs: '4vh', sm: '4vh', md: '4vh' }
            }}
          >
            <FormControl
              sx={{
                backgroundColor: '#EAEAF0',
                borderRadius: '8px',
                fontFamily: 'Raleway, sans-serif',
                width: { xs: '100%', sm: '80%', md: '22.22vh' },
              }}
            >
              <Select
                sx={{
                  height: { xs: '4vh', sm: '4.5vh', md: '5.19vh' },
                  color: '#413545',
                  fontFamily: 'Raleway, sans-serif',
                  '& fieldset': { border: 'none' },
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
                value={selected}
                onChange={handleChange}
                onOpen={handleOpen}
                onClose={handleClose}
                displayEmpty
                disabled={loading}
                renderValue={(value) => {
                  if (!value) {
                    return <Typography style={{ display: "flex", justifyContent: "center" }} sx={{ color: '#413545' }}>Выберите отрасль</Typography>;
                  }
                  return NICHE_MAP[value]?.name || '';
                }}
              >
                {Object.entries(NICHE_MAP).map(([id, { name }]) => (
                  <MenuItem key={id} value={id}>{name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Field type={contentType} showDividers={contentType === 'startups'} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="outlined"
              size="small"
              sx={{ color: '#65558F', borderColor: '#65558F', fontFamily: 'Raleway', mr: 2 }}
              onClick={() => {
                setVisitedEvents([]);
                localStorage.removeItem('visitedEvents');
              }}
            >
              Сбросить посещённые мероприятия
            </Button>
          </Box>
        </Box>
      </Box>

      <CrisisDialog
        open={crisisDialogOpen}
        onClose={() => setCrisisDialogOpen(false)}
        onSolutionSelect={handleCrisisSolution}
        title={currentCrisis?.title || ''}
        description={currentCrisis?.description || ''}
        solutions={currentCrisis?.solutions || []}
      />

      <EndTurnDialog
        open={isEndTurnDialogOpen}
        onClose={() => setIsEndTurnDialogOpen(false)}
      />

      {/* Диалог статистики после посещения мероприятия */}
      <StatsDialog
        open={statsDialogOpen}
        onClose={() => setStatsDialogOpen(false)}
        type={statsTab}
        data={userStats as UserStats}
        previousData={prevStats}
        loading={false}
        sessionData={{
          stepCount: 0,
          monthId: 0,
          stepsLeft: 5,
          money: (userStats as UserStats).money?.total || 0,
          reputation: (userStats as UserStats).reputation || 0,
          expertise: Object.values((userStats as UserStats).expertise || {}).reduce((sum: number, value: number) => sum + value, 0)
        }}
      />
    </Box>
  );
};

export default FirstMonthPage; 