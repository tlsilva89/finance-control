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
  totalConsumption: number;
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
      return this.creditCards.reduce((sum, card) => sum + card.limit, 0);
    },

    totalCreditCardConsumption(): number {
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
          (income) => income.monthReference !== month
        );
        this.incomes.push(...response.data);
      } catch (error: any) {
        const { error: showError } = useNotification();
        showError(error?.message || "Erro ao carregar entradas");
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
        };
        const response = await api.post("/api/incomes", incomeWithMonth);
        this.incomes.unshift(response.data);
        success("Entrada adicionada com sucesso!");
      } catch (err: any) {
        error("Erro ao adicionar entrada");
        throw err;
      }
    },

    async updateIncome(id: string, income: Partial<Income>) {
      const { success, error } = useNotification();
      try {
        const response = await api.put(`/api/incomes/${id}`, income);
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
        const incoming = response.data;
        this.creditCards = [
          ...this.creditCards.filter(
            (cc) => !incoming.some((inc: CreditCard) => inc.id === cc.id)
          ),
          ...incoming,
        ];
      } catch (error: any) {
        const { error: showError } = useNotification();
        showError(error?.message || "Erro ao carregar cartões");
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
      return response.data;
    },

    async addExpense(
      expense: Omit<
        CreditCardExpense,
        "id" | "createdAt" | "installmentAmount" | "currentInstallment"
      >
    ) {
      const response = await api.post("/api/credit-card-expenses", expense);
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
        error("Erro ao adicionar compra existente");
        throw err;
      }
    },

    async updateExpense(id: string, expense: Partial<CreditCardExpense>) {
      const response = await api.put(
        `/api/credit-card-expenses/${id}`,
        expense
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
          (sub) => sub.monthReference !== month
        );
        this.subscriptions.push(...response.data);
      } catch (error: any) {
        const { error: showError } = useNotification();
        showError(error?.message || "Erro ao carregar assinaturas");
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
        this.subscriptions.unshift(response.data);
        success("Assinatura adicionada com sucesso!");
      } catch (err: any) {
        error("Erro ao adicionar assinatura");
        throw err;
      }
    },

    async updateSubscription(id: string, subscription: Partial<Subscription>) {
      const { success, error } = useNotification();
      try {
        const response = await api.put(
          `/api/subscriptions/${id}`,
          subscription
        );
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
          (service) => service.monthReference !== month
        );
        this.services.push(...response.data);
      } catch (error: any) {
        const { error: showError } = useNotification();
        showError(error?.message || "Erro ao carregar serviços");
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
        this.services.unshift(response.data);
        success("Serviço adicionado com sucesso!");
      } catch (err: any) {
        error("Erro ao adicionar serviço");
        throw err;
      }
    },

    async updateService(id: string, service: Partial<Service>) {
      const { success, error } = useNotification();
      try {
        const response = await api.put(`/api/services/${id}`, service);
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
        this.services = this.services.filter((s) => s.id !== id);
        success("Serviço removido com sucesso!");
      } catch (err: any) {
        error("Erro ao remover serviço");
        throw err;
      }
    },
  },
});
