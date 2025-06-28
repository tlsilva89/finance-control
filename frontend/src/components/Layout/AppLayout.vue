<template>
  <div class="min-h-screen bg-dark-950">
    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 bg-dark-900 border-r border-dark-800"
    >
      <div
        class="flex items-center justify-center h-16 border-b border-dark-800"
      >
        <h1 class="text-xl font-bold text-primary-500">FinanceControl</h1>
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
        >
          <component :is="item.icon" class="w-5 h-5 mr-3" />
          {{ item.name }}
        </router-link>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="ml-64">
      <!-- Header -->
      <header class="bg-dark-900 border-b border-dark-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-semibold text-gray-100">{{ pageTitle }}</h2>
          <div class="flex items-center space-x-4">
            <span class="text-gray-400">Usuário</span>
            <button @click="logout" class="btn-primary">Sair</button>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="p-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import {
  HomeIcon,
  CreditCardIcon,
  BanknotesIcon,
  Cog6ToothIcon,
  ChartBarIcon,
} from "@heroicons/vue/24/outline";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

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

const logout = () => {
  authStore.logout();
  router.push("/login");
};
</script>
