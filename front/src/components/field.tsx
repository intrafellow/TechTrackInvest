import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import VerticalCard from './available_card';
import BoughtCard from './bought_card';
import EventsList from './event';
import { startupsAPI, conferenceAPI } from '../api/apiClient';

interface Startup {
  id: string;
  name: string;
  description: string;
  price: number;
  nicheId: string;
}

interface Event {
  id: number;
  name: string;
  description: string;
  price: number;
  nicheId: string;
}

interface FieldProps {
  type: 'startups' | 'events';
  showDividers?: boolean;
}

const Field: React.FC<FieldProps> = ({ type, showDividers = true }) => {
  const [selected, setSelected] = useState<string>('');
  const [startups, setStartups] = useState<Startup[]>([]);
  const [boughtStartups, setBoughtStartups] = useState<Startup[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStartups = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await startupsAPI.getAll();
      const filteredStartups = selected ? data.availableStartups.filter((startup: Startup) => startup.nicheId === selected) : data.availableStartups;
      setStartups(filteredStartups);
      setBoughtStartups(data.purchasedStartups);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Произошла ошибка при загрузке стартапов');
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await conferenceAPI.getAll();
      const filteredEvents = selected ? data.filter((event: Event) => event.nicheId === selected) : data;
      setEvents(filteredEvents);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Произошла ошибка при загрузке мероприятий');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (type === 'startups') {
      loadStartups();
    } else {
      loadEvents();
    }
  }, [selected, type]);

  const handleChange = (event: any) => {
    setSelected(event.target.value);
  };

  return (
    <Box>
      <FormControl fullWidth sx={{ marginBottom: 3 }}>
        <Select
          value={selected}
          onChange={handleChange}
          displayEmpty
          sx={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            '& .MuiSelect-select': {
              fontFamily: 'Raleway',
              color: '#000000'
            }
          }}
        >
          <MenuItem value="">
            <em>Все отрасли</em>
          </MenuItem>
          <MenuItem value="it">IT</MenuItem>
          <MenuItem value="medtech">MedTech</MenuItem>
          <MenuItem value="greentech">GreenTech</MenuItem>
          <MenuItem value="spacetech">SpaceTech</MenuItem>
        </Select>
      </FormControl>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress sx={{ color: '#737EB5' }} />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : type === 'startups' ? (
        <>
          {showDividers && (
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
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                  gap: 2,
                  marginBottom: '4vh'
                }}
              >
                {boughtStartups.map((startup) => (
                  <BoughtCard
                    key={startup.id}
                    title={startup.name}
                    subtitle={startup.nicheId}
                    resourceId={startup.id}
                  />
                ))}
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  marginBottom: '1vh', 
                  marginTop: { xs: '2vh', sm: '3vh', md: '4vh' },
                  color: '#E3E6FF',
                  fontSize: { xs: '1.8vh', sm: '2vh', md: '2.2vh' }
                }}
              >
                Доступные стартапы
              </Typography>
              <Divider sx={{ backgroundColor: '#CAC4D0', marginBottom: '2vh' }} />
            </>
          )}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 3fr' },
              gap: 3
            }}
          >
            {startups.map((startup) => (
              <VerticalCard
                key={startup.id}
                title={startup.name}
                subtitle={startup.nicheId}
                description={startup.description}
                resourceId={startup.id}
                startupId={startup.id}
                price={startup.price}
                onDealStart={() => {}}
                onDealEnd={() => {}}
              />
            ))}
          </Box>
        </>
      ) : (
        <EventsList events={events} />
      )}
    </Box>
  );
};

export default Field;