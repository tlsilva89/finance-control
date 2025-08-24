import { defineStore } from "pinia";
import api from "../services/api";
import { useNotification } from "../composables/useNotification";
import { useDateReferenceStore } from "./dateReference";
import { formatDateForAPI } from "../utils/dateUtils";

export interface User {
  id: string;
  username: string;
  name: string;
}

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
  totalConsumption: number;
  dueDate: number;
  closingDay: number;
  createdAt: string;
  expenses?: CreditCardExpense[];
}

export interface CreditCardExpense {
  id: string;
  description: string;
  amount: number;
  purchaseDate: string;
  installments: number;
  currentInstallment: number;
  installmentAmount: number;
  category: string;
  isPaid: boolean;
  creditCardId: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  dueDate: number;
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

export interface FinancialReport {
  startDate: string;
  endDate: string;
  totalIncomes: number;
  totalExpenses: number;
  balance: number;
  incomes: Income[];
  creditCardExpenses: CreditCardExpense[];
  subscriptions: Subscription[];
  services: Service[];
}

interface FinanceState {
  incomes: Income[];
  creditCards: CreditCard[];
  subscriptions: Subscription[];
  services: Service[];
  loading: boolean;
}

function normalizeMonthRef(ref: string): string {
  if (!ref) return new Date().toISOString().slice(0, 7);
  const [year, month] = ref.split("-");
  return `${year}-${month.padStart(2, "0")}`;
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
      if (!Array.isArray(this.incomes)) return [];
      const dateStore = useDateReferenceStore();
      const target = normalizeMonthRef(dateStore.monthYearString);
      return this.incomes.filter(
        (income) => normalizeMonthRef(income.monthReference) === target
      );
    },
    currentMonthCreditCards(): CreditCard[] {
      if (!Array.isArray(this.creditCards)) return [];
      return this.creditCards;
    },
    currentMonthSubscriptions(): Subscription[] {
      if (!Array.isArray(this.subscriptions)) return [];
      const dateStore = useDateReferenceStore();
      const target = normalizeMonthRef(dateStore.monthYearString);
      return this.subscriptions.filter(
        (sub) => normalizeMonthRef(sub.monthReference) === target
      );
    },
    currentMonthServices(): Service[] {
      if (!Array.isArray(this.services)) return [];
      const dateStore = useDateReferenceStore();
      const target = normalizeMonthRef(dateStore.monthYearString);
      return this.services.filter(
        (service) => normalizeMonthRef(service.monthReference) === target
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
      if (!Array.isArray(this.creditCards)) return 0;
      return this.creditCards.reduce((sum, card) => sum + card.limit, 0);
    },
    totalCreditCardConsumption(): number {
      if (!Array.isArray(this.creditCards)) return 0;
      return this.creditCards.reduce(
        (sum, card) => sum + (card.totalConsumption || 0),
        0
      );
    },
    availableCreditLimit(): number {
      return this.totalCreditCardLimit - this.totalCreditCardConsumption;
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
        const response = await api.get(`/api/incomes?monthReference=${month}`);
        this.incomes = this.incomes.filter(
          (income) =>
            normalizeMonthRef(income.monthReference) !==
            normalizeMonthRef(month)
        );
        if (Array.isArray(response.data)) {
          this.incomes.push(...response.data);
        }
      } catch (error: any) {
        const { error: showError } = useNotification();
        showError(error?.message || "Erro ao carregar entradas");
        this.incomes = Array.isArray(this.incomes) ? this.incomes : [];
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
        const incomeWithMonth = {
          ...income,
          monthReference: dateStore.monthYearString,
          date:
            formatDateForAPI(income.date) ||
            new Date().toISOString().split("T")[0],
        };
        const response = await api.post("/api/incomes", incomeWithMonth);
        if (!Array.isArray(this.incomes)) this.incomes = [];
        this.incomes.unshift(response.data);
        success("Entrada adicionada com sucesso!");
      } catch (err: any) {
        error("Erro ao adicionar entrada");
        throw err;
      }
    },

