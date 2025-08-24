export const formatDateForAPI = (date: Date | string | null): string | null => {
  if (!date) return null;

  try {
    let dateString: string;

    if (typeof date === "string") {
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }
      const tempDate = new Date(date + "T12:00:00");
      if (isNaN(tempDate.getTime())) return null;
      const year = tempDate.getFullYear();
      const month = String(tempDate.getMonth() + 1).padStart(2, "0");
      const day = String(tempDate.getDate()).padStart(2, "0");
      dateString = `${year}-${month}-${day}`;
    } else {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      dateString = `${year}-${month}-${day}`;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    return null;
  } catch {
    return null;
  }
};

export const formatDateFromAPI = (dateString: string | null): Date | null => {
  if (!dateString) return null;

  try {
    let datePart = dateString;
    if (dateString.includes("T")) {
      datePart = dateString.split("T")[0];
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      return null;
    }

    const [year, month, day] = datePart.split("-").map(Number);
    return new Date(year, month - 1, day);
  } catch {
    return null;
  }
};

export const dateToInputValue = (date: Date | string | null): string => {
  if (!date) return "";

  try {
    if (typeof date === "string") {
      const datePart = date.split("T")[0];
      if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
        return datePart;
      }
      const dateObj = formatDateFromAPI(date);
      if (!dateObj) return "";
      date = dateObj;
    }

    const year = (date as Date).getFullYear();
    const month = String((date as Date).getMonth() + 1).padStart(2, "0");
    const day = String((date as Date).getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  } catch {
    return "";
  }
};

export const getCurrentDateForInput = (): string => {
  return dateToInputValue(new Date());
};

export const formatDateForDisplay = (date: Date | string | null): string => {
  if (!date) return "";

  try {
    let dateObj: Date | null = null;

    if (typeof date === "string") {
      const datePart = date.split("T")[0];
      if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
        const [year, month, day] = datePart.split("-").map(Number);
        dateObj = new Date(year, month - 1, day);
      } else {
        dateObj = formatDateFromAPI(date);
      }
    } else {
      dateObj = date;
    }

    if (!dateObj) return "";

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(dateObj);
  } catch {
    return "";
  }
};

export const formatDateShort = (date: Date | string | null): string => {
  if (!date) return "";

  try {
    let dateObj: Date | null = null;

    if (typeof date === "string") {
      const datePart = date.split("T")[0];
      if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
        const [year, month, day] = datePart.split("-").map(Number);
        dateObj = new Date(year, month - 1, day);
      } else {
        dateObj = formatDateFromAPI(date);
      }
    } else {
      dateObj = date;
    }

    if (!dateObj) return "";

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }).format(dateObj);
  } catch {
    return "";
  }
};

export const addDays = (date: Date | string, days: number): Date => {
  const dateObj =
    typeof date === "string" ? formatDateFromAPI(date) || new Date() : date;
  const result = new Date(dateObj);
  result.setDate(result.getDate() + days);
  return result;
};

export const addMonths = (date: Date | string, months: number): Date => {
  const dateObj =
    typeof date === "string" ? formatDateFromAPI(date) || new Date() : date;
  const result = new Date(dateObj);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const isDateInPast = (date: Date | string | null): boolean => {
  if (!date) return false;

  const dateObj = typeof date === "string" ? formatDateFromAPI(date) : date;
  if (!dateObj) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const compareDate = new Date(dateObj);
  compareDate.setHours(0, 0, 0, 0);

  return compareDate < today;
};

export const isDateInFuture = (date: Date | string | null): boolean => {
  if (!date) return false;

  const dateObj = typeof date === "string" ? formatDateFromAPI(date) : date;
  if (!dateObj) return false;

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  return dateObj > today;
};

export const daysDifference = (
  date1: Date | string,
  date2: Date | string = new Date()
): number => {
  const d1 =
    typeof date1 === "string" ? formatDateFromAPI(date1) || new Date() : date1;
  const d2 =
    typeof date2 === "string" ? formatDateFromAPI(date2) || new Date() : date2;

  const diffTime = d2.getTime() - d1.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getFirstDayOfMonth = (date: Date | string = new Date()): Date => {
  const dateObj =
    typeof date === "string" ? formatDateFromAPI(date) || new Date() : date;
  return new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
};

export const getLastDayOfMonth = (date: Date | string = new Date()): Date => {
  const dateObj =
    typeof date === "string" ? formatDateFromAPI(date) || new Date() : date;
  return new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);
};

export const getMonthReference = (date: Date | string = new Date()): string => {
  const dateObj =
    typeof date === "string" ? formatDateFromAPI(date) || new Date() : date;
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};
