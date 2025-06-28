<template>
  <div
    class="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 flex flex-col"
  >
    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 bg-dark-900/95 backdrop-blur-xl border-r border-dark-800/50 transform transition-all duration-300 ease-in-out lg:translate-x-0 shadow-2xl flex flex-col"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Header do Sidebar com Logo Tipográfico -->
      <div
        class="flex items-center justify-between h-16 border-b border-dark-800/50 px-6 bg-dark-800/80"
      >
        <div class="flex items-center space-x-3">
          <!-- Logo Tipográfico Elegante sem fundo colorido -->
          <div class="relative">
            <div class="text-2xl font-bold tracking-tight">
              <span class="text-white">Finance</span
              ><span class="text-primary-400 font-light">Control</span>
            </div>
            <div
              class="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary-400 to-transparent rounded-full"
            ></div>
          </div>
        </div>
        <button
          @click="sidebarOpen = false"
          class="lg:hidden text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="mt-6 px-3 flex-1">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          class="group flex items-center px-3 py-3 mb-2 text-gray-300 rounded-xl transition-all duration-200 hover:bg-dark-800/80 hover:text-white relative overflow-hidden"
          :class="{
            'bg-gradient-to-r from-primary-600/20 to-primary-700/20 text-white border border-primary-500/30 shadow-lg shadow-primary-500/10':
              $route.path === item.path,
          }"
          @click="sidebarOpen = false"
        >
          <!-- Active indicator -->
          <div
            v-if="$route.path === item.path"
            class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-400 to-primary-600 rounded-r-full"
          ></div>

          <div
            class="flex items-center justify-center w-10 h-10 rounded-lg mr-3 transition-all duration-200"
            :class="
              $route.path === item.path
                ? 'bg-primary-500/20'
                : 'bg-dark-800/50 group-hover:bg-primary-500/10'
            "
          >
            <component :is="item.icon" class="w-5 h-5" />
          </div>

          <span class="font-medium">{{ item.name }}</span>

          <!-- Hover effect -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"
          ></div>
        </router-link>
      </nav>

      <!-- User Info Movido para o Final da Sidebar -->
      <div
        class="mt-auto p-4 border-t border-dark-800/50 bg-dark-900/50 backdrop-blur-sm"
      >
        <div
          class="flex items-center space-x-3 p-3 rounded-xl bg-dark-800/50 border border-dark-700/50 hover:bg-dark-800/70 transition-all duration-200 cursor-pointer group"
        >
          <div class="relative">
            <!-- Avatar com Gradiente e Ícone de Perfil -->
            <div
              class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg border-2 border-primary-400/20 group-hover:scale-105 transition-transform duration-200"
            >
              <UserIcon class="w-6 h-6 text-white" />
            </div>
            <!-- Status Online -->
            <div
              class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-dark-900 shadow-sm"
            >
              <div
                class="w-full h-full bg-green-400 rounded-full animate-pulse"
              ></div>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p
              class="text-sm font-medium text-gray-100 truncate group-hover:text-white transition-colors"
            >
              {{ user?.name || "Usuário" }}
            </p>
            <p
              class="text-xs text-gray-400 truncate group-hover:text-gray-300 transition-colors"
            >
              {{ user?.email || "email@exemplo.com" }}
            </p>
          </div>
          <!-- Indicador de Menu -->
          <div
            class="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <ChevronRightIcon class="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </aside>

    <!-- Overlay for mobile -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-all duration-300"
    ></div>

    <!-- Main Content -->
    <main class="lg:ml-64 flex flex-col min-h-screen">
      <!-- Header -->
      <header
        class="sticky top-0 z-30 bg-dark-900/95 backdrop-blur-xl border-b border-dark-800/50 px-4 sm:px-6 py-4 shadow-lg"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button
              @click="sidebarOpen = true"
              class="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-dark-800/50 rounded-lg transition-all duration-200"
            >
              <Bars3Icon class="w-6 h-6" />
            </button>

            <div class="flex items-center space-x-3">
              <div
                class="hidden sm:flex w-10 h-10 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-xl items-center justify-center border border-primary-500/20"
              >
                <component
                  :is="currentPageIcon"
                  class="w-5 h-5 text-primary-400"
                />
              </div>
              <div>
                <h2 class="text-xl sm:text-2xl font-bold text-gray-100">
                  {{ pageTitle }}
                </h2>
                <p class="text-xs text-gray-400 hidden sm:block">
                  {{ pageSubtitle }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Balance Display -->
            <div
              class="hidden md:flex items-center space-x-4 px-4 py-2 bg-dark-800/50 rounded-xl border border-dark-700/50"
            >
              <div class="text-right">
                <p class="text-xs text-gray-400">Saldo Total</p>
                <p class="text-sm font-bold text-green-400">
                  {{ formatCurrency(totalBalance) }}
                </p>
              </div>
              <div
                class="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center"
              >
                <BanknotesIcon class="w-4 h-4 text-green-400" />
              </div>
            </div>

            <!-- User Menu -->
            <div class="relative">
              <button
                @click="userMenuOpen = !userMenuOpen"
                class="flex items-center space-x-3 p-2 rounded-xl hover:bg-dark-800/50 transition-all duration-200 border border-transparent hover:border-dark-700/50"
              >
                <div class="hidden sm:block text-right">
                  <p class="text-sm font-medium text-gray-100">
                    {{ user?.name || "Usuário" }}
                  </p>
                  <p class="text-xs text-gray-400">Online</p>
                </div>
                <div class="relative">
                  <!-- Avatar Melhorado no Header -->
                  <div
                    class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center border border-primary-400/20"
                  >
                    <UserIcon class="w-5 h-5 text-white" />
                  </div>
                  <div
                    class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-dark-900"
                  ></div>
                </div>
                <ChevronDownIcon
                  class="w-4 h-4 text-gray-400 transition-transform duration-200"
                  :class="{ 'rotate-180': userMenuOpen }"
                />
              </button>

              <!-- User Dropdown -->
              <div
                v-if="userMenuOpen"
                class="absolute right-0 mt-2 w-48 bg-dark-800/95 backdrop-blur-xl border border-dark-700/50 rounded-xl shadow-2xl py-2 z-50"
                @click.stop
              >
                <div class="px-4 py-3 border-b border-dark-700/50">
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center"
                    >
                      <UserIcon class="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-100">
                        {{ user?.name }}
                      </p>
                      <p class="text-xs text-gray-400">{{ user?.email }}</p>
                    </div>
                  </div>
                </div>

                <button
                  @click="logout"
                  class="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                  <ArrowRightOnRectangleIcon class="w-4 h-4 mr-3" />
                  Sair da Conta
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="flex-1 p-4 sm:p-6">
        <slot />
      </div>

      <!-- Footer Fixo no Final -->
      <footer
        class="mt-auto border-t border-dark-800/50 bg-dark-900/50 backdrop-blur-sm px-4 sm:px-6 py-6"
      >
        <div
          class="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0"
        >
          <div class="flex items-center space-x-2">
            <!-- Logo Pequeno no Footer -->
            <div class="text-lg font-bold text-gray-400">
              <span>Finance</span
              ><span class="text-primary-400 font-light">Control</span>
            </div>
            <span class="text-gray-600">•</span>
            <p class="text-xs text-gray-400">
              © 2025 Todos os direitos reservados.
            </p>
          </div>
          <div class="flex items-center space-x-4 text-xs text-gray-400">
            <span
              class="px-2 py-1 bg-primary-500/10 text-primary-400 rounded-full border border-primary-500/20"
              >v1.0.0</span
            >
            <span>•</span>
            <span>{{ new Date().toLocaleDateString("pt-BR") }}</span>
            <span>•</span>
            <span>{{
              new Date().toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })
            }}</span>
          </div>
        </div>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { useFinanceStore } from "../../stores/finance";