    async updateIncome(id: string, income: Partial<Income>) {
      const { success, error } = useNotification();
      const dateStore = useDateReferenceStore();
      try {
        const incomeToUpdate = {
          ...income,
          monthReference: income.monthReference || dateStore.monthYearString,
          date: income.date ? formatDateForAPI(income.date) : undefined,
        };
        const response = await api.put(`/api/incomes/${id}`, incomeToUpdate);
        if (!Array.isArray(this.incomes)) this.incomes = [];
        const index = this.incomes.findIndex((i) => i.id === id);
        if (index !== -1) {
          this.incomes[index] = response.data;
        }
        success("Entrada atualizada com sucesso!");
      } catch (err: any) {
        error("Erro ao atualizar entrada");
        throw err;
      }
    },

    async deleteIncome(id: string) {
      const { success, error } = useNotification();
      try {
        await api.delete(`/api/incomes/${id}`);
        if (!Array.isArray(this.incomes)) this.incomes = [];
        this.incomes = this.incomes.filter((i) => i.id !== id);
        success("Entrada removida com sucesso!");
      } catch (err: any) {
        error("Erro ao remover entrada");
        throw err;
      }
    },

    async fetchCreditCards(monthReference?: string) {
      const dateStore = useDateReferenceStore();
      const month = monthReference || dateStore.monthYearString;
      this.loading = true;
      try {
        const response = await api.get(
          `/api/credit-cards?monthReference=${month}`
        );
        this.creditCards = Array.isArray(response.data) ? response.data : [];
      } catch (error: any) {
        const { error: showError } = useNotification();
        showError(error?.message || "Erro ao carregar cartões");
        this.creditCards = [];
      } finally {
        this.loading = false;
      }
    },

    async addCreditCard(
      creditCard: Omit<
        CreditCard,
        "id" | "createdAt" | "currentDebt" | "totalConsumption"
      >
    ) {
      const { success, error } = useNotification();
      try {
        const response = await api.post("/api/credit-cards", creditCard);
        if (!Array.isArray(this.creditCards)) this.creditCards = [];
        this.creditCards.unshift(response.data);
        success("Cartão adicionado com sucesso!");
      } catch (err: any) {
        error("Erro ao adicionar cartão");
        throw err;
      }
    },

