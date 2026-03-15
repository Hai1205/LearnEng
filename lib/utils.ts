import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { parseISO } from 'date-fns/parseISO'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const TOTAL_MS_IN_DAY = 24 * 60 * 60 * 1000;

export const formatDateAgo = (date: string, style?: string) => {
  const createdDate = date ? parseISO(date) : new Date();
  const now = new Date();

  const diffInMs = now.getTime() - createdDate.getTime();
  const diffInDays = diffInMs / (TOTAL_MS_IN_DAY);

  if (diffInDays < 7) {
    return formatDistanceToNow(createdDate, { addSuffix: true });
  } else {
    switch (style) {
      case "DDMMYYY":
        return formatDateInDDMMYYY(date);
      case "YYYYMMDD":
        return formatDateInYYYYMMDD(date);
      default:
        return formatDateInDDMMYYY(date);
    }
  }
};

export const formatDateInDDMMYYY = (date: string) => {
  const d = new Date(date);
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year = d.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

export const formatDateInYYYYMMDD = (date: string) => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const formatNumberStyle = (value: number): string => {
  if (value < 1_000) {
    return value.toString();
  } else if (value < 1_000_000) {
    return (value / 1_000).toFixed(value >= 10_000 ? 0 : 1).replace('.', ',') + 'K';
  } else if (value < 1_000_000_000) {
    return (value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1).replace('.', ',') + 'M';
  } else {
    return (value / 1_000_000_000).toFixed(value >= 10_000_000_000 ? 0 : 1).replace('.', ',') + 'B';
  }
}