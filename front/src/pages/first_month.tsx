import React, { useState, useEffect } from 'react';
import { Box, Divider, Typography, FormControl, Select, MenuItem, useMediaQuery, useTheme, CircularProgress, Button, Tabs, Tab } from '@mui/material';
import Header from '../components/header';
import LeftMenu from '../components/left_menu';
import VerticalCard from '../components/available_card';
import BoughtCard from '../components/bought_card';
import MobileSlider from '../components/mobile_slider';
import EventsList from '../components/event';
import { startupsAPI, conferenceAPI, crisisAPI, userAPI } from '../api/apiClient';
import { useLocation, useNavigate } from 'react-router-dom';
import EndTurnDialog from '../components/end_turn_dialog';
import CrisisDialog from '../components/crisis_dialog';
import StatsDialog from '../components/stats_dialog';
import TutorialDialog from '../components/TutorialDialog';

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
  nicheId: string;
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

interface CrisisEffect {
  priceDelta: number;
  expensesDelta: number;
  teamDelta: number;
  productDelta: number;
  reputationDelta: number;
}

interface CrisisSolution {
  id: string;
  title: string;
  description: string;
  effect: CrisisEffect;
}

interface Crisis {
  id: string;
  name: string;
  description: string;
  nichesId: string[];
  possibleSolutions: CrisisSolution[];
}

interface Stats {
  price: number;
  expenses: number;
  team: number;
  product: number;
  reputation: number;
}

interface Session {
  stats: Stats;
  // ... другие поля сессии
}

