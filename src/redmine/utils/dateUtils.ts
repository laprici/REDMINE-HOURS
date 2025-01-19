import { format, subDays, eachDayOfInterval, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function getPastDates(days: number): string[] {
	const today = new Date();
	const start = subDays(today, days);
	return eachDayOfInterval({ start, end: today }).map((date) =>
		format(date, "yyyy-MM-dd")
	);
}

export function formatDate(
	date: string,
	pattern: string = "dd-MM-yyyy"
): string {
	return format(parseISO(date), pattern, { locale: es });
}

export function getDayName(date: string): string {
	return format(parseISO(date), "eeee", { locale: es });
}
