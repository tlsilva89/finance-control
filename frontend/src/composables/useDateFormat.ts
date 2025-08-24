import { formatDateForAPI, dateToInputValue } from "@/utils/dateUtils";

export function useDateFormat() {
  const formatDateNoTimezone = (dateString: string | null): string => {
    if (!dateString) return "";
    const datePart = dateString.split("T")[0];
    const parts = datePart.split("-");
    const year = Number(parts);
    const month = Number(parts[1]);
    const day = Number(parts[2]);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("pt-BR");
  };

  const formatDateForDisplay = (date: Date | string | null): string => {
    if (!date) return "";

    try {
      if (typeof date === "string") {
        const datePart = date.split("T")[0];
        if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
          const parts = datePart.split("-");
          const year = Number(parts[0]);
          const month = Number(parts[1]);
          const day = Number(parts[2]);
          const dateObj = new Date(year, month - 1, day);
          return new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }).format(dateObj);
        }
      }

      const dateObj = date as Date;
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(dateObj);
    } catch {
      return "";
    }
  };

  const formatDateShort = (date: Date | string | null): string => {
    if (!date) return "";

    try {
      if (typeof date === "string") {
        const datePart = date.split("T")[0];
        if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
          const parts = datePart.split("-");
          const year = Number(parts[0]);
          const month = Number(parts[1]);
          const day = Number(parts[2]);
          const dateObj = new Date(year, month - 1, day);
          return new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "2-digit",
          }).format(dateObj);
        }
      }

      const dateObj = date as Date;
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }).format(dateObj);
    } catch {
      return "";
    }
  };

  const formatDateForInput = (date: Date | string | null): string => {
    return dateToInputValue(date);
  };

  const formatDateForApi = (date: Date | string | null): string | null => {
    if (!date) return null;

    try {
      if (typeof date === "string") {
        const datePart = date.split("T")[0];
        if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
          return datePart;
        }
      }

      if (date instanceof Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }

      return formatDateForAPI(date);
    } catch {
      return null;
    }
  };

  const normalizeDate = (dateStr: string): string => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };

  const displayDate = formatDateForDisplay;
  const shortDate = formatDateShort;
  const inputDate = formatDateForInput;
  const apiDate = formatDateForApi;

  return {
    formatDateNoTimezone,
    formatDateForDisplay,
    formatDateShort,
    formatDateForInput,
    formatDateForApi,
    normalizeDate,
    displayDate,
    shortDate,
    inputDate,
    apiDate,
  };
}
