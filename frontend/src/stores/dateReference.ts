import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  getFirstDayOfMonth,
  getLastDayOfMonth,
  getMonthReference,
} from "../utils/dateUtils";

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
    return getMonthReference(currentReferenceDate.value);
  });

  const isCurrentMonth = computed(() => {
    const now = new Date();
    return (
      currentMonth.value === now.getMonth() &&
      currentYear.value === now.getFullYear()
    );
  });

  const canGoPrevious = computed(() => {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    return currentReferenceDate.value > twelveMonthsAgo;
  });

  const canGoNext = computed(() => {
    const now = new Date();
    return currentReferenceDate.value < now;
  });

  const setReferenceDate = (date: Date | string) => {
    if (typeof date === "string") {
      currentReferenceDate.value = new Date(date);
    } else {
      currentReferenceDate.value = new Date(date);
    }
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
    const startDate = getFirstDayOfMonth(currentReferenceDate.value);
    const endDate = getLastDayOfMonth(currentReferenceDate.value);
    endDate.setHours(23, 59, 59, 999);
    return { startDate, endDate };
  };

  const setMonthYear = (year: number, month: number) => {
    const newDate = new Date(year, month, 1);
    currentReferenceDate.value = newDate;
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
    setMonthYear,
  };
});
