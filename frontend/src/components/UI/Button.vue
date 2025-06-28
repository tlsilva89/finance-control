<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <div
      v-if="loading"
      class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
    ></div>
    <component v-if="icon && !loading" :is="icon" :class="iconClasses" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  variant?: "primary" | "secondary" | "danger" | "success" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  icon?: any;
  iconPosition?: "left" | "right";
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  disabled: false,
  loading: false,
  iconPosition: "left",
});

defineEmits<{
  click: [];
}>();

const buttonClasses = computed(() => {
  const base =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500",
    secondary:
      "bg-dark-700 hover:bg-dark-600 text-gray-100 focus:ring-dark-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
    outline:
      "border border-dark-600 hover:bg-dark-800 text-gray-100 focus:ring-dark-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return `${base} ${variants[props.variant]} ${sizes[props.size]}`;
});

const iconClasses = computed(() => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const position = props.iconPosition === "left" ? "mr-2" : "ml-2";

  return `${sizes[props.size]} ${position}`;
});
</script>
