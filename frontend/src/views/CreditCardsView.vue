<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header com Navegação de Mês -->
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 class="text-3xl font-bold text-gray-100">Cartões de Crédito</h1>
          <p class="text-gray-400 mt-1">
            Gerencie seus cartões e limites por mês
          </p>
        </div>

        <!-- Navegação de Mês + Botão Novo Cartão -->
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

          <!-- Botão Novo Cartão no Header (Desktop) -->
          <Button
            variant="primary"
            size="md"
            :icon="PlusIcon"
            @click="openModal()"
            class="hidden sm:flex"
          >
            Novo Cartão
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
              {{ financeStore.currentMonthCreditCards.length }} cartão(ões)
              registrado(s)
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
              <p class="text-gray-400 text-sm">Total de Dívidas</p>
              <p class="text-2xl font-bold text-red-400">
                {{ formatCurrency(financeStore.totalCreditCardDebt) }}
              </p>
            </div>
            <CreditCardIcon class="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div
          class="bg-dark-900 border border-dark-800 rounded-xl p-4 sm:p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Limite Total</p>
              <p class="text-2xl font-bold text-blue-400">
                {{ formatCurrency(financeStore.totalCreditCardLimit) }}
              </p>
            </div>
            <BanknotesIcon class="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div
          class="bg-dark-900 border border-dark-800 rounded-xl p-4 sm:p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Limite Disponível</p>
              <p class="text-2xl font-bold text-green-400">
                {{ formatCurrency(financeStore.availableCreditLimit) }}
              </p>
            </div>
            <DocumentTextIcon class="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      <!-- Lista de Cartões -->
      <div
        class="bg-dark-900 border border-dark-800 rounded-xl p-4 sm:p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-100">
            Meus Cartões - {{ dateStore.currentMonthName }}
          </h2>
          <div class="flex items-center space-x-2">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar cartões..."
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

        <div
          v-else-if="filteredCreditCards.length === 0"
          class="text-center py-12"
        >
          <CreditCardIcon class="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-100 mb-2">
            Nenhum cartão encontrado
          </h3>
          <p class="text-gray-400 mb-6">
            Comece adicionando seu primeiro cartão para
            {{ dateStore.currentMonthName }}
          </p>
          <Button variant="primary" :icon="PlusIcon" @click="openModal()">
            Adicionar Primeiro Cartão
          </Button>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="card in filteredCreditCards"
            :key="card.id"
            class="flex items-center justify-between p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors group"
          >
            <div class="flex items-center space-x-4">
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center"
                :class="getCardColor(card.currentDebt, card.limit)"
              >
                <CreditCardIcon class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="font-medium text-gray-100">{{ card.name }}</h3>
                <p class="text-sm text-gray-400">
                  Vencimento: {{ card.dueDate }}
                </p>
                <div class="flex items-center space-x-2 mt-1">
                  <div class="w-24 bg-dark-700 rounded-full h-2">
                    <div
                      class="h-2 rounded-full transition-all duration-300"
                      :class="getProgressBarColor(card.currentDebt, card.limit)"
                      :style="{
                        width: `${getUsagePercentage(
                          card.currentDebt,
                          card.limit
                        )}%`,
                      }"
                    ></div>
                  </div>
                  <span class="text-xs text-gray-400">
                    {{
                      getUsagePercentage(card.currentDebt, card.limit).toFixed(
                        1
                      )
                    }}%
                  </span>
                </div>
              </div>
            </div>

            <div class="flex items-center space-x-4">
              <div class="text-right">
                <p class="text-lg font-semibold text-red-400">
                  {{ formatCurrency(card.currentDebt) }}
                </p>
                <p class="text-sm text-gray-400">
                  de {{ formatCurrency(card.limit) }}
                </p>
              </div>

              <div
                class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <button
                  @click="openModal(card)"
                  class="p-2 text-gray-400 hover:text-blue-400 transition-colors rounded-lg hover:bg-dark-600"
                  title="Editar cartão"
                >
                  <PencilIcon class="w-4 h-4" />
                </button>
                <button
                  @click="confirmDelete(card)"
                  class="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-dark-600"
                  title="Excluir cartão"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Action Button (Mobile) -->
    <FloatingActionButton
      :icon="PlusIcon"
      tooltip="Novo Cartão"
      @click="openModal()"
      class="sm:hidden"
    />

    <!-- Modal -->
    <CreditCardModal
      :open="modalOpen"
      :creditCard="selectedCreditCard"
      @close="closeModal"
      @submit="handleSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      :open="deleteModalOpen"
      title="Excluir Cartão"
      message="Tem certeza que deseja excluir este cartão? Esta ação não pode ser desfeita."
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
import CreditCardModal from "../components/UI/CreditCardModal.vue";
import FloatingActionButton from "../components/UI/FloatingActionButton.vue";
import ConfirmationModal from "../components/UI/ConfirmationModal.vue";
import {
  PlusIcon,
  CreditCardIcon,
  BanknotesIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  InformationCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/vue/24/outline";

// Interface para CreditCard
interface CreditCard {
  id: string;
  name: string;
  limit: number;
  currentDebt: number;
  dueDate: number;
  monthReference: string;
  createdAt: string;
}

// Inicializar stores
const financeStore = useFinanceStore();
const dateStore = useDateReferenceStore();

// Estados reativos
const loading = ref(false);
const modalOpen = ref(false);
const deleteModalOpen = ref(false);
const selectedCreditCard = ref<CreditCard | null>(null);
const creditCardToDelete = ref<CreditCard | null>(null);
const searchTerm = ref("");
const mounted = ref(false);

// Computed properties
const filteredCreditCards = computed(() => {
  if (!searchTerm.value) return financeStore.currentMonthCreditCards;

  return financeStore.currentMonthCreditCards.filter((card) =>
    card.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// Funções utilitárias
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const getUsagePercentage = (debt: number, limit: number) => {
  return limit > 0 ? (debt / limit) * 100 : 0;
};

const getCardColor = (debt: number, limit: number) => {
  const percentage = getUsagePercentage(debt, limit);
  if (percentage >= 80) return "bg-red-600";
  if (percentage >= 60) return "bg-yellow-600";
  return "bg-blue-600";
};

const getProgressBarColor = (debt: number, limit: number) => {
  const percentage = getUsagePercentage(debt, limit);
  if (percentage >= 80) return "bg-red-500";
  if (percentage >= 60) return "bg-yellow-500";
  return "bg-blue-500";
};

// Funções de controle do modal
const openModal = (creditCard: CreditCard | null = null) => {
  selectedCreditCard.value = creditCard;
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
  selectedCreditCard.value = null;
};

// Funções de CRUD
const handleSubmit = async (creditCardData: any) => {
  try {
    loading.value = true;

    if (creditCardData.id) {
      await financeStore.updateCreditCard(creditCardData.id, creditCardData);
    } else {
      await financeStore.addCreditCard(creditCardData);
    }

    closeModal();
  } catch (err) {
    console.error("Erro ao salvar cartão:", err);
  } finally {
    loading.value = false;
  }
};

const confirmDelete = (creditCard: CreditCard) => {
  creditCardToDelete.value = creditCard;
  deleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (creditCardToDelete.value) {
    try {
      loading.value = true;
      await financeStore.deleteCreditCard(creditCardToDelete.value.id);
      deleteModalOpen.value = false;
      creditCardToDelete.value = null;
    } catch (err) {
      console.error("Erro ao deletar cartão:", err);
    } finally {
      loading.value = false;
    }
  }
};

// Lifecycle
onMounted(async () => {
  if (mounted.value) return;
  mounted.value = true;

  loading.value = true;
  try {
    await nextTick();
    await financeStore.fetchCreditCards();
  } catch (err) {
    console.error("Erro ao carregar cartões:", err);
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
        await financeStore.fetchCreditCards();
      } catch (err) {
        console.error("Erro ao carregar cartões:", err);
      } finally {
        loading.value = false;
      }
    }, 100);
  }
);
</script>
