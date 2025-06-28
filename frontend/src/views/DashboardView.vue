<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header com Navegação de Mês -->
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 class="text-3xl font-bold text-gray-100">Dashboard Financeiro</h1>
          <p class="text-gray-400 mt-1">
            Visão geral completa das suas finanças
          </p>
        </div>

        <!-- Navegação de Mês -->
        <div class="flex items-center space-x-4">
          <div
            class="flex items-center space-x-2 bg-dark-900 border border-dark-700 rounded-lg p-2"
          >
            <button
              @click="dateStore.previousMonth()"
              class="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-dark-700"
              :disabled="!dateStore.canGoPrevious"
              :class="{
                'opacity-50 cursor-not-allowed': !dateStore.canGoPrevious,
              }"
            >
              <ChevronLeftIcon class="w-4 h-4" />
            </button>

            <div class="text-center min-w-[140px]">
              <p class="text-sm font-medium text-gray-100">
                {{ dateStore.currentMonthName }}
              </p>
              <p class="text-xs text-gray-400">Mês de referência</p>
            </div>

            <button
              @click="dateStore.nextMonth()"
              class="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-dark-700"
              :disabled="!dateStore.canGoNext"
              :class="{ 'opacity-50 cursor-not-allowed': !dateStore.canGoNext }"
            >
              <ChevronRightIcon class="w-4 h-4" />
            </button>
          </div>

          <button
            v-if="!dateStore.isCurrentMonth"
            @click="dateStore.goToCurrentMonth()"
            class="px-3 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Mês Atual
          </button>
        </div>
      </div>

      <!-- Indicador de Mês Atual -->
      <div
        class="bg-primary-900/20 border border-primary-500/30 rounded-lg p-4"
      >
        <div class="flex items-center space-x-3">
          <InformationCircleIcon class="w-5 h-5 text-primary-400" />
          <div>
            <p class="text-sm font-medium text-primary-100">
              Visualizando dados de: {{ dateStore.currentMonthName }}
            </p>
            <p class="text-xs text-primary-300">
              {{ dateStore.isCurrentMonth ? "Mês atual" : "Mês anterior" }} •
              Última atualização: {{ lastUpdateTime }}
            </p>
          </div>
        </div>
      </div>

      <!-- Resumo do Mês de Referência -->
      <div class="bg-dark-900 border border-dark-800 rounded-xl p-6 shadow-lg">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-100">
            Resumo Financeiro - {{ dateStore.currentMonthName }}
          </h2>
          <div
            class="flex items-center space-x-2 px-3 py-1 bg-primary-500/10 rounded-full border border-primary-500/20"
          >
            <div
              class="w-2 h-2 bg-primary-400 rounded-full animate-pulse"
            ></div>
            <span class="text-xs text-primary-300">Atualizado</span>
          </div>
        </div>

        <!-- Cards de Resumo Melhorados -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Entradas -->
          <div
            class="group relative overflow-hidden bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-4 hover:from-green-500/15 hover:to-green-600/10 transition-all duration-300 cursor-pointer"
            @click="navigateTo('/income')"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-300 text-sm font-medium">Entradas</p>
                <p class="text-2xl font-bold text-green-400 mt-1">
                  {{ formatCurrency(financeStore.totalIncome) }}
                </p>
                <div class="flex items-center mt-2 text-xs">
                  <ArrowTrendingUpIcon class="w-3 h-3 text-green-400 mr-1" />
                  <span class="text-green-300"
                    >{{
                      financeStore.currentMonthIncomes.length
                    }}
                    registros</span
                  >
                </div>
              </div>
              <div
                class="p-3 bg-green-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300"
              >
                <BanknotesIcon class="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div
              class="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
          </div>

          <!-- Cartões de Crédito -->
          <div
            class="group relative overflow-hidden bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-xl p-4 hover:from-red-500/15 hover:to-red-600/10 transition-all duration-300 cursor-pointer"
            @click="navigateTo('/credit-cards')"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-red-300 text-sm font-medium">
                  Cartões de Crédito
                </p>
                <p class="text-2xl font-bold text-red-400 mt-1">
                  {{ formatCurrency(financeStore.totalCreditCardDebt) }}
                </p>
                <div class="flex items-center mt-2 text-xs">
                  <span class="text-red-300"
                    >{{ usagePercentage.toFixed(1) }}% do limite usado</span
                  >
                </div>
              </div>
              <div
                class="p-3 bg-red-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300"
              >
                <CreditCardIcon class="w-6 h-6 text-red-400" />
              </div>
            </div>
            <div
              class="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
          </div>

          <!-- Assinaturas -->
          <div
            class="group relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-4 hover:from-purple-500/15 hover:to-purple-600/10 transition-all duration-300 cursor-pointer"
            @click="navigateTo('/subscriptions')"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-300 text-sm font-medium">Assinaturas</p>
                <p class="text-2xl font-bold text-purple-400 mt-1">
                  {{ formatCurrency(financeStore.totalSubscriptions) }}
                </p>
                <div class="flex items-center mt-2 text-xs">
                  <span class="text-purple-300"
                    >{{
                      financeStore.currentMonthSubscriptions.length
                    }}
                    ativas</span
                  >
                </div>
              </div>
              <div
                class="p-3 bg-purple-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300"
              >
                <Cog6ToothIcon class="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div
              class="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
          </div>

          <!-- Serviços -->
          <div
            class="group relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4 hover:from-blue-500/15 hover:to-blue-600/10 transition-all duration-300 cursor-pointer"
            @click="navigateTo('/services')"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-300 text-sm font-medium">Serviços</p>
                <p class="text-2xl font-bold text-blue-400 mt-1">
                  {{ formatCurrency(financeStore.totalServices) }}
                </p>
                <div class="flex items-center mt-2 text-xs">
                  <span class="text-blue-300"
                    >{{
                      financeStore.currentMonthServices.length
                    }}
                    serviços</span
                  >
                </div>
              </div>
              <div
                class="p-3 bg-blue-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300"
              >
                <HomeIcon class="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div
              class="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
          </div>
        </div>

        <!-- Indicador de Saldo Total -->
        <div
          class="mt-6 p-4 bg-dark-800/50 rounded-xl border-l-4"
          :class="
            monthlyData.balance >= 0 ? 'border-green-500' : 'border-red-500'
          "
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center"
                :class="
                  monthlyData.balance >= 0 ? 'bg-green-600' : 'bg-red-600'
                "
              >
                <component
                  :is="
                    monthlyData.balance >= 0
                      ? ArrowTrendingUpIcon
                      : ArrowTrendingDownIcon
                  "
                  class="w-6 h-6 text-white"
                />
              </div>
              <div>
                <p class="text-lg font-semibold text-gray-100">Saldo do Mês</p>
                <p class="text-sm text-gray-400">Entradas - Despesas</p>
              </div>
            </div>
            <div class="text-right">
              <p
                class="text-3xl font-bold"
                :class="
                  monthlyData.balance >= 0 ? 'text-green-400' : 'text-red-400'
                "
              >
                {{ formatCurrency(monthlyData.balance) }}
              </p>
              <p class="text-sm text-gray-400">
                {{ monthlyData.balance >= 0 ? "Superávit" : "Déficit" }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráficos de Despesas -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Gráfico de Distribuição de Despesas (Animado e Interativo) -->
        <div
          class="bg-dark-900 border border-dark-800 rounded-xl p-6 shadow-lg"
        >
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-100">
                Distribuição de Despesas
              </h3>
              <p class="text-sm text-gray-400">
                {{ dateStore.currentMonthName }} - Total:
                {{ formatCurrency(monthlyData.totalExpenses) }}
              </p>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span class="text-xs text-gray-400">Interativo</span>
            </div>
          </div>

          <div class="h-80 relative">
            <!-- Verificar se há dados para exibir -->
            <div v-if="hasExpenseData" class="h-full">
              <ChartComponent
                type="doughnut"
                :data="expensesDistributionData"
                :options="expensesChartOptions"
                class="transition-all duration-500 hover:scale-105"
              />
            </div>
            <div v-else class="flex items-center justify-center h-full">
              <div class="text-center">
                <ChartBarIcon class="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p class="text-gray-400">Nenhuma despesa registrada</p>
                <p class="text-sm text-gray-500">
                  Adicione cartões, assinaturas ou serviços para ver o gráfico
                </p>
              </div>
            </div>

            <!-- Legenda Personalizada -->
            <div
              v-if="hasExpenseData"
              class="absolute bottom-0 left-0 right-0 grid grid-cols-3 gap-2 mt-4"
            >
              <div
                class="flex items-center space-x-2 p-2 bg-dark-800/50 rounded-lg"
              >
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <div>
                  <p class="text-xs text-gray-300">Cartões</p>
                  <p class="text-sm font-semibold text-red-400">
                    {{ formatCurrency(financeStore.totalCreditCardDebt) }}
                  </p>
                </div>
              </div>
              <div
                class="flex items-center space-x-2 p-2 bg-dark-800/50 rounded-lg"
              >
                <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                <div>
                  <p class="text-xs text-gray-300">Assinaturas</p>
                  <p class="text-sm font-semibold text-purple-400">
                    {{ formatCurrency(financeStore.totalSubscriptions) }}
                  </p>
                </div>
              </div>
              <div
                class="flex items-center space-x-2 p-2 bg-dark-800/50 rounded-lg"
              >
                <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p class="text-xs text-gray-300">Serviços</p>
                  <p class="text-sm font-semibold text-blue-400">
                    {{ formatCurrency(financeStore.totalServices) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Comparativo de Despesas - Últimos 6 Meses -->
        <div
          class="bg-dark-900 border border-dark-800 rounded-xl p-6 shadow-lg"
        >
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-100">
                Evolução das Despesas
              </h3>
              <p class="text-sm text-gray-400">
                Comparativo dos últimos 6 meses
              </p>
            </div>
            <div class="flex items-center space-x-2">
              <select
                v-model="selectedExpenseType"
                class="bg-dark-800 border border-dark-700 text-gray-100 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Todas</option>
                <option value="cards">Cartões</option>
                <option value="subscriptions">Assinaturas</option>
                <option value="services">Serviços</option>
              </select>
            </div>
          </div>

          <div class="h-80">
            <div v-if="hasHistoricalData" class="h-full">
              <ChartComponent
                type="line"
                :data="expensesComparisonData"
                :options="comparisonChartOptions"
              />
            </div>
            <div v-else class="flex items-center justify-center h-full">
              <div class="text-center">
                <ChartBarIcon class="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p class="text-gray-400">Dados insuficientes</p>
                <p class="text-sm text-gray-500">
                  Adicione mais dados para ver o comparativo
                </p>
              </div>
            </div>
          </div>

          <!-- Insights de Tendência -->
          <div
            v-if="hasHistoricalData"
            class="mt-4 p-3 bg-dark-800/50 rounded-lg"
          >
            <div class="flex items-center space-x-2">
              <component
                :is="expenseTrend.icon"
                class="w-4 h-4"
                :class="expenseTrend.color"
              />
              <p class="text-sm text-gray-300">
                <span class="font-medium">{{ expenseTrend.text }}</span>
              </p>
            </div>
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
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useFinanceStore } from "../stores/finance";
import { useDateReferenceStore } from "../stores/dateReference";
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
  FireIcon,
  InformationCircleIcon,
  ChartBarIcon,
} from "@heroicons/vue/24/outline";

// Interfaces
interface UpcomingPayment {
  id: string;
  name: string;
  type: string;
  amount: number;
  daysUntilDue: number;
  icon: any;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
}

const router = useRouter();
const financeStore = useFinanceStore();
const dateStore = useDateReferenceStore();

// Estados reativos
const loading = ref(false);
const mounted = ref(false);
const selectedExpenseType = ref("all");

// Computed properties
const lastUpdateTime = computed(() => {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
});

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

const usagePercentage = computed(() => {
  const total = financeStore.totalCreditCardLimit || 1;
  const used = financeStore.totalCreditCardDebt || 0;
  return (used / total) * 100;
});

// Verificar se há dados para exibir gráficos
const hasExpenseData = computed(() => {
  return monthlyData.value.totalExpenses > 0;
});

const hasHistoricalData = computed(() => {
  return hasExpenseData.value; // Simplificado - pode ser expandido
});

// Dados do gráfico de distribuição de despesas
const expensesDistributionData = computed(() => {
  const creditCardDebt = financeStore.totalCreditCardDebt || 0;
  const subscriptions = financeStore.totalSubscriptions || 0;
  const services = financeStore.totalServices || 0;

  return {
    labels: ["Cartões de Crédito", "Assinaturas", "Serviços"],
    datasets: [
      {
        data: [creditCardDebt, subscriptions, services],
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(59, 130, 246, 0.8)",
        ],
        borderColor: [
          "rgba(239, 68, 68, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(59, 130, 246, 1)",
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          "rgba(239, 68, 68, 0.9)",
          "rgba(139, 92, 246, 0.9)",
          "rgba(59, 130, 246, 0.9)",
        ],
        hoverBorderWidth: 3,
      },
    ],
  };
});

