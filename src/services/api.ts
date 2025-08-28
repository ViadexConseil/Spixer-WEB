const API_BASE_URL = 'https://api.spixer.fr';

// ============= UPDATED API TYPES TO MATCH DOCUMENTATION =============

export interface FavoriteSport {
  id: number;
  label: string;
}

export interface EventSummary {
  event_id: string;
  event_name: string;
  start_time: string;
  end_time?: string;
  city: string;
  country: string;
}

export interface StageSummary {
  stage_id: string;
  stage_name: string;
  stage_description?: string;
  stage_start: string;
  stage_end: string;
  stage_registration_end: string;
  category_label: string;
  event: EventSummary;
}

export interface RankingSummary {
  ranking_id: string;
  rank_position: number;
  bib_number: string;
}

export interface UserRegistration {
  registration_id: string;
  registration_type: string;
  registration_status: string;
  registration_date: string;
  stage: StageSummary;
  ranking?: RankingSummary;
}

export interface ProfileUser {
  user_id: string;
  email: string;
  username: string;
  user_created_at: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  bio?: string;
  avatar_url?: string;
  birthdate?: string;
  location?: string;
  is_premium_member: boolean;
  registrations: UserRegistration[];
  favorite_sports: FavoriteSport[];
  events: EventSummary[];
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
}

export interface Event {
  id: string;
  name: string;
  description: string;
  start_time: string;
  end_time?: string;
  city: string;
  country: string;
  organiser_email: string;
  // Additional fields for backward compatibility
  registration_end_time?: string | null;
  is_draft?: number;
  cancel_reason?: string | null;
  postal_code?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Stage {
  id: string;
  event_id: string;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  registration_end_time: string;
  category_label: string;
  // Additional fields for backward compatibility
  max_participants?: number;
}

export interface Registration {
  id: string;
  user_id: string;
  stage_id: string;
  type: string;
  status: string;
  created_at: string;
  user_email: string;
  stage_name: string;
  event_name: string;
}

export interface Ranking {
  id: string;
  stage_id: string;
  user_id: string;
  rank_position: number;
  user_email: string;
  stage_name: string;
  event_name: string;
}

export interface Category {
  id: number;
  label: string;
}

export interface Club {
  id: string;
  federation_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  federation_name: string;
}

export interface ClubMember {
  id: string;
  username: string;
  role: string;
}

export interface GuestProfile {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  birthdate: string;
}

export interface UserInformations {
  first_name?: string;
  last_name?: string;
  bio?: string;
  avatar_url?: string;
  birthdate?: string;
  location?: string;
  is_premium_member?: boolean;
  favorite_categories?: number[];
  phone?: string;
}

export interface PaymentIntent {
  client_secret: string;
}

export interface RankingRecord {
  id: string;
  ranking_id: string;
  face_signature?: string;
  ocr_label?: string;
  latitude?: number;
  longitude?: number;
  source?: string;
  captured_at: string;
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
    // Handle API error structure: { "error": { "message": "<reason>" } }
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
    const response = await apiCall(`/v1/events/${id}`);
    return response.event;
  },

