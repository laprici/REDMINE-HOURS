import { CronJob } from "cron";
import { checkHours } from "../services/timeEntries";
import { getLaboralesChile } from "../services/feriados";
import { getMessage } from "../utils/messages";

const DAYS = 7;
const MIN_HOURS = 6;
const MIN_HOURS_FRIDAY = 4;

const execute = async () => {
	try {
		const missing = await checkHours(DAYS);

		if (missing.length > 0) {
			const message = getMessage(missing);
		}
	} catch (error) {
		console.error("Error al ejecutar el cron job:", error);
	}
};

export const CRON_JOB_1 = new CronJob(
	"15 9 * * 1-5",
	execute,
	null,
	true,
	"America/Santiago"
);

export const CRON_JOB_2 = new CronJob(
	"15 17 * * 1-4",
	execute,
	null,
	true,
	"America/Santiago"
);

export const CRON_JOB_3 = new CronJob(
	"45 14 * * 5",
	execute,
	null,
	true,
	"America/Santiago"
);