const FirstMonthPage: React.FC = () => {
  // Обработчики сделок
  const handleDealStart = () => {
    setIsDealInProgress(true);
  };

  const handleDealEnd = () => {
    setIsDealInProgress(false);
    if (hasCrisisThisMonth) {
      checkForCrisis();
    }
  };

  // Функция для проверки появления кризиса
  const checkForCrisis = async () => {
    console.log('Проверка кризиса:', { isDealInProgress, hasCrisisThisMonth, currentCrisis });
    // Кризис не может появиться во время сделки и если он уже есть
    if (!isDealInProgress && hasCrisisThisMonth && !currentCrisis) {
      // 50% шанс появления кризиса
      const willHaveCrisis = Math.random() < 0.5;
      console.log('Шанс кризиса:', willHaveCrisis);
      
      if (willHaveCrisis) {
        try {
          console.log('Запрос кризиса у API');
          const crisisData = await crisisAPI.getCrisis();
          console.log('Получен кризис:', crisisData);
          setCurrentCrisis(crisisData);
          setCrisisDialogOpen(true);
        } catch (error) {
          console.log('API недоступен, используем демо-режим');
          // В демо-режиме используем тестовый кризис
          setCurrentCrisis({
            id: "crisis-1",
            name: "Solar Panel Shortage",
            description: "Shortage in raw materials impacts solar panel production.",
            nichesId: ["niche-1"],
            possibleSolutions: [
              {
                id: "solution-1",
                title: "Government Grant",
                description: "Get support from the government to mitigate crisis impact.",
                effect: {
                  priceDelta: -500,
                  expensesDelta: -200,
                  teamDelta: -1,
                  productDelta: 3,
                  reputationDelta: 10
                }
              },
              {
                id: "solution-2",
                title: "Alternative Materials",
                description: "Switch to alternative materials for production.",
                effect: {
                  priceDelta: -300,
                  expensesDelta: -100,
                  teamDelta: 0,
                  productDelta: 2,
                  reputationDelta: 5
                }
              },
              {
                id: "solution-3",
                title: "Price Increase",
                description: "Increase prices to cover additional costs.",
                effect: {
                  priceDelta: 200,
                  expensesDelta: 0,
                  teamDelta: 0,
                  productDelta: 0,
                  reputationDelta: -5
                }
              }
            ]
          });
          setCrisisDialogOpen(true);
        }
      } else {
        // Если кризиса нет, сбрасываем флаг
        setHasCrisisThisMonth(false);
      }
    }
  };

  // Состояния
  const location = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>('');
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
  const [currentCrisis, setCurrentCrisis] = useState<Crisis | null>(() => {
    const saved = localStorage.getItem('currentCrisis');
    return saved ? JSON.parse(saved) : null;
  });
  const [isDealInProgress, setIsDealInProgress] = useState(false);
  const [hasCrisisThisMonth, setHasCrisisThisMonth] = useState(() => {
    const saved = localStorage.getItem('hasCrisisThisMonth');
    return saved ? JSON.parse(saved) : false;
  });
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
  const [showTutorial, setShowTutorial] = useState(false);

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
      nicheId: 'IT',
      purchased: false
    },
    {
      id: 'startup-2',
      name: 'EcoEnergy Solutions',
      description: 'Инновационные решения для возобновляемой энергетики',
      price: 1500000,
      categoryName: 'GreenTech',
      nicheId: 'GreenTech',
      purchased: false
    }
  ];

  useEffect(() => {
    // Проверяем, был ли переход к следующему месяцу
    if (location.state?.monthChanged) {
      if (location.state?.isDemo) {
        setCurrentMonth(location.state.currentMonth ?? 1);
      } else {
        setCurrentMonth(location.state.currentMonth ?? (currentMonth + 1));
      }
      // Очищаем состояние после обработки
      navigate(location.pathname, { replace: true, state: { ...location.state, monthChanged: false } });
    }
  }, [location.state]);

  // Сохраняем текущий месяц в localStorage
  useEffect(() => {
    localStorage.setItem('currentMonth', JSON.stringify(currentMonth));
  }, [currentMonth]);

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
          nicheId: s.nicheId || s.categoryName,
          purchased: true
        }));

        available = available.map((s: any) => ({
          id: s.resourceId,
          name: s.name,
          description: s.description,
          price: 1000000, // Установим стандартную цену
          categoryName: s.categoryName,
          nicheId: s.nicheId || s.categoryName,
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
                nicheId: demo.nicheId || demo.categoryName,
                purchased: true
              }
            ];
          }
        }

        // Обновляем месяц из API, если он есть в ответе
        if (data.currentMonth !== undefined) {
          setCurrentMonth(data.currentMonth);
          localStorage.setItem('currentMonth', JSON.stringify(data.currentMonth));
        }

        setBoughtStartups(bought);
        setAvailableStartups(available);
        const eventsDataRaw = await conferenceAPI.getAll();
        const eventsData = eventsDataRaw.map((e: any) => ({
          ...e,
          nicheId: e.nicheId || e.categoryName || e.category || '',
        }));
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
              nicheId: demo.nicheId || demo.categoryName,
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
      console.log('Переход к новому месяцу');
      // Сбрасываем текущий кризис
      setCurrentCrisis(null);
      // Всегда устанавливаем кризис в новом месяце
      setHasCrisisThisMonth(true);
      // Проверяем кризис сразу
      checkForCrisis();
      
      // Очищаем состояние после обработки
      navigate(location.pathname, { replace: true, state: { ...location.state, monthChanged: false } });
      setSelected(''); // Сбросить фильтр на 'Все стартапы/мероприятия'
    }
  }, [location.state?.monthChanged]);

  // Проверяем кризис при загрузке страницы, если он должен быть
  useEffect(() => {
    if (hasCrisisThisMonth && !currentCrisis && !location.state?.monthChanged) {
      checkForCrisis();
    }
  }, []);

  // Проверяем кризис при каждом действии, но не во время сделки
  useEffect(() => {
    if (!isDealInProgress && hasCrisisThisMonth) {
      checkForCrisis();
    }
  }, [contentType, selected, hasCrisisThisMonth]);

  // Фильтрация по selected
  const filteredBought = boughtStartups.filter(s => selected === '' || s.nicheId === selected);
  const filteredAvailable = availableStartups.filter(s => selected === '' || s.nicheId === selected);

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

  const handleCrisisSolution = async (solutionId: string): Promise<void> => {
    try {
      const response = await crisisAPI.submitSolution(solutionId);
      if (response.success) {
        // Обновляем статистику на основе эффектов выбранного решения
        const selectedSolution = currentCrisis?.possibleSolutions.find((s: CrisisSolution) => s.id === solutionId);
        if (selectedSolution) {
          const { effect } = selectedSolution;
          
          // Обновляем текущие значения
          setUserStats((prev: UserStats) => ({
            ...prev,
            money: {
              ...prev.money,
              cash: Math.max(0, prev.money.cash + effect.priceDelta),
              total: Math.max(0, prev.money.total + effect.priceDelta)
            },
            reputation: Math.max(0, prev.reputation + effect.reputationDelta)
          }));
        }
      }
    } catch (error: unknown) {
      console.error('Ошибка при отправке решения:', error);
    } finally {
      setCurrentCrisis(null);
      setCrisisDialogOpen(false);
      setHasCrisisThisMonth(false);
    }
  };

  const handleVisitEvent = async (eventId: number) => {
    const event = (events.length > 0 ? events : demoEvents).find((e: Event) => e.id === eventId);
    if (!event) return;
    
    try {
      // Получаем текущие данные экспертизы из API
      const expertiseData = await userAPI.getExpertise();
      
      // Сохраняем текущие значения как предыдущие
      setPrevStats({
        ...userStats,
        expertise: expertiseData.map || {}
      });
      
      // Обновляем статистику с правильными названиями ниш
      setUserStats((prev: any) => {
        const updated = {
          ...prev,
          expertise: expertiseData.map || {}
        };
        localStorage.setItem('userStats', JSON.stringify(updated));
        return updated;
      });
      
      setVisitedEvents((prev: number[]) => {
        const updated = [...prev, eventId];
        localStorage.setItem('visitedEvents', JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error('Ошибка при получении данных экспертизы:', error);
    }
  };

  useEffect(() => {
    if (pendingStatsDialog) {
      setStatsDialogOpen(true);
      setPendingStatsDialog(false);
    }
  }, [userStats, pendingStatsDialog]);

  // Сохраняем состояние кризиса в localStorage
  useEffect(() => {
    localStorage.setItem('hasCrisisThisMonth', JSON.stringify(hasCrisisThisMonth));
  }, [hasCrisisThisMonth]);

  useEffect(() => {
    localStorage.setItem('currentCrisis', JSON.stringify(currentCrisis));
  }, [currentCrisis]);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  // Добавляю функцию для загрузки мероприятий по selected
  const loadEvents = async () => {
    setLoading(true);
    try {
      let eventsDataRaw;
      if (selected === '') {
        eventsDataRaw = await conferenceAPI.getAll();
      } else {
        eventsDataRaw = await conferenceAPI.getByNiche(selected);
      }
      const eventsData = eventsDataRaw.map((e: any) => ({
        ...e,
        nicheId: e.nicheId || e.categoryName || e.category || '',
      }));
      setEvents(eventsData);
    } catch (error) {
      setEvents([]);
      setError('Ошибка при загрузке мероприятий');
    } finally {
      setLoading(false);
    }
  };

  // useEffect для загрузки мероприятий при изменении selected и contentType
  useEffect(() => {
    if (contentType === 'events') {
      loadEvents();
    }
    // ... возможно, другие зависимости
  }, [selected, contentType]);

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
      const filteredEvents = (events.length > 0 ? events : demoEvents)
        .filter(e => !visitedEvents.includes(e.id))
        .filter(e => selected === '' || e.nicheId === selected);

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
                    return (
                      <Typography style={{ display: "flex", justifyContent: "center" }} sx={{ color: '#413545' }}>
                        {contentType === 'events' ? 'Все мероприятия' : 'Все стартапы'}
                      </Typography>
                    );
                  }
                  return NICHE_MAP[value]?.name || '';
                }}
              >
                <MenuItem value="">{contentType === 'events' ? 'Все мероприятия' : 'Все стартапы'}</MenuItem>
                {Object.entries(NICHE_MAP).map(([id, { name }]) => (
                  <MenuItem key={id} value={id}>{name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Field type={contentType} showDividers={contentType === 'startups'} />

        </Box>
      </Box>

      <CrisisDialog
        open={crisisDialogOpen}
        onClose={() => setCrisisDialogOpen(false)}
        onSolutionSelect={handleCrisisSolution}
        title={currentCrisis?.name || ''}
        description={currentCrisis?.description || ''}
        solutions={currentCrisis?.possibleSolutions || []}
      />

      <EndTurnDialog
        open={isEndTurnDialogOpen}
        onClose={() => setIsEndTurnDialogOpen(false)}
        currentMonth={currentMonth}
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

      {showTutorial && (
        <TutorialDialog onClose={() => setShowTutorial(false)} />
      )}
    </Box>
  );
};

export default FirstMonthPage; 