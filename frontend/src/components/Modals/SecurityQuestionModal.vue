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
        <h3 class="text-xl font-bold text-white">Pergunta de Segurança</h3>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-dark-700/50"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>

      <!-- Formulário -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Pergunta de Segurança -->
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
            class="w-full px-4 py-3 bg-dark-700/50 border border-dark-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
          >
            <option value="" class="bg-gray-800">Selecione uma pergunta</option>
            <option
              value="Qual o nome do seu primeiro animal de estimação?"
              class="bg-gray-800"
            >
              Qual o nome do seu primeiro animal de estimação?
            </option>
            <option value="Em que cidade você nasceu?" class="bg-gray-800">
              Em que cidade você nasceu?
            </option>
            <option value="Qual o nome da sua mãe?" class="bg-gray-800">
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

        <!-- Resposta de Segurança -->
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
            class="w-full px-4 py-3 bg-dark-700/50 border border-dark-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
            placeholder="Digite sua resposta"
          />
          <p class="text-xs text-gray-400 mt-1">
            Esta resposta será usada para recuperação de senha
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
            :disabled="
              loading || !form.securityQuestion || !form.securityAnswer
            "
            class="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <div v-if="loading" class="flex items-center justify-center">
              <div
                class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
              ></div>
              Salvando...
            </div>
            <span v-else>Salvar</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
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

const form = reactive({
  securityQuestion: "",
  securityAnswer: "",
});

const closeModal = () => {
  emit("close");
  resetForm();
};

const resetForm = () => {
  form.securityQuestion = "";
  form.securityAnswer = "";
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    await api.post("/api/auth/update-security-question", {
      securityQuestion: form.securityQuestion,
      securityAnswer: form.securityAnswer,
    });

    success("Pergunta de segurança atualizada com sucesso!");
    closeModal();
  } catch (err: any) {
    error(
      err.response?.data?.error || "Erro ao atualizar pergunta de segurança"
    );
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