  create: async (eventData: {
    name: string;
    description: string;
    start_time: string;
    end_time?: string;
    postal_code: string;
    city?: string;
    club_id?: string;
  }): Promise<{ message: string; event_id: string }> => {
    return apiCall('/v1/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  update: async (id: string, eventData: {
    name?: string;
    description?: string;
    start_time?: string;
    end_time?: string;
  }): Promise<{ message: string }> => {
    return apiCall(`/v1/events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(eventData),
    });
  },

  delete: async (id: string): Promise<{ message: string }> => {
    return apiCall(`/v1/events/${id}`, {
      method: 'DELETE',
    });
  },
};

// Stages API
export const stagesAPI = {
  list: async (): Promise<Stage[]> => {
    const response = await apiCall('/v1/stages');
    return response.stages || [];
  },

  get: async (id: string): Promise<Stage> => {
    const response = await apiCall(`/v1/stages/${id}`);
    return response.stage;
  },

  getByEvent: async (eventId: string): Promise<Stage[]> => {
    const response = await apiCall(`/v1/events/${eventId}/stages`);
    return response.stages || [];
  },

  create: async (stageData: {
    event_id: string;
    name: string;
    description: string;
    start_time: string;
    end_time: string;
    registration_end_time: string;
    max_participants?: number;
    min_age?: number;
  }): Promise<{ message: string; stage_id: string }> => {
    return apiCall('/v1/stages', {
      method: 'POST',
      body: JSON.stringify(stageData),
    });
  },

  update: async (id: string, stageData: {
    name?: string;
    description?: string;
    start_time?: string;
    end_time?: string;
    registration_end_time?: string;
    min_age?: number;
  }): Promise<{ message: string }> => {
    return apiCall(`/v1/stages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(stageData),
    });
  },

  delete: async (id: string): Promise<{ message: string }> => {
    return apiCall(`/v1/stages/${id}`, {
      method: 'DELETE',
    });
  },
};

// Registrations API
export const registrationsAPI = {
  list: async (): Promise<Registration[]> => {
    const response = await apiCall('/v1/registrations');
    return response.registrations || [];
  },

  get: async (id: string): Promise<Registration> => {
    const response = await apiCall(`/v1/registrations/${id}`);
    return response.registration;
  },

  getByStage: async (stageId: string): Promise<Registration[]> => {
    const response = await apiCall(`/v1/stages/${stageId}/registrations`);
    return response.registrations || [];
  },

  create: async (registrationData: { 
    stage_id: string; 
    type: string;
    registrant_user_id?: string; 
  }): Promise<{ message: string; registration_id: string }> => {
    return apiCall('/v1/registrations', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  },

  update: async (id: string, registrationData: { 
    status?: string;
    type?: string; 
  }): Promise<{ message: string }> => {
    return apiCall(`/v1/registrations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(registrationData),
    });
  },

  delete: async (id: string): Promise<{ message: string }> => {
    return apiCall(`/v1/registrations/${id}`, {
      method: 'DELETE',
    });
  },
};

// Rankings API
export const rankingsAPI = {
  list: async (): Promise<Ranking[]> => {
    const response = await apiCall('/v1/rankings');
    return response.rankings || [];
  },

  get: async (id: string): Promise<Ranking> => {
    const response = await apiCall(`/v1/rankings/${id}`);
    return response.ranking;
  },

  getByStage: async (stageId: string): Promise<Ranking[]> => {
    const response = await apiCall(`/v1/stages/${stageId}/rankings`);
    return response.rankings || [];
  },

  create: async (rankingData: {
    stage_id: string;
    user_id: string;
    rank_position: number;
  }): Promise<{ message: string; ranking_id: string }> => {
    return apiCall('/v1/rankings', {
      method: 'POST',
      body: JSON.stringify(rankingData),
    });
  },

  update: async (id: string, rankingData: {
    rank_position?: number;
  }): Promise<{ message: string }> => {
    return apiCall(`/v1/rankings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(rankingData),
    });
  },

  delete: async (id: string): Promise<{ message: string }> => {
    return apiCall(`/v1/rankings/${id}`, {
      method: 'DELETE',
    });
  },

  getRecords: async (rankingId: string): Promise<RankingRecord[]> => {
    const response = await apiCall(`/v1/rankings/${rankingId}/records`);
    return response.records || [];
  },
};

