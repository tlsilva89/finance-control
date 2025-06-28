<template>
  <SimpleModal :open="open" @close="$emit('cancel')">
    <!-- Content -->
    <div class="flex items-start space-x-4">
      <!-- Icon -->
      <div
        class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100"
      >
        <ExclamationTriangleIcon class="h-6 w-6 text-red-600" />
      </div>

      <!-- Text -->
      <div class="flex-1">
        <h3 class="text-lg font-semibold leading-6 text-gray-100 mb-2">
          {{ title }}
        </h3>
        <p class="text-sm text-gray-400">
          {{ message }}
        </p>
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex gap-3 mt-6">
      <button
        @click="$emit('cancel')"
        class="flex-1 px-4 py-2 text-sm font-medium text-gray-300 bg-dark-800 border border-dark-700 rounded-lg hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-dark-500 transition-colors"
      >
        Cancelar
      </button>
      <button
        @click="$emit('confirm')"
        class="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
      >
        Confirmar
      </button>
    </div>
  </SimpleModal>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon } from "@heroicons/vue/24/outline";
import SimpleModal from "./SimpleModal.vue";

defineProps<{
  open: boolean;
  title: string;
  message: string;
}>();

defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>
