<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-100">Cartões de Crédito</h1>
        <button class="btn-primary">
          <PlusIcon class="w-5 h-5 mr-2" />
          Novo Cartão
        </button>
      </div>

      <div class="card">
        <h2 class="text-xl font-semibold mb-4">Meus Cartões</h2>
        <p class="text-gray-400">Funcionalidade em desenvolvimento...</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from "@/components/Layout/AppLayout.vue";
import { PlusIcon } from "@heroicons/vue/24/outline";
</script>
