import axios from "axios";
import { config } from "../config/environment";
import { formatDate, getDayName, getPastDates } from "../utils/dateUtils";
import { getLaboralesChile } from "./feriados";

export async function getRedmineEntries(from: string, to: string) {
	try {
		const { data } = await axios.get(
			`${config.URL_REDMINE}time_entries.json`,
			{
				headers: { "X-Redmine-API-Key": config.API_KEY },
				params: { user_id: config.USER_ID, from, to },
			}
		);
		return data?.time_entries || [];
	} catch (error: any) {
		throw new Error("Error al obtener las horas de Redmine");
	}
}

export async function checkHours(days: number) {
	const dates = getPastDates(days);

	const entries = await getRedmineEntries(dates[0], dates[dates.length - 1]);
	const hoursRedmine = entries.reduce(
		(
			acc: Record<string, number>,
			{ spent_on, hours }: { spent_on: string; hours: number }
		) => {
			acc[spent_on] = (acc[spent_on] || 0) + hours;
			return acc;
		},
		{}
	);

	return dates
		.filter((date) => {
			const dayOfWeek = new Date(date).getDay();
			const minHours =
				dayOfWeek === 5 ? config.MIN_HOURS_FRIDAY : config.MIN_HOURS;
			return !hoursRedmine[date] || hoursRedmine[date] < minHours;
		})
		.map((date) => ({
			date: formatDate(date),
			hours: hoursRedmine[date] || 0,
			day: getDayName(date),
			icon: hoursRedmine[date] ? "⌛" : "🚨",
		}));
}