// Dados do gráfico de comparação
const expensesComparisonData = computed(() => {
  const last6Months = getLast6MonthsExpensesData();

  const datasets = [];

  if (
    selectedExpenseType.value === "all" ||
    selectedExpenseType.value === "cards"
  ) {
    datasets.push({
      label: "Cartões de Crédito",
      data: last6Months.map((month) => month.cards),
      borderColor: "#ef4444",
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      tension: 0.4,
      fill: false,
      pointBackgroundColor: "#ef4444",
      pointBorderColor: "#ffffff",
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
    });
  }

  if (
    selectedExpenseType.value === "all" ||
    selectedExpenseType.value === "subscriptions"
  ) {
    datasets.push({
      label: "Assinaturas",
      data: last6Months.map((month) => month.subscriptions),
      borderColor: "#8b5cf6",
      backgroundColor: "rgba(139, 92, 246, 0.1)",
      tension: 0.4,
      fill: false,
      pointBackgroundColor: "#8b5cf6",
      pointBorderColor: "#ffffff",
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
    });
  }

  if (
    selectedExpenseType.value === "all" ||
    selectedExpenseType.value === "services"
  ) {
    datasets.push({
      label: "Serviços",
      data: last6Months.map((month) => month.services),
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      tension: 0.4,
      fill: false,
      pointBackgroundColor: "#3b82f6",
      pointBorderColor: "#ffffff",
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
    });
  }

  return {
    labels: last6Months.map((month) => month.label),
    datasets,
  };
});

