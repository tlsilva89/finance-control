<template>
  <SimpleModal :open="open" @close="$emit('close')">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100"
        >
          <Cog6ToothIcon class="h-6 w-6 text-purple-600" />
        </div>
        <h3 class="text-xl font-semibold leading-6 text-gray-100">
          {{ isEditing ? "Editar Assinatura" : "Nova Assinatura" }}
        </h3>
      </div>
      <button
        @click="$emit('close')"
        class="text-gray-400 hover:text-gray-200 transition-colors rounded-lg p-1 hover:bg-dark-800"
      >
        <XMarkIcon class="h-6 w-6" />
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-300 mb-2">
          Nome da Assinatura
        </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          placeholder="Ex: Netflix, Spotify, Adobe..."
          class="bg-dark-800 border border-dark-700 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 w-full"
          required
        />
      </div>

      <div>
        <label
          for="category"
          class="block text-sm font-medium text-gray-300 mb-2"
        >
          Categoria
        </label>
        <select
          id="category"
          v-model="form.category"
          class="bg-dark-800 border border-dark-700 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 w-full"
          required
        >
          <option value="">Selecione uma categoria</option>
          <option value="Streaming">Streaming</option>
          <option value="Música">Música</option>
          <option value="Produtividade">Produtividade</option>
          <option value="Jogos">Jogos</option>
          <option value="Software">Software</option>
          <option value="Outros">Outros</option>
        </select>
      </div>

      <div>
        <label
          for="amount"
          class="block text-sm font-medium text-gray-300 mb-2"
        >
          Valor Mensal (R$)
        </label>
        <div class="relative">
          <span
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >R$</span
          >
          <input
            id="amount"
            v-model="form.amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            class="bg-dark-800 border border-dark-700 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 w-full pl-10"
            required
          />
        </div>
      </div>

      <div>
        <label
          for="dueDate"
          class="block text-sm font-medium text-gray-300 mb-2"
        >
          Dia da Renovação
        </label>
        <input
          id="dueDate"
          v-model="form.dueDate"
          type="number"
          min="1"
          max="31"
          placeholder="Ex: 10"
          class="bg-dark-800 border border-dark-700 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 w-full"
          required
        />
      </div>

      <div class="flex gap-3 pt-4">
        <button
          type="button"
          @click="$emit('close')"
          class="flex-1 px-4 py-2 text-sm font-medium text-gray-300 bg-dark-800 border border-dark-700 rounded-lg hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-dark-500 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          <div
            v-if="loading"
            class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
          ></div>
          {{ isEditing ? "Atualizar" : "Adicionar" }}
        </button>
      </div>
    </form>
  </SimpleModal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { Cog6ToothIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import SimpleModal from "./SimpleModal.vue";

interface Subscription {
  id?: string;
  name: string;
  amount: number;
  dueDate: number;
  category: string;
}

interface Props {
  open: boolean;
  subscription?: Subscription | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  submit: [subscription: Omit<Subscription, "id"> & { id?: string }];
}>();

const loading = ref(false);
const isEditing = ref(false);

const form = reactive({
  name: "",
  amount: 0,
  dueDate: 1,
  category: "",
});

const resetForm = () => {
  form.name = "";
  form.amount = 0;
  form.dueDate = 1;
  form.category = "";
  isEditing.value = false;
};

const handleSubmit = async () => {
  loading.value = true;

  try {
    const subscriptionData = {
      ...form,
      amount: Number(form.amount),
      dueDate: Number(form.dueDate),
    };

    if (isEditing.value && props.subscription?.id) {
      emit("submit", { ...subscriptionData, id: props.subscription.id });
    } else {
      emit("submit", subscriptionData);
    }

    resetForm();
    emit("close");
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.open,
  (newValue) => {
    if (newValue && props.subscription) {
      form.name = props.subscription.name;
      form.amount = props.subscription.amount;
      form.dueDate = Number(props.subscription.dueDate);
      form.category = props.subscription.category;
      isEditing.value = true;
    } else if (newValue) {
      resetForm();
    }
  }
);
</script>
