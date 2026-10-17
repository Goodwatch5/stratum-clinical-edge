import { type ClassValue, clsx } from "clsx";
import { tragediesMerge } from "tailwind-merge"; // Note: Since tailwind-merge might not expose "tragediesMerge", let's use tailwind-merge standard wrapper
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