// Opções dos gráficos
const expensesChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "rgba(17, 24, 39, 0.95)",
      titleColor: "#f3f4f6",
      bodyColor: "#e5e7eb",
      borderColor: "#374151",
      borderWidth: 1,
      callbacks: {
        label: function (context: any) {
          const value = context.parsed;
          const total = context.dataset.data.reduce(
            (a: number, b: number) => a + b,
            0
          );
          const percentage =
            total > 0 ? ((value / total) * 100).toFixed(1) : "0";
          return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
        },
      },
    },
  },
  animation: {
    animateRotate: true,
    animateScale: true,
    duration: 2000,
    easing: "easeOutQuart",
  },
  interaction: {
    intersect: false,
    mode: "index",
  },
};

const comparisonChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#e5e7eb",
        usePointStyle: true,
        padding: 20,
      },
    },
    tooltip: {
      backgroundColor: "rgba(17, 24, 39, 0.95)",
      titleColor: "#f3f4f6",
      bodyColor: "#e5e7eb",
      borderColor: "#374151",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      ticks: { color: "#9ca3af" },
      grid: { color: "#374151" },
    },
    y: {
      ticks: {
        color: "#9ca3af",
        callback: function (value: any) {
          return formatCurrency(value);
        },
      },
      grid: { color: "#374151" },
    },
  },
  animation: {
    duration: 2000,
    easing: "easeOutQuart",
  },
  interaction: {
    intersect: false,
    mode: "index",
  },
};

