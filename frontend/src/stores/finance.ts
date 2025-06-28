import { defineStore } from "pinia";
import api from "../services/api";
import { useNotification } from "../composables/useNotification";

interface Income {
  id: string;
  description: string;
  amount: number;
  date: string;
  createdAt: string;
}

interface CreditCard {
  id: string;
  name: string;
  limit: number;
  currentDebt: number;
  dueDate: number;
  createdAt: string;
}

interface Subscription {
  id: string;
  name: string;
  amount: number;
  renewalDate: string;
  category: string;
  createdAt: string;
}

interface Service {
  id: string;
  name: string;
  amount: number;
  dueDate: number;
  category: string;
  createdAt: string;
}

interface FinanceState {
  incomes: Income[];
  creditCards: CreditCard[];
  subscriptions: Subscription[];
  services: Service[];
  loading: boolean;
}

export const useFinanceStore = defineStore("finance", {
  state: (): FinanceState => ({
    incomes: [],
    creditCards: [],
    subscriptions: [],
    services: [],
    loading: false,
  }),

  getters: {
    totalIncome: (state) =>
      state.incomes.reduce((sum, income) => sum + income.amount, 0),

    totalCreditCardDebt: (state) =>
      state.creditCards.reduce((sum, card) => sum + card.currentDebt, 0),

    totalCreditCardLimit: (state) =>
      state.creditCards.reduce((sum, card) => sum + card.limit, 0),

    totalSubscriptions: (state) =>
      state.subscriptions.reduce((sum, sub) => sum + sub.amount, 0),

    totalServices: (state) =>
      state.services.reduce((sum, service) => sum + service.amount, 0),

    monthlyExpenses: (state) => {
      const subscriptions = state.subscriptions.reduce(
        (sum, sub) => sum + sub.amount,
        0
      );
      const services = state.services.reduce(
        (sum, service) => sum + service.amount,
        0
      );
      return subscriptions + services;
    },

    balance(): number {
      return this.totalIncome - this.monthlyExpenses - this.totalCreditCardDebt;
    },

    availableCreditLimit(): number {
      return this.totalCreditCardLimit - this.totalCreditCardDebt;
    },
  },

  actions: {
    // ========== MÉTODOS GERAIS ==========
    async fetchAllData() {
      this.loading = true;
      try {
        await Promise.all([
          this.fetchIncomes(),
          this.fetchCreditCards(),
          this.fetchSubscriptions(),
          this.fetchServices(),
        ]);
      } finally {
        this.loading = false;
      }
    },

    // ========== MÉTODOS DE INCOME ==========
    async fetchIncomes() {
      this.loading = true;
      try {
        console.log("Buscando entradas...");
        const response = await api.get("/api/incomes");
        this.incomes = response.data;
        console.log("Entradas carregadas:", this.incomes);
      } catch (error) {
        console.error("Erro ao buscar entradas:", error);
        const { error: showError } = useNotification();
        showError("Erro ao carregar entradas");
      } finally {
        this.loading = false;
      }
    },

    async addIncome(income: Omit<Income, "id" | "createdAt">) {
      const { success, error } = useNotification();
      try {
        console.log("Adicionando entrada:", income);
        const response = await api.post("/api/incomes", income);
        this.incomes.unshift(response.data);
        success("Entrada adicionada com sucesso!");
        console.log("Entrada adicionada:", response.data);
      } catch (err: any) {
        console.error("Erro ao adicionar entrada:", err);
        error("Erro ao adicionar entrada");
        throw err;
      }
    },

    async updateIncome(id: string, income: Partial<Income>) {
      const { success, error } = useNotification();
      try {
        console.log("Atualizando entrada:", id, income);
        const response = await api.put(`/api/incomes/${id}`, income);
        const index = this.incomes.findIndex((i) => i.id === id);
        if (index !== -1) {
          this.incomes[index] = response.data;
        }
        success("Entrada atualizada com sucesso!");
        console.log("Entrada atualizada:", response.data);
      } catch (err: any) {
        console.error("Erro ao atualizar entrada:", err);
        error("Erro ao atualizar entrada");
        throw err;
      }
    },

    async deleteIncome(id: string) {
      const { success, error } = useNotification();
      try {
        console.log("Deletando entrada:", id);
        await api.delete(`/api/incomes/${id}`);
        this.incomes = this.incomes.filter((i) => i.id !== id);
        success("Entrada removida com sucesso!");
        console.log("Entrada removida:", id);
      } catch (err: any) {
        console.error("Erro ao remover entrada:", err);
        error("Erro ao remover entrada");
        throw err;
      }
    },

    // ========== MÉTODOS DE CREDIT CARDS ==========
    async fetchCreditCards() {
      this.loading = true;
      try {
        console.log("Buscando cartões...");
        const response = await api.get("/api/credit-cards");
        this.creditCards = response.data;
        console.log("Cartões carregados:", this.creditCards);
      } catch (error) {
        console.error("Erro ao buscar cartões:", error);
        const { error: showError } = useNotification();
        showError("Erro ao carregar cartões");
      } finally {
        this.loading = false;
      }
    },

    async addCreditCard(creditCard: Omit<CreditCard, "id" | "createdAt">) {
      const { success, error } = useNotification();
      try {
        console.log("Adicionando cartão:", creditCard);
        const response = await api.post("/api/credit-cards", creditCard);
        this.creditCards.unshift(response.data);
        success("Cartão adicionado com sucesso!");
        console.log("Cartão adicionado:", response.data);
      } catch (err: any) {
        console.error("Erro ao adicionar cartão:", err);
        error("Erro ao adicionar cartão");
        throw err;
      }
    },

    async updateCreditCard(id: string, creditCard: Partial<CreditCard>) {
      const { success, error } = useNotification();
      try {
        console.log("Atualizando cartão:", id, creditCard);
        const response = await api.put(`/api/credit-cards/${id}`, creditCard);
        const index = this.creditCards.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.creditCards[index] = response.data;
        }
        success("Cartão atualizado com sucesso!");
        console.log("Cartão atualizado:", response.data);
      } catch (err: any) {
        console.error("Erro ao atualizar cartão:", err);
        error("Erro ao atualizar cartão");
        throw err;
      }
    },

    async deleteCreditCard(id: string) {
      const { success, error } = useNotification();
      try {
        console.log("Deletando cartão:", id);
        await api.delete(`/api/credit-cards/${id}`);
        this.creditCards = this.creditCards.filter((c) => c.id !== id);
        success("Cartão removido com sucesso!");
        console.log("Cartão removido:", id);
      } catch (err: any) {
        console.error("Erro ao remover cartão:", err);
        error("Erro ao remover cartão");
        throw err;
      }
    },

    // ========== MÉTODOS DE SUBSCRIPTIONS ==========
    async fetchSubscriptions() {
      this.loading = true;
      try {
        console.log("Buscando assinaturas...");
        const response = await api.get("/api/subscriptions");
        this.subscriptions = response.data;
        console.log("Assinaturas carregadas:", this.subscriptions);
      } catch (error) {
        console.error("Erro ao buscar assinaturas:", error);
        const { error: showError } = useNotification();
        showError("Erro ao carregar assinaturas");
      } finally {
        this.loading = false;
      }
    },

    async addSubscription(
      subscription: Omit<Subscription, "id" | "createdAt">
    ) {
      const { success, error } = useNotification();
      try {
        console.log("Adicionando assinatura:", subscription);
        const response = await api.post("/api/subscriptions", subscription);
        this.subscriptions.unshift(response.data);
        success("Assinatura adicionada com sucesso!");
        console.log("Assinatura adicionada:", response.data);
      } catch (err: any) {
        console.error("Erro ao adicionar assinatura:", err);
        error("Erro ao adicionar assinatura");
        throw err;
      }
    },

    async updateSubscription(id: string, subscription: Partial<Subscription>) {
      const { success, error } = useNotification();
      try {
        console.log("Atualizando assinatura:", id, subscription);
        const response = await api.put(
          `/api/subscriptions/${id}`,
          subscription
        );
        const index = this.subscriptions.findIndex((s) => s.id === id);
        if (index !== -1) {
          this.subscriptions[index] = response.data;
        }
        success("Assinatura atualizada com sucesso!");
        console.log("Assinatura atualizada:", response.data);
      } catch (err: any) {
        console.error("Erro ao atualizar assinatura:", err);
        error("Erro ao atualizar assinatura");
        throw err;
      }
    },

    async deleteSubscription(id: string) {
      const { success, error } = useNotification();
      try {
        console.log("Deletando assinatura:", id);
        await api.delete(`/api/subscriptions/${id}`);
        this.subscriptions = this.subscriptions.filter((s) => s.id !== id);
        success("Assinatura removida com sucesso!");
        console.log("Assinatura removida:", id);
      } catch (err: any) {
        console.error("Erro ao remover assinatura:", err);
        error("Erro ao remover assinatura");
        throw err;
      }
    },

    // ========== MÉTODOS DE SERVICES ==========
    async fetchServices() {
      this.loading = true;
      try {
        console.log("Buscando serviços...");
        const response = await api.get("/api/services");
        this.services = response.data;
        console.log("Serviços carregados:", this.services);
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
        const { error: showError } = useNotification();
        showError("Erro ao carregar serviços");
      } finally {
        this.loading = false;
      }
    },

    async addService(service: Omit<Service, "id" | "createdAt">) {
      const { success, error } = useNotification();
      try {
        console.log("Adicionando serviço:", service);
        const response = await api.post("/api/services", service);
        this.services.unshift(response.data);
        success("Serviço adicionado com sucesso!");
        console.log("Serviço adicionado:", response.data);
      } catch (err: any) {
        console.error("Erro ao adicionar serviço:", err);
        error("Erro ao adicionar serviço");
        throw err;
      }
    },

    async updateService(id: string, service: Partial<Service>) {
      const { success, error } = useNotification();
      try {
        console.log("Atualizando serviço:", id, service);
        const response = await api.put(`/api/services/${id}`, service);
        const index = this.services.findIndex((s) => s.id === id);
        if (index !== -1) {
          this.services[index] = response.data;
        }
        success("Serviço atualizado com sucesso!");
        console.log("Serviço atualizado:", response.data);
      } catch (err: any) {
        console.error("Erro ao atualizar serviço:", err);
        error("Erro ao atualizar serviço");
        throw err;
      }
    },

    async deleteService(id: string) {
      const { success, error } = useNotification();
      try {
        console.log("Deletando serviço:", id);
        await api.delete(`/api/services/${id}`);
        this.services = this.services.filter((s) => s.id !== id);
        success("Serviço removido com sucesso!");
        console.log("Serviço removido:", id);
      } catch (err: any) {
        console.error("Erro ao remover serviço:", err);
        error("Erro ao remover serviço");
        throw err;
      }
    },
  },
});
