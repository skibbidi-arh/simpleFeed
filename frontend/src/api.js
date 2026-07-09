/* ============================================================
   API Client — SimpleFeed
   Centralized fetch wrappers with JWT token injection.
   ============================================================ */

const TOKEN_KEY = 'simplefeed_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ---------- Auth ----------

export async function login(email, password) {
  const body = new URLSearchParams();
  body.append('username', email);
  body.append('password', password);

  const res = await fetch('/auth/jwt/login', {
    method: 'POST',
    body,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Invalid email or password');
  }

  const data = await res.json();
  setToken(data.access_token);
  return data;
}

export async function register(email, password) {
  const res = await fetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const msg =
      data.detail === 'REGISTER_USER_ALREADY_EXISTS'
        ? 'An account with this email already exists'
        : data.detail || 'Registration failed';
    throw new Error(msg);
  }

  return res.json();
}

// ---------- User ----------

export async function getMe() {
  const res = await fetch('/users/me', {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
}

// ---------- Feed ----------

export async function getFeed() {
  const res = await fetch('/feed', {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error('Failed to load feed');
  return res.json();
}

// ---------- Upload ----------

export async function uploadPost(file, caption) {
  const form = new FormData();
  form.append('file', file);
  form.append('caption', caption);

  const res = await fetch('/upload', {
    method: 'POST',
    headers: authHeaders(),
    body: form,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Upload failed');
  }

  return res.json();
}

// ---------- Delete ----------

export async function deletePost(postId) {
  const res = await fetch(`/posts/${postId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Delete failed');
  }

  return res.json();
}
