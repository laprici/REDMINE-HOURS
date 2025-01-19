import axios from "axios";
import { eachDayOfInterval, endOfYear, format, isWeekend } from "date-fns";

export async function getFeriadosChile(): Promise<string[]> {
	const { data } = await axios.get("https://api.boostr.cl/holidays.json");
	const { data: feriados } = await data;
	return feriados.map((holiday: { date: string }) => holiday.date);
}

export const getLaboralesChile = async () => {
	const feriados = await getFeriadosChile();
	const year = new Date().getFullYear();
	const start = new Date(year, 0, 1);
	const end = endOfYear(new Date(year, 0, 1));
	const allDays = eachDayOfInterval({ start, end });
	const filterAllDays = allDays.filter(
		(day) =>
			!isWeekend(day) && !feriados.includes(format(day, "yyyy-MM-dd"))
	);
	return filterAllDays.map((day) => format(day, "yyyy-MM-dd"));
};
