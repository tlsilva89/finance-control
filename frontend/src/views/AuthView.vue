<template>
  <div
    class="min-h-screen flex items-center justify-center bg-dark-950 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div
          class="mx-auto h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center mb-4"
        >
          <BanknotesIcon class="h-6 w-6 text-white" />
        </div>
        <h2 class="text-3xl font-bold text-gray-100">
          {{ isLogin ? "Entrar" : "Criar Conta" }}
        </h2>
        <p class="mt-2 text-gray-400">
          {{ isLogin ? "Acesse sua conta" : "Crie sua conta gratuita" }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <div class="space-y-4">
          <div v-if="!isLogin">
            <label
              for="name"
              class="block text-sm font-medium text-gray-300 mb-1"
            >
              Nome completo
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              placeholder="Digite seu nome completo"
              class="input-field w-full"
              required
            />
          </div>

          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="Digite seu email"
              class="input-field w-full"
              required
            />
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-300 mb-1"
            >
              Senha
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="Digite sua senha"
              class="input-field w-full"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          :loading="authStore.loading"
          class="w-full"
        >
          {{ isLogin ? "Entrar" : "Criar Conta" }}
        </Button>

        <div class="text-center">
          <button
            type="button"
            @click="isLogin = !isLogin"
            class="text-primary-500 hover:text-primary-400 transition-colors"
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
import Button from "../components/UI/Button.vue";
import { BanknotesIcon } from "@heroicons/vue/24/outline";

const router = useRouter();
const authStore = useAuthStore();

const isLogin = ref(true);

const form = reactive({
  name: "",
  email: "",
  password: "",
});

const handleSubmit = async () => {
  try {
    if (isLogin.value) {
      await authStore.login(form.email, form.password);
    } else {
      await authStore.register(form.name, form.email, form.password);
    }
    router.push("/dashboard");
  } catch (error) {
    // Error handling is done in the store with toast notifications
  }
};
</script>
