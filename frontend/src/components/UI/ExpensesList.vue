<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-100">Extrato de Gastos</h3>
      <div class="flex items-center space-x-2">
        <select
          v-model="filterCategory"
          class="bg-dark-800 border border-dark-600 text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Todas as categorias</option>
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
        <button
          @click="emit('add-expense')"
          class="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm transition-colors flex items-center space-x-1"
        >
          <PlusIcon class="w-4 h-4" />
          <span>Adicionar</span>
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-8">
      <div
        class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"
      ></div>
    </div>

    <div v-else-if="filteredExpenses.length === 0" class="text-center py-8">
      <DocumentTextIcon class="mx-auto h-10 w-10 text-gray-400 mb-3" />
      <p class="text-gray-400">Nenhuma parcela ativa para este mês</p>
      <p class="text-xs text-gray-500 mt-1">
        As parcelas de compras parceladas aparecerão no mês correspondente
      </p>
    </div>

    <div v-else class="space-y-2 max-h-96 overflow-y-auto">
      <div
        v-for="expense in filteredExpenses"
        :key="expense.id"
        class="flex items-center justify-between p-3 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors group"
      >
        <div class="flex items-center space-x-3">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
            :class="getCategoryColor(expense.category)"
          >
            <component
              :is="getCategoryIcon(expense.category)"
              class="w-4 h-4"
            />
          </div>
          <div>
            <p class="font-medium text-gray-100 text-sm">
              {{ expense.description }}
            </p>
            <div class="flex items-center space-x-2 text-xs text-gray-400">
              <span>{{ formatDate(expense.purchaseDate) }}</span>
              <span v-if="expense.installments > 1">
                • Parcela {{ expense.currentInstallment }}/{{
                  expense.installments
                }}
              </span>
              <span v-if="expense.category">• {{ expense.category }}</span>
              <span
                v-if="expense.installments > 1"
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
              >
                📅 Parcela do mês
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <div class="text-right">
            <p
              class="font-semibold text-sm"
              :class="expense.isPaid ? 'text-green-400' : 'text-red-400'"
            >
              {{ formatCurrency(expense.installmentAmount) }}
            </p>
            <p v-if="expense.installments > 1" class="text-xs text-gray-400">
              Total: {{ formatCurrency(expense.amount) }}
            </p>
            <p
              v-if="
                expense.installments > 1 &&
                expense.currentInstallment < expense.installments
              "
              class="text-xs text-blue-400"
            >
              Restam: {{ expense.installments - expense.currentInstallment }}x
            </p>
          </div>

          <div
            class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <button
              @click="emit('toggle-paid', expense)"
              class="p-1.5 rounded-lg transition-colors"
              :class="
                expense.isPaid
                  ? 'text-green-400 hover:bg-green-400/10'
                  : 'text-gray-400 hover:bg-gray-400/10'
              "
              :title="
                expense.isPaid ? 'Marcar como não pago' : 'Marcar como pago'
              "
            >
              <CheckIcon v-if="expense.isPaid" class="w-4 h-4" />
              <XMarkIcon v-else class="w-4 h-4" />
            </button>
            <button
              @click="emit('edit-expense', expense)"
              class="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
              title="Editar gasto"
            >
              <PencilIcon class="w-4 h-4" />
            </button>
            <button
              @click="emit('delete-expense', expense)"
              class="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              title="Excluir gasto"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="filteredExpenses.length > 0"
      class="mt-4 p-3 bg-dark-800 rounded-lg"
    >
      <div class="flex justify-between items-center text-sm">
        <span class="text-gray-400">Parcelas do mês atual:</span>
        <span class="font-semibold text-gray-100">{{
          filteredExpenses.length
        }}</span>
      </div>
      <div class="flex justify-between items-center text-sm mt-1">
        <span class="text-gray-400">Valor total:</span>
        <span class="font-semibold text-gray-100">{{
          formatCurrency(totalAmount)
        }}</span>
      </div>
      <div class="flex justify-between items-center text-sm mt-1">
        <span class="text-gray-400">Não pagos:</span>
        <span class="font-semibold text-red-400">{{
          formatCurrency(unpaidAmount)
        }}</span>
      </div>
      <div class="flex justify-between items-center text-sm mt-1">
        <span class="text-gray-400">Compras parceladas:</span>
        <span class="font-semibold text-blue-400">{{
          installmentExpensesCount
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { type CreditCardExpense } from "../../stores/finance";
import { useDateFormat } from "../../composables/useDateFormat";
import {
  PlusIcon,
  DocumentTextIcon,
  CheckIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  FaceSmileIcon,
  TruckIcon,
  SunIcon,
  HeartIcon,
  AcademicCapIcon,
  HomeIcon,
  ShoppingBagIcon,
  CpuChipIcon,
  MapIcon,
  SparklesIcon,
  FaceSmileIcon as SportIcon,
  GiftIcon,
  BeakerIcon,
  FireIcon,
  FilmIcon,
  BuildingOfficeIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  Squares2X2Icon,
} from "@heroicons/vue/24/outline";

interface Props {
  expenses: CreditCardExpense[];
  loading: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "add-expense": [];
  "edit-expense": [expense: CreditCardExpense];
  "delete-expense": [expense: CreditCardExpense];
  "toggle-paid": [expense: CreditCardExpense];
}>();

const { displayDate: formatDate } = useDateFormat();

const filterCategory = ref("");

const filteredExpenses = computed(() => {
  if (!filterCategory.value) return props.expenses;
  return props.expenses.filter(
    (expense) => expense.category === filterCategory.value
  );
});

const totalAmount = computed(() => {
  return filteredExpenses.value.reduce(
    (sum, expense) => sum + expense.installmentAmount,
    0
  );
});

const unpaidAmount = computed(() => {
  return filteredExpenses.value
    .filter((expense) => !expense.isPaid)
    .reduce((sum, expense) => sum + expense.installmentAmount, 0);
});

const installmentExpensesCount = computed(() => {
  return filteredExpenses.value.filter((expense) => expense.installments > 1)
    .length;
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Alimentação: "bg-green-600",
    Transporte: "bg-blue-600",
    Lazer: "bg-purple-600",
    Saúde: "bg-red-600",
    Educação: "bg-yellow-600",
    Casa: "bg-orange-600",
    Vestuário: "bg-pink-600",
    Tecnologia: "bg-indigo-600",
    Viagem: "bg-teal-600",
    Beleza: "bg-pink-400",
    Esporte: "bg-lime-600",
    Pets: "bg-amber-600",
    Farmácia: "bg-emerald-600",
    Combustível: "bg-slate-600",
    Streaming: "bg-violet-600",
    Restaurante: "bg-rose-600",
    Livros: "bg-cyan-600",
    Serviços: "bg-stone-600",
    Outros: "bg-gray-600",
  };
  return colors[category] || "bg-gray-600";
};

const getCategoryIcon = (category: string) => {
  const icons: Record<string, any> = {
    Alimentação: FaceSmileIcon,
    Transporte: TruckIcon,
    Lazer: SunIcon,
    Saúde: HeartIcon,
    Educação: AcademicCapIcon,
    Casa: HomeIcon,
    Vestuário: ShoppingBagIcon,
    Tecnologia: CpuChipIcon,
    Viagem: MapIcon,
    Beleza: SparklesIcon,
    Esporte: SportIcon,
    Pets: GiftIcon,
    Farmácia: BeakerIcon,
    Combustível: FireIcon,
    Streaming: FilmIcon,
    Restaurante: BuildingOfficeIcon,
    Livros: BookOpenIcon,
    Serviços: Cog6ToothIcon,
    Outros: Squares2X2Icon,
  };
  return icons[category] || Squares2X2Icon;
};
</script>
