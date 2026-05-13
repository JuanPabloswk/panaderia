const raw = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const API_BASE_URL = String(raw).replace(/\/$/, '');
