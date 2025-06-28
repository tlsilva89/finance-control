<template>
  <button @click="$emit('click')" :class="buttonClasses" class="group relative">
    <div
      class="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"
    ></div>
    <div
      class="relative bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 transition-all duration-300 transform group-hover:scale-110 shadow-lg"
    >
      <component :is="icon" class="w-6 h-6" />
    </div>

    <!-- Tooltip -->
    <div
      class="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-dark-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
    >
      {{ tooltip }}
      <div
        class="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-dark-800"
      ></div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  icon: any;
  tooltip: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

const props = withDefaults(defineProps<Props>(), {
  position: "bottom-right",
});

defineEmits<{
  click: [];
}>();

const buttonClasses = computed(() => {
  const positions = {
    "bottom-right": "fixed bottom-6 right-6 z-40",
    "bottom-left": "fixed bottom-6 left-6 z-40",
    "top-right": "fixed top-6 right-6 z-40",
    "top-left": "fixed top-6 left-6 z-40",
  };

  return positions[props.position];
});
</script>
