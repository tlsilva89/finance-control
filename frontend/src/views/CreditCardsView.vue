<template>
  <AppLayout>
    <div class="space-y-6">
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 class="text-3xl font-bold text-gray-100">Cartões de Crédito</h1>
          <p class="text-gray-400 mt-1">
            Gerencie seus cartões e gastos por mês
          </p>
        </div>
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
          <Button
            variant="primary"
            size="md"
            :icon="PlusIcon"
            @click="openCardModal()"
            class="hidden sm:flex"
          >
            Novo Cartão
          </Button>
        </div>
      </div>

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
          <Button variant="primary" :icon="PlusIcon" @click="openCardModal()"
            >Adicionar Primeiro Cartão</Button
          >
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="card in filteredCreditCards"
            :key="card.id"
            class="border border-dark-700 rounded-lg overflow-hidden hover:border-dark-600 transition-colors"
          >
            <div class="flex items-center justify-between p-4 bg-dark-800">
              <div class="flex items-center space-x-4">
                <div
                  class="w-12 h-12 rounded-full flex items-center justify-center"
                  :class="getCardColor(card.totalConsumption, card.limit)"
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
                        :class="
                          getProgressBarColor(card.totalConsumption, card.limit)
                        "
                        :style="{
                          width: `${getUsagePercentage(
                            card.totalConsumption,
                            card.limit
                          )}%`,
                        }"
                      ></div>
                    </div>
                    <span class="text-xs text-gray-400"
                      >{{
                        getUsagePercentage(
                          card.totalConsumption,
                          card.limit
                        ).toFixed(1)
                      }}%</span
                    >
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
                <div class="flex items-center space-x-2">
                  <button
                    @click="toggleExpenses(card.id)"
                    class="p-2 text-gray-400 hover:text-blue-400 transition-colors rounded-lg hover:bg-dark-600"
                    title="Ver gastos"
                  >
                    <ChevronDownIcon
                      v-if="!expandedCards.has(card.id)"
                      class="w-4 h-4"
                    />
                    <ChevronUpIcon v-else class="w-4 h-4" />
                  </button>
                  <button
                    @click="openPurchaseModal(card.id)"
                    class="p-2 text-gray-400 hover:text-green-400 transition-colors rounded-lg hover:bg-dark-600"
                    title="Adicionar compra"
                  >
                    <PlusIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="openCardModal(card)"
                    class="p-2 text-gray-400 hover:text-blue-400 transition-colors rounded-lg hover:bg-dark-600"
                    title="Editar cartão"
                  >
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="confirmDeleteCard(card)"
                    class="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-dark-600"
                    title="Excluir cartão"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div
              v-if="expandedCards.has(card.id)"
              class="p-4 bg-dark-850 border-t border-dark-700"
            >
              <ExpensesList
                :expenses="getCardExpenses(card.id)"
                :loading="expensesLoading"
                @add-expense="openPurchaseModal(card.id)"
                @edit-expense="editExpense"
                @delete-expense="confirmDeleteExpense"
                @toggle-paid="toggleExpensePaid"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <FloatingActionButton
      :icon="PlusIcon"
      tooltip="Novo Cartão"
      @click="openCardModal()"
      class="sm:hidden"
    />

    <CreditCardModal
      :open="cardModalOpen"
      :creditCard="selectedCreditCard"
      @close="closeCardModal"
      @submit="handleCardSubmit"
    />

    <PurchaseModal
      :open="purchaseModalOpen"
      :creditCardId="selectedCardId"
      :expenseToEdit="expenseToEdit"
      @close="closePurchaseModal"
      @submit="handlePurchaseSubmit"
    />

    <ConfirmationModal
      :open="deleteCardModalOpen"
      title="Excluir Cartão"
      message="Tem certeza que deseja excluir este cartão? Esta ação não pode ser desfeita."
      @confirm="handleDeleteCard"
      @cancel="deleteCardModalOpen = false"
    />

    <ConfirmationModal
      :open="deleteExpenseModalOpen"
      title="Excluir Gasto"
      message="Tem certeza que deseja excluir este gasto? Esta ação não pode ser desfeita."
      @confirm="handleDeleteExpense"
      @cancel="deleteExpenseModalOpen = false"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from "vue";
