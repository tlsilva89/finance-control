
<template>
  <div class="bg-dark-800 border border-dark-600 rounded-lg p-3 mb-3">
    <div class="flex justify-between items-center mb-2">
      <span class="text-sm font-medium text-gray-300">{{ description }}</span>
      <span class="text-xs text-gray-400">{{ category }}</span>
    </div>
    
    <div class="flex justify-between items-center text-sm mb-2">
      <span class="text-gray-400">Parcela:</span>
      <span class="font-semibold text-yellow-400">
        {{ currentInstallment }} de {{ totalInstallments }}
      </span>
    </div>
    
    <div class="flex justify-between items-center text-sm mb-3">
      <span class="text-gray-400">Valor desta parcela:</span>
      <span class="font-semibold text-green-400">
        {{ formatCurrency(installmentAmount) }}
      </span>
    </div>
    
    <!-- Barra de progresso -->
    <div class="w-full bg-dark-700 rounded-full h-2 mb-2">
      <div 
        class="bg-primary-500 h-2 rounded-full transition-all duration-300"
        :style="{ width: `${progressPercentage}%` }"
      ></div>
    </div>
    
    <div class="flex justify-between text-xs text-gray-400">
      <span>Comprada em {{ formatDate(purchaseDate) }}</span>
      <span>{{ progressPercentage.toFixed(1) }}% pago</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  description: string;
  category: string;
  purchaseDate: string;
  totalInstallments: number;
  currentInstallment: number;
  installmentAmount: number;
}

const props = defineProps<Props>();

const progressPercentage = computed(() => {
  return (props.currentInstallment / props.totalInstallments) * 100;
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("pt-BR");
};
</script>