// Categories API
export const categoriesAPI = {
  list: async (): Promise<Category[]> => {
    const response = await apiCall('/v1/categories');
    return response.categories || [];
  },

  get: async (id: number): Promise<Category> => {
    const response = await apiCall(`/v1/categories/${id}`);
    return response.category;
  },

  create: async (categoryData: { label: string }): Promise<{ message: string; category_id: number }> => {
    return apiCall('/v1/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  update: async (id: number, categoryData: { label: string }): Promise<{ message: string }> => {
    return apiCall(`/v1/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(categoryData),
    });
  },

  delete: async (id: number): Promise<{ message: string }> => {
    return apiCall(`/v1/categories/${id}`, {
      method: 'DELETE',
    });
  },
};

// User Informations API
export const userInformationsAPI = {
  create: async (informations: UserInformations): Promise<{ message: string }> => {
    return apiCall('/v1/user/informations', {
      method: 'POST',
      body: JSON.stringify(informations),
    });
  },

  update: async (informations: UserInformations): Promise<{ message: string }> => {
    return apiCall('/v1/user/informations', {
      method: 'PUT',
      body: JSON.stringify(informations),
    });
  },
};

// Clubs API
export const clubsAPI = {
  list: async (): Promise<Club[]> => {
    const response = await apiCall('/v1/clubs');
    return response.clubs || [];
  },

  get: async (id: string): Promise<Club> => {
    const response = await apiCall(`/v1/clubs/${id}`);
    return response.club;
  },

  getMembers: async (id: string): Promise<ClubMember[]> => {
    const response = await apiCall(`/v1/clubs/${id}/members`);
    return response.members || [];
  },

  getEvents: async (id: string): Promise<Event[]> => {
    const response = await apiCall(`/v1/clubs/${id}/events`);
    return response.events || [];
  },
};

// Guest Profiles API
export const guestProfilesAPI = {
  create: async (guestData: {
    username: string;
    first_name: string;
    last_name: string;
    birthdate: string;
  }): Promise<{ message: string; guest_id: string }> => {
    return apiCall('/v1/profiles/guests', {
      method: 'POST',
      body: JSON.stringify(guestData),
    });
  },

  list: async (): Promise<GuestProfile[]> => {
    const response = await apiCall('/v1/profiles/guests');
    return response.guests || [];
  },

  initiateClaim: async (guestId: string, email: string): Promise<{ message: string }> => {
    return apiCall(`/v1/profiles/guests/${guestId}/initiate-claim`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  claim: async (token: string, password: string): Promise<{ message: string }> => {
    return apiCall('/v1/profiles/claim', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  },
};

// File Upload API
export const uploadAPI = {
  upload: async (file: File, type: 'gpx' | 'img'): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/v1/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || errorData.message || `Upload failed: ${response.status}`;
      throw new Error(errorMessage);
    }

    return response.json();
  },
};

// User Account Management API (Password & Email Change)
export const accountAPI = {
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    return apiCall('/v1/user/change-password', {
      method: 'POST',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });
  },

  requestEmailChange: async (newEmail: string): Promise<{ message: string }> => {
    return apiCall('/v1/user/request-email-change', {
      method: 'POST',
      body: JSON.stringify({ new_email: newEmail }),
    });
  },

  verifyEmailChange: async (token: string): Promise<{ message: string }> => {
    return apiCall('/v1/user/verify-email-change', {
      method: 'POST',
      body: JSON.stringify({ token }),
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

  webhook: async (payload: any): Promise<{ received: string }> => {
    return apiCall('/v1/payments/webhook', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

// Server-to-Server API (for automated processes)
export const serverAPI = {
  createRecord: async (recordData: {
    ranking_id: string;
    face_signature: string;
    ocr_label: string;
    latitude: number;
    longitude: number;
    source: string;
  }, apiKey: string): Promise<{ message: string; record_id: string }> => {
    const response = await fetch(`${API_BASE_URL}/v1/server/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify(recordData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `Server API call failed: ${response.status}`;
      throw new Error(errorMessage);
    }

    return response.json();
  },
};

// Health check
export const healthCheck = async (): Promise<{ message: string; version?: string }> => {
  return apiCall('/');
};