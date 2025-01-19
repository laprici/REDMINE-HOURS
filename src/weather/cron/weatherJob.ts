import { CronJob } from "cron";
import { rangeUV } from "../utils/utils";
import * as MESSAGES from "../utils/messages.json";
import { getWeather } from "../services/weather";
import { sendCard } from "../services/weather";

const CRON_SCHEDULES = [
	{ time: "15 9 * * 1-5", description: "Lunes a viernes, 9:15 AM" },
	{ time: "00 15 * * 1-4", description: "Lunes a jueves, 3:00 PM" },
	{ time: "45 14 * * 5", description: "Viernes, 2:45 PM" },
	{ time: "00 17 * * 1-4", description: "Lunes a jueves, 5:00 PM" },
];

interface infoCard {
	time: string;
	temperature: number;
	uvIndex: number;
	uvLevel: string;
	humidity: number;
	weatherIconUrl: string;
	reminder?: string;
	feelsLike: number;
	weatherDescription: string;
}

const renderWeather = (current: Record<string, any>) => {
	const K = 273.15;
	const { temp, uvi, weather, feels_like } = current;
	const tempC = (temp - K).toFixed();
	const messageUv = rangeUV(uvi);
	const description = weather[0].description;
	const feels_likeC = (feels_like - K).toFixed();
	const numberRandom = Math.floor(Math.random() * MESSAGES.length);
	const card = createWeatherCard({
		time: new Date().toLocaleTimeString(),
		temperature: Number(tempC),
		uvIndex: uvi,
		uvLevel: messageUv,
		humidity: current.humidity,
		weatherIconUrl: `https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`,
		reminder: MESSAGES[numberRandom],
		feelsLike: Number(feels_likeC),
		weatherDescription: description,
	});

	return card;
};

function createWeatherCard(data: infoCard) {
	return {
		card: {
			header: {
				title: "yuta del clima",
				subtitle: `by laPrici`,
				imageUrl: "https://i.postimg.cc/DZp8hGwz/yuta-bastarda.png",
				imageType: "CIRCLE",
				imageAltText: "Avatar",
			},
			sections: [
				{
					header: "",
					collapsible: true,
					uncollapsibleWidgetsCount: 3,
					widgets: [
						{
							columns: {
								columnItems: [
									{
										widgets: [
											{
												decoratedText: {
													topLabel: "Hora",
													text: data.time,
													startIcon: {
														materialIcon: {
															name: "schedule",
															fill: false,
															weight: 400,
															grade: 25,
														},
													},
												},
											},
											{
												decoratedText: {
													topLabel: "Temperatura",
													text: `${data.temperature}°C`,
													startIcon: {
														materialIcon: {
															name: "device_thermostat",
															fill: false,
															weight: 400,
															grade: 25,
														},
													},
												},
											},
											{
												decoratedText: {
													topLabel: "Índice UV",
													text: `${data.uvIndex} (${data.uvLevel})`,
													startIcon: {
														materialIcon: {
															name: "sunny_snowing",
															fill: false,
															weight: 400,
															grade: 25,
														},
													},
												},
											},
											{
												decoratedText: {
													topLabel: "Humedad",
													text: `${data.humidity}%`,
													startIcon: {
														materialIcon: {
															name: "humidity_low",
															fill: false,
															weight: 400,
															grade: 25,
														},
													},
												},
											},
										],
									},
									{
										widgets: [
											{
												image: {
													imageUrl:
														data.weatherIconUrl,
													altText: "Weather icon",
												},
											},
										],
									},
								],
							},
						},
						{
							decoratedText: {
								text: `<b style='text-align:center;'>${
									data.reminder ||
									"Recuerda el uso de protector solar"
								} 🧴</b>`,
							},
						},
					],
				},
			],
		},
	};
}

const executeWeatherJob = async () => {
	const current = await getWeather();
	const card = renderWeather(current);
	await sendCard(card);
	console.log("Weather sent");
};

export const initializeCronJobsWeather = () => {
	CRON_SCHEDULES.forEach(({ time, description }) => {
		new CronJob(time, executeWeatherJob, null, true, "America/Santiago");
		console.log(`Scheduled job: ${description} (${time})`);
	});
};
