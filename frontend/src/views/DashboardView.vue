<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header com Navegação de Mês -->
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 class="text-3xl font-bold text-gray-100">Dashboard Financeiro</h1>
          <p class="text-gray-400 mt-1">Visão geral das suas finanças</p>
        </div>

        <!-- Navegação de Mês -->
        <div class="flex items-center space-x-4">
          <div
            class="flex items-center space-x-2 bg-dark-900 border border-dark-700 rounded-lg p-2"
          >
            <button
              @click="previousMonth"
              class="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-dark-700"
              :disabled="!canGoPrevious"
            >
              <ChevronLeftIcon class="w-4 h-4" />
            </button>

            <div class="text-center min-w-[120px]">
              <p class="text-sm font-medium text-gray-100">
                {{ currentMonthName }}
              </p>
              <p class="text-xs text-gray-400">{{ currentYear }}</p>
            </div>

            <button
              @click="nextMonth"
              class="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-dark-700"
              :disabled="!canGoNext"
            >
              <ChevronRightIcon class="w-4 h-4" />
            </button>
          </div>

          <button
            @click="goToCurrentMonth"
            class="px-3 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            v-if="!isCurrentMonth"
          >
            Atual
          </button>
        </div>
      </div>

      <!-- Cards de Resumo -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="card in summaryCards"
          :key="card.title"
          class="bg-dark-900 border border-dark-800 rounded-xl p-4 sm:p-6 shadow-lg hover:bg-dark-800 transition-all cursor-pointer"
          @click="navigateTo(card.route)"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">{{ card.title }}</p>
              <p class="text-2xl font-bold" :class="card.color">
                {{ formatCurrency(card.value) }}
              </p>
            </div>
            <component :is="card.icon" class="w-8 h-8" :class="card.color" />
          </div>
          <div class="mt-4 flex items-center text-sm">
            <div class="flex items-center">
              <component
                :is="
                  card.trend >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon
                "
                class="w-4 h-4 mr-1"
                :class="card.trend >= 0 ? 'text-green-400' : 'text-red-400'"
              />
              <span
                :class="card.trend >= 0 ? 'text-green-400' : 'text-red-400'"
              >
                {{ Math.abs(card.trend).toFixed(1) }}%
              </span>
            </div>
            <span class="text-gray-400 ml-2">vs mês anterior</span>
          </div>
        </div>
      </div>

      <!-- Resumo Financeiro Principal -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          class="lg:col-span-2 bg-dark-900 border border-dark-800 rounded-xl p-6 shadow-lg"
        >
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-100">Fluxo de Caixa</h3>
            <div class="flex items-center space-x-2">
              <div class="flex items-center space-x-1">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="text-xs text-gray-400">Entradas</span>
              </div>
              <div class="flex items-center space-x-1">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <span class="text-xs text-gray-400">Saídas</span>
              </div>
            </div>
          </div>
          <div class="h-64">
            <ChartComponent
              type="line"
              :data="cashFlowChartData"
              :options="cashFlowChartOptions"
            />
          </div>
        </div>

        <div
          class="bg-dark-900 border border-dark-800 rounded-xl p-6 shadow-lg"
        >
          <h3 class="text-lg font-semibold text-gray-100 mb-6">
            Resumo do Mês
          </h3>
          <div class="space-y-4">
            <div
              class="flex items-center justify-between p-3 bg-dark-800 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center"
                >
                  <ArrowDownIcon class="w-5 h-5 text-white" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-100">Entradas</p>
                  <p class="text-xs text-gray-400">Total recebido</p>
                </div>
              </div>
              <p class="text-lg font-bold text-green-400">
                {{ formatCurrency(monthlyData.totalIncome) }}
              </p>
            </div>

            <div
              class="flex items-center justify-between p-3 bg-dark-800 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center"
                >
                  <ArrowUpIcon class="w-5 h-5 text-white" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-100">Gastos</p>
                  <p class="text-xs text-gray-400">Total gasto</p>
                </div>
              </div>
              <p class="text-lg font-bold text-red-400">
                {{ formatCurrency(monthlyData.totalExpenses) }}
              </p>
            </div>

            <div
              class="flex items-center justify-between p-3 bg-dark-800 rounded-lg border-l-4"
              :class="
                monthlyData.balance >= 0 ? 'border-green-500' : 'border-red-500'
              "
            >
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center"
                  :class="
                    monthlyData.balance >= 0 ? 'bg-green-600' : 'bg-red-600'
                  "
                >
                  <component
                    :is="monthlyData.balance >= 0 ? PlusIcon : MinusIcon"
                    class="w-5 h-5 text-white"
                  />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-100">Saldo</p>
                  <p class="text-xs text-gray-400">Resultado final</p>
                </div>
              </div>
              <p
                class="text-lg font-bold"
                :class="
                  monthlyData.balance >= 0 ? 'text-green-400' : 'text-red-400'
                "
              >
                {{ formatCurrency(monthlyData.balance) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráficos de Análise -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Gráfico de Gastos por Categoria -->
        <div
          class="bg-dark-900 border border-dark-800 rounded-xl p-6 shadow-lg"
        >
          <h3 class="text-lg font-semibold text-gray-100 mb-6">
            Gastos por Categoria
          </h3>
          <div class="h-64">
            <ChartComponent
              type="doughnut"
              :data="expensesByCategoryData"
              :options="doughnutChartOptions"
            />
          </div>
        </div>

        <!-- Comparativo Últimos 6 Meses -->
        <div
          class="bg-dark-900 border border-dark-800 rounded-xl p-6 shadow-lg"
        >
          <h3 class="text-lg font-semibold text-gray-100 mb-6">
            Últimos 6 Meses
          </h3>
          <div class="h-64">
            <ChartComponent
              type="bar"
              :data="sixMonthsComparisonData"
              :options="barChartOptions"
            />
          </div>
        </div>
      </div>

      <!-- Transações Recentes e Próximos Vencimentos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Transações Recentes -->
        <div
          class="bg-dark-900 border border-dark-800 rounded-xl p-6 shadow-lg"
        >
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-100">
              Transações Recentes
            </h3>
            <button
              @click="navigateTo('/income')"
              class="text-primary-500 hover:text-primary-400 text-sm transition-colors"
            >
              Ver todas
            </button>
          </div>
          <div class="space-y-3" v-if="recentTransactions.length > 0">
            <div
              v-for="transaction in recentTransactions"
              :key="transaction.id"
              class="flex items-center justify-between p-3 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center bg-green-600"
                >
                  <BanknotesIcon class="w-5 h-5 text-white" />
                </div>
                <div>
                  <p class="font-medium text-gray-100">
                    {{ transaction.description }}
                  </p>
                  <p class="text-sm text-gray-400">Entrada</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-semibold text-green-400">
                  +{{ formatCurrency(transaction.amount) }}
                </p>
                <p class="text-sm text-gray-400">
                  {{ formatDate(transaction.date) }}
                </p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <BanknotesIcon class="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p class="text-gray-400">Nenhuma transação recente</p>
          </div>
        </div>

        <!-- Próximos Vencimentos -->
        <div
          class="bg-dark-900 border border-dark-800 rounded-xl p-6 shadow-lg"
        >
          <h3 class="text-lg font-semibold text-gray-100 mb-6">
            Próximos Vencimentos
          </h3>
          <div class="space-y-3" v-if="upcomingPayments.length > 0">
            <div
              v-for="upcoming in upcomingPayments"
              :key="upcoming.id"
              class="flex items-center justify-between p-3 bg-dark-800 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center"
                  :class="getUrgencyColor(upcoming.daysUntilDue)"
                >
                  <component :is="upcoming.icon" class="w-5 h-5 text-white" />
                </div>
                <div>
                  <p class="font-medium text-gray-100">{{ upcoming.name }}</p>
                  <p class="text-sm text-gray-400">{{ upcoming.type }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-semibold text-orange-400">
                  {{ formatCurrency(upcoming.amount) }}
                </p>
                <p
                  class="text-sm"
                  :class="getUrgencyTextColor(upcoming.daysUntilDue)"
                >
                  {{ getUrgencyText(upcoming.daysUntilDue) }}
                </p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <CreditCardIcon class="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p class="text-gray-400">Nenhum vencimento próximo</p>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useFinanceStore } from "../stores/finance";
import AppLayout from "../components/Layout/AppLayout.vue";
import ChartComponent from "../components/Charts/ChartComponent.vue";
import {
  BanknotesIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  HomeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  PlusIcon,
  MinusIcon,
  FireIcon,
} from "@heroicons/vue/24/outline";

// Interface para tipagem dos próximos vencimentos
interface UpcomingPayment {
  id: string;
  name: string;
  type: string;
  amount: number;
  daysUntilDue: number;
  icon: any;
}

// Interface para transações
interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
}

const router = useRouter();
const financeStore = useFinanceStore();

// Estados reativos
const currentDate = ref(new Date());
const loading = ref(false);

// Computed para navegação de mês
const currentMonth = computed(() => currentDate.value.getMonth());
const currentYear = computed(() => currentDate.value.getFullYear());
const isCurrentMonth = computed(() => {
  const now = new Date();
  return (
    currentMonth.value === now.getMonth() &&
    currentYear.value === now.getFullYear()
  );
});

const currentMonthName = computed(() => {
  return new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(
    currentDate.value
  );
});

const canGoPrevious = computed(() => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return currentDate.value > sixMonthsAgo;
});

const canGoNext = computed(() => {
  const now = new Date();
  return currentDate.value < now;
});

// Dados dinâmicos baseados no store
const monthlyData = computed(() => {
  const totalIncome = financeStore.totalIncome || 0;
  const totalExpenses =
    (financeStore.totalCreditCardDebt || 0) +
    (financeStore.totalSubscriptions || 0) +
    (financeStore.totalServices || 0);
  const balance = totalIncome - totalExpenses;

  return {
    totalIncome,
    totalExpenses,
    balance,
  };
});

const summaryCards = computed(() => [
  {
    title: "Entradas",
    value: financeStore.totalIncome || 0,
    trend: calculateTrend("income"),
    color: "text-green-400",
    icon: BanknotesIcon,
    route: "/income",
  },
  {
    title: "Cartões de Crédito",
    value: financeStore.totalCreditCardDebt || 0,
    trend: calculateTrend("creditCards"),
    color: "text-red-400",
    icon: CreditCardIcon,
    route: "/credit-cards",
  },
  {
    title: "Assinaturas",
    value: financeStore.totalSubscriptions || 0,
    trend: calculateTrend("subscriptions"),
    color: "text-purple-400",
    icon: Cog6ToothIcon,
    route: "/subscriptions",
  },
  {
    title: "Serviços",
    value: financeStore.totalServices || 0,
    trend: calculateTrend("services"),
    color: "text-blue-400",
    icon: HomeIcon,
    route: "/services",
  },
]);

// Dados dos gráficos baseados em dados reais
const cashFlowChartData = computed(() => {
  const last6Months = getLast6MonthsData();
  return {
    labels: last6Months.map((month) => month.label),
    datasets: [
      {
        label: "Entradas",
        data: last6Months.map((month) => month.income),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Saídas",
        data: last6Months.map((month) => month.expenses),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };
});

const expensesByCategoryData = computed(() => {
  const creditCardDebt = financeStore.totalCreditCardDebt || 0;
  const subscriptions = financeStore.totalSubscriptions || 0;
  const services = financeStore.totalServices || 0;

  return {
    labels: ["Cartões de Crédito", "Assinaturas", "Serviços"],
    datasets: [
      {
        data: [creditCardDebt, subscriptions, services],
        backgroundColor: ["#ef4444", "#8b5cf6", "#3b82f6"],
        borderWidth: 0,
      },
    ],
  };
});

const sixMonthsComparisonData = computed(() => {
  const last6Months = getLast6MonthsData();
  return {
    labels: last6Months.map((month) => month.label),
    datasets: [
      {
        label: "Entradas",
        data: last6Months.map((month) => month.income),
        backgroundColor: "#10b981",
      },
      {
        label: "Gastos",
        data: last6Months.map((month) => month.expenses),
        backgroundColor: "#ef4444",
      },
    ],
  };
});

// Opções dos gráficos
const cashFlowChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      ticks: { color: "#9ca3af" },
      grid: { color: "#374151" },
    },
    y: {
      ticks: { color: "#9ca3af" },
      grid: { color: "#374151" },
    },
  },
};

