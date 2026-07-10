// Base URL of the Spring Boot / JDBC backend (see the understory-backend
// project). Override at build time with VITE_API_BASE in a .env file if you
// deploy the backend somewhere other than localhost:8080, e.g.:
//   VITE_API_BASE=https://api.yourdomain.com/api
export const API_BASE = import.meta.env.VITE_API_BASE

export async function apiRegister(username, email, password) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.data?.message || data.message || "Registration failed.");
  return data.data;
}
export async function apiLogin(username, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      password
    })
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data.data;
}
export async function getProfileRecord(username) {
  try {
    const res = await fetch(`${API_BASE}/users/${encodeURIComponent(username)}/profile`);
    if (!res.ok) return null;
    return await res.json(); // { likes, cart, profile }
  } catch {
    return null;
  }
}

export async function saveProfileRecord(username, data) {
  try {
    await fetch(`${API_BASE}/users/${encodeURIComponent(username)}/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: data.likes, cart: data.cart, profile: data.profile }),
    });
  } catch {
    // best-effort persistence; UI state is already updated optimistically
  }
}

export async function apiAdminListUsers(passcode) {
  const res = await fetch(`${API_BASE}/admin/users`, {
    headers: { "X-Admin-Passcode": passcode },
  });
  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error((data && data.error) || "Wrong passcode.");
  return data; // [{ username, likes, cart, profile }]
}
