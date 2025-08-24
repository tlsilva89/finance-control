<template>
  <AppLayout>
    <div class="space-y-6">
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 class="text-3xl font-bold text-gray-100">Serviços</h1>
          <p class="text-gray-400 mt-1">
            Gerencie seus serviços de consumo por mês
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
            Novo Serviço
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
              {{ financeStore.currentMonthServices.length }} serviço(s)
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
              <p class="text-gray-400 text-sm">Total Mensal</p>
              <p class="text-2xl font-bold text-orange-400">
                {{ formatCurrency(financeStore.totalServices) }}
              </p>
            </div>
            <ChartBarIcon class="w-8 h-8 text-orange-400" />
          </div>
        </div>

        <div
          class="bg-dark-900 border border-dark-800 rounded-xl p-4 sm:p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Serviços Básicos</p>
              <p class="text-2xl font-bold text-blue-400">
                {{ formatCurrency(basicServicesTotal) }}
              </p>
            </div>
            <HomeIcon class="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div
          class="bg-dark-900 border border-dark-800 rounded-xl p-4 sm:p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Total de Serviços</p>
              <p class="text-2xl font-bold text-gray-100">
                {{ financeStore.currentMonthServices.length }}
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
            Meus Serviços - {{ dateStore.currentMonthName }}
          </h2>
          <div class="flex items-center space-x-2">
            <select
              v-model="selectedCategory"
              class="bg-dark-800 border border-dark-700 text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Todas as categorias</option>
              <option value="Moradia">Moradia</option>
              <option value="Energia">Energia</option>
              <option value="Água">Água</option>
              <option value="Internet">Internet</option>
              <option value="Telefone">Telefone</option>
              <option value="Gás">Gás</option>
              <option value="Outros">Outros</option>
            </select>
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar serviços..."
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
          v-else-if="filteredServices.length === 0"
          class="text-center py-12"
        >
          <ChartBarIcon class="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-100 mb-2">
            Nenhum serviço encontrado
          </h3>
          <p class="text-gray-400 mb-6">
            Comece adicionando seus serviços para
            {{ dateStore.currentMonthName }}
          </p>
          <Button variant="primary" :icon="PlusIcon" @click="openModal()">
            Adicionar Primeiro Serviço
          </Button>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="service in filteredServices"
            :key="service.id"
            class="flex items-center justify-between p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors group"
          >
            <div class="flex items-center space-x-4">
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center"
                :class="getCategoryColor(service.category)"
              >
                <component
                  :is="getCategoryIcon(service.category)"
                  class="w-6 h-6 text-white"
                />
              </div>
              <div>
                <h3 class="font-medium text-gray-100">{{ service.name }}</h3>
                <p class="text-sm text-gray-400">
                  {{ service.category }} • Vence dia {{ service.dueDate }}
                </p>
              </div>
            </div>

            <div class="flex items-center space-x-4">
              <span class="text-lg font-semibold text-orange-400">
                {{ formatCurrency(service.amount) }}
              </span>

              <div
                class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <button
                  @click="openModal(service)"
                  class="p-2 text-gray-400 hover:text-blue-400 transition-colors rounded-lg hover:bg-dark-600"
                  title="Editar serviço"
                >
                  <PencilIcon class="w-4 h-4" />
                </button>
                <button
                  @click="confirmDelete(service)"
                  class="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-dark-600"
                  title="Excluir serviço"
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
      tooltip="Novo Serviço"
      @click="openModal()"
      class="sm:hidden"
    />

    <ServiceModal
      :open="modalOpen"
      :service="selectedService"
      @close="closeModal"
      @submit="handleSubmit"
    />

    <ConfirmationModal
      :open="deleteModalOpen"
      title="Excluir Serviço"
      message="Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita."
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
import ServiceModal from "../components/UI/ServiceModal.vue";
import FloatingActionButton from "../components/UI/FloatingActionButton.vue";
import ConfirmationModal from "../components/UI/ConfirmationModal.vue";
import {
  PlusIcon,
  ChartBarIcon,
  HomeIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  InformationCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BoltIcon,
  GlobeAltIcon,
  PhoneIcon,
  FireIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/vue/24/outline";

interface Service {
  id: string;
  name: string;
  amount: number;
  dueDate: number;
  category: string;
  monthReference: string;
  createdAt: string;
}

const financeStore = useFinanceStore();
const dateStore = useDateReferenceStore();

const loading = ref(false);
const modalOpen = ref(false);
const deleteModalOpen = ref(false);
const selectedService = ref<Service | null>(null);
const serviceToDelete = ref<Service | null>(null);
const searchTerm = ref("");
const selectedCategory = ref("");
const mounted = ref(false);

const basicServicesTotal = computed(() =>
  financeStore.currentMonthServices
    .filter((service) =>
      ["Moradia", "Energia", "Água", "Internet"].includes(service.category)
    )
    .reduce((sum, service) => sum + service.amount, 0)
);

const filteredServices = computed(() => {
  let filtered = financeStore.currentMonthServices;

  if (selectedCategory.value) {
    filtered = filtered.filter(
      (service) => service.category === selectedCategory.value
    );
  }

  if (searchTerm.value) {
    filtered = filtered.filter(
      (service) =>
        service.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.value.toLowerCase())
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
    Moradia: HomeIcon,
    Energia: BoltIcon,
    Água: WrenchScrewdriverIcon,
    Internet: GlobeAltIcon,
    Telefone: PhoneIcon,
    Gás: FireIcon,
    Outros: ChartBarIcon,
  };
  return icons[category as keyof typeof icons] || ChartBarIcon;
};

const getCategoryColor = (category: string) => {
  const colors = {
    Moradia: "bg-blue-600",
    Energia: "bg-yellow-600",
    Água: "bg-cyan-600",
    Internet: "bg-purple-600",
    Telefone: "bg-green-600",
    Gás: "bg-orange-600",
    Outros: "bg-gray-600",
  };
  return colors[category as keyof typeof colors] || "bg-gray-600";
};

const openModal = (service: Service | null = null) => {
  selectedService.value = service;
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
  selectedService.value = null;
};

const handleSubmit = async (serviceData: any) => {
  try {
    loading.value = true;

    if (serviceData.id) {
      await financeStore.updateService(serviceData.id, serviceData);
    } else {
      await financeStore.addService(serviceData);
    }

    closeModal();
  } catch (err) {
    console.error("Erro ao salvar serviço:", err);
  } finally {
    loading.value = false;
  }
};

const confirmDelete = (service: Service) => {
  serviceToDelete.value = service;
  deleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (serviceToDelete.value) {
    try {
      loading.value = true;
      await financeStore.deleteService(serviceToDelete.value.id);
      deleteModalOpen.value = false;
      serviceToDelete.value = null;
    } catch (err) {
      console.error("Erro ao deletar serviço:", err);
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
    await financeStore.fetchServices();
  } catch (err) {
    console.error("Erro ao carregar serviços:", err);
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
        await financeStore.fetchServices();
      } catch (err) {
        console.error("Erro ao carregar serviços:", err);
      } finally {
        loading.value = false;
      }
    }, 100);
  }
);
</script>
