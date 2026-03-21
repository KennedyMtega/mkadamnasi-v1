import { getAnonymousId } from './utils';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || '';

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const anonymousId = getAnonymousId();
  if (anonymousId) {
    headers['x-anonymous-id'] = anonymousId;
  }

  return headers;
}

async function handleResponse(response: Response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Tatizo la seva');
  }
  return data;
}

export const api = {
  // Votes
  async getVotes(params?: Record<string, string>) {
    const searchParams = new URLSearchParams(params);
    const res = await fetch(`${BASE_URL}/api/votes?${searchParams}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getVote(id: string) {
    const res = await fetch(`${BASE_URL}/api/votes/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async createVote(data: {
    title: string;
    description?: string;
    type: string;
    categoryId: string;
    region?: string;
    options: string[];
    isAnonymous: boolean;
    duration: string;
  }) {
    const res = await fetch(`${BASE_URL}/api/votes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async castVote(voteId: string, optionId: string) {
    const res = await fetch(`${BASE_URL}/api/votes/${voteId}/cast`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ optionId }),
    });
    return handleResponse(res);
  },

  // Ratings
  async getRatings(params?: Record<string, string>) {
    const searchParams = new URLSearchParams(params);
    const res = await fetch(`${BASE_URL}/api/ratings?${searchParams}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getRating(id: string) {
    const res = await fetch(`${BASE_URL}/api/ratings/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async createRating(data: {
    title: string;
    description?: string;
    categoryId: string;
    entityName: string;
    entityType?: string;
    region?: string;
    isAnonymous: boolean;
  }) {
    const res = await fetch(`${BASE_URL}/api/ratings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async submitRating(ratingId: string, score: number, review?: string) {
    const res = await fetch(`${BASE_URL}/api/ratings/${ratingId}/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ score, review }),
    });
    return handleResponse(res);
  },

  // Categories
  async getCategories() {
    const res = await fetch(`${BASE_URL}/api/categories`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // User Profile
  async getUserProfile() {
    const res = await fetch(`${BASE_URL}/api/users`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async updateUserProfile(data: {
    username?: string;
    bio?: string;
    region?: string;
    language?: string;
  }) {
    const res = await fetch(`${BASE_URL}/api/users`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async getUserStats() {
    const res = await fetch(`${BASE_URL}/api/users/stats`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Search
  async search(params: {
    q: string;
    type?: 'vote' | 'rating' | 'all';
    categoryId?: string;
    region?: string;
    limit?: number;
    offset?: number;
  }) {
    const searchParams = new URLSearchParams();
    searchParams.set('q', params.q);
    if (params.type) searchParams.set('type', params.type);
    if (params.categoryId) searchParams.set('categoryId', params.categoryId);
    if (params.region) searchParams.set('region', params.region);
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.offset) searchParams.set('offset', String(params.offset));

    const res = await fetch(`${BASE_URL}/api/search?${searchParams}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Notifications
  async getNotifications(params?: Record<string, string>) {
    const searchParams = new URLSearchParams(params);
    const res = await fetch(`${BASE_URL}/api/notifications?${searchParams}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async markNotificationsRead(ids: string[]) {
    const res = await fetch(`${BASE_URL}/api/notifications`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ ids }),
    });
    return handleResponse(res);
  },

  async markAllNotificationsRead() {
    const res = await fetch(`${BASE_URL}/api/notifications`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ all: true }),
    });
    return handleResponse(res);
  },

  // Activity
  async getActivity(params?: {
    type?: string;
    limit?: number;
    offset?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.set('type', params.type);
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.offset) searchParams.set('offset', String(params.offset));

    const res = await fetch(`${BASE_URL}/api/activity?${searchParams}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
