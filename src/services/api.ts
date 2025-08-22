const API_BASE_URL = 'https://api.spixer.fr';

// Types for new API structure
export interface FavoriteSport {
  id: string;
  label: string;
}

export interface UserRegistration {
  registration_id: string;
  registration_type?: string;
  registration_status?: string;
  registration_date?: string;
  stage: {
    stage_id: string;
    stage_name?: string;
    stage_description?: string;
    category_label?: string;
    event: {
      event_id: string;
      event_name?: string;
      event_start?: string;
      event_city?: string;
      event_country?: string;
    };
  };
  ranking: {
    ranking_id: string;
    rank_position?: number;
    bib_number?: string;
    ranking_date?: string;
    records: Array<{
      ocr_label?: string;
      face_signature?: string;
      latitude?: number;
      longitude?: number;
      captured_at?: string;
    }>;
  };
}

export interface ProfileUser {
  user_id: string;
  email: string;
  username: string;
  user_created_at: string;
  name: string; // Merged field containing first_name + last_name
  bio?: string;
  avatar_url?: string;
  birthdate?: string;
  location?: string;
  is_premium?: boolean;
  registrations: UserRegistration[];
  favorite_sports: FavoriteSport[];
  events: Event[];
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  email_verified: boolean;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export interface RegisterResponse {
  message: string;
  user: AuthUser;
}

export interface ProfileResponse {
  user: ProfileUser[];
  favorite_sports: FavoriteSport[];
}

// Legacy interfaces for backward compatibility
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  user_informations?: UserInformations;
  registrations?: Registration[];
  rankings?: Ranking[];
  favorite_sport?: {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
  };
}

export interface Event {
  id: string;
  name: string;
  description: string;
  label?: string;
  start_time: string;
  registration_end_time?: string | null;
  postal_code: string;
  address?: string;
  city: string;
  region?: string | null;
  country: string;
  oneplan_path?: string | null;
  is_draft?: number;
  cancel_reason?: string | null;
  organiser_id?: string;
  organiser_email?: string;
  PMR?: number;
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
    const errorData = await response.json().catch(() => ({}));
    // Handle new error structure: { "error": { "message": "<reason>" } }
    const errorMessage = errorData.error?.message || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return response.json();
};

// Authentication API
export const authAPI = {
  register: async (email: string, username: string, password: string): Promise<RegisterResponse> => {
    return apiCall('/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
    });
  },

  login: async (identifier: string, password: string): Promise<AuthResponse> => {
    return apiCall('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
  },

  logout: async (): Promise<{ message: string }> => {
    return apiCall('/v1/auth/logout', {
      method: 'POST',
    });
  },

  getProfile: async (): Promise<ProfileResponse> => {
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
    // Workaround: API individual event endpoint has UUID format issues
    // Fetch all events and find the specific one
    const allEvents = await eventsAPI.list();
    const event = allEvents.find(e => e.id === id);
    if (!event) {
      throw new Error('Event not found');
    }
    return event;
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
    try {
      const response = await apiCall(`/v1/events/${eventId}/stages`);
      return response.stages || [];
    } catch (error) {
      // API endpoint may have UUID format issues, return empty array for now
      console.warn(`Could not fetch stages for event ${eventId}:`, error);
      return [];
    }
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

  create: async (registration: { stage_id: string; type: string }): Promise<{ message: string; registration_id: string }> => {
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
  create: async (informations: {
    first_name?: string;
    last_name?: string;
    bio?: string;
    avatar_url?: string;
    birthdate?: string;
    location?: string;
    is_premium_member?: boolean;
    favorite_categories?: number[];
  }): Promise<{ message: string }> => {
    return apiCall('/v1/user/informations', {
      method: 'POST',
      body: JSON.stringify(informations),
    });
  },

  update: async (informations: {
    first_name?: string;
    last_name?: string;
    bio?: string;
    avatar_url?: string;
    birthdate?: string;
    location?: string;
    is_premium_member?: boolean;
    favorite_categories?: number[];
    phone?: string;
  }): Promise<{ message: string }> => {
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