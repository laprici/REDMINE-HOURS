import { CRON_JOB_1, CRON_JOB_2, CRON_JOB_3 } from "./redmine/cron/redmineJob";
import { initializeCronJobsWeather } from "./weather/cron/weatherJob";

CRON_JOB_1.start();
CRON_JOB_2.start();
CRON_JOB_3.start();

initializeCronJobsWeather();