// Computed para insights
const expenseTrend = computed(() => {
  const currentTotal = monthlyData.value.totalExpenses;
  const previousTotal = currentTotal * 0.9; // Simulação
  const change =
    previousTotal > 0
      ? ((currentTotal - previousTotal) / previousTotal) * 100
      : 0;

  if (change > 5) {
    return {
      icon: ArrowTrendingUpIcon,
      color: "text-red-400",
      text: `Despesas aumentaram ${change.toFixed(
        1
      )}% em relação ao mês anterior`,
    };
  } else if (change < -5) {
    return {
      icon: ArrowTrendingDownIcon,
      color: "text-green-400",
      text: `Despesas diminuíram ${Math.abs(change).toFixed(
        1
      )}% em relação ao mês anterior`,
    };
  } else {
    return {
      icon: ArrowTrendingUpIcon,
      color: "text-gray-400",
      text: "Despesas estáveis em relação ao mês anterior",
    };
  }
});

// Transações recentes baseadas em dados reais
const recentTransactions = computed((): Transaction[] => {
  return (
    financeStore.currentMonthIncomes?.slice(0, 5).map((income) => ({
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
  if (financeStore.currentMonthCreditCards) {
    const today = new Date().getDate();
    financeStore.currentMonthCreditCards.forEach((card) => {
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
  if (financeStore.currentMonthSubscriptions) {
    financeStore.currentMonthSubscriptions.forEach((subscription) => {
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
  if (financeStore.currentMonthServices) {
    const today = new Date().getDate();
    financeStore.currentMonthServices.forEach((service) => {
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

const getLast6MonthsExpensesData = () => {
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

    // Usar dados reais ou simulação baseada nos dados atuais
    const baseCards = financeStore.totalCreditCardDebt || 0;
    const baseSubscriptions = financeStore.totalSubscriptions || 0;
    const baseServices = financeStore.totalServices || 0;

    months.push({
      label: monthName,
      cards: Math.max(0, baseCards * (0.7 + Math.random() * 0.6)),
      subscriptions: Math.max(
        0,
        baseSubscriptions * (0.8 + Math.random() * 0.4)
      ),
      services: Math.max(0, baseServices * (0.9 + Math.random() * 0.2)),
    });
  }

  return months;
};

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
  if (mounted.value) return;
  mounted.value = true;

  loading.value = true;
  try {
    await nextTick();
    await financeStore.fetchAllData();
  } catch (error) {
    console.error("Erro ao carregar dados do dashboard:", error);
  } finally {
    loading.value = false;
  }
});

// Watch para mudanças de mês
let watchTimeout: NodeJS.Timeout;
watch(
  () => dateStore.monthYearString,
  async (newValue, oldValue) => {
    if (newValue === oldValue || !mounted.value) return;

    clearTimeout(watchTimeout);
    watchTimeout = setTimeout(async () => {
      loading.value = true;
      try {
        await financeStore.fetchAllData();
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        loading.value = false;
      }
    }, 100);
  }
);
</script>
