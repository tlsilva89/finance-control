<template>
  <AppLayout>
    <div class="space-y-6">
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 class="text-3xl font-bold text-gray-100">
            Divisor de Despesas da Casa
          </h1>
          <p class="text-gray-400 mt-1">
            Adicione as despesas e divida o valor total entre os moradores.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          class="lg:col-span-2 bg-dark-900 border border-dark-800 rounded-xl p-6 shadow-lg space-y-6"
        >
          <div>
            <h2 class="text-xl font-semibold text-gray-100 mb-4">
              Adicionar Despesa
            </h2>
            <form
              @submit.prevent="addExpense"
              class="grid sm:grid-cols-3 gap-4 items-end"
            >
              <div class="sm:col-span-2">
                <label
                  for="description"
                  class="block text-sm font-medium text-gray-300 mb-2"
                  >Descrição</label
                >
                <input
                  id="description"
                  v-model="newExpense.description"
                  type="text"
                  placeholder="Ex: Energia Elétrica"
                  class="w-full bg-dark-800 border border-dark-700 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label
                  for="amount"
                  class="block text-sm font-medium text-gray-300 mb-2"
                  >Valor (R$)</label
                >
                <input
                  id="amount"
                  v-model.number="newExpense.amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  class="w-full bg-dark-800 border border-dark-700 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <Button type="submit" :icon="PlusIcon" class="sm:col-start-3"
                >Adicionar</Button
              >
            </form>
          </div>

          <div class="border-t border-dark-800 pt-6">
            <h3 class="text-lg font-semibold text-gray-100 mb-4">
              Lista de Despesas ({{ expenses.length }})
            </h3>
            <div v-if="expenses.length === 0" class="text-center py-8">
              <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-500 mb-4" />
              <p class="text-gray-400">Nenhuma despesa adicionada ainda.</p>
            </div>
            <div v-else class="space-y-3 max-h-96 overflow-y-auto pr-2">
              <div
                v-for="expense in expenses"
                :key="expense.id"
                class="flex items-center justify-between p-3 bg-dark-800 rounded-lg group"
              >
                <p class="text-gray-200">{{ expense.description }}</p>
                <div class="flex items-center space-x-4">
                  <span class="font-semibold text-orange-400">{{
                    formatCurrency(expense.amount)
                  }}</span>
                  <button
                    @click="removeExpense(expense.id)"
                    class="p-1 text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Coluna de Resumo -->
        <div
          class="bg-dark-900 border border-dark-800 rounded-xl p-6 shadow-lg h-fit"
        >
          <h2 class="text-xl font-semibold text-gray-100 mb-6">
            Resumo da Divisão
          </h2>
          <div class="space-y-6">
            <div>
              <label
                for="people"
                class="block text-sm font-medium text-gray-300 mb-2"
                >Dividir entre quantas pessoas?</label
              >
              <input
                id="people"
                v-model.number="numberOfPeople"
                type="number"
                min="1"
                class="w-full bg-dark-800 border border-dark-700 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div class="border-t border-dark-700 pt-4 space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-400">Total das Despesas:</span>
                <span class="text-lg font-bold text-orange-400">{{
                  formatCurrency(totalAmount)
                }}</span>
              </div>
              <div
                class="flex justify-between items-center p-4 bg-primary-500/10 rounded-lg border border-primary-500/20"
              >
                <span class="font-medium text-primary-300"
                  >Valor por Pessoa:</span
                >
                <span class="text-2xl font-bold text-primary-400">{{
                  formatCurrency(amountPerPerson)
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import AppLayout from "../components/Layout/AppLayout.vue";
import Button from "../components/UI/Button.vue";
import {
  PlusIcon,
  TrashIcon,
  DocumentTextIcon,
} from "@heroicons/vue/24/outline";

interface Expense {
  id: number;
  description: string;
  amount: number;
}

const newExpense = ref({
  description: "",
  amount: null as number | null,
});
const expenses = ref<Expense[]>([]);
const numberOfPeople = ref(2);

const totalAmount = computed(() => {
  return expenses.value.reduce((sum, expense) => sum + expense.amount, 0);
});

const amountPerPerson = computed(() => {
  if (numberOfPeople.value > 0 && totalAmount.value > 0) {
    return totalAmount.value / numberOfPeople.value;
  }
  return 0;
});

const addExpense = () => {
  if (
    newExpense.value.description &&
    newExpense.value.amount !== null &&
    newExpense.value.amount > 0
  ) {
    expenses.value.push({
      id: Date.now(),
      description: newExpense.value.description,
      amount: newExpense.value.amount,
    });
    newExpense.value.description = "";
    newExpense.value.amount = null;
  }
};

const removeExpense = (id: number) => {
  expenses.value = expenses.value.filter((expense) => expense.id !== id);
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};
</script>
