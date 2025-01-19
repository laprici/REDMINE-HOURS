import { getLaboralesChile } from "../services/feriados";
import { getRedmineEntries } from "../services/redmine";
import { getPastDates, formatDate, getDayName } from "../utils/dateUtils";
import { sendMessage, formatMessage } from "./messaging";
import { config } from "../config/environment";

async function checkHours(days: number) {
	const laborales = await getLaboralesChile();
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

async function main() {
	try {
		const missing = await checkHours(7);
		if (missing && missing.length > 0) {
			const message = formatMessage(missing);
			await sendMessage(message);
		} else {
			console.log("Todo en orden");
		}
	} catch (error: any) {
		console.error(error);
	}
}

main();