    async updateCreditCard(id: string, creditCard: Partial<CreditCard>) {
      const { success, error } = useNotification();
      try {
        const response = await api.put(`/api/credit-cards/${id}`, creditCard);
        if (!Array.isArray(this.creditCards)) this.creditCards = [];
        const index = this.creditCards.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.creditCards[index] = response.data;
        }
        success("Cartão atualizado com sucesso!");
      } catch (err: any) {
        error("Erro ao atualizar cartão");
        throw err;
      }
    },

    async deleteCreditCard(id: string) {
      const { success, error } = useNotification();
      try {
        await api.delete(`/api/credit-cards/${id}`);
        if (!Array.isArray(this.creditCards)) this.creditCards = [];
        this.creditCards = this.creditCards.filter((c) => c.id !== id);
        success("Cartão removido com sucesso!");
      } catch (err: any) {
        error("Erro ao remover cartão");
        throw err;
      }
    },

    async fetchExpensesByCard(
      cardId: string,
      monthReference?: string
    ): Promise<CreditCardExpense[]> {
      const params = new URLSearchParams();
      if (monthReference) {
        params.append("monthReference", monthReference);
      }
      const response = await api.get(
        `/api/credit-card-expenses/card/${cardId}?${params.toString()}`
      );
      return Array.isArray(response.data) ? response.data : [];
    },

    async fetchActiveExpensesByCard(
      cardId: string,
      monthReference?: string
    ): Promise<CreditCardExpense[]> {
      const params = new URLSearchParams();
      if (monthReference) {
        params.append("monthReference", monthReference);
      }
      const response = await api.get(
        `/api/credit-card-expenses/card/${cardId}/active?${params.toString()}`
      );
      return Array.isArray(response.data) ? response.data : [];
    },

    async addExpense(
      expense: Omit<
        CreditCardExpense,
        "id" | "createdAt" | "installmentAmount" | "currentInstallment"
      >
    ) {
      const expenseToAdd = {
        ...expense,
        purchaseDate:
          formatDateForAPI(expense.purchaseDate) ||
          new Date().toISOString().split("T")[0],
      };
      const response = await api.post(
        "/api/credit-card-expenses",
        expenseToAdd
      );
      return response.data;
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
      if (!expense.description?.trim()) {
        error("Descrição é obrigatória");
        throw new Error("Descrição é obrigatória");
      }
      if (expense.amount <= 0) {
        error("Valor deve ser maior que zero");
        throw new Error("Valor deve ser maior que zero");
      }
      if (expense.installments <= 0) {
        error("Parcelas devem ser maior que zero");
        throw new Error("Parcelas devem ser maior que zero");
      }
      if (!expense.category?.trim()) {
        error("Categoria é obrigatória");
        throw new Error("Categoria é obrigatória");
      }
      try {
        const datePart = expense.purchaseDate.split("T")[0];
        const normalizedDate = /^\d{4}-\d{2}-\d{2}$/.test(datePart)
          ? datePart
          : expense.purchaseDate;
        const expenseToAdd = {
          ...expense,
          purchaseDate: normalizedDate,
        };
        const response = await api.post(
          "/api/credit-card-expenses/with-installments",
          expenseToAdd
        );
        success(
          `${expense.installments} parcela(s) adicionada(s) com sucesso!`
        );
        return response.data;
      } catch (err: any) {
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
      if (!expense.description?.trim()) {
        error("Descrição é obrigatória");
        throw new Error("Descrição é obrigatória");
      }
      if (expense.totalAmount <= 0) {
        error("Valor total deve ser maior que zero");
        throw new Error("Valor total deve ser maior que zero");
      }
      if (expense.totalInstallments <= 0) {
        error("Total de parcelas deve ser maior que zero");
        throw new Error("Total de parcelas deve ser maior que zero");
      }
      if (
        expense.currentInstallment <= 0 ||
        expense.currentInstallment > expense.totalInstallments
      ) {
        error("Parcela atual deve estar entre 1 e o total de parcelas");
        throw new Error("Parcela atual inválida");
      }
      if (!expense.category?.trim()) {
        error("Categoria é obrigatória");
        throw new Error("Categoria é obrigatória");
      }
      try {
        const datePart = expense.originalPurchaseDate.split("T")[0];
        const normalizedDate = /^\d{4}-\d{2}-\d{2}$/.test(datePart)
          ? datePart
          : expense.originalPurchaseDate;
        const expenseToAdd = {
          ...expense,
          originalPurchaseDate: normalizedDate,
        };
        const response = await api.post(
          "/api/credit-card-expenses/existing-with-installments",
          expenseToAdd
        );
        const remainingInstallments =
          expense.totalInstallments - expense.currentInstallment + 1;
        success(
          `${remainingInstallments} parcela(s) restante(s) adicionada(s) com sucesso!`
        );
        return response.data;
      } catch (err: any) {
        error("Erro ao adicionar compra existente");
        throw err;
      }
    },

    async updateExpense(id: string, expense: Partial<CreditCardExpense>) {
      const expenseToUpdate = {
        ...expense,
        purchaseDate: expense.purchaseDate
          ? formatDateForAPI(expense.purchaseDate)
          : undefined,
      };
      const response = await api.put(
        `/api/credit-card-expenses/${id}`,
        expenseToUpdate
      );
      return response.data;
    },

    async deleteExpense(id: string) {
      await api.delete(`/api/credit-card-expenses/${id}`);
    },

    async toggleExpensePaid(id: string) {
      const response = await api.patch(`/api/credit-card-expenses/${id}/pay`);
      return response.data;
    },

    async fetchSubscriptions(monthReference?: string) {
      const dateStore = useDateReferenceStore();
      const month = monthReference || dateStore.monthYearString;
      this.loading = true;
      try {
        const response = await api.get(
          `/api/subscriptions?monthReference=${month}`
        );
        this.subscriptions = this.subscriptions.filter(
          (sub) =>
            normalizeMonthRef(sub.monthReference) !== normalizeMonthRef(month)
        );
        if (Array.isArray(response.data)) {
          this.subscriptions.push(...response.data);
        }
      } catch (error: any) {
        const { error: showError } = useNotification();
        showError(error?.message || "Erro ao carregar assinaturas");
        this.subscriptions = Array.isArray(this.subscriptions)
          ? this.subscriptions
          : [];
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
        const subWithMonth = {
          ...subscription,
          monthReference: dateStore.monthYearString,
        };
        const response = await api.post("/api/subscriptions", subWithMonth);
        if (!Array.isArray(this.subscriptions)) this.subscriptions = [];
        this.subscriptions.unshift(response.data);
        success("Assinatura adicionada com sucesso!");
      } catch (err: any) {
        error("Erro ao adicionar assinatura");
        throw err;
      }
    },

    async updateSubscription(id: string, subscription: Partial<Subscription>) {
      const { success, error } = useNotification();
      const dateStore = useDateReferenceStore();
      try {
        const subToUpdate = {
          ...subscription,
          monthReference:
            subscription.monthReference || dateStore.monthYearString,
        };
        const response = await api.put(`/api/subscriptions/${id}`, subToUpdate);
        if (!Array.isArray(this.subscriptions)) this.subscriptions = [];
        const index = this.subscriptions.findIndex((s) => s.id === id);
        if (index !== -1) {
          this.subscriptions[index] = response.data;
        }
        success("Assinatura atualizada com sucesso!");
      } catch (err: any) {
        error("Erro ao atualizar assinatura");
        throw err;
      }
    },

    async deleteSubscription(id: string) {
      const { success, error } = useNotification();
      try {
        await api.delete(`/api/subscriptions/${id}`);
        if (!Array.isArray(this.subscriptions)) this.subscriptions = [];
        this.subscriptions = this.subscriptions.filter((s) => s.id !== id);
        success("Assinatura removida com sucesso!");
      } catch (err: any) {
        error("Erro ao remover assinatura");
        throw err;
      }
    },

    async fetchServices(monthReference?: string) {
      const dateStore = useDateReferenceStore();
      const month = monthReference || dateStore.monthYearString;
      this.loading = true;
      try {
        const response = await api.get(`/api/services?monthReference=${month}`);
        this.services = this.services.filter(
          (service) =>
            normalizeMonthRef(service.monthReference) !==
            normalizeMonthRef(month)
        );
        if (Array.isArray(response.data)) {
          this.services.push(...response.data);
        }
      } catch (error: any) {
        const { error: showError } = useNotification();
        showError(error?.message || "Erro ao carregar serviços");
        this.services = Array.isArray(this.services) ? this.services : [];
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
        const serviceWithMonth = {
          ...service,
          monthReference: dateStore.monthYearString,
        };
        const response = await api.post("/api/services", serviceWithMonth);
        if (!Array.isArray(this.services)) this.services = [];
        this.services.unshift(response.data);
        success("Serviço adicionado com sucesso!");
      } catch (err: any) {
        error("Erro ao adicionar serviço");
        throw err;
      }
    },

    async updateService(id: string, service: Partial<Service>) {
      const { success, error } = useNotification();
      const dateStore = useDateReferenceStore();
      try {
        const serviceToUpdate = {
          ...service,
          monthReference: service.monthReference || dateStore.monthYearString,
        };
        const response = await api.put(`/api/services/${id}`, serviceToUpdate);
        if (!Array.isArray(this.services)) this.services = [];
        const index = this.services.findIndex((s) => s.id === id);
        if (index !== -1) {
          this.services[index] = response.data;
        }
        success("Serviço atualizado com sucesso!");
      } catch (err: any) {
        error("Erro ao atualizar serviço");
        throw err;
      }
    },

    async deleteService(id: string) {
      const { success, error } = useNotification();
      try {
        await api.delete(`/api/services/${id}`);
        if (!Array.isArray(this.services)) this.services = [];
        this.services = this.services.filter((s) => s.id !== id);
        success("Serviço removido com sucesso!");
      } catch (err: any) {
        error("Erro ao remover serviço");
        throw err;
      }
    },

    async fetchFinancialReport(
      startDate: string,
      endDate: string
    ): Promise<FinancialReport | null> {
      const { error: showError } = useNotification();
      try {
        const response = await api.get("/api/reports/financial", {
          params: { startDate, endDate },
        });
        return response.data;
      } catch (error: any) {
        showError(error?.message || "Erro ao buscar relatório financeiro");
        return null;
      }
    },
  },
});
