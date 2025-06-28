import { defineStore } from "pinia";
import api from "../services/api";
import { useNotification } from "../composables/useNotification";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token"),
    loading: false,
  }),

  actions: {
    async login(email: string, password: string) {
      const { success, error } = useNotification();
      this.loading = true;

      try {
        console.log("Fazendo login...");
        const response = await api.post("/api/auth/login", {
          email,
          password,
        });
        const { user, token } = response.data;

        this.user = user;
        this.token = token;
        this.isAuthenticated = true;

        localStorage.setItem("token", token);

        success(`Bem-vindo, ${user.name}!`);
        console.log("Login realizado com sucesso:", user);
      } catch (err: any) {
        console.error("Erro no login:", err);
        const message = err.response?.data?.error || "Erro ao fazer login";
        error(message);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async register(name: string, email: string, password: string) {
      const { success, error } = useNotification();
      this.loading = true;

      try {
        console.log("Registrando usuário...");
        const response = await api.post("/api/auth/register", {
          name,
          email,
          password,
        });
        const { user, token } = response.data;

        this.user = user;
        this.token = token;
        this.isAuthenticated = true;

        localStorage.setItem("token", token);

        success(`Conta criada com sucesso! Bem-vindo, ${user.name}!`);
        console.log("Registro realizado com sucesso:", user);
      } catch (err: any) {
        console.error("Erro no registro:", err);
        const message = err.response?.data?.error || "Erro ao criar conta";
        error(message);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      const { info } = useNotification();

      this.user = null;
      this.token = null;
      this.isAuthenticated = false;

      localStorage.removeItem("token");

      info("Você foi desconectado");
    },
  },
});
