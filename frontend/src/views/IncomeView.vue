<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header com Navegação de Mês -->
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 class="text-3xl font-bold text-gray-100">Entradas</h1>
          <p class="text-gray-400 mt-1">
            Gerencie suas fontes de renda por mês
          </p>
        </div>

        <!-- Navegação de Mês + Botão Nova Entrada -->
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

          <!-- Botão Nova Entrada no Header (Desktop) -->
          <Button
            variant="primary"
            size="md"
            :icon="PlusIcon"
            @click="openModal()"
            class="hidden sm:flex"
          >
            Nova Entrada
          </Button>
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
              {{ financeStore.currentMonthIncomes.length }} entrada(s)
              registrada(s)
            </p>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          class="bg-dark-900 border border-dark-800 rounded-xl p-4 sm:p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Total do Mês</p>
              <p class="text-2xl font-bold text-green-400">
                {{ formatCurrency(financeStore.totalIncome) }}
              </p>
            </div>
            <ArrowTrendingUpIcon class="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div
          class="bg-dark-900 border border-dark-800 rounded-xl p-4 sm:p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Última Entrada</p>
              <p class="text-lg font-semibold text-gray-100">
                {{ lastIncomeDate }}
              </p>
            </div>
            <CalendarIcon class="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div
          class="bg-dark-900 border border-dark-800 rounded-xl p-4 sm:p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Total de Registros</p>
              <p class="text-2xl font-bold text-gray-100">
                {{ financeStore.currentMonthIncomes.length }}
              </p>
            </div>
            <DocumentTextIcon class="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      <!-- Lista de Entradas -->
      <div
        class="bg-dark-900 border border-dark-800 rounded-xl p-4 sm:p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-100">
            Histórico de Entradas - {{ dateStore.currentMonthName }}
          </h2>
          <div class="flex items-center space-x-2">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar entradas..."
              class="bg-dark-800 border border-dark-700 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 w-64"
            />
            <MagnifyingGlassIcon class="w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div v-if="loading" class="flex justify-center py-8">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"
          ></div>
        </div>

        <div v-else-if="filteredIncomes.length === 0" class="text-center py-12">
          <BanknotesIcon class="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-100 mb-2">
            Nenhuma entrada encontrada
          </h3>
          <p class="text-gray-400 mb-6">
            Comece adicionando sua primeira fonte de renda para
            {{ dateStore.currentMonthName }}
          </p>
          <Button variant="primary" :icon="PlusIcon" @click="openModal()">
            Adicionar Primeira Entrada
          </Button>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="income in filteredIncomes"
            :key="income.id"
            class="flex items-center justify-between p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors group"
          >
            <div class="flex items-center space-x-4">
              <div
                class="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center"
              >
                <BanknotesIcon class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="font-medium text-gray-100">
                  {{ income.description }}
                </h3>
                <p class="text-sm text-gray-400">
                  {{ formatDate(income.date) }}
                </p>
              </div>
            </div>

            <div class="flex items-center space-x-4">
              <span class="text-lg font-semibold text-green-400">
                {{ formatCurrency(income.amount) }}
              </span>

              <div
                class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <button
                  @click="openModal(income)"
                  class="p-2 text-gray-400 hover:text-blue-400 transition-colors rounded-lg hover:bg-dark-600"
                  title="Editar entrada"
                >
                  <PencilIcon class="w-4 h-4" />
                </button>
                <button
                  @click="confirmDelete(income)"
                  class="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-dark-600"
                  title="Excluir entrada"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- REMOVIDO: Botão duplicado "Adicionar Nova Entrada" -->
      <!-- Esta seção foi removida para evitar duplicação -->
    </div>

    <!-- Floating Action Button (Mobile) -->
    <FloatingActionButton
      :icon="PlusIcon"
      tooltip="Nova Entrada"
      @click="openModal()"
      class="sm:hidden"
    />

    <!-- Modal -->
    <IncomeModal
      :open="modalOpen"
      :income="selectedIncome"
      @close="closeModal"
      @submit="handleSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      :open="deleteModalOpen"
      title="Excluir Entrada"
      message="Tem certeza que deseja excluir esta entrada? Esta ação não pode ser desfeita."
      @confirm="handleDelete"
      @cancel="deleteModalOpen = false"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useFinanceStore } from "../stores/finance";
