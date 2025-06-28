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
              <span class="text-sm">Recuperação segura de senha</span>
            </div>
          </div>
        </div>

        <!-- Seção Direita - Formulário -->
        <div
          class="lg:w-1/2 p-8 lg:p-12 bg-white/5 backdrop-blur-sm overflow-y-auto max-h-[600px]"
        >
          <div class="max-w-sm mx-auto">
            <!-- Formulário de Login/Registro -->
            <div v-if="currentView === 'auth'">
              <!-- Header do Formulário -->
              <div class="text-center mb-6">
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
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Nome Completo (apenas registro) -->
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

                <!-- Nome de Usuário -->
                <div>
                  <label
                    for="username"
                    class="block text-sm font-medium text-gray-200 mb-2"
                  >
                    Nome de Usuário
                  </label>
                  <div class="relative">
                    <input
                      id="username"
                      v-model="form.username"
                      type="text"
                      required
                      @blur="checkUsername"
                      class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                      placeholder="usuario123"
                    />
                    <div
                      v-if="usernameStatus"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <CheckIcon
                        v-if="usernameStatus === 'available'"
                        class="w-5 h-5 text-green-400"
                      />
                      <XMarkIcon
                        v-else-if="usernameStatus === 'taken'"
                        class="w-5 h-5 text-red-400"
                      />
                    </div>
                  </div>
                  <p
                    v-if="usernameMessage"
                    class="text-xs mt-1"
                    :class="
                      usernameStatus === 'available'
                        ? 'text-green-400'
                        : 'text-red-400'
                    "
                  >
                    {{ usernameMessage }}
                  </p>
                  <p class="text-xs text-gray-400 mt-1">
                    3-20 caracteres, apenas letras, números e underscore
                  </p>
                </div>

                <!-- Data de Nascimento (apenas registro) -->
                <div v-if="!isLogin">
                  <label
                    for="birthDate"
                    class="block text-sm font-medium text-gray-200 mb-2"
                  >
                    Data de Nascimento
                  </label>
                  <input
                    id="birthDate"
                    v-model="form.birthDate"
                    type="date"
                    required
                    class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
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

                <!-- Pergunta de Segurança (apenas registro) -->
                <div v-if="!isLogin" class="space-y-3">
                  <div>
                    <label
                      for="securityQuestion"
                      class="block text-sm font-medium text-gray-200 mb-2"
                    >
                      Pergunta de Segurança
                    </label>
                    <select
                      id="securityQuestion"
                      v-model="form.securityQuestion"
                      required
                      class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    >
                      <option value="" class="bg-gray-800">
                        Selecione uma pergunta
                      </option>
                      <option
                        value="Qual o nome do seu primeiro animal de estimação?"
                        class="bg-gray-800"
                      >
                        Qual o nome do seu primeiro animal de estimação?
                      </option>
                      <option
                        value="Em que cidade você nasceu?"
                        class="bg-gray-800"
                      >
                        Em que cidade você nasceu?
                      </option>
                      <option
                        value="Qual o nome da sua mãe?"
                        class="bg-gray-800"
                      >
                        Qual o nome da sua mãe?
                      </option>
                      <option
                        value="Qual era o modelo do seu primeiro carro?"
                        class="bg-gray-800"
                      >
                        Qual era o modelo do seu primeiro carro?
                      </option>
                      <option
                        value="Qual o nome da sua escola primária?"
                        class="bg-gray-800"
                      >
                        Qual o nome da sua escola primária?
                      </option>
                    </select>
                  </div>

                  <div v-if="form.securityQuestion">
                    <label
                      for="securityAnswer"
                      class="block text-sm font-medium text-gray-200 mb-2"
                    >
                      Resposta de Segurança
                    </label>
                    <input
                      id="securityAnswer"
                      v-model="form.securityAnswer"
                      type="text"
                      required
                      class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                      placeholder="Digite sua resposta"
                    />
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
                    @click="currentView = 'forgot'"
                    class="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <!-- Botão Submit -->
                <button
                  type="submit"
                  :disabled="
                    authStore.loading ||
                    (!isLogin && usernameStatus === 'taken')
                  "
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
                <div class="relative my-4">
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

            <!-- Formulário de Esqueci a Senha -->
            <div v-else-if="currentView === 'forgot'">
              <div class="text-center mb-6">
                <h3 class="text-3xl font-bold text-white mb-2">
                  Esqueci minha senha
                </h3>
                <p class="text-gray-300">
                  Digite seu nome de usuário para verificar
                </p>
              </div>

              <form @submit.prevent="handleForgotPassword" class="space-y-4">
                <div>
                  <label
                    for="forgotUsername"
                    class="block text-sm font-medium text-gray-200 mb-2"
                  >
                    Nome de Usuário
                  </label>
                  <input
                    id="forgotUsername"
                    v-model="forgotForm.username"
                    type="text"
                    required
                    class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    placeholder="usuario123"
                  />
                </div>

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
                    Verificando...
                  </div>
                  <span v-else>Verificar Usuário</span>
                </button>

                <div class="text-center">
                  <button
                    type="button"
                    @click="currentView = 'auth'"
                    class="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  >
                    Voltar ao login
                  </button>
                </div>
              </form>
            </div>

            <!-- Formulário de Reset de Senha -->
            <div v-else-if="currentView === 'reset'">
              <div class="text-center mb-6">
                <h3 class="text-3xl font-bold text-white mb-2">
                  Redefinir Senha
                </h3>
                <p class="text-gray-300">
                  Confirme seus dados para redefinir sua senha
                </p>
              </div>

              <form @submit.prevent="handleResetPassword" class="space-y-4">
                <div>
                  <label
                    for="resetBirthDate"
                    class="block text-sm font-medium text-gray-200 mb-2"
                  >
                    Data de Nascimento
                  </label>
                  <input
                    id="resetBirthDate"
                    v-model="resetForm.birthDate"
                    type="date"
                    required
                    class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-200 mb-2">
                    Pergunta de Segurança
                  </label>
                  <div
                    class="p-3 bg-white/5 border border-white/20 rounded-xl text-gray-300"
                  >
                    {{ resetForm.securityQuestion }}
                  </div>
                </div>

                <div>
                  <label
                    for="resetSecurityAnswer"
                    class="block text-sm font-medium text-gray-200 mb-2"
                  >
                    Sua Resposta
                  </label>
                  <input
                    id="resetSecurityAnswer"
                    v-model="resetForm.securityAnswer"
                    type="text"
                    required
                    class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    placeholder="Digite sua resposta"
                  />
                </div>

                <div>
                  <label
                    for="newPassword"
                    class="block text-sm font-medium text-gray-200 mb-2"
                  >
                    Nova Senha
                  </label>
                  <div class="relative">
                    <input
                      id="newPassword"
                      v-model="resetForm.newPassword"
                      :type="showNewPassword ? 'text' : 'password'"
                      required
                      class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm pr-12"
                      placeholder="Digite sua nova senha"
                    />
                    <button
                      type="button"
                      @click="showNewPassword = !showNewPassword"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                      <EyeIcon v-if="!showNewPassword" class="w-5 h-5" />
                      <EyeSlashIcon v-else class="w-5 h-5" />
                    </button>
                  </div>
                </div>

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
                    Redefinindo...
                  </div>
                  <span v-else>Redefinir Senha</span>
                </button>

                <div class="text-center">
                  <button
                    type="button"
                    @click="currentView = 'auth'"
                    class="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  >
                    Voltar ao login
                  </button>
                </div>
              </form>
            </div>
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
import {
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { useNotification } from "../composables/useNotification";
import api from "../services/api";

const router = useRouter();
const authStore = useAuthStore();
const { success, error } = useNotification();

const currentView = ref("auth"); // 'auth', 'forgot', 'reset'
const isLogin = ref(true);
const showPassword = ref(false);
const showNewPassword = ref(false);
const rememberMe = ref(false);
const usernameStatus = ref<"available" | "taken" | null>(null);
const usernameMessage = ref("");

const form = reactive({
  username: "",
  name: "",
  birthDate: "",
  password: "",
  securityQuestion: "",
  securityAnswer: "",
});

const forgotForm = reactive({
  username: "",
});

const resetForm = reactive({
  username: "",
  birthDate: "",
  securityQuestion: "",
  securityAnswer: "",
  newPassword: "",
});

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  form.username = "";
  form.name = "";
  form.birthDate = "";
  form.password = "";
  form.securityQuestion = "";
  form.securityAnswer = "";
  showPassword.value = false;
  usernameStatus.value = null;
  usernameMessage.value = "";
};

