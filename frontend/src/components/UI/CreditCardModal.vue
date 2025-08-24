<template>
  <SimpleModal :open="open" @close="$emit('close')">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100"
        >
          <CreditCardIcon class="h-6 w-6 text-blue-600" />
        </div>
        <h3 class="text-xl font-semibold leading-6 text-gray-100">
          {{ isEditing ? "Editar Cartão" : "Novo Cartão" }}
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
          Nome do Cartão
        </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          placeholder="Ex: Nubank, Itaú, Bradesco..."
          class="bg-dark-800 border border-dark-700 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 w-full"
          required
        />
      </div>

      <div>
        <label for="limit" class="block text-sm font-medium text-gray-300 mb-2">
          Limite (R$)
        </label>
        <div class="relative">
          <span
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >R$</span
          >
          <input
            id="limit"
            v-model="form.limit"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            class="bg-dark-800 border border-dark-700 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 w-full pl-10"
            required
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label
            for="closingDay"
            class="block text-sm font-medium text-gray-300 mb-2"
          >
            Dia de Fechamento
          </label>
          <select
            id="closingDay"
            v-model="form.closingDay"
            class="bg-dark-800 border border-dark-700 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 w-full"
            required
          >
            <option v-for="day in 31" :key="day" :value="day">{{ day }}</option>
          </select>
        </div>

        <div>
          <label
            for="dueDate"
            class="block text-sm font-medium text-gray-300 mb-2"
          >
            Dia do Vencimento
          </label>
          <select
            id="dueDate"
            v-model="form.dueDate"
            class="bg-dark-800 border border-dark-700 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 w-full"
            required
          >
            <option v-for="day in 31" :key="day" :value="day">{{ day }}</option>
          </select>
        </div>
      </div>

      <div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
        <div class="flex items-start space-x-2">
          <InformationCircleIcon
            class="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
          />
          <div>
            <p class="text-sm font-medium text-blue-100">Dívida Automática</p>
            <p class="text-xs text-blue-200 mt-1">
              A dívida atual será calculada automaticamente conforme você
              adiciona os gastos do cartão.
            </p>
          </div>
        </div>
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
import {
  CreditCardIcon,
  XMarkIcon,
  InformationCircleIcon,
} from "@heroicons/vue/24/outline";
import SimpleModal from "./SimpleModal.vue";

interface CreditCard {
  id?: string;
  name: string;
  limit: number;
  dueDate: number;
  closingDay: number; // Adicionado
}

interface Props {
  open: boolean;
  creditCard?: CreditCard | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  submit: [
    creditCard: Omit<CreditCard, "id"> & {
      id?: string;
    }
  ];
}>();

const loading = ref(false);
const isEditing = ref(false);

const form = reactive({
  name: "",
  limit: 0,
  dueDate: 1,
  closingDay: 1, // Adicionado
});

const resetForm = () => {
  form.name = "";
  form.limit = 0;
  form.dueDate = 1;
  form.closingDay = 1; // Adicionado
  isEditing.value = false;
};

const handleSubmit = async () => {
  loading.value = true;

  try {
    const creditCardData = {
      ...form,
      limit: Number(form.limit),
      dueDate: Number(form.dueDate),
      closingDay: Number(form.closingDay), // Adicionado
    };

    if (isEditing.value && props.creditCard?.id) {
      emit("submit", { ...creditCardData, id: props.creditCard.id });
    } else {
      emit("submit", creditCardData);
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
    if (newValue && props.creditCard) {
      form.name = props.creditCard.name;
      form.limit = props.creditCard.limit;
      form.dueDate = props.creditCard.dueDate;
      form.closingDay = props.creditCard.closingDay; // Adicionado
      isEditing.value = true;
    } else if (newValue) {
      resetForm();
    }
  }
);
</script>