import {
  HomeIcon,
  CreditCardIcon,
  BanknotesIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  UserIcon,
} from "@heroicons/vue/24/outline";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const financeStore = useFinanceStore();

const sidebarOpen = ref(false);
const userMenuOpen = ref(false);

const user = computed(() => authStore.user);

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: HomeIcon,
    subtitle: "Visão geral das finanças",
  },
  {
    name: "Entradas",
    path: "/income",
    icon: BanknotesIcon,
    subtitle: "Gerencie suas fontes de renda",
  },
  {
    name: "Cartões",
    path: "/credit-cards",
    icon: CreditCardIcon,
    subtitle: "Controle seus cartões de crédito",
  },
  {
    name: "Assinaturas",
    path: "/subscriptions",
    icon: Cog6ToothIcon,
    subtitle: "Gerencie suas assinaturas mensais",
  },
  {
    name: "Serviços",
    path: "/services",
    icon: ChartBarIcon,
    subtitle: "Controle seus serviços de consumo",
  },
];

const pageTitle = computed(() => {
  const currentItem = menuItems.find((item) => item.path === route.path);
  return currentItem?.name || "Dashboard";
});

const pageSubtitle = computed(() => {
  const currentItem = menuItems.find((item) => item.path === route.path);
  return currentItem?.subtitle || "Controle financeiro pessoal";
});

const currentPageIcon = computed(() => {
  const currentItem = menuItems.find((item) => item.path === route.path);
  return currentItem?.icon || HomeIcon;
});

const totalBalance = computed(() => {
  return financeStore.balance || 0;
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const logout = () => {
  userMenuOpen.value = false;
  authStore.logout();
  router.push("/login");
};

// Close dropdowns when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as Element;
  if (!target.closest(".relative")) {
    userMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  financeStore.fetchAllData?.();
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
/* Custom scrollbar for sidebar */
aside::-webkit-scrollbar {
  width: 4px;
}

aside::-webkit-scrollbar-track {
  background: transparent;
}

aside::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 2px;
}

aside::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}
</style>