const checkUsername = async () => {
  if (!form.username || isLogin.value) return;

  try {
    const response = await api.post("/api/auth/check-username", {
      username: form.username,
    });

    usernameStatus.value = response.data.available ? "available" : "taken";
    usernameMessage.value = response.data.message;
  } catch (err) {
    console.error("Erro ao verificar username:", err);
  }
};

const handleSubmit = async () => {
  try {
    if (isLogin.value) {
      await authStore.login(form.username, form.password);
    } else {
      await authStore.register(
        form.username,
        form.name,
        form.birthDate,
        form.password,
        form.securityQuestion,
        form.securityAnswer
      );
    }
    router.push("/dashboard");
  } catch (err) {
    // Error handling is done in the store with toast notifications
  }
};

const handleForgotPassword = async () => {
  try {
    authStore.loading = true;
    const response = await api.post("/api/auth/forgot-password", {
      username: forgotForm.username,
    });

    if (response.data.hasUser) {
      resetForm.username = forgotForm.username;
      resetForm.securityQuestion = response.data.securityQuestion;
      currentView.value = "reset";
      success("Usuário encontrado!");
    } else {
      error("Usuário não encontrado");
    }
  } catch (err: any) {
    error(err.response?.data?.error || "Erro ao verificar usuário");
  } finally {
    authStore.loading = false;
  }
};

const handleResetPassword = async () => {
  try {
    authStore.loading = true;
    await api.post("/api/auth/reset-password", {
      username: resetForm.username,
      birthDate: resetForm.birthDate,
      securityAnswer: resetForm.securityAnswer,
      newPassword: resetForm.newPassword,
    });

    success("Senha redefinida com sucesso!");
    currentView.value = "auth";

    // Limpar formulários
    forgotForm.username = "";
    resetForm.username = "";
    resetForm.birthDate = "";
    resetForm.securityQuestion = "";
    resetForm.securityAnswer = "";
    resetForm.newPassword = "";
  } catch (err: any) {
    error(err.response?.data?.error || "Erro ao redefinir senha");
  } finally {
    authStore.loading = false;
  }
};
</script>

<style scoped>
/* Efeitos de foco aprimorados */
input:focus,
select:focus {
  box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.1);
}

/* Animação suave para transições */
* {
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter,
    backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Scrollbar personalizada */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(34, 211, 238, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(34, 211, 238, 0.5);
}
</style>
