<template>
  <div id="app" class="dark">
    <RouterView />
    <NotificationContainer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "./stores/auth";
import NotificationContainer from "./components/UI/NotificationContainer.vue";

const authStore = useAuthStore();

onMounted(() => {
  // Verificar se há token salvo no localStorage
  const token = localStorage.getItem("token");
  if (token) {
    authStore.token = token;
    authStore.isAuthenticated = true;
    // Aqui você pode fazer uma chamada para validar o token
  }
});
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
