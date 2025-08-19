const API_BASE_URL = 'https://api.spixer.fr';

// Types
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  start_time: string;
  postal_code: number;
  city: string;
  country: string;
  created_at: string;
  updated_at: string;
}

export interface Stage {
  id: string;
  event_id: string;
  name: string;
  description: string;
  max_participants: number;
  created_at: string;
  updated_at: string;
}

export interface Registration {
  id: string;
  stage_id: string;
  user_id: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface Ranking {
  id: string;
  stage_id: string;
  user_id: string;
  rank_position: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface UserInformations {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  birth_date?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentIntent {
  client_secret: string;
  amount: number;
  currency: string;
}

export interface RankingRecord {
  id: string;
  ranking_id: string;
  face_signature?: string;
  ocr_label?: string;
  latitude?: number;
  longitude?: number;
  source?: string;
  created_at: string;
  updated_at: string;
}

// Auth helpers
export const getAuthToken = (): string | null => {
  return localStorage.getItem('spixer_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('spixer_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('spixer_token');
};

// API helper function
const apiCall = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

// Authentication API
export const authAPI = {
  register: async (email: string, username: string, password: string): Promise<{ user: User; token: string }> => {
    return apiCall('/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
    });
  },

  login: async (identifier: string, password: string): Promise<{ user: User; token: string }> => {
    return apiCall('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
  },

  logout: async (): Promise<void> => {
    return apiCall('/v1/auth/logout', {
      method: 'POST',
    });
  },

  getProfile: async (): Promise<User> => {
    return apiCall('/v1/auth/me');
  },
};

// Events API
export const eventsAPI = {
  list: async (): Promise<Event[]> => {
    const response = await apiCall('/v1/events');
    return response.events || [];
  },

  get: async (id: string): Promise<Event> => {
    return apiCall(`/v1/events/${id}`);
  },

  create: async (event: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event> => {
    return apiCall('/v1/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  },

  update: async (id: string, event: Partial<Event>): Promise<Event> => {
    return apiCall(`/v1/events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(event),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiCall(`/v1/events/${id}`, {
      method: 'DELETE',
    });
  },
};

// Stages API
export const stagesAPI = {
  list: async (): Promise<Stage[]> => {
    return apiCall('/v1/stages');
  },

  get: async (id: string): Promise<Stage> => {
    return apiCall(`/v1/stages/${id}`);
  },

  getByEvent: async (eventId: string): Promise<Stage[]> => {
    const response = await apiCall(`/v1/events/${eventId}/stages`);
    return response.stages || [];
  },

  create: async (stage: Omit<Stage, 'id' | 'created_at' | 'updated_at'>): Promise<Stage> => {
    return apiCall('/v1/stages', {
      method: 'POST',
      body: JSON.stringify(stage),
    });
  },

  update: async (id: string, stage: Partial<Stage>): Promise<Stage> => {
    return apiCall(`/v1/stages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(stage),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiCall(`/v1/stages/${id}`, {
      method: 'DELETE',
    });
  },
};

// Registrations API
export const registrationsAPI = {
  list: async (): Promise<Registration[]> => {
    return apiCall('/v1/registrations');
  },

  get: async (id: string): Promise<Registration> => {
    return apiCall(`/v1/registrations/${id}`);
  },

  getByStage: async (stageId: string): Promise<Registration[]> => {
    return apiCall(`/v1/stages/${stageId}/registrations`);
  },

  create: async (registration: Omit<Registration, 'id' | 'created_at' | 'updated_at'>): Promise<Registration> => {
    return apiCall('/v1/registrations', {
      method: 'POST',
      body: JSON.stringify(registration),
    });
  },

  update: async (id: string, registration: Partial<Registration>): Promise<Registration> => {
    return apiCall(`/v1/registrations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(registration),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiCall(`/v1/registrations/${id}`, {
      method: 'DELETE',
    });
  },
};

// Rankings API
export const rankingsAPI = {
  list: async (): Promise<Ranking[]> => {
    return apiCall('/v1/rankings');
  },

  get: async (id: string): Promise<Ranking> => {
    return apiCall(`/v1/rankings/${id}`);
  },

  getByStage: async (stageId: string): Promise<Ranking[]> => {
    return apiCall(`/v1/stages/${stageId}/rankings`);
  },

  create: async (ranking: Omit<Ranking, 'id' | 'created_at' | 'updated_at'>): Promise<Ranking> => {
    return apiCall('/v1/rankings', {
      method: 'POST',
      body: JSON.stringify(ranking),
    });
  },

  update: async (id: string, ranking: Partial<Ranking>): Promise<Ranking> => {
    return apiCall(`/v1/rankings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(ranking),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiCall(`/v1/rankings/${id}`, {
      method: 'DELETE',
    });
  },

  getRecords: async (rankingId: string): Promise<RankingRecord[]> => {
    return apiCall(`/v1/rankings/${rankingId}/records`);
  },

  createRecord: async (rankingId: string, record: Omit<RankingRecord, 'id' | 'ranking_id' | 'created_at' | 'updated_at'>): Promise<RankingRecord> => {
    return apiCall(`/v1/rankings/${rankingId}/records`, {
      method: 'POST',
      body: JSON.stringify(record),
    });
  },
};

// Categories API
export const categoriesAPI = {
  list: async (): Promise<Category[]> => {
    return apiCall('/v1/categories');
  },

  get: async (id: string): Promise<Category> => {
    return apiCall(`/v1/categories/${id}`);
  },

  create: async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> => {
    return apiCall('/v1/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  },

  update: async (id: string, category: Partial<Category>): Promise<Category> => {
    return apiCall(`/v1/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(category),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiCall(`/v1/categories/${id}`, {
      method: 'DELETE',
    });
  },
};

// User Informations API
export const userInformationsAPI = {
  get: async (): Promise<UserInformations> => {
    return apiCall('/v1/user/informations');
  },

  create: async (informations: Omit<UserInformations, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<UserInformations> => {
    return apiCall('/v1/user/informations', {
      method: 'POST',
      body: JSON.stringify(informations),
    });
  },

  update: async (informations: Partial<Omit<UserInformations, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<UserInformations> => {
    return apiCall('/v1/user/informations', {
      method: 'PUT',
      body: JSON.stringify(informations),
    });
  },
};

// Payments API
export const paymentsAPI = {
  createIntent: async (amount: number, currency: string = 'eur'): Promise<PaymentIntent> => {
    return apiCall('/v1/payments/intent', {
      method: 'POST',
      body: JSON.stringify({ amount, currency }),
    });
  },

  webhook: async (payload: any, signature: string): Promise<void> => {
    return apiCall('/v1/payments/webhook', {
      method: 'POST',
      headers: {
        'Stripe-Signature': signature,
      },
      body: JSON.stringify(payload),
    });
  },
};

// Health check
export const healthCheck = async (): Promise<{ message: string; version: string }> => {
  return apiCall('/');
};