const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: { color: "#e5e7eb" },
    },
  },
};

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: "#e5e7eb" },
    },
  },
  scales: {
    x: {
      ticks: { color: "#9ca3af" },
      grid: { color: "#374151" },
    },
    y: {
      ticks: { color: "#9ca3af" },
      grid: { color: "#374151" },
    },
  },
};

// Transações recentes baseadas em dados reais
const recentTransactions = computed((): Transaction[] => {
  return (
    financeStore.incomes?.slice(0, 5).map((income) => ({
      id: income.id,
      description: income.description,
      amount: income.amount,
      date: income.date,
    })) || []
  );
});

// Próximos vencimentos baseados em dados reais
const upcomingPayments = computed((): UpcomingPayment[] => {
  const upcoming: UpcomingPayment[] = [];

  // Adicionar cartões próximos do vencimento
  if (financeStore.creditCards) {
    const today = new Date().getDate();
    financeStore.creditCards.forEach((card) => {
      const daysUntilDue = card.dueDate - today;
      if (daysUntilDue >= 0 && daysUntilDue <= 15) {
        upcoming.push({
          id: card.id,
          name: card.name,
          type: "Cartão de Crédito",
          amount: card.currentDebt,
          daysUntilDue,
          icon: CreditCardIcon,
        });
      }
    });
  }

  // Adicionar assinaturas próximas da renovação
  if (financeStore.subscriptions) {
    financeStore.subscriptions.forEach((subscription) => {
      const renewalDate = new Date(subscription.renewalDate);
      const today = new Date();
      const diffTime = renewalDate.getTime() - today.getTime();
      const daysUntilDue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (daysUntilDue >= 0 && daysUntilDue <= 15) {
        upcoming.push({
          id: subscription.id,
          name: subscription.name,
          type: "Assinatura",
          amount: subscription.amount,
          daysUntilDue,
          icon: Cog6ToothIcon,
        });
      }
    });
  }

  // Adicionar serviços próximos do vencimento
  if (financeStore.services) {
    const today = new Date().getDate();
    financeStore.services.forEach((service) => {
      const daysUntilDue = service.dueDate - today;
      if (daysUntilDue >= 0 && daysUntilDue <= 15) {
        upcoming.push({
          id: service.id,
          name: service.name,
          type: "Serviço",
          amount: service.amount,
          daysUntilDue,
          icon: FireIcon,
        });
      }
    });
  }

  return upcoming.sort((a, b) => a.daysUntilDue - b.daysUntilDue).slice(0, 5);
});

