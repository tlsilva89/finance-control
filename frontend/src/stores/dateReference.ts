import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useDateReferenceStore = defineStore("dateReference", () => {
  const currentReferenceDate = ref(new Date());

  const currentMonth = computed(() => currentReferenceDate.value.getMonth());
  const currentYear = computed(() => currentReferenceDate.value.getFullYear());

  const currentMonthName = computed(() => {
    return new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      year: "numeric",
    }).format(currentReferenceDate.value);
  });

  const monthYearString = computed(() => {
    return `${currentYear.value}-${String(currentMonth.value + 1).padStart(
      2,
      "0"
    )}`;
  });

  const isCurrentMonth = computed(() => {
    const now = new Date();
    return (
      currentMonth.value === now.getMonth() &&
      currentYear.value === now.getFullYear()
    );
  });

  const canGoPrevious = computed(() => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 12);
    return currentReferenceDate.value > sixMonthsAgo;
  });

  const canGoNext = computed(() => {
    const now = new Date();
    return currentReferenceDate.value < now;
  });

  const setReferenceDate = (date: Date) => {
    currentReferenceDate.value = new Date(date);
  };

  const previousMonth = () => {
    if (canGoPrevious.value) {
      const newDate = new Date(currentReferenceDate.value);
      newDate.setMonth(newDate.getMonth() - 1);
      currentReferenceDate.value = newDate;
    }
  };

  const nextMonth = () => {
    if (canGoNext.value) {
      const newDate = new Date(currentReferenceDate.value);
      newDate.setMonth(newDate.getMonth() + 1);
      currentReferenceDate.value = newDate;
    }
  };

  const goToCurrentMonth = () => {
    currentReferenceDate.value = new Date();
  };

  const getDateRange = () => {
    const startDate = new Date(currentYear.value, currentMonth.value, 1);
    const endDate = new Date(
      currentYear.value,
      currentMonth.value + 1,
      0,
      23,
      59,
      59
    );
    return { startDate, endDate };
  };

  return {
    currentReferenceDate,
    currentMonth,
    currentYear,
    currentMonthName,
    monthYearString,
    isCurrentMonth,
    canGoPrevious,
    canGoNext,
    setReferenceDate,
    previousMonth,
    nextMonth,
    goToCurrentMonth,
    getDateRange,
  };
});
