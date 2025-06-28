<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Cards de Resumo -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="card in summaryCards"
          :key="card.title"
          class="card hover:bg-dark-800 transition-colors cursor-pointer"
          @click="navigateTo(card.route)"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">{{ card.title }}</p>
              <p class="text-2xl font-bold" :class="card.color">
                {{ formatCurrency(card.value) }}
              </p>
            </div>
            <component :is="card.icon" class="w-8 h-8" :class="card.color" />
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span :class="card.trend > 0 ? 'text-green-400' : 'text-red-400'">
              {{ card.trend > 0 ? "+" : "" }}{{ card.trend }}%
            </span>
            <span class="text-gray-400 ml-2">vs mês anterior</span>
          </div>
        </div>
      </div>

      <!-- Resumo Rápido -->
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Resumo Financeiro</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center p-4 bg-dark-800 rounded-lg">
            <p class="text-gray-400 text-sm">Saldo Total</p>
            <p class="text-2xl font-bold text-green-400">R$ 3.200,00</p>
          </div>
          <div class="text-center p-4 bg-dark-800 rounded-lg">
            <p class="text-gray-400 text-sm">Gastos do Mês</p>
            <p class="text-2xl font-bold text-red-400">R$ 2.300,00</p>
          </div>
          <div class="text-center p-4 bg-dark-800 rounded-lg">
            <p class="text-gray-400 text-sm">Economia</p>
            <p class="text-2xl font-bold text-blue-400">R$ 900,00</p>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import AppLayout from "../components/Layout/AppLayout.vue";
import {
  BanknotesIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  HomeIcon,
} from "@heroicons/vue/24/outline";

const router = useRouter();

const summaryCards = [
  {
    title: "Entradas",
    value: 5500.0,
    trend: 12.5,
    color: "text-green-400",
    icon: BanknotesIcon,
    route: "/income",
  },
  {
    title: "Cartões de Crédito",
    value: 2300.0,
    trend: -5.2,
    color: "text-red-400",
    icon: CreditCardIcon,
    route: "/credit-cards",
  },
  {
    title: "Assinaturas",
    value: 450.0,
    trend: 2.1,
    color: "text-yellow-400",
    icon: Cog6ToothIcon,
    route: "/subscriptions",
  },
  {
    title: "Serviços",
    value: 890.0,
    trend: -1.8,
    color: "text-blue-400",
    icon: HomeIcon,
    route: "/services",
  },
];

const navigateTo = (route: string) => {
  router.push(route);
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};
</script>
