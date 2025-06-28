<template>
  <SimpleModal :open="open" @close="$emit('close')">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100"
        >
          <BanknotesIcon class="h-6 w-6 text-green-600" />
        </div>
        <h3 class="text-xl font-semibold leading-6 text-gray-100">
          {{ isEditing ? "Editar Entrada" : "Nova Entrada" }}
        </h3>
      </div>
      <button
        @click="$emit('close')"
        class="text-gray-400 hover:text-gray-200 transition-colors rounded-lg p-1 hover:bg-dark-800"
      >
        <XMarkIcon class="h-6 w-6" />
      </button>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label
          for="description"
          class="block text-sm font-medium text-gray-300 mb-2"
        >
          Descrição
        </label>
        <input
          id="description"
          v-model="form.description"
          type="text"
          placeholder="Ex: Salário, Freelance, Vendas..."
          class="input-field w-full"
          required
        />
      </div>

      <div>
        <label
          for="amount"
          class="block text-sm font-medium text-gray-300 mb-2"
        >
          Valor (R$)
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
            class="input-field w-full pl-10"
            required
          />
        </div>
      </div>

      <div>
        <label for="date" class="block text-sm font-medium text-gray-300 mb-2">
          Data
        </label>
        <input
          id="date"
          v-model="form.date"
          type="date"
          class="input-field w-full"
          required
        />
      </div>

      <!-- Buttons -->
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
import { BanknotesIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import SimpleModal from "./SimpleModal.vue";

interface Income {
  id?: string;
  description: string;
  amount: number;
  date: string;
}

interface Props {
  open: boolean;
  income?: Income | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  submit: [income: Omit<Income, "id"> & { id?: string }];
}>();

const loading = ref(false);
const isEditing = ref(false);

const form = reactive({
  description: "",
  amount: 0,
  date: new Date().toISOString().split("T")[0],
});

const resetForm = () => {
  form.description = "";
  form.amount = 0;
  form.date = new Date().toISOString().split("T")[0];
  isEditing.value = false;
};

const handleSubmit = async () => {
  loading.value = true;

  try {
    const incomeData = {
      ...form,
      amount: Number(form.amount),
    };

    if (isEditing.value && props.income?.id) {
      emit("submit", { ...incomeData, id: props.income.id });
    } else {
      emit("submit", incomeData);
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
    if (newValue && props.income) {
      // Editando
      form.description = props.income.description;
      form.amount = props.income.amount;
      form.date = props.income.date.split("T")[0];
      isEditing.value = true;
    } else if (newValue) {
      // Novo
      resetForm();
    }
  }
);
</script>
