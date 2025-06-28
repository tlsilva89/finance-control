<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <TransitionGroup name="notification" tag="div" class="space-y-2">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="notificationClasses(notification.type)"
        class="max-w-sm w-full bg-dark-800 border rounded-lg shadow-lg p-4 flex items-start space-x-3"
      >
        <div class="flex-shrink-0">
          <component
            :is="getIcon(notification.type)"
            :class="iconClasses(notification.type)"
            class="w-5 h-5"
          />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-100">
            {{ notification.title }}
          </p>
          <p v-if="notification.message" class="text-sm text-gray-300 mt-1">
            {{ notification.message }}
          </p>
        </div>
        <button
          @click="removeNotification(notification.id)"
          class="flex-shrink-0 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <XMarkIcon class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useNotification } from "../../composables/useNotification";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";

const { notifications, removeNotification } = useNotification();

const getIcon = (type: string) => {
  const icons = {
    success: CheckCircleIcon,
    error: ExclamationCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
  };
  return icons[type as keyof typeof icons] || InformationCircleIcon;
};

const notificationClasses = (type: string) => {
  const classes = {
    success: "border-green-500",
    error: "border-red-500",
    warning: "border-yellow-500",
    info: "border-blue-500",
  };
  return classes[type as keyof typeof classes] || "border-gray-500";
};

const iconClasses = (type: string) => {
  const classes = {
    success: "text-green-400",
    error: "text-red-400",
    warning: "text-yellow-400",
    info: "text-blue-400",
  };
  return classes[type as keyof typeof classes] || "text-gray-400";
};
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
