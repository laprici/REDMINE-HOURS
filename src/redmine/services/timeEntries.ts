import axios from "axios";
import { config } from "../../config/environment";
import { eachDayOfInterval, format, parseISO, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { getLaboralesChile } from "../services/feriados";

export async function getRedmineEntries(from: string, to: string) {
	try {
		console.log("Obteniendo horas de Redmine...");
		console.log({ user_id: config.USER_ID, from, to });
		const { data } = await axios.get(
			`${config.URL_REDMINE}time_entries.json`,
			{
				headers: { "X-Redmine-API-Key": config.API_KEY_REDMINE },
				params: { user_id: config.USER_ID, from, to },
			}
		);
		return data?.time_entries || [];
	} catch (error) {
		console.error(error);
		throw new Error("Error al obtener las horas de Redmine");
	}
}

export const checkHours = async (days: number) => {
	const today =
		new Date().getHours() !== 9 ? new Date() : subDays(new Date(), 1);
	const laborales = await getLaboralesChile();
	const start = subDays(today, days);
	const dates = eachDayOfInterval({ start, end: today }).map((date) =>
		format(date, "yyyy-MM-dd")
	);

	const { data } = await axios.get(`${config.URL_REDMINE}time_entries.json`, {
		headers: {
			"X-Redmine-API-Key": config.API_KEY_REDMINE,
		},
		params: {
			user_id: config.USER_ID,
			from: format(start, "yyyy-MM-dd"),
			to: format(today, "yyyy-MM-dd"),
		},
	});

	const entries = data?.time_entries || [];
	const hoursRedmine = entries.reduce(
		(
			acc: Record<string, number>,
			entry: { spent_on: string; hours: number }
		) => {
			const { spent_on, hours } = entry;
			if (!acc[spent_on]) {
				acc[spent_on] = 0;
			}
			acc[spent_on] += hours;
			return acc;
		},
		{}
	);

	const missing = dates
		.filter((date) => {
			const day = parseISO(date).getDay();
			return (
				(!hoursRedmine[date] && laborales.includes(date)) ||
				(day == 5 && hoursRedmine[date] <= config.MIN_HOURS_FRIDAY) ||
				(day != 5 && hoursRedmine[date] <= config.MIN_HOURS)
			);
		})
		.map((date) => {
			const dateFormatDate = parseISO(date);
			const day = format(dateFormatDate, "eeee", { locale: es });
			const icon = hoursRedmine[date] ? "⌛" : "🚨";
			return {
				date: format(dateFormatDate, "dd-MM-yyyy"),
				hours: hoursRedmine[date] || 0,
				day,
				icon,
			};
		});
	return missing;
};
