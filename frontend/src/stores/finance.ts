import { defineStore } from "pinia";
import api from "../services/api";
import { useNotification } from "../composables/useNotification";
import { useDateReferenceStore } from "./dateReference";

export interface Income {
  id: string;
  description: string;
  amount: number;
  date: string;
  monthReference: string;
  createdAt: string;
}

export interface CreditCard {
  id: string;
  name: string;
  limit: number;
  currentDebt: number;
  dueDate: number;
  monthReference: string;
  createdAt: string;
}

export interface CreditCardExpense {
  id: string;
  description: string;
  amount: number;
  installmentAmount: number;
  purchaseDate: string;
  installments: number;
  currentInstallment: number;
  category: string;
  isPaid: boolean;
  creditCardId: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  renewalDate: string;
  category: string;
  monthReference: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  amount: number;
  dueDate: number;
  category: string;
  monthReference: string;
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
    currentMonthIncomes(): Income[] {
      const dateStore = useDateReferenceStore();
      return this.incomes.filter(
        (income) => income.monthReference === dateStore.monthYearString
      );
    },

    currentMonthCreditCards(): CreditCard[] {
      const dateStore = useDateReferenceStore();
      return this.creditCards.filter(
        (card) => card.monthReference === dateStore.monthYearString
      );
    },

    currentMonthSubscriptions(): Subscription[] {
      const dateStore = useDateReferenceStore();
      return this.subscriptions.filter(
        (sub) => sub.monthReference === dateStore.monthYearString
      );
    },

    currentMonthServices(): Service[] {
      const dateStore = useDateReferenceStore();
      return this.services.filter(
        (service) => service.monthReference === dateStore.monthYearString
      );
    },

    totalIncome(): number {
      return this.currentMonthIncomes.reduce(
        (sum, income) => sum + income.amount,
        0
      );
    },

    totalCreditCardDebt(): number {
      return this.currentMonthCreditCards.reduce(
        (sum, card) => sum + card.currentDebt,
        0
      );
    },

    totalCreditCardLimit(): number {
      return this.currentMonthCreditCards.reduce(
        (sum, card) => sum + card.limit,
        0
      );
    },

    totalSubscriptions(): number {
      return this.currentMonthSubscriptions.reduce(
        (sum, sub) => sum + sub.amount,
        0
      );
    },

    totalServices(): number {
      return this.currentMonthServices.reduce(
        (sum, service) => sum + service.amount,
        0
      );
    },

    monthlyExpenses(): number {
      return this.totalSubscriptions + this.totalServices;
    },

    balance(): number {
      return this.totalIncome - this.monthlyExpenses - this.totalCreditCardDebt;
    },

    availableCreditLimit(): number {
      return this.totalCreditCardLimit - this.totalCreditCardDebt;
    },
  },

  actions: {
    async fetchAllData() {
      const dateStore = useDateReferenceStore();
      this.loading = true;
      try {
        await Promise.all([
          this.fetchIncomes(dateStore.monthYearString),
          this.fetchCreditCards(dateStore.monthYearString),
          this.fetchSubscriptions(dateStore.monthYearString),
          this.fetchServices(dateStore.monthYearString),
        ]);
      } finally {
        this.loading = false;
      }
    },

    async fetchIncomes(monthReference?: string) {
      const dateStore = useDateReferenceStore();
      const month = monthReference || dateStore.monthYearString;
      this.loading = true;
      try {
        console.log("Buscando entradas para o mês:", month);
        const response = await api.get(`/api/incomes?monthReference=${month}`);
        this.incomes = this.incomes.filter(
          (income) => income.monthReference !== month
        );
        this.incomes.push(...response.data);
        console.log("Entradas carregadas:", response.data);
      } catch (error) {
        console.error("Erro ao buscar entradas:", error);
        const { error: showError } = useNotification();
        showError("Erro ao carregar entradas");
      } finally {
        this.loading = false;
      }
    },

    async addIncome(
      income: Omit<Income, "id" | "createdAt" | "monthReference">
    ) {
      const { success, error } = useNotification();
      const dateStore = useDateReferenceStore();
      try {
        console.log("Adicionando entrada:", income);
        const incomeWithMonth = {
          ...income,
          monthReference: dateStore.monthYearString,
        };
        const response = await api.post("/api/incomes", incomeWithMonth);
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

    async fetchCreditCards(monthReference?: string) {
      const dateStore = useDateReferenceStore();
      const month = monthReference || dateStore.monthYearString;
      this.loading = true;
      try {
        console.log("Buscando cartões para o mês:", month);
        const response = await api.get(
          `/api/credit-cards?monthReference=${month}`
        );
        this.creditCards = this.creditCards.filter(
          (card) => card.monthReference !== month
        );
        this.creditCards.push(...response.data);
        console.log("Cartões carregados:", response.data);
      } catch (error) {
        console.error("Erro ao buscar cartões:", error);
        const { error: showError } = useNotification();
        showError("Erro ao carregar cartões");
      } finally {
        this.loading = false;
      }
    },

    async addCreditCard(
      creditCard: Omit<CreditCard, "id" | "createdAt" | "monthReference">
    ) {
      const { success, error } = useNotification();
      const dateStore = useDateReferenceStore();
      try {
        console.log("Adicionando cartão:", creditCard);
        const cardWithMonth = {
          ...creditCard,
          monthReference: dateStore.monthYearString,
        };
        const response = await api.post("/api/credit-cards", cardWithMonth);
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

    async fetchExpensesByCard(
      cardId: string,
      monthReference?: string
    ): Promise<CreditCardExpense[]> {
      try {
        const params = new URLSearchParams();
        if (monthReference) {
          params.append("monthReference", monthReference);
        }
        const response = await api.get(
          `/api/credit-card-expenses/card/${cardId}?${params.toString()}`
        );
        return response.data;
      } catch (error) {
        console.error("Erro ao buscar gastos do cartão:", error);
        throw error;
      }
    },

    async addExpense(
      expense: Omit<
        CreditCardExpense,
        "id" | "createdAt" | "installmentAmount" | "currentInstallment"
      >
    ) {
      try {
        const response = await api.post("/api/credit-card-expenses", expense);
        return response.data;
      } catch (error) {
        console.error("Erro ao adicionar gasto:", error);
        throw error;
      }
    },

    async addExpenseWithInstallments(expense: {
      description: string;
      amount: number;
      installmentAmount: number;
      purchaseDate: string;
      installments: number;
      category: string;
      creditCardId: string;
    }) {
      const { success, error } = useNotification();
      try {
        const response = await api.post(
          "/api/credit-card-expenses/with-installments",
          expense
        );
        success(
          `${expense.installments} parcela(s) adicionada(s) com sucesso!`
        );
        return response.data;
      } catch (err: any) {
        console.error("Erro ao adicionar gastos parcelados:", err);
        error("Erro ao adicionar gastos parcelados");
        throw err;
      }
    },

    async addExistingExpenseWithInstallments(expense: {
      description: string;
      originalPurchaseDate: string;
      totalAmount: number;
      installmentAmount: number;
      totalInstallments: number;
      currentInstallment: number;
      category: string;
      creditCardId: string;
    }) {
      const { success, error } = useNotification();
      try {
        const response = await api.post(
          "/api/credit-card-expenses/existing-with-installments",
          expense
        );
        const remainingInstallments =
          expense.totalInstallments - expense.currentInstallment + 1;
        success(
          `${remainingInstallments} parcela(s) restante(s) adicionada(s) com sucesso!`
        );
        return response.data;
      } catch (err: any) {
        console.error("Erro ao adicionar compra existente:", err);
        error("Erro ao adicionar compra existente");
        throw err;
      }
    },

    async updateExpense(id: string, expense: Partial<CreditCardExpense>) {
      try {
        const response = await api.put(
          `/api/credit-card-expenses/${id}`,
          expense
        );
        return response.data;
      } catch (error) {
        console.error("Erro ao atualizar gasto:", error);
        throw error;
      }
    },

    async deleteExpense(id: string) {
      try {
        await api.delete(`/api/credit-card-expenses/${id}`);
      } catch (error) {
        console.error("Erro ao deletar gasto:", error);
        throw error;
      }
    },

    async toggleExpensePaid(id: string) {
      try {
        const response = await api.patch(`/api/credit-card-expenses/${id}/pay`);
        return response.data;
      } catch (error) {
        console.error("Erro ao alterar status do gasto:", error);
        throw error;
      }
    },

    async fetchSubscriptions(monthReference?: string) {
      const dateStore = useDateReferenceStore();
      const month = monthReference || dateStore.monthYearString;
      this.loading = true;
      try {
        console.log("Buscando assinaturas para o mês:", month);
        const response = await api.get(
          `/api/subscriptions?monthReference=${month}`
        );
        this.subscriptions = this.subscriptions.filter(
          (sub) => sub.monthReference !== month
        );
        this.subscriptions.push(...response.data);
        console.log("Assinaturas carregadas:", response.data);
      } catch (error) {
        console.error("Erro ao buscar assinaturas:", error);
        const { error: showError } = useNotification();
        showError("Erro ao carregar assinaturas");
      } finally {
        this.loading = false;
      }
    },

    async addSubscription(
      subscription: Omit<Subscription, "id" | "createdAt" | "monthReference">
    ) {
      const { success, error } = useNotification();
      const dateStore = useDateReferenceStore();
      try {
        console.log("Adicionando assinatura:", subscription);
        const subWithMonth = {
          ...subscription,
          monthReference: dateStore.monthYearString,
        };
        const response = await api.post("/api/subscriptions", subWithMonth);
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

    async fetchServices(monthReference?: string) {
      const dateStore = useDateReferenceStore();
      const month = monthReference || dateStore.monthYearString;
      this.loading = true;
      try {
        console.log("Buscando serviços para o mês:", month);
        const response = await api.get(`/api/services?monthReference=${month}`);
        this.services = this.services.filter(
          (service) => service.monthReference !== month
        );
        this.services.push(...response.data);
        console.log("Serviços carregados:", response.data);
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
        const { error: showError } = useNotification();
        showError("Erro ao carregar serviços");
      } finally {
        this.loading = false;
      }
    },

    async addService(
      service: Omit<Service, "id" | "createdAt" | "monthReference">
    ) {
      const { success, error } = useNotification();
      const dateStore = useDateReferenceStore();
      try {
        console.log("Adicionando serviço:", service);
        const serviceWithMonth = {
          ...service,
          monthReference: dateStore.monthYearString,
        };
        const response = await api.post("/api/services", serviceWithMonth);
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
