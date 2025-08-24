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
      class="relative bg-dark-900 border border-dark-700 rounded-xl shadow-xl w-full max-w-2xl"
    >
      <div
        class="flex items-center justify-between p-6 border-b border-dark-700"
      >
        <h3 class="text-xl font-semibold text-gray-100">Adicionar Compra</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-white transition-colors"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <div class="flex border-b border-dark-700">
        <button
          type="button"
          :class="[
            'flex-1 px-6 py-3 text-sm font-medium transition-colors',
            activeTab === 'new'
              ? 'text-primary-400 border-b-2 border-primary-400 bg-dark-800'
              : 'text-gray-400 hover:text-gray-300 hover:bg-dark-800',
          ]"
          @click="activeTab = 'new'"
        >
          <PlusIcon class="w-4 h-4 inline mr-2" />
          Nova Compra
        </button>
        <button
          type="button"
          :class="[
            'flex-1 px-6 py-3 text-sm font-medium transition-colors',
            activeTab === 'existing'
              ? 'text-primary-400 border-b-2 border-primary-400 bg-dark-800'
              : 'text-gray-400 hover:text-gray-300 hover:bg-dark-800',
          ]"
          @click="activeTab = 'existing'"
        >
          <ClockIcon class="w-4 h-4 inline mr-2" />
          Compra Existente
        </button>
      </div>

      <div v-if="activeTab === 'new'" class="p-6">
        <form @submit.prevent="submitNewPurchase" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Descrição
            </label>
            <input
              v-model="newPurchase.description"
              type="text"
              required
              class="w-full bg-dark-800 border border-dark-600 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Ex: Notebook Asus"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Data da Compra
            </label>
            <input
              v-model="newPurchase.purchaseDate"
              type="date"
              required
              class="w-full bg-dark-800 border border-dark-600 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Número de Parcelas
              </label>
              <select
                v-model.number="newPurchase.installments"
                @change="calculateNewTotalAmount"
                class="w-full bg-dark-800 border border-dark-600 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              >
                <option v-for="n in 24" :key="n" :value="n">{{ n }}x</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Valor da Parcela
              </label>
              <input
                v-model.number="newPurchase.installmentAmount"
                type="number"
                step="0.01"
                min="0"
                required
                @input="calculateNewTotalAmount"
                class="w-full bg-dark-800 border border-dark-600 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="0,00"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Categoria
            </label>
            <select
              v-model="newPurchase.category"
              required
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
              <option value="Viagem">Viagem</option>
              <option value="Beleza">Beleza</option>
              <option value="Esporte">Esporte</option>
              <option value="Pets">Pets</option>
              <option value="Farmácia">Farmácia</option>
              <option value="Combustível">Combustível</option>
              <option value="Streaming">Streaming</option>
              <option value="Restaurante">Restaurante</option>
              <option value="Livros">Livros</option>
              <option value="Serviços">Serviços</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div class="bg-dark-800 border border-dark-600 rounded-lg p-3">
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-400">Valor total da compra:</span>
              <span class="font-semibold text-green-400">
                {{ formatCurrency(newPurchase.totalAmount) }}
              </span>
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
              Adicionar Compra
            </button>
          </div>
        </form>
      </div>

      <div v-if="activeTab === 'existing'" class="p-6">
        <form @submit.prevent="submitExistingPurchase" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Descrição
            </label>
            <input
              v-model="existingPurchase.description"
              type="text"
              required
              class="w-full bg-dark-800 border border-dark-600 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Ex: Notebook Asus"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Data da Primeira Compra
            </label>
            <input
              v-model="existingPurchase.originalPurchaseDate"
              type="date"
              required
              class="w-full bg-dark-800 border border-dark-600 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Total de Parcelas
              </label>
              <select
                v-model.number="existingPurchase.totalInstallments"
                @change="updateCurrentInstallment"
                class="w-full bg-dark-800 border border-dark-600 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              >
                <option v-for="n in 24" :key="n" :value="n">{{ n }}x</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Parcela Atual
              </label>
              <select
                v-model.number="existingPurchase.currentInstallment"
                class="w-full bg-dark-800 border border-dark-600 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              >
                <option
                  v-for="n in existingPurchase.totalInstallments"
                  :key="n"
                  :value="n"
                >
                  {{ n }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Valor da Parcela
            </label>
            <input
              v-model.number="existingPurchase.installmentAmount"
              type="number"
              step="0.01"
              min="0"
              required
              @input="calculateExistingTotal"
              class="w-full bg-dark-800 border border-dark-600 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="0,00"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Categoria
            </label>
            <select
              v-model="existingPurchase.category"
              required
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
              <option value="Viagem">Viagem</option>
              <option value="Beleza">Beleza</option>
              <option value="Esporte">Esporte</option>
              <option value="Pets">Pets</option>
              <option value="Farmácia">Farmácia</option>
              <option value="Combustível">Combustível</option>
              <option value="Streaming">Streaming</option>
              <option value="Restaurante">Restaurante</option>
              <option value="Livros">Livros</option>
              <option value="Serviços">Serviços</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div class="bg-dark-800 border border-dark-600 rounded-lg p-3">
            <div class="flex justify-between items-center text-sm mb-2">
              <span class="text-gray-400">Valor total da compra:</span>
              <span class="font-semibold text-blue-400">
                {{ formatCurrency(existingPurchase.totalAmount) }}
              </span>
            </div>
            <div class="flex justify-between items-center text-sm mb-2">
              <span class="text-gray-400">Parcela atual:</span>
              <span class="font-semibold text-yellow-400">
                {{ existingPurchase.currentInstallment }} de
                {{ existingPurchase.totalInstallments }}
              </span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-400">Parcelas restantes:</span>
              <span class="font-semibold text-green-400">
                {{
                  existingPurchase.totalInstallments -
                  existingPurchase.currentInstallment +
                  1
                }}
              </span>
            </div>
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
                  Será criada a parcela atual e todas as futuras
                  automaticamente.
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
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import {
  XMarkIcon,
  InformationCircleIcon,
  PlusIcon,
  ClockIcon,
} from "@heroicons/vue/24/outline";
import { useDateFormat } from "../../composables/useDateFormat";

interface NewPurchaseForm {
  description: string;
  purchaseDate: string;
  totalAmount: number;
  installmentAmount: number;
  installments: number;
  category: string;
  creditCardId: string;
}

interface ExistingPurchaseForm {
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
  submit: [
    data: NewPurchaseForm | ExistingPurchaseForm,
    type: "new" | "existing"
  ];
}>();

const { normalizeDate } = useDateFormat();
const activeTab = ref<"new" | "existing">("new");

const newPurchase = ref<NewPurchaseForm>({
  description: "",
  purchaseDate: new Date().toISOString().split("T")[0],
  totalAmount: 0,
  installmentAmount: 0,
  installments: 1,
  category: "",
  creditCardId: props.creditCardId,
});

const existingPurchase = ref<ExistingPurchaseForm>({
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

const calculateNewTotalAmount = () => {
  if (
    newPurchase.value.installmentAmount > 0 &&
    newPurchase.value.installments > 0
  ) {
    newPurchase.value.totalAmount =
      Math.round(
        newPurchase.value.installmentAmount *
          newPurchase.value.installments *
          100
      ) / 100;
  }
};

const calculateExistingTotal = () => {
  if (
    existingPurchase.value.installmentAmount > 0 &&
    existingPurchase.value.totalInstallments > 0
  ) {
    existingPurchase.value.totalAmount =
      Math.round(
        existingPurchase.value.installmentAmount *
          existingPurchase.value.totalInstallments *
          100
      ) / 100;
  }
};

const updateCurrentInstallment = () => {
  if (
    existingPurchase.value.currentInstallment >
    existingPurchase.value.totalInstallments
  ) {
    existingPurchase.value.currentInstallment =
      existingPurchase.value.totalInstallments;
  }
  calculateExistingTotal();
};

const submitNewPurchase = () => {
  calculateNewTotalAmount();

  const formattedData = {
    ...newPurchase.value,
    purchaseDate: normalizeDate(newPurchase.value.purchaseDate),
  };

  emit("submit", formattedData, "new");
};

const submitExistingPurchase = () => {
  calculateExistingTotal();

  const formattedData = {
    ...existingPurchase.value,
    originalPurchaseDate: normalizeDate(
      existingPurchase.value.originalPurchaseDate
    ),
  };

  emit("submit", formattedData, "existing");
};

watch(
  () => props.open,
  (newVal) => {
    if (newVal) {
      activeTab.value = "new";
      newPurchase.value = {
        description: "",
        purchaseDate: new Date().toISOString().split("T")[0],
        totalAmount: 0,
        installmentAmount: 0,
        installments: 1,
        category: "",
        creditCardId: props.creditCardId,
      };
      existingPurchase.value = {
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
    newPurchase.value.creditCardId = newVal;
    existingPurchase.value.creditCardId = newVal;
  }
);
</script>
