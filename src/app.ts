import axios from "axios";
import { format, endOfYear, eachDayOfInterval, isWeekend } from "date-fns";
const URL_REDMINE = process.env.URL_REDMINE;
const API_KEY = process.env.API_KEY;

const feriadosChile = async () => {
	const { data } = await axios.get("https://api.boostr.cl/holidays.json");
	const { data: feriados } = await data;
	return await feriados.map(({ date }) => date);
};

async function init() {
	const feriados = await feriadosChile();
	const start = new Date();
	const year = start.getFullYear();
	const end = endOfYear(new Date(year, 0, 1));
	const allDays = eachDayOfInterval({ start, end });
	const laborales = allDays.filter(
		(day) =>
			!isWeekend(day) && !feriados.includes(format(day, "yyyy-MM-dd"))
	);
	console.log(laborales);
}

init();
