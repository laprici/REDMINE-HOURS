import axios from "axios";
import {
	format,
	endOfYear,
	eachDayOfInterval,
	isWeekend,
	subDays,
	parseISO,
} from "date-fns";
import { es } from "date-fns/locale/es";

const URL_REDMINE = process.env.URL_REDMINE;
const API_KEY = process.env.API_KEY;
const USER_ID = process.env.USER_ID;
const WEBHOOK_KEY = process.env.WEBHOOK_KEY;
const WEBHOOK_TOKEN = process.env.WEBHOOK_TOKEN;
const DAYS = 7;
const MIN_HOURS = 6;
const MIN_HOURS_FRIDAY = 4;

async function getFeriadosChile(): Promise<string[]> {
	const { data } = await axios.get("https://api.boostr.cl/holidays.json");
	const { data: feriados } = await data;
	return feriados.map((holiday: { date: string }) => holiday.date);
}

const getLaboralesChile = async () => {
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

async function getTimeEntries(days: number): Promise<Record<string, number>> {
	const today = new Date();
	const start = subDays(today, days);

	const { data } = await axios.get(`${URL_REDMINE}time_entries.json`, {
		headers: { "X-Redmine-API-Key": API_KEY },
		params: {
			user_id: USER_ID,
			from: format(start, "yyyy-MM-dd"),
			to: format(today, "yyyy-MM-dd"),
		},
	});

	return (data.time_entries || []).reduce(
		(
			acc: Record<string, number>,
			entry: { spent_on: string; hours: number }
		) => {
			acc[entry.spent_on] = (acc[entry.spent_on] || 0) + entry.hours;
			return acc;
		},
		{}
	);
}

const checkHours = async (days: number) => {
	const today = new Date();
	const laborales = await getLaboralesChile();
	const start = subDays(today, days);
	const dates = eachDayOfInterval({ start, end: today }).map((date) =>
		format(date, "yyyy-MM-dd")
	);

	const { data } = await axios.get(`${URL_REDMINE}time_entries.json`, {
		headers: {
			"X-Redmine-API-Key": API_KEY,
		},
		params: {
			user_id: USER_ID,
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
				(day == 5 && hoursRedmine[date] <= MIN_HOURS_FRIDAY) ||
				(day != 5 && hoursRedmine[date] <= MIN_HOURS)
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

async function sendMessage(message: string) {
	console.log(message);
	const url = `https://chat.googleapis.com/v1/spaces/AAAABkKCtSQ/messages?key=${WEBHOOK_KEY}&token=${WEBHOOK_TOKEN}`;
	try {
		const response = await axios.post(
			url,
			{ text: message },
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		console.log(response);
	} catch (error) {
		console.error(error);
	}
}

function getMessage(missing: Record<string, string | number>[]) {
	const msg = `*Nooooooo!* 🚨 \nFaltan horitas por agregar\n\n`;
	const message = missing.map(({ date, hours, day, icon }) => {
		return hours === 0
			? `${icon} ${date} (${day}): Ni una hora registrada 😱`
			: `${icon} ${date} (${day}): Solo ${hours} horas. Ponle empeño ✍️`;
	});

	return msg + message.join("\n");
}

async function init() {
	const missing = await checkHours(DAYS);
	if (missing.length === 0) {
		console.log("Todo en orden");
		return;
	}
	const message = getMessage(missing);
	console.log(message);
	sendMessage(message);
}

init();
