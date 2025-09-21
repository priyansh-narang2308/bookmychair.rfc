import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://bookmychair-rfc-1.onrender.com";

export const getPopularChairs = async (token: string) => {
  const res = await axios.get(`${API_URL}/analytics/popular-chairs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getPeakHours = async (token: string) => {
  const res = await axios.get(`${API_URL}/analytics/peak-hours`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};