
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// RTL utility functions
export function rtlClass(isRTL: boolean, ltrClass: string, rtlClass: string = "") {
  return isRTL ? rtlClass : ltrClass;
}

export function rtlDir(isRTL: boolean) {
  return isRTL ? "rtl" : "ltr";
}

export function rtlAlign(isRTL: boolean) {
  return isRTL ? "text-right" : "text-left";
}

export function rtlFloat(isRTL: boolean) {
  return isRTL ? "float-right" : "float-left";
}

export function rtlMargin(isRTL: boolean, margin: string) {
  if (!isRTL) return margin;
  
  // Convert margin classes for RTL
  return margin
    .replace(/ml-/g, "temp-mr-")
    .replace(/mr-/g, "ml-")
    .replace(/temp-mr-/g, "mr-")
    .replace(/pl-/g, "temp-pr-")
    .replace(/pr-/g, "pl-")
    .replace(/temp-pr-/g, "pr-");
}