import { useDateReferenceStore } from "../stores/dateReference";
import AppLayout from "../components/Layout/AppLayout.vue";
import Button from "../components/UI/Button.vue";
import IncomeModal from "../components/UI/IncomeModal.vue";
import FloatingActionButton from "../components/UI/FloatingActionButton.vue";
import ConfirmationModal from "../components/UI/ConfirmationModal.vue";
import {
  PlusIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  InformationCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/vue/24/outline";

// Interface para Income
interface Income {
  id: string;
  description: string;
  amount: number;
  date: string;
  monthReference: string;
  createdAt: string;
}

// Inicializar stores uma única vez
const financeStore = useFinanceStore();
const dateStore = useDateReferenceStore();

// Estados reativos
const loading = ref(false);
const modalOpen = ref(false);
const deleteModalOpen = ref(false);
const selectedIncome = ref<Income | null>(null);
const incomeToDelete = ref<Income | null>(null);
const searchTerm = ref("");
const mounted = ref(false);

// Computed properties baseados no mês atual
const lastIncomeDate = computed(() => {
  if (financeStore.currentMonthIncomes.length === 0) return "Nenhuma";
  const lastIncome = financeStore.currentMonthIncomes[0];
  return formatDate(lastIncome.date);
});

const filteredIncomes = computed(() => {
  if (!searchTerm.value) return financeStore.currentMonthIncomes;

  return financeStore.currentMonthIncomes.filter((income) =>
    income.description.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
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
    year: "numeric",
  }).format(new Date(date));
};

// Funções de controle do modal
const openModal = (income: Income | null = null) => {
  selectedIncome.value = income;
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
  selectedIncome.value = null;
};

// Funções de CRUD
const handleSubmit = async (incomeData: any) => {
  try {
    loading.value = true;

    if (incomeData.id) {
      await financeStore.updateIncome(incomeData.id, incomeData);
    } else {
      await financeStore.addIncome(incomeData);
    }

    closeModal();
  } catch (err) {
    console.error("Erro ao salvar entrada:", err);
  } finally {
    loading.value = false;
  }
};

const confirmDelete = (income: Income) => {
  incomeToDelete.value = income;
  deleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (incomeToDelete.value) {
    try {
      loading.value = true;
      await financeStore.deleteIncome(incomeToDelete.value.id);
      deleteModalOpen.value = false;
      incomeToDelete.value = null;
    } catch (err) {
      console.error("Erro ao deletar entrada:", err);
    } finally {
      loading.value = false;
    }
  }
};

// Lifecycle
onMounted(async () => {
  if (mounted.value) return; // Prevenir montagem dupla
  mounted.value = true;

  loading.value = true;
  try {
    await nextTick();
    await financeStore.fetchIncomes();
  } catch (err) {
    console.error("Erro ao carregar entradas:", err);
  } finally {
    loading.value = false;
  }
});

// Watch para mudanças de mês (com debounce)
let watchTimeout: NodeJS.Timeout;
watch(
  () => dateStore.monthYearString,
  async (newValue, oldValue) => {
    if (newValue === oldValue || !mounted.value) return;

    clearTimeout(watchTimeout);
    watchTimeout = setTimeout(async () => {
      loading.value = true;
      try {
        await financeStore.fetchIncomes();
      } catch (err) {
        console.error("Erro ao carregar entradas:", err);
      } finally {
        loading.value = false;
      }
    }, 100);
  }
);
</script>
