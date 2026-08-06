import api from "../../../services/axios";

export const login = (data) =>
  api.post("/auth/login", data);

export const forgotPassword = (data) =>
  api.post("/auth/forgot-password", data);