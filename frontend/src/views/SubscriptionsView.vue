<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 class="text-3xl font-bold text-gray-100">Assinaturas</h1>
          <p class="text-gray-400 mt-1">Gerencie suas assinaturas mensais</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="text-right">
            <p class="text-sm text-gray-400">Total Mensal</p>
            <p class="text-2xl font-bold text-purple-400">
              {{ formatCurrency(totalSubscriptions) }}
            </p>
          </div>
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

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <p class="text-gray-400 text-sm">Próxima Renovação</p>
              <p class="text-lg font-semibold text-yellow-400">
                {{ nextRenewalDate }}
              </p>
            </div>
            <CalendarIcon class="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div
          class="bg-dark-900 border border-dark-800 rounded-xl p-4 sm:p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Total de Assinaturas</p>
              <p class="text-2xl font-bold text-gray-100">
                {{ subscriptions.length }}
              </p>
            </div>
            <DocumentTextIcon class="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      <!-- Categorias de Assinaturas -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          class="bg-dark-900 border border-dark-800 rounded-xl p-4 sm:p-6 shadow-lg"
        >
          <h3 class="text-lg font-semibold text-gray-100 mb-4">
            Por Categoria
          </h3>
          <div class="space-y-3">
            <div
              v-for="category in subscriptionsByCategory"
              :key="category.name"
              class="flex items-center justify-between p-3 bg-dark-800 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="w-3 h-3 rounded-full"
                  :style="{ backgroundColor: category.color }"
                ></div>
                <span class="text-gray-100">{{ category.name }}</span>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-100">
                  {{ formatCurrency(category.total) }}
                </p>
                <p class="text-xs text-gray-400">
                  {{ category.count }} assinaturas
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-dark-900 border border-dark-800 rounded-xl p-4 sm:p-6 shadow-lg"
        >
          <h3 class="text-lg font-semibold text-gray-100 mb-4">
            Próximas Renovações
          </h3>
          <div class="space-y-3">
            <div
              v-for="subscription in upcomingRenewals"
              :key="subscription.id"
              class="flex items-center justify-between p-3 bg-dark-800 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <component
                  :is="getCategoryIcon(subscription.category)"
                  class="w-5 h-5 text-gray-400"
                />
                <div>
                  <p class="font-medium text-gray-100">
                    {{ subscription.name }}
                  </p>
                  <p class="text-xs text-gray-400">
                    {{ subscription.category }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-semibold text-purple-400">
                  {{ formatCurrency(subscription.amount) }}
                </p>
                <p class="text-xs text-gray-400">
                  {{ formatDate(subscription.renewalDate) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de Assinaturas -->
      <div
        class="bg-dark-900 border border-dark-800 rounded-xl p-4 sm:p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-100">
            Minhas Assinaturas
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
            Comece adicionando suas assinaturas mensais
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
                  {{ formatDate(subscription.renewalDate) }}
                </p>
                <div class="flex items-center space-x-2 mt-1">
                  <div
                    class="w-2 h-2 rounded-full"
                    :class="getRenewalStatus(subscription.renewalDate)"
                  ></div>
                  <span class="text-xs text-gray-400">
                    {{ getRenewalText(subscription.renewalDate) }}
                  </span>
                </div>
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

    <!-- Floating Action Button (Mobile) -->
    <FloatingActionButton
      :icon="PlusIcon"
      tooltip="Nova Assinatura"
      @click="openModal()"
      class="sm:hidden"
    />

    <!-- Modal -->
    <SubscriptionModal
      :open="modalOpen"
      :subscription="selectedSubscription"
      @close="closeModal"
      @submit="handleSubmit"
    />

    <!-- Delete Confirmation Modal -->
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
import { ref, computed, onMounted } from "vue";
import { useFinanceStore } from "../stores/finance";
import AppLayout from "../components/Layout/AppLayout.vue";
import Button from "../components/UI/Button.vue";
import SubscriptionModal from "../components/UI/SubscriptionModal.vue";
import FloatingActionButton from "../components/UI/FloatingActionButton.vue";
import ConfirmationModal from "../components/UI/ConfirmationModal.vue";
import {
  PlusIcon,
  Cog6ToothIcon,
  PlayIcon,
  CalendarIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  MusicalNoteIcon,
  ComputerDesktopIcon,
  PuzzlePieceIcon,
  CodeBracketIcon,
} from "@heroicons/vue/24/outline";

// Interface para Subscription
interface Subscription {
  id: string;
  name: string;
  amount: number;
  renewalDate: string;
  category: string;
  createdAt: string;
}

const financeStore = useFinanceStore();

// Estados reativos
const loading = ref(false);
const modalOpen = ref(false);
const deleteModalOpen = ref(false);
const selectedSubscription = ref<Subscription | null>(null);
const subscriptionToDelete = ref<Subscription | null>(null);
const searchTerm = ref("");
const selectedCategory = ref("");

// Computed properties
const subscriptions = computed(() => financeStore.subscriptions || []);
const totalSubscriptions = computed(() => financeStore.totalSubscriptions || 0);

const streamingTotal = computed(() =>
  subscriptions.value
    .filter((sub) => sub.category === "Streaming")
    .reduce((sum, sub) => sum + sub.amount, 0)
);

const nextRenewalDate = computed(() => {
  if (subscriptions.value.length === 0) return "Nenhuma";

  const upcoming = subscriptions.value
    .map((sub) => ({ ...sub, date: new Date(sub.renewalDate) }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .find((sub) => sub.date >= new Date());

  return upcoming ? formatDate(upcoming.renewalDate) : "Próximo mês";
});

const upcomingRenewals = computed(() => {
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  return subscriptions.value
    .filter((sub) => {
      const renewalDate = new Date(sub.renewalDate);
      return renewalDate >= today && renewalDate <= nextWeek;
    })
    .sort(
      (a, b) =>
        new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime()
    )
    .slice(0, 5);
});

const subscriptionsByCategory = computed(() => {
  const categories = subscriptions.value.reduce((acc, subscription) => {
    if (!acc[subscription.category]) {
      acc[subscription.category] = { total: 0, count: 0 };
    }
    acc[subscription.category].total += subscription.amount;
    acc[subscription.category].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const colors = [
    "#8b5cf6",
    "#ef4444",
    "#f59e0b",
    "#10b981",
    "#3b82f6",
    "#f97316",
  ];

  return Object.entries(categories).map(([name, data], index) => ({
    name,
    total: data.total,
    count: data.count,
    color: colors[index % colors.length],
  }));
});

const filteredSubscriptions = computed(() => {
  let filtered = subscriptions.value;

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

const getRenewalStatus = (renewalDate: string) => {
  const today = new Date();
  const renewal = new Date(renewalDate);
  const diffDays = Math.ceil(
    (renewal.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays <= 3) return "bg-red-500";
  if (diffDays <= 7) return "bg-yellow-500";
  return "bg-green-500";
};

const getRenewalText = (renewalDate: string) => {
  const today = new Date();
  const renewal = new Date(renewalDate);
  const diffDays = Math.ceil(
    (renewal.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays <= 0) return "Vencida";
  if (diffDays === 1) return "Vence amanhã";
  if (diffDays <= 7) return `Vence em ${diffDays} dias`;
  return "Em dia";
};

// Funções de controle do modal
const openModal = (subscription: Subscription | null = null) => {
  selectedSubscription.value = subscription;
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
  selectedSubscription.value = null;
};

// Funções de CRUD
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

// Lifecycle
onMounted(async () => {
  loading.value = true;
  try {
    await financeStore.fetchSubscriptions();
  } catch (err) {
    console.error("Erro ao carregar assinaturas:", err);
  } finally {
    loading.value = false;
  }
});
</script>
