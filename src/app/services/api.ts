const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const api = {
  get: async (path: string) => {
    const res = await fetch(`${API_URL}/${path}`);
    if (!res.ok) throw new Error(`Failed to fetch ${path}`);
    return res.json();
  },
  post: async (path: string, data: any) => {
    const res = await fetch(`${API_URL}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to post to ${path}`);
    return res.json();
  },
  put: async (path: string, id: string, data: any) => {
    const res = await fetch(`${API_URL}/${path}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to put to ${path}`);
    return res.json();
  },
  delete: async (path: string, id: string) => {
    const res = await fetch(`${API_URL}/${path}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Failed to delete from ${path}`);
    return res.json();
  },
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  },
  login: async (credentials: any) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Login failed");
    }
    return res.json();
  },
  register: async (userData: any) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Registration failed");
    }
    return res.json();
  }
};
