import { ref } from "vue";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

const notifications = ref<Notification[]>([]);

export const useNotification = () => {
  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      id,
      duration: 4000,
      ...notification,
    };

    notifications.value.push(newNotification);

    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  };

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };

  const success = (title: string, message?: string) => {
    return addNotification({ type: "success", title, message });
  };

  const error = (title: string, message?: string) => {
    return addNotification({ type: "error", title, message });
  };

  const warning = (title: string, message?: string) => {
    return addNotification({ type: "warning", title, message });
  };

  const info = (title: string, message?: string) => {
    return addNotification({ type: "info", title, message });
  };

  const clear = () => {
    notifications.value = [];
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
    clear,
  };
};
