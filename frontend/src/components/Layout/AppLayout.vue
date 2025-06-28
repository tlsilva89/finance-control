<template>
  <div class="min-h-screen bg-dark-950">
    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 bg-dark-900 border-r border-dark-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div
        class="flex items-center justify-between h-16 border-b border-dark-800 px-6"
      >
        <h1 class="text-xl font-bold text-primary-500">FinanceControl</h1>
        <button
          @click="sidebarOpen = false"
          class="lg:hidden text-gray-400 hover:text-white"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <nav class="mt-8">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          class="flex items-center px-6 py-3 text-gray-300 hover:bg-dark-800 hover:text-white transition-colors"
          :class="{
            'bg-dark-800 text-white border-r-2 border-primary-500':
              $route.path === item.path,
          }"
          @click="sidebarOpen = false"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3" />
          {{ item.name }}
        </router-link>
      </nav>

      <!-- User Info -->
      <div
        class="absolute bottom-0 left-0 right-0 p-6 border-t border-dark-800"
      >
        <div class="flex items-center space-x-3">
          <div
            class="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center"
          >
            <span class="text-white font-semibold">{{ userInitials }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-100 truncate">
              {{ user?.name }}
            </p>
            <p class="text-xs text-gray-400 truncate">{{ user?.email }}</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Overlay for mobile -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
    ></div>

    <!-- Main Content -->
    <main class="lg:ml-64">
      <!-- Header -->
      <header class="bg-dark-900 border-b border-dark-800 px-4 sm:px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button
              @click="sidebarOpen = true"
              class="lg:hidden text-gray-400 hover:text-white"
            >
              <Bars3Icon class="w-6 h-6" />
            </button>
            <h2 class="text-xl sm:text-2xl font-semibold text-gray-100">
              {{ pageTitle }}
            </h2>
          </div>
          <div class="flex items-center space-x-4">
            <div class="hidden sm:block text-right">
              <p class="text-sm font-medium text-gray-100">{{ user?.name }}</p>
              <p class="text-xs text-gray-400">{{ formatCurrency(balance) }}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              @click="logout"
              :icon="ArrowRightOnRectangleIcon"
            >
              <span class="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="p-4 sm:p-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { useFinanceStore } from "../../stores/finance";
import Button from "../UI/Button.vue";
import {
  HomeIcon,
  CreditCardIcon,
  BanknotesIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const financeStore = useFinanceStore();

const sidebarOpen = ref(false);

const user = computed(() => authStore.user);
const balance = computed(() => financeStore.balance);

const userInitials = computed(() => {
  if (!user.value?.name) return "U";
  return user.value.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
  { name: "Entradas", path: "/income", icon: BanknotesIcon },
  { name: "Cartões", path: "/credit-cards", icon: CreditCardIcon },
  { name: "Assinaturas", path: "/subscriptions", icon: Cog6ToothIcon },
  { name: "Serviços", path: "/services", icon: ChartBarIcon },
];

const pageTitle = computed(() => {
  const currentItem = menuItems.find((item) => item.path === route.path);
  return currentItem?.name || "Dashboard";
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const logout = () => {
  authStore.logout();
  router.push("/login");
};

onMounted(() => {
  financeStore.fetchAllData();
});
</script>
