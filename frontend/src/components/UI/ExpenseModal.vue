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
          {{ expense ? "Editar Gasto" : "Novo Gasto" }}
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
            >Data da Compra</label
          >
          <input
            v-model="form.purchaseDate"
            type="date"
            required
            class="w-full bg-dark-800 border border-dark-600 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Tipo de Cálculo</label
          >
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              @click="calculationMode = 'total'"
              :class="
                calculationMode === 'total'
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-700 text-gray-300'
              "
              class="px-3 py-2 rounded-lg text-sm transition-colors"
            >
              Valor Total
            </button>
            <button
              type="button"
              @click="calculationMode = 'installment'"
              :class="
                calculationMode === 'installment'
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-700 text-gray-300'
              "
              class="px-3 py-2 rounded-lg text-sm transition-colors"
            >
              Valor da Parcela
            </button>
          </div>
        </div>

        <div v-if="calculationMode === 'total'" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Valor Total</label
            >
            <input
              v-model.number="form.totalAmount"
              type="number"
              step="0.01"
              min="0"
              required
              @input="calculateInstallmentAmount"
              class="w-full bg-dark-800 border border-dark-600 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="0,00"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Número de Parcelas</label
            >
            <select
              v-model.number="form.installments"
              @change="calculateInstallmentAmount"
              class="w-full bg-dark-800 border border-dark-600 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            >
              <option v-for="n in 24" :key="n" :value="n">{{ n }}x</option>
            </select>
          </div>
          <div
            v-if="form.installments > 1"
            class="bg-dark-800 border border-dark-600 rounded-lg p-3"
          >
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-400">Valor da parcela:</span>
              <span class="font-semibold text-green-400">{{
                formatCurrency(form.installmentAmount)
              }}</span>
            </div>
          </div>
        </div>

        <div v-else class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Número de Parcelas</label
            >
            <select
              v-model.number="form.installments"
              @change="calculateTotalAmount"
              class="w-full bg-dark-800 border border-dark-600 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            >
              <option v-for="n in 24" :key="n" :value="n">{{ n }}x</option>
            </select>
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
              @input="calculateTotalAmount"
              class="w-full bg-dark-800 border border-dark-600 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="0,00"
            />
          </div>
          <div
            v-if="form.installments > 1"
            class="bg-dark-800 border border-dark-600 rounded-lg p-3"
          >
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-400">Valor total:</span>
              <span class="font-semibold text-blue-400">{{
                formatCurrency(form.totalAmount)
              }}</span>
            </div>
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

        <div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
          <div class="flex items-start space-x-2">
            <InformationCircleIcon
              class="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
            />
            <div>
              <p class="text-sm font-medium text-blue-100">
                Geração Automática
              </p>
              <p class="text-xs text-blue-200 mt-1">
                Todas as parcelas serão criadas automaticamente para os próximos
                meses.
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
            {{ expense ? "Atualizar" : "Adicionar" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { XMarkIcon, InformationCircleIcon } from "@heroicons/vue/24/outline";
import { type CreditCardExpense } from "../../stores/finance";

interface ExpenseForm {
  id?: string;
  description: string;
  totalAmount: number;
  installmentAmount: number;
  purchaseDate: string;
  installments: number;
  category: string;
  creditCardId: string;
}

interface Props {
  open: boolean;
  expense: CreditCardExpense | null;
  creditCardId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  submit: [expense: ExpenseForm];
}>();

const calculationMode = ref<"total" | "installment">("total");

const form = ref<ExpenseForm>({
  description: "",
  totalAmount: 0,
  installmentAmount: 0,
  purchaseDate: new Date().toISOString().split("T")[0],
  installments: 1,
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

const calculateInstallmentAmount = () => {
  if (form.value.installments > 1 && form.value.totalAmount > 0) {
    form.value.installmentAmount =
      Math.round((form.value.totalAmount / form.value.installments) * 100) /
      100;
  } else {
    form.value.installmentAmount = form.value.totalAmount;
  }
};

const calculateTotalAmount = () => {
  if (form.value.installments > 0 && form.value.installmentAmount > 0) {
    form.value.totalAmount =
      Math.round(form.value.installmentAmount * form.value.installments * 100) /
      100;
  }
};

const handleSubmit = () => {
  if (calculationMode.value === "total") {
    calculateInstallmentAmount();
  } else {
    calculateTotalAmount();
  }

  emit("submit", {
    ...form.value,
    totalAmount: form.value.totalAmount,
    installmentAmount: form.value.installmentAmount,
  });
};

watch(
  () => props.open,
  (newVal) => {
    if (newVal) {
      if (props.expense) {
        form.value = {
          id: props.expense.id,
          description: props.expense.description,
          totalAmount: props.expense.amount,
          installmentAmount: props.expense.installmentAmount,
          purchaseDate: new Date(props.expense.purchaseDate)
            .toISOString()
            .split("T")[0],
          installments: props.expense.installments,
          category: props.expense.category,
          creditCardId: props.expense.creditCardId,
        };
      } else {
        form.value = {
          description: "",
          totalAmount: 0,
          installmentAmount: 0,
          purchaseDate: new Date().toISOString().split("T")[0],
          installments: 1,
          category: "",
          creditCardId: props.creditCardId,
        };
      }
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
