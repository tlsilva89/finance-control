<template>
  <div class="flex items-center space-x-4">
    <div
      class="flex items-center space-x-2 bg-dark-900 border border-dark-700 rounded-lg p-2"
    >
      <button
        @click="dateStore.previousMonth()"
        class="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-dark-700"
        :disabled="!dateStore.canGoPrevious"
        :class="{ 'opacity-50 cursor-not-allowed': !dateStore.canGoPrevious }"
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
  </div>
</template>

<script setup lang="ts">
import { useDateReferenceStore } from "../../stores/dateReference";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";

const dateStore = useDateReferenceStore();
</script>
