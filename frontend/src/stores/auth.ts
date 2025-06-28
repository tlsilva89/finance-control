import { defineStore } from "pinia";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: false,
  }),

  actions: {
    async login(email: string, password: string) {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });
      const { user, token } = response.data;

      this.user = user;
      this.token = token;
      this.isAuthenticated = true;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },

    async register(name: string, email: string, password: string) {
      const response = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });
      const { user, token } = response.data;

      this.user = user;
      this.token = token;
      this.isAuthenticated = true;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;

      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    },
  },
});
