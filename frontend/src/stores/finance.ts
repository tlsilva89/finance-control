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

interface FinanceState {
  incomes: Income[];
  loading: boolean;
}

export const useFinanceStore = defineStore("finance", {
  state: (): FinanceState => ({
    incomes: [],
    loading: false,
  }),

  getters: {
    totalIncome: (state) =>
      state.incomes.reduce((sum, income) => sum + income.amount, 0),
  },

  actions: {
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
  },
});
