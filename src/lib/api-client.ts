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
};
