<template>
  <div class="min-h-screen flex items-center justify-center bg-dark-950">
    <div class="max-w-md w-full space-y-8 p-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-100">
          {{ isLogin ? "Entrar" : "Criar Conta" }}
        </h2>
        <p class="mt-2 text-gray-400">
          {{ isLogin ? "Acesse sua conta" : "Crie sua conta gratuita" }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <div v-if="!isLogin" class="space-y-4">
          <input
            v-model="form.name"
            type="text"
            placeholder="Nome completo"
            class="input-field w-full"
            required
          />
        </div>

        <div class="space-y-4">
          <input
            v-model="form.email"
            type="email"
            placeholder="Email"
            class="input-field w-full"
            required
          />
          <input
            v-model="form.password"
            type="password"
            placeholder="Senha"
            class="input-field w-full"
            required
          />
        </div>

        <button type="submit" :disabled="loading" class="btn-primary w-full">
          {{ loading ? "Processando..." : isLogin ? "Entrar" : "Criar Conta" }}
        </button>

        <div class="text-center">
          <button
            type="button"
            @click="isLogin = !isLogin"
            class="text-primary-500 hover:text-primary-400"
          >
            {{ isLogin ? "Não tem conta? Criar uma" : "Já tem conta? Entrar" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const isLogin = ref(true);
const loading = ref(false);

const form = reactive({
  name: "",
  email: "",
  password: "",
});

const handleSubmit = async () => {
  loading.value = true;
  try {
    if (isLogin.value) {
      await authStore.login(form.email, form.password);
    } else {
      await authStore.register(form.name, form.email, form.password);
    }
    router.push("/dashboard");
  } catch (error) {
    console.error("Erro na autenticação:", error);
  } finally {
    loading.value = false;
  }
};
</script>
