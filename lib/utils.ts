import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatPricePerUpgrade = (profit: number): string => {
	if (profit >= 1_000_000_000_000)
		return `+${(profit / 1_000_000_000_000).toLocaleString().slice(0, 3)}T`;
	if (profit >= 1_000_000_000)
		return `+${(profit / 1_000_000_000).toLocaleString().slice(0, 3)}B`;
	if (profit >= 1_000_000)
		return `+${(profit / 1_000_000).toLocaleString().slice(0, 3)}M`;
	if (profit >= 1_000)
		return `+${(profit / 1_000).toLocaleString().slice(0, 3)}K`;
	return `+${profit}`;
};

export const useBagImage = (place: number): string => {
	const images = [
		"bronze.png",
		"silver.png",
		"gold.png",
		"platinum.png",
		"diamond.png",
	];
	return images[place] || "default.png";
};
