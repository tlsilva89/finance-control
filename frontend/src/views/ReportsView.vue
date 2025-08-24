<template>
  <AppLayout>
    <div class="space-y-6">
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 class="text-3xl font-bold text-gray-100">
            Relatórios Financeiros
          </h1>
          <p class="text-gray-400 mt-1">
            Selecione um período para gerar e exportar seu relatório detalhado.
          </p>
        </div>
        <Button
          v-if="report && !loading"
          @click="exportPDF"
          :icon="ArrowDownTrayIcon"
          variant="secondary"
        >
          Exportar para PDF
        </Button>
      </div>

      <div class="bg-dark-900 border border-dark-800 rounded-xl p-6 shadow-lg">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label
              for="startDate"
              class="block text-sm font-medium text-gray-300 mb-2"
              >Data de Início</label
            >
            <input
              type="date"
              id="startDate"
              v-model="startDate"
              class="w-full bg-dark-800 border border-dark-700 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label
              for="endDate"
              class="block text-sm font-medium text-gray-300 mb-2"
              >Data de Fim</label
            >
            <input
              type="date"
              id="endDate"
              v-model="endDate"
              class="w-full bg-dark-800 border border-dark-700 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <Button
            @click="generateReport"
            :disabled="loading"
            :icon="DocumentChartBarIcon"
          >
            {{ loading ? "Gerando..." : "Gerar Relatório" }}
          </Button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-10">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"
        ></div>
        <p class="mt-4 text-gray-400">Buscando dados...</p>
      </div>

      <div v-if="report && !loading" class="space-y-6">
        <div
          class="bg-dark-900 border border-dark-800 rounded-xl p-6 shadow-lg"
        >
          <h2 class="text-xl font-semibold text-gray-100 mb-4">
            Resumo do Período ({{ displayDate(report.startDate) }} -
            {{ displayDate(report.endDate) }})
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-green-500/10 p-4 rounded-lg">
              <p class="text-sm text-green-300">Total de Entradas</p>
              <p class="text-2xl font-bold text-green-400">
                {{ formatCurrency(report.totalIncomes) }}
              </p>
            </div>
            <div class="bg-red-500/10 p-4 rounded-lg">
              <p class="text-sm text-red-300">Total de Despesas</p>
              <p class="text-2xl font-bold text-red-400">
                {{ formatCurrency(report.totalExpenses) }}
              </p>
            </div>
            <div
              :class="
                report.balance >= 0 ? 'bg-blue-500/10' : 'bg-orange-500/10'
              "
              class="p-4 rounded-lg"
            >
              <p
                :class="
                  report.balance >= 0 ? 'text-blue-300' : 'text-orange-300'
                "
                class="text-sm"
              >
                Saldo
              </p>
              <p
                :class="
                  report.balance >= 0 ? 'text-blue-400' : 'text-orange-400'
                "
                class="text-2xl font-bold"
              >
                {{ formatCurrency(report.balance) }}
              </p>
            </div>
          </div>
        </div>

        <div v-for="section in reportSections" :key="section.title">
          <div
            v-if="section.items.length > 0"
            class="bg-dark-900 border border-dark-800 rounded-xl p-6 shadow-lg"
          >
            <h3 class="text-lg font-semibold text-gray-100 mb-4">
              {{ section.title }} ({{ section.items.length }})
            </h3>
            <div class="space-y-2">
              <div
                v-for="item in section.items"
                :key="item.id"
                class="flex justify-between items-center p-3 bg-dark-800 rounded-md"
              >
                <div>
                  <p class="text-gray-200">{{ item.description }}</p>
                  <p class="text-xs text-gray-500">
                    {{ displayDate(item.date) }}
                  </p>
                </div>
                <p class="font-semibold" :class="section.color">
                  {{ formatCurrency(item.amount) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  useFinanceStore,
  type FinancialReport,
  type Income,
  type CreditCardExpense,
  type Subscription,
  type Service,
} from "../stores/finance";
import { useDateFormat } from "../composables/useDateFormat";
import { usePDFExport } from "../composables/usePDFExport";
import AppLayout from "../components/Layout/AppLayout.vue";
import Button from "../components/UI/Button.vue";
import {
  DocumentChartBarIcon,
  ArrowDownTrayIcon,
} from "@heroicons/vue/24/outline";

const financeStore = useFinanceStore();
const { displayDate, inputDate } = useDateFormat();
const { exportReportAsPDF } = usePDFExport();

const loading = ref(false);
const startDate = ref(
  inputDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
);
const endDate = ref(inputDate(new Date()));
const report = ref<FinancialReport | null>(null);

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const generateReport = async () => {
  if (!startDate.value || !endDate.value) {
    return;
  }
  loading.value = true;
  report.value = null;
  const result = await financeStore.fetchFinancialReport(
    startDate.value,
    endDate.value
  );
  if (result) {
    report.value = result;
  }
  loading.value = false;
};

const exportPDF = () => {
  if (report.value) {
    exportReportAsPDF(report.value, startDate.value, endDate.value);
  }
};

const reportSections = computed(() => {
  if (!report.value) return [];
  return [
    {
      title: "Entradas",
      items: report.value.incomes.map((i: Income) => ({
        id: i.id,
        amount: i.amount,
        date: i.date,
        description: i.description,
      })),
      color: "text-green-400",
    },
    {
      title: "Despesas de Cartão",
      items: report.value.creditCardExpenses.map((e: CreditCardExpense) => ({
        id: e.id,
        amount: e.installmentAmount,
        date: e.purchaseDate,
        description: e.description,
      })),
      color: "text-red-400",
    },
    {
      title: "Assinaturas",
      items: report.value.subscriptions.map((s: Subscription) => ({
        id: s.id,
        amount: s.amount,
        date: s.renewalDate,
        description: s.name,
      })),
      color: "text-purple-400",
    },
    {
      title: "Serviços",
      items: report.value.services.map((s: Service) => ({
        id: s.id,
        amount: s.amount,
        date: `Dia ${s.dueDate}`,
        description: s.name,
      })),
      color: "text-orange-400",
    },
  ];
});
</script>
