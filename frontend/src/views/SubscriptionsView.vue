<template>
  <AppLayout>
    <div class="space-y-6">
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 class="text-3xl font-bold text-gray-100">Assinaturas</h1>
          <p class="text-gray-400 mt-1">
            Gerencie suas assinaturas mensais por mês
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
            @click="openModal()"
            class="hidden sm:flex"
          >
            Nova Assinatura
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
              {{ financeStore.currentMonthSubscriptions.length }} assinatura(s)
              registrada(s)
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
              <p class="text-gray-400 text-sm">Total Mensal</p>
              <p class="text-2xl font-bold text-purple-400">
                {{ formatCurrency(financeStore.totalSubscriptions) }}
              </p>
            </div>
            <Cog6ToothIcon class="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div
          class="bg-dark-900 border border-dark-800 rounded-xl p-4 sm:p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Streaming</p>
              <p class="text-2xl font-bold text-red-400">
                {{ formatCurrency(streamingTotal) }}
              </p>
            </div>
            <PlayIcon class="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div
          class="bg-dark-900 border border-dark-800 rounded-xl p-4 sm:p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Total de Assinaturas</p>
              <p class="text-2xl font-bold text-gray-100">
                {{ financeStore.currentMonthSubscriptions.length }}
              </p>
            </div>
            <DocumentTextIcon class="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      <div
        class="bg-dark-900 border border-dark-800 rounded-xl p-4 sm:p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-100">
            Minhas Assinaturas - {{ dateStore.currentMonthName }}
          </h2>
          <div class="flex items-center space-x-2">
            <select
              v-model="selectedCategory"
              class="bg-dark-800 border border-dark-700 text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Todas as categorias</option>
              <option value="Streaming">Streaming</option>
              <option value="Produtividade">Produtividade</option>
              <option value="Música">Música</option>
              <option value="Jogos">Jogos</option>
              <option value="Software">Software</option>
              <option value="Outros">Outros</option>
            </select>
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar assinaturas..."
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
          v-else-if="filteredSubscriptions.length === 0"
          class="text-center py-12"
        >
          <Cog6ToothIcon class="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-100 mb-2">
            Nenhuma assinatura encontrada
          </h3>
          <p class="text-gray-400 mb-6">
            Comece adicionando suas assinaturas para
            {{ dateStore.currentMonthName }}
          </p>
          <Button variant="primary" :icon="PlusIcon" @click="openModal()">
            Adicionar Primeira Assinatura
          </Button>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="subscription in filteredSubscriptions"
            :key="subscription.id"
            class="flex items-center justify-between p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors group"
          >
            <div class="flex items-center space-x-4">
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center"
                :class="getCategoryColor(subscription.category)"
              >
                <component
                  :is="getCategoryIcon(subscription.category)"
                  class="w-6 h-6 text-white"
                />
              </div>
              <div>
                <h3 class="font-medium text-gray-100">
                  {{ subscription.name }}
                </h3>
                <p class="text-sm text-gray-400">
                  {{ subscription.category }} • Renova em
                  {{ displayDate(subscription.renewalDate) }}
                </p>
              </div>
            </div>

            <div class="flex items-center space-x-4">
              <span class="text-lg font-semibold text-purple-400">
                {{ formatCurrency(subscription.amount) }}
              </span>

              <div
                class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <button
                  @click="openModal(subscription)"
                  class="p-2 text-gray-400 hover:text-blue-400 transition-colors rounded-lg hover:bg-dark-600"
                  title="Editar assinatura"
                >
                  <PencilIcon class="w-4 h-4" />
                </button>
                <button
                  @click="confirmDelete(subscription)"
                  class="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-dark-600"
                  title="Excluir assinatura"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <FloatingActionButton
      :icon="PlusIcon"
      tooltip="Nova Assinatura"
      @click="openModal()"
      class="sm:hidden"
    />

    <SubscriptionModal
      :open="modalOpen"
      :subscription="selectedSubscription"
      @close="closeModal"
      @submit="handleSubmit"
    />

    <ConfirmationModal
      :open="deleteModalOpen"
      title="Excluir Assinatura"
      message="Tem certeza que deseja excluir esta assinatura? Esta ação não pode ser desfeita."
      @confirm="handleDelete"
      @cancel="deleteModalOpen = false"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useFinanceStore } from "../stores/finance";
import { useDateReferenceStore } from "../stores/dateReference";
import { useDateFormat } from "../composables/useDateFormat";
import AppLayout from "../components/Layout/AppLayout.vue";
import Button from "../components/UI/Button.vue";
import SubscriptionModal from "../components/UI/SubscriptionModal.vue";
import FloatingActionButton from "../components/UI/FloatingActionButton.vue";
import ConfirmationModal from "../components/UI/ConfirmationModal.vue";
import {
  PlusIcon,
  Cog6ToothIcon,
  PlayIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  InformationCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MusicalNoteIcon,
  ComputerDesktopIcon,
  PuzzlePieceIcon,
  CodeBracketIcon,
} from "@heroicons/vue/24/outline";

interface Subscription {
  id: string;
  name: string;
  amount: number;
  renewalDate: string;
  category: string;
  monthReference: string;
  createdAt: string;
}

const financeStore = useFinanceStore();
const dateStore = useDateReferenceStore();
const { displayDate } = useDateFormat();

const loading = ref(false);
const modalOpen = ref(false);
const deleteModalOpen = ref(false);
const selectedSubscription = ref<Subscription | null>(null);
const subscriptionToDelete = ref<Subscription | null>(null);
const searchTerm = ref("");
const selectedCategory = ref("");
const mounted = ref(false);

const streamingTotal = computed(() =>
  financeStore.currentMonthSubscriptions
    .filter((sub) => sub.category === "Streaming")
    .reduce((sum, sub) => sum + sub.amount, 0)
);

const filteredSubscriptions = computed(() => {
  let filtered = financeStore.currentMonthSubscriptions;

  if (selectedCategory.value) {
    filtered = filtered.filter(
      (sub) => sub.category === selectedCategory.value
    );
  }

  if (searchTerm.value) {
    filtered = filtered.filter(
      (sub) =>
        sub.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        sub.category.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  }

  return filtered;
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const getCategoryIcon = (category: string) => {
  const icons = {
    Streaming: PlayIcon,
    Música: MusicalNoteIcon,
    Produtividade: ComputerDesktopIcon,
    Jogos: PuzzlePieceIcon,
    Software: CodeBracketIcon,
    Outros: Cog6ToothIcon,
  };
  return icons[category as keyof typeof icons] || Cog6ToothIcon;
};

const getCategoryColor = (category: string) => {
  const colors = {
    Streaming: "bg-red-600",
    Música: "bg-green-600",
    Produtividade: "bg-blue-600",
    Jogos: "bg-purple-600",
    Software: "bg-indigo-600",
    Outros: "bg-gray-600",
  };
  return colors[category as keyof typeof colors] || "bg-gray-600";
};

const openModal = (subscription: Subscription | null = null) => {
  selectedSubscription.value = subscription;
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
  selectedSubscription.value = null;
};

const handleSubmit = async (subscriptionData: any) => {
  try {
    loading.value = true;

    if (subscriptionData.id) {
      await financeStore.updateSubscription(
        subscriptionData.id,
        subscriptionData
      );
    } else {
      await financeStore.addSubscription(subscriptionData);
    }

    closeModal();
  } catch (err) {
    console.error("Erro ao salvar assinatura:", err);
  } finally {
    loading.value = false;
  }
};

const confirmDelete = (subscription: Subscription) => {
  subscriptionToDelete.value = subscription;
  deleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (subscriptionToDelete.value) {
    try {
      loading.value = true;
      await financeStore.deleteSubscription(subscriptionToDelete.value.id);
      deleteModalOpen.value = false;
      subscriptionToDelete.value = null;
    } catch (err) {
      console.error("Erro ao deletar assinatura:", err);
    } finally {
      loading.value = false;
    }
  }
};

onMounted(async () => {
  if (mounted.value) return;
  mounted.value = true;

  loading.value = true;
  try {
    await nextTick();
    await financeStore.fetchSubscriptions();
  } catch (err) {
    console.error("Erro ao carregar assinaturas:", err);
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
        await financeStore.fetchSubscriptions();
      } catch (err) {
        console.error("Erro ao carregar assinaturas:", err);
      } finally {
        loading.value = false;
      }
    }, 100);
  }
);
</script>