import {
  useFinanceStore,
  type CreditCard,
  type CreditCardExpense,
} from "../stores/finance";
import { useDateReferenceStore } from "../stores/dateReference";
import AppLayout from "../components/Layout/AppLayout.vue";
import Button from "../components/UI/Button.vue";
import CreditCardModal from "../components/UI/CreditCardModal.vue";
import PurchaseModal from "../components/UI/PurchaseModal.vue";
import ExpensesList from "../components/UI/ExpensesList.vue";
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
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/vue/24/outline";

const financeStore = useFinanceStore();
const dateStore = useDateReferenceStore();

const loading = ref(false);
const expensesLoading = ref(false);
const cardModalOpen = ref(false);
const purchaseModalOpen = ref(false);
const deleteCardModalOpen = ref(false);
const deleteExpenseModalOpen = ref(false);
const selectedCreditCard = ref<CreditCard | null>(null);
const selectedCardId = ref("");
const expenseToEdit = ref<CreditCardExpense | null>(null);
const cardToDelete = ref<CreditCard | null>(null);
const expenseToDelete = ref<CreditCardExpense | null>(null);
const searchTerm = ref("");
const mounted = ref(false);
const expandedCards = ref(new Set<string>());
const cardExpenses = ref<Record<string, CreditCardExpense[]>>({});

