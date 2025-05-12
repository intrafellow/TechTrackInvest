import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем интерцептор для автоматического добавления токена
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/api/v1/login', { email, password });
    return response.data;
  },

  register: async (email: string, username: string, password: string) => {
    const response = await apiClient.post('/api/v1/user/registration', { email, username, password });
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await apiClient.post('/api/v1/auth/forgot-password', null, { params: { email } });
    return response.data;
  },

  resetPassword: async (email: string, newPassword: string) => {
    const response = await apiClient.post('/api/v1/auth/reset-password', { email, newPassword });
    return response.data;
  },

  validateToken: async (email: string, token: string) => {
    const response = await apiClient.post('/api/v1/auth/validate-token', null, { params: { email, token } });
    return response.data;
  }
};

export const userAPI = {
  getReputation: async () => {
    const response = await apiClient.get('/api/v1/user/reputation');
    return response.data;
  },

  getMoney: async () => {
    const response = await apiClient.get('/api/v1/user/money');
    return response.data;
  },

  getExpertise: async () => {
    const response = await apiClient.get('/api/v1/user/expertise');
    return response.data;
  },

  updateUsername: async (username: string) => {
    const response = await apiClient.put('/api/v1/user/username', { username });
    return response.data;
  },

  updateEmail: async (email: string) => {
    const response = await apiClient.put('/api/v1/user/email', { email });
    return response.data;
  },

  validateEmailToken: async (email: string, token: string) => {
    const response = await apiClient.post('/api/v1/user/email/validate', { email, token });
    return response.data;
  },

  updatePassword: async (newPassword: string) => {
    const response = await apiClient.put('/api/v1/user/password', { newPassword });
    return response.data;
  },

  getStats: async () => {
    const response = await apiClient.get('/api/v1/user/stats');
    return response.data;
  }
};

export const startupsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/api/v1/startups');
    return response.data;
  },

  getByNiche: async (nicheId: string) => {
    const response = await apiClient.get(`/api/v1/startups/niche/${nicheId}`);
    return response.data;
  },

  getExpertise: async (resourceId: string, price: number) => {
    const response = await apiClient.get(`/api/v1/startups/${resourceId}/expertise/${price}`);
    return response.data;
  },

  getStatistics: async (startupResourceId: string) => {
    const response = await apiClient.get(`/api/v1/startups/statistics/${startupResourceId}`);
    return response.data;
  },

  buy: async (resourceId: string, finalPrice: number, teamEffect: number, reputationEffect: number) => {
    const requestData = {
      resourceId: resourceId,
      finalPrice: finalPrice,
      teamEffect: teamEffect,
      reputationEffect: reputationEffect
    };

    console.log('Sending buy request with data:', JSON.stringify(requestData, null, 2));
    
    try {
      const response = await apiClient.post('/api/v1/startups/buy', requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Buy response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Buy request failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
          headers: error.config?.headers
        },
        stack: error.stack
      });
      throw error;
    }
  },

  sell: async (startupResourceId: string) => {
    const response = await apiClient.get(`/api/v1/startups/sell/${startupResourceId}`);
    return response.data;
  }
};

export const conferenceAPI = {
  getAll: async () => {
    const response = await apiClient.get('/api/v1/conference');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/api/v1/conference/${id}`);
    return response.data;
  },

  attend: async (conferenceId: number) => {
    const response = await apiClient.post(`/api/v1/conference/${conferenceId}/attend`);
    return response.data;
  },

  getByNiche: async (nicheId: string) => {
    const response = await apiClient.get(`/api/v1/conference/niche/${nicheId}`);
    return response.data;
  },

  getConferences: async () => {
    const response = await apiClient.get('/api/v1/conference');
    return response.data;
  },

  getConferenceStats: async (conferenceId: number) => {
    const response = await apiClient.get(`/api/v1/conference/${conferenceId}/stats`);
    return response.data;
  }
};

export const contractAPI = {
  getContract: async (startupId: string) => {
    const response = await apiClient.get(`/api/v1/contract/${startupId}`);
    return response.data;
  },

  getFinalCondition: async (contractId: string, minPrice: number, maxPrice: number, userOfferedPrice: number): Promise<any> => {
    console.log('Making final condition request with params:', {
      contractId,
      minPrice,
      maxPrice,
      userOfferedPrice
    });
    const response = await apiClient.post('/api/v1/contract/finalCondition', {
      contractId,
      minPrice,
      maxPrice,
      userOfferedPrice
    });
    return response.data;
  }
};

export const crisisAPI = {
  getCrisis: async () => {
    try {
      const response = await apiClient.get('/api/v1/crisis');
      return response.data;
    } catch (error) {
      console.error('Error getting crisis:', error);
      throw error;
    }
  },

  submitSolution: async (solutionId: string) => {
    try {
      const response = await apiClient.post(`/api/v1/crisis/solution/${solutionId}`);
      return response.data;
    } catch (error) {
      console.error('Error submitting solution:', error);
      throw error;
    }
  }
};

export const sessionAPI = {
  start: async () => {
    const response = await apiClient.get('/api/v1/session/start');
    return response.data;
  },

  finish: async () => {
    const response = await apiClient.get('/api/v1/session/finish');
    return response.data;
  },

  endMonth: async () => {
    const response = await apiClient.get('/api/v1/month/finish');
    return response.data;
  },

  getCurrentSession: async () => {
    try {
      const response = await apiClient.get('/api/v1/session/current');
      return response.data;
    } catch (error) {
      console.error('Error getting current session:', error);
      throw error;
    }
  }
};

export const imageAPI = {
  getImage: async (imageId: string) => {
    const response = await apiClient.get(`/api/v1/images/${imageId}`, {
      responseType: 'blob'
    });
    return URL.createObjectURL(response.data);
  }
};

export const gameAPI = {
  nextMonth: async () => {
    try {
      const response = await fetch(`${BASE_URL}/game/next-month`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to proceed to next month');
      }

      return await response.json();
    } catch (error) {
      console.error('Error proceeding to next month:', error);
      throw error;
    }
  },
};

export const monthAPI = {
  getStepCount: async () => {
    const response = await apiClient.get('/api/v1/month/stepCount');
    return response.data;
  },
  getMonthCount: async () => {
    const response = await apiClient.get('/api/v1/month/monthCount');
    return response.data;
  },
  endMonth: async () => {
    const response = await apiClient.get('/api/v1/month/finish');
    return response.data;
  }
}; 