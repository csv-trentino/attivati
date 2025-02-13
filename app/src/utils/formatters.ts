import { format, parse, parseISO } from "date-fns";

export const processColorByStatus = (status: string) => {
  switch (status) {
    case "pending":
      return "statusPending";
    case "approved":
      return "statusAccepted";
    case "rejected":
      return "statusRejected";
    case "canceled":
      return "statusCanceled";
  }
};

export const convertToDDMMYYYY = (dateString: string): string => {
  try {
    const parsedDate = parseISO(dateString);
    return format(parsedDate, "dd/MM/yyyy");
  } catch (err) {
    return "";
  }
};

export const convertToYYYYMMDD = (dateString: string): string | null => {
  try {
    const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());
    return format(parsedDate, "yyyy-MM-dd");
  } catch (err) {
    return null;
  }
};

export const convertToDate = (dateString?: string): Date | undefined => {
  if (!dateString) {
    return undefined;
  }

  try {
    return parseISO(dateString);
  } catch (err) {
    return undefined;
  }
};
