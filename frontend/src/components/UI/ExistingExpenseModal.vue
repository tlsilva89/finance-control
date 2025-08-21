<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
  >
    <div
      class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
      @click="$emit('close')"
    ></div>
    <div
      class="relative bg-dark-900 border border-dark-700 rounded-xl shadow-xl w-full max-w-lg"
    >
      <div
        class="flex items-center justify-between p-6 border-b border-dark-700"
      >
        <h3 class="text-xl font-semibold text-gray-100">
          Adicionar Compra Existente
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-white transition-colors"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Descrição</label
          >
          <input
            v-model="form.description"
            type="text"
            required
            class="w-full bg-dark-800 border border-dark-600 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            placeholder="Ex: Notebook Asus"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Data da Primeira Compra</label
          >
          <input
            v-model="form.originalPurchaseDate"
            type="date"
            required
            class="w-full bg-dark-800 border border-dark-600 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Total de Parcelas</label
            >
            <select
              v-model.number="form.totalInstallments"
              @change="updateCurrentInstallment"
              class="w-full bg-dark-800 border border-dark-600 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            >
              <option v-for="n in 24" :key="n" :value="n">{{ n }}x</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Parcela Atual</label
            >
            <select
              v-model.number="form.currentInstallment"
              class="w-full bg-dark-800 border border-dark-600 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            >
              <option v-for="n in form.totalInstallments" :key="n" :value="n">
                {{ n }}
              </option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Valor da Parcela</label
          >
          <input
            v-model.number="form.installmentAmount"
            type="number"
            step="0.01"
            min="0"
            required
            @input="calculateTotal"
            class="w-full bg-dark-800 border border-dark-600 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            placeholder="0,00"
          />
        </div>

        <div class="bg-dark-800 border border-dark-600 rounded-lg p-3">
          <div class="flex justify-between items-center text-sm mb-2">
            <span class="text-gray-400">Valor total da compra:</span>
            <span class="font-semibold text-blue-400">{{
              formatCurrency(form.totalAmount)
            }}</span>
          </div>
          <div class="flex justify-between items-center text-sm mb-2">
            <span class="text-gray-400">Parcela atual:</span>
            <span class="font-semibold text-yellow-400"
              >{{ form.currentInstallment }} de
              {{ form.totalInstallments }}</span
            >
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-gray-400">Parcelas restantes:</span>
            <span class="font-semibold text-green-400">{{
              form.totalInstallments - form.currentInstallment + 1
            }}</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Categoria</label
          >
          <select
            v-model="form.category"
            class="w-full bg-dark-800 border border-dark-600 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Selecione uma categoria</option>
            <option value="Alimentação">Alimentação</option>
            <option value="Transporte">Transporte</option>
            <option value="Lazer">Lazer</option>
            <option value="Saúde">Saúde</option>
            <option value="Educação">Educação</option>
            <option value="Casa">Casa</option>
            <option value="Vestuário">Vestuário</option>
            <option value="Tecnologia">Tecnologia</option>
            <option value="Outros">Outros</option>
          </select>
        </div>

        <div
          class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3"
        >
          <div class="flex items-start space-x-2">
            <InformationCircleIcon
              class="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0"
            />
            <div>
              <p class="text-sm font-medium text-yellow-100">
                Compra Parcelada Existente
              </p>
              <p class="text-xs text-yellow-200 mt-1">
                Será criada a parcela atual e todas as futuras automaticamente.
              </p>
            </div>
          </div>
        </div>

        <div class="flex space-x-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-3 text-gray-300 bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Adicionar Parcelas
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { XMarkIcon, InformationCircleIcon } from "@heroicons/vue/24/outline";

interface ExistingExpenseForm {
  description: string;
  originalPurchaseDate: string;
  totalAmount: number;
  installmentAmount: number;
  totalInstallments: number;
  currentInstallment: number;
  category: string;
  creditCardId: string;
}

interface Props {
  open: boolean;
  creditCardId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  submit: [expense: ExistingExpenseForm];
}>();

const form = ref<ExistingExpenseForm>({
  description: "",
  originalPurchaseDate: new Date().toISOString().split("T")[0],
  totalAmount: 0,
  installmentAmount: 0,
  totalInstallments: 2,
  currentInstallment: 1,
  category: "",
  creditCardId: props.creditCardId,
});

const formatCurrency = (value: number) => {
  if (isNaN(value)) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const calculateTotal = () => {
  if (form.value.installmentAmount > 0 && form.value.totalInstallments > 0) {
    form.value.totalAmount =
      Math.round(
        form.value.installmentAmount * form.value.totalInstallments * 100
      ) / 100;
  }
};

const updateCurrentInstallment = () => {
  if (form.value.currentInstallment > form.value.totalInstallments) {
    form.value.currentInstallment = form.value.totalInstallments;
  }
  calculateTotal();
};

const handleSubmit = () => {
  calculateTotal();
  emit("submit", { ...form.value });
};

watch(
  () => props.open,
  (newVal) => {
    if (newVal) {
      form.value = {
        description: "",
        originalPurchaseDate: new Date().toISOString().split("T")[0],
        totalAmount: 0,
        installmentAmount: 0,
        totalInstallments: 2,
        currentInstallment: 1,
        category: "",
        creditCardId: props.creditCardId,
      };
    }
  }
);

watch(
  () => props.creditCardId,
  (newVal) => {
    form.value.creditCardId = newVal;
  }
);
</script>