const filteredCreditCards = computed(() => {
  const cards = financeStore.currentMonthCreditCards;
  const search = searchTerm.value;

  if (!search) return cards;
  return cards.filter((card) =>
    card.name.toLowerCase().includes(search.toLowerCase())
  );
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const getUsagePercentage = (totalConsumption: number, limit: number) => {
  return limit > 0 ? (totalConsumption / limit) * 100 : 0;
};

const getCardColor = (totalConsumption: number, limit: number) => {
  const percentage = getUsagePercentage(totalConsumption, limit);
  if (percentage >= 80) return "bg-red-600";
  if (percentage >= 60) return "bg-yellow-600";
  return "bg-blue-600";
};

const getProgressBarColor = (totalConsumption: number, limit: number) => {
  const percentage = getUsagePercentage(totalConsumption, limit);
  if (percentage >= 80) return "bg-red-500";
  if (percentage >= 60) return "bg-yellow-500";
  return "bg-blue-500";
};

const openCardModal = (creditCard: CreditCard | null = null) => {
  selectedCreditCard.value = creditCard;
  cardModalOpen.value = true;
};

const closeCardModal = () => {
  cardModalOpen.value = false;
  selectedCreditCard.value = null;
};

const openPurchaseModal = (cardId: string) => {
  selectedCardId.value = cardId;
  expenseToEdit.value = null;
  purchaseModalOpen.value = true;
};

const closePurchaseModal = () => {
  purchaseModalOpen.value = false;
  selectedCardId.value = "";
  expenseToEdit.value = null;
};

const handleCardSubmit = async (creditCardData: any) => {
  try {
    loading.value = true;
    if (creditCardData.id) {
      await financeStore.updateCreditCard(creditCardData.id, creditCardData);
    } else {
      await financeStore.addCreditCard(creditCardData);
    }
    await nextTick();
    closeCardModal();
  } catch (err) {
    console.error("Erro ao salvar cartão:", err);
  } finally {
    loading.value = false;
  }
};

const handlePurchaseSubmit = async (
  data: any,
  type: "new" | "existing" | "update"
) => {
  try {
    expensesLoading.value = true;

    if (type === "new") {
      await financeStore.addExpenseWithInstallments(data);
    } else if (type === "existing") {
      await financeStore.addExistingExpenseWithInstallments(data);
    } else if (type === "update") {
      await financeStore.updateExpense(data.id, data);
    }

    if (!expandedCards.value.has(data.creditCardId)) {
      expandedCards.value.add(data.creditCardId);
    }

    await Promise.all([
      loadCardExpenses(data.creditCardId),
      financeStore.fetchCreditCards(),
    ]);

    closePurchaseModal();
  } catch (err) {
    console.error("Erro ao salvar compra:", err);
  } finally {
    expensesLoading.value = false;
  }
};

const confirmDeleteCard = (creditCard: CreditCard) => {
  cardToDelete.value = creditCard;
  deleteCardModalOpen.value = true;
};

const handleDeleteCard = async () => {
  if (cardToDelete.value) {
    try {
      loading.value = true;
      await financeStore.deleteCreditCard(cardToDelete.value.id);
      deleteCardModalOpen.value = false;
      cardToDelete.value = null;
    } catch (err) {
      console.error("Erro ao deletar cartão:", err);
    } finally {
      loading.value = false;
    }
  }
};

const editExpense = (expense: CreditCardExpense) => {
  selectedCardId.value = String(expense.creditCardId);
  expenseToEdit.value = expense;
  purchaseModalOpen.value = true;
};

const confirmDeleteExpense = (expense: CreditCardExpense) => {
  expenseToDelete.value = expense;
  deleteExpenseModalOpen.value = true;
};

const handleDeleteExpense = async () => {
  if (expenseToDelete.value) {
    try {
      expensesLoading.value = true;
      await financeStore.deleteExpense(expenseToDelete.value.id);

      await Promise.all([
        loadCardExpenses(String(expenseToDelete.value.creditCardId)),
        financeStore.fetchCreditCards(),
      ]);

      deleteExpenseModalOpen.value = false;
      expenseToDelete.value = null;
    } catch (err) {
      console.error("Erro ao deletar gasto:", err);
    } finally {
      expensesLoading.value = false;
    }
  }
};

const toggleExpensePaid = async (expense: CreditCardExpense) => {
  try {
    expensesLoading.value = true;
    await financeStore.toggleExpensePaid(expense.id);

    await Promise.all([
      loadCardExpenses(String(expense.creditCardId)),
      financeStore.fetchCreditCards(),
    ]);
  } catch (err) {
    console.error("Erro ao atualizar status do gasto:", err);
  } finally {
    expensesLoading.value = false;
  }
};

const toggleExpenses = async (cardId: string) => {
  if (expandedCards.value.has(cardId)) {
    expandedCards.value.delete(cardId);
    const { [cardId]: _, ...rest } = cardExpenses.value;
    cardExpenses.value = rest;
  } else {
    expandedCards.value.add(cardId);
    await loadCardExpenses(cardId);
  }
};

const loadCardExpenses = async (cardId: string) => {
  try {
    expensesLoading.value = true;

    const expenses = await financeStore.fetchActiveExpensesByCard(
      cardId,
      dateStore.monthYearString
    );

    cardExpenses.value = {
      ...cardExpenses.value,
      [cardId]: [...expenses],
    };
  } catch (err) {
    console.error("Erro ao carregar gastos do cartão:", err);
  } finally {
    expensesLoading.value = false;
  }
};

const getCardExpenses = (cardId: string): CreditCardExpense[] => {
  return cardExpenses.value[cardId] || [];
};

onMounted(async () => {
  if (mounted.value) return;
  mounted.value = true;
  loading.value = true;
  try {
    await nextTick();
    await financeStore.fetchCreditCards();
    await nextTick();
  } catch (err) {
    console.error("Erro ao carregar cartões:", err);
  } finally {
    loading.value = false;
  }
});

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

        const reloadPromises = [];
        for (const cardId of expandedCards.value) {
          reloadPromises.push(loadCardExpenses(cardId));
        }
        await Promise.all(reloadPromises);

        await nextTick();
      } catch (err) {
        console.error("Erro ao carregar cartões:", err);
      } finally {
        loading.value = false;
      }
    }, 100);
  }
);
</script>
