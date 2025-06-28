import { defineStore } from "pinia";
import axios from "axios";
import { useToast } from "vue-toastification";

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
  },

  actions: {
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

    async fetchIncomes() {
      try {
        const response = await axios.get("/api/incomes");
        this.incomes = response.data;
      } catch (error) {
        console.error("Erro ao buscar entradas:", error);
      }
    },

    async addIncome(income: Omit<Income, "id" | "createdAt">) {
      const toast = useToast();
      try {
        const response = await axios.post("/api/incomes", income);
        this.incomes.push(response.data);
        toast.success("Entrada adicionada com sucesso!");
      } catch (error: any) {
        toast.error("Erro ao adicionar entrada");
        throw error;
      }
    },

    async updateIncome(id: string, income: Partial<Income>) {
      const toast = useToast();
      try {
        const response = await axios.put(`/api/incomes/${id}`, income);
        const index = this.incomes.findIndex((i) => i.id === id);
        if (index !== -1) {
          this.incomes[index] = response.data;
        }
        toast.success("Entrada atualizada com sucesso!");
      } catch (error: any) {
        toast.error("Erro ao atualizar entrada");
        throw error;
      }
    },

    async deleteIncome(id: string) {
      const toast = useToast();
      try {
        await axios.delete(`/api/incomes/${id}`);
        this.incomes = this.incomes.filter((i) => i.id !== id);
        toast.success("Entrada removida com sucesso!");
      } catch (error: any) {
        toast.error("Erro ao remover entrada");
        throw error;
      }
    },

    // Métodos similares para creditCards, subscriptions e services...
    async fetchCreditCards() {
      try {
        const response = await axios.get("/api/credit-cards");
        this.creditCards = response.data;
      } catch (error) {
        console.error("Erro ao buscar cartões:", error);
      }
    },

    async fetchSubscriptions() {
      try {
        const response = await axios.get("/api/subscriptions");
        this.subscriptions = response.data;
      } catch (error) {
        console.error("Erro ao buscar assinaturas:", error);
      }
    },

    async fetchServices() {
      try {
        const response = await axios.get("/api/services");
        this.services = response.data;
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
      }
    },
  },
});
