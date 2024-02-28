import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function createCirclePath(center, radius) {
  return `
    M ${center}, ${center}
    m 0,-${radius}
    a ${radius},${radius} 0 0,1 0,${radius * 2}
    a ${radius},${radius} 0 0,1 0,-${radius * 2}
  `;
}
