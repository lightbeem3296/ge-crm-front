import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: any[]) { // eslint-disable-line
  return twMerge(clsx(inputs));
}
