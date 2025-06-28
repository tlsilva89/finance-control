<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center p-4"
  >
    <!-- Container Principal -->
    <div
      class="w-full max-w-5xl bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
    >
      <div class="flex flex-col lg:flex-row min-h-[600px]">
        <!-- Seção Esquerda - Branding -->
        <div
          class="lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 flex flex-col justify-center items-center text-center text-white relative overflow-hidden"
        >
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-10">
            <div
              class="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"
            ></div>
            <div
              class="absolute bottom-0 right-0 w-48 h-48 bg-white rounded-full translate-x-24 translate-y-24"
            ></div>
          </div>

          <!-- Logo Principal -->
          <div class="relative z-10 mb-8">
            <div class="mb-6">
              <div
                class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm"
              >
                <svg
                  class="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h1 class="text-4xl font-bold mb-2">
                <span class="text-white">Finance</span>
                <span class="text-cyan-300 ml-2">Control</span>
              </h1>
              <div
                class="w-24 h-1 bg-gradient-to-r from-cyan-300 to-white rounded-full mx-auto"
              ></div>
            </div>

            <h2 class="text-2xl font-light mb-4">
              Controle Financeiro Inteligente
            </h2>
            <p class="text-blue-100 text-lg leading-relaxed max-w-sm">
              Gerencie suas finanças pessoais com precisão e elegância.
              Dashboard completo para controle total.
            </p>
          </div>

          <!-- Features -->
          <div class="relative z-10 space-y-4 mt-8">
            <div class="flex items-center space-x-3 text-blue-100">
              <div class="w-2 h-2 bg-cyan-300 rounded-full"></div>
              <span class="text-sm">Dashboard interativo</span>
            </div>
            <div class="flex items-center space-x-3 text-blue-100">
              <div class="w-2 h-2 bg-cyan-300 rounded-full"></div>
              <span class="text-sm">Relatórios detalhados</span>
            </div>
            <div class="flex items-center space-x-3 text-blue-100">
              <div class="w-2 h-2 bg-cyan-300 rounded-full"></div>
              <span class="text-sm">Controle por período</span>
            </div>
          </div>
        </div>

        <!-- Seção Direita - Formulário -->
        <div class="lg:w-1/2 p-12 bg-white/5 backdrop-blur-sm">
          <div class="max-w-sm mx-auto">
            <!-- Header do Formulário -->
            <div class="text-center mb-8">
              <h3 class="text-3xl font-bold text-white mb-2">
                {{ isLogin ? "Bem-vindo!" : "Criar Conta" }}
              </h3>
              <p class="text-gray-300">
                {{
                  isLogin
                    ? "Entre na sua conta para continuar"
                    : "Preencha os dados para começar"
                }}
              </p>
            </div>

            <!-- Formulário -->
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Nome (apenas registro) -->
              <div v-if="!isLogin">
                <label
                  for="name"
                  class="block text-sm font-medium text-gray-200 mb-2"
                >
                  Nome Completo
                </label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  placeholder="Digite seu nome completo"
                />
              </div>

              <!-- Email -->
              <div>
                <label
                  for="email"
                  class="block text-sm font-medium text-gray-200 mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  placeholder="seu@email.com"
                />
              </div>

              <!-- Senha -->
              <div>
                <label
                  for="password"
                  class="block text-sm font-medium text-gray-200 mb-2"
                >
                  Senha
                </label>
                <div class="relative">
                  <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm pr-12"
                    placeholder="Digite sua senha"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                    <EyeSlashIcon v-else class="w-5 h-5" />
                  </button>
                </div>
              </div>

              <!-- Lembrar-me (apenas login) -->
              <div v-if="isLogin" class="flex items-center justify-between">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="rememberMe"
                    class="w-4 h-4 text-cyan-400 bg-white/10 border-white/20 rounded focus:ring-cyan-400 focus:ring-2"
                  />
                  <span class="ml-2 text-sm text-gray-300">Lembrar-me</span>
                </label>
                <button
                  type="button"
                  class="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Esqueci minha senha
                </button>
              </div>

              <!-- Botão Submit -->
              <button
                type="submit"
                :disabled="authStore.loading"
                class="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <div
                  v-if="authStore.loading"
                  class="flex items-center justify-center"
                >
                  <div
                    class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                  ></div>
                  Processando...
                </div>
                <span v-else>{{ isLogin ? "Entrar" : "Criar Conta" }}</span>
              </button>

              <!-- Divisor -->
              <div class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-white/20"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-2 bg-gray-900 text-gray-400">ou</span>
                </div>
              </div>

              <!-- Toggle Login/Register -->
              <div class="text-center">
                <p class="text-gray-300">
                  {{ isLogin ? "Não tem uma conta?" : "Já tem uma conta?" }}
                  <button
                    type="button"
                    @click="toggleMode"
                    class="text-cyan-400 hover:text-cyan-300 font-medium ml-1 transition-colors"
                  >
                    {{ isLogin ? "Criar uma agora" : "Fazer login" }}
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";

const router = useRouter();
const authStore = useAuthStore();

const isLogin = ref(true);
const showPassword = ref(false);
const rememberMe = ref(false);

const form = reactive({
  name: "",
  email: "",
  password: "",
});

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  form.name = "";
  form.email = "";
  form.password = "";
  showPassword.value = false;
};

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

<style scoped>
/* Efeitos de foco aprimorados */
input:focus {
  box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.1);
}

/* Animação suave para transições */
* {
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter,
    backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
