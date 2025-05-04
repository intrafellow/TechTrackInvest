import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider
} from '@mui/material';
import { conferenceAPI, userAPI, sessionAPI } from '../api/apiClient';

interface Event {
  id: number;
  name: string;
  description: string;
  price: number;
  nicheId: string;
  gainedReputation?: number;
  expertiseChanges?: { nicheId: string; change: number }[];
}

interface EventsListProps {
  events: Event[];
  onVisit?: (eventId: number) => void;
  visitedEvents?: number[];
}

const EventDialog: React.FC<{ 
  open: boolean; 
  onClose: () => void; 
  event: Event;
  onAttend: () => void;
  loading: boolean;
  success: boolean;
  visited: boolean;
}> = ({ open, onClose, event, onAttend, loading, success, visited }) => {
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
            fontFamily: '"Lettersano Full", sans-serif',
            color: '#1D1B20',
            fontSize: { xs: '2vh', sm: '2.5vh', md: '3vh' },
            textAlign: 'center'
          }}
        >
          {event.name}
        </Typography>
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
          {event.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2vh' }}>
          <Button
            onClick={onAttend}
            disabled={loading || success || visited}
            sx={{
              backgroundColor: visited || success ? '#E6E0E9' : '#E8DEF8',
              color: '#4A4459',
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: visited || success ? '#E6E0E9' : '#D0BCFF'
              },
              '&.Mui-disabled': {
                backgroundColor: '#E6E0E9',
                color: '#49454F'
              }
            }}
          >
            {visited || success ? 'Посещено' : loading ? (
              <CircularProgress size={24} sx={{ color: '#4A4459' }} />
            ) : (
              `Посетить за ${event.price} ₽`
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const EventCard: React.FC<{ event: Event; onVisit?: (eventId: number) => void; visited?: boolean; }> = ({ event, onVisit, visited }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(event);

  const handleAttend = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await conferenceAPI.attend(event.id);
      if (response.success) {
        setSuccess(true);
        setDialogOpen(false);
        onVisit?.(event.id);
        
        // Обновляем данные события из ответа API
        setCurrentEvent(prev => ({
          ...prev,
          gainedReputation: response.content.gainedReputation,
          expertiseChanges: response.content.expertiseChanges
        }));
        
        // Получаем текущие данные о деньгах
        const moneyData = await userAPI.getMoney();
        
        // Отправляем событие об обновлении баланса
        window.dispatchEvent(new CustomEvent('balanceUpdate', { 
          detail: {
            cash: moneyData.cash,
            investment: moneyData.investment,
            total: moneyData.total
          }
        }));

        // Создаем объект с изменениями экспертизы
        const expertiseChanges = response.content.expertiseChanges.reduce((acc: { [key: string]: number }, change: { nicheId: string; change: number }) => {
          acc[change.nicheId] = change.change;
          return acc;
        }, {});

        // Отправляем событие об обновлении характеристик
        window.dispatchEvent(new CustomEvent('statsUpdate', { 
          detail: {
            reputation: response.content.gainedReputation,
            expertise: expertiseChanges,
            stepsLeft: response.stepsLeft
          }
        }));

        console.log('Обновление характеристик:', {
          reputation: response.content.gainedReputation,
          expertise: expertiseChanges,
          stepsLeft: response.stepsLeft
        });
      } else {
        setError(response.errorMessage || 'Не удалось посетить конференцию');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Произошла ошибка при посещении конференции');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card
        onClick={() => setDialogOpen(true)}
        sx={{
          width: '100%',
          maxWidth: 400,
          backgroundColor: visited || success ? '#B0BEC5' : '#737EB5',
          color: '#F6F7FF',
          borderRadius: '12px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          transition: 'transform 0.2s',
          cursor: visited || success ? 'not-allowed' : 'pointer',
          opacity: visited || success ? 0.7 : 1,
          '&:hover': {
            transform: visited || success ? 'none' : 'translateY(-4px)'
          }
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontFamily: '"Lettersano Full", sans-serif',
              fontWeight: 600,
              marginBottom: 2
            }}
          >
            {currentEvent.name}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'Raleway',
              marginBottom: 2
            }}
          >
            {currentEvent.description}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Raleway',
              fontWeight: 600,
              color: '#4caf50'
            }}
          >
            Стоимость: {currentEvent.price} ₽
          </Typography>
        </CardContent>
      </Card>
      <EventDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        event={currentEvent}
        onAttend={handleAttend}
        loading={loading}
        success={success}
        visited={visited || false}
      />
      {error && (
        <Alert severity="error" sx={{ margin: 2 }}>
          {error}
        </Alert>
      )}
    </>
  );
};

const EventsList: React.FC<EventsListProps> = ({ events, onVisit, visitedEvents }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
        gap: 3,
        padding: 3
      }}
    >
      {events.map((event) => (
        <EventCard key={event.id} event={event} onVisit={onVisit} visited={visitedEvents?.includes(event.id)} />
      ))}
    </Box>
  );
};

export default EventsList;