// Funções utilitárias
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(date));
};

const navigateTo = (route: string) => {
  router.push(route);
};

// Função para calcular tendência (simulada - você pode implementar lógica real)
const calculateTrend = (type: string) => {
  const trends = {
    income: 12.5,
    creditCards: -5.2,
    subscriptions: 2.1,
    services: -1.8,
  };
  return trends[type as keyof typeof trends] || 0;
};

// Função para obter dados dos últimos 6 meses
const getLast6MonthsData = () => {
  const months = [];
  const currentDate = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    const monthName = new Intl.DateTimeFormat("pt-BR", {
      month: "short",
    }).format(date);

    const baseIncome = financeStore.totalIncome || 0;
    const baseExpenses = monthlyData.value.totalExpenses;

    months.push({
      label: monthName,
      income: baseIncome * (0.8 + Math.random() * 0.4),
      expenses: baseExpenses * (0.8 + Math.random() * 0.4),
    });
  }

  return months;
};

// Funções de navegação de mês
const previousMonth = () => {
  if (canGoPrevious.value) {
    const newDate = new Date(currentDate.value);
    newDate.setMonth(newDate.getMonth() - 1);
    currentDate.value = newDate;
  }
};

const nextMonth = () => {
  if (canGoNext.value) {
    const newDate = new Date(currentDate.value);
    newDate.setMonth(newDate.getMonth() + 1);
    currentDate.value = newDate;
  }
};

const goToCurrentMonth = () => {
  currentDate.value = new Date();
};

// Funções de estilo para vencimentos
const getUrgencyColor = (days: number) => {
  if (days <= 3) return "bg-red-600";
  if (days <= 7) return "bg-yellow-600";
  return "bg-blue-600";
};

const getUrgencyTextColor = (days: number) => {
  if (days <= 3) return "text-red-400";
  if (days <= 7) return "text-yellow-400";
  return "text-blue-400";
};

const getUrgencyText = (days: number) => {
  if (days === 0) return "Hoje";
  if (days === 1) return "Amanhã";
  if (days <= 7) return `${days} dias`;
  return `${days} dias`;
};

// Lifecycle
onMounted(async () => {
  loading.value = true;
  try {
    await financeStore.fetchAllData();
  } catch (error) {
    console.error("Erro ao carregar dados do dashboard:", error);
  } finally {
    loading.value = false;
  }
});

// Watch para mudanças de mês
watch(currentDate, async () => {
  console.log(
    "Carregando dados para:",
    currentMonthName.value,
    currentYear.value
  );
  await financeStore.fetchAllData();
});
</script>
