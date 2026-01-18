export const API_URL = import.meta.env.VITE_API_URL;
;

export async function signup(name, email, password) {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export function getToken() {
  return localStorage.getItem('token');
}

export function getUser() {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export async function fetchSummaries() {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function sendAudio(formData) {
  const token = getToken();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120 * 1000); // 2 minutes
  try {
    const res = await fetch(`${API_URL}/api/summary`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errorData.message || `Server error: ${res.status}`);
    }
    return res.json();
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') {
      throw new Error('Request timeout: Server took too long to process audio');
    }
    throw err;
  }
}

export async function deleteSummary(summaryId) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/summary/${summaryId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
