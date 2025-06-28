<template>
  <!-- Overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    @click="closeModal"
  >
    <!-- Modal -->
    <div
      class="bg-dark-800/95 backdrop-blur-xl border border-dark-700/50 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-white">Alterar Senha</h3>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-dark-700/50"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>

      <!-- Formulário -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Senha Atual -->
        <div>
          <label
            for="currentPassword"
            class="block text-sm font-medium text-gray-200 mb-2"
          >
            Senha Atual
          </label>
          <div class="relative">
            <input
              id="currentPassword"
              v-model="form.currentPassword"
              :type="showCurrentPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-3 bg-dark-700/50 border border-dark-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              placeholder="Digite sua senha atual"
            />
            <button
              type="button"
              @click="showCurrentPassword = !showCurrentPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <EyeIcon v-if="!showCurrentPassword" class="w-5 h-5" />
              <EyeSlashIcon v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Nova Senha -->
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
              v-model="form.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-3 bg-dark-700/50 border border-dark-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
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

        <!-- Confirmar Nova Senha -->
        <div>
          <label
            for="confirmPassword"
            class="block text-sm font-medium text-gray-200 mb-2"
          >
            Confirmar Nova Senha
          </label>
          <div class="relative">
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-3 bg-dark-700/50 border border-dark-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              placeholder="Confirme sua nova senha"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <EyeIcon v-if="!showConfirmPassword" class="w-5 h-5" />
              <EyeSlashIcon v-else class="w-5 h-5" />
            </button>
          </div>
          <p
            v-if="
              form.newPassword &&
              form.confirmPassword &&
              form.newPassword !== form.confirmPassword
            "
            class="text-red-400 text-xs mt-1"
          >
            As senhas não coincidem
          </p>
        </div>

        <!-- Botões -->
        <div class="flex space-x-3 pt-4">
          <button
            type="button"
            @click="closeModal"
            class="flex-1 px-4 py-3 bg-dark-700/50 hover:bg-dark-600/50 text-gray-300 hover:text-white rounded-xl transition-all duration-200 border border-dark-600/50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="loading || form.newPassword !== form.confirmPassword"
            class="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <div v-if="loading" class="flex items-center justify-center">
              <div
                class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
              ></div>
              Alterando...
            </div>
            <span v-else>Alterar Senha</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { XMarkIcon, EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";
import { useNotification } from "../../composables/useNotification";
import api from "../../services/api";

interface Props {
  isOpen: boolean;
}

interface Emits {
  (e: "close"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { success, error } = useNotification();

const loading = ref(false);
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const form = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const closeModal = () => {
  emit("close");
  resetForm();
};

const resetForm = () => {
  form.currentPassword = "";
  form.newPassword = "";
  form.confirmPassword = "";
  showCurrentPassword.value = false;
  showNewPassword.value = false;
  showConfirmPassword.value = false;
};

const handleSubmit = async () => {
  if (form.newPassword !== form.confirmPassword) {
    error("As senhas não coincidem");
    return;
  }

  loading.value = true;
  try {
    await api.post("/api/auth/change-password", {
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });

    success("Senha alterada com sucesso!");
    closeModal();
  } catch (err: any) {
    error(err.response?.data?.error || "Erro ao alterar senha");
  } finally {
    loading.value = false;
  }
};

// Reset form when modal closes
watch(
  () => props.isOpen,
  (newValue) => {
    if (!newValue) {
      resetForm();
    }
  }
);
</script>
