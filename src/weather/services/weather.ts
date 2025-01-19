import axios from "axios";
import { config } from "../../config/environment";

// Valdivia
const LAT = "-39.8141262";
const LON = "-73.2459859";

export const getWeather = async () => {
	const response = await axios.get(
		`https://api.openweathermap.org//data/3.0/onecall?lat=${LAT}&lon=${LON}&appid=${config.API_KEY_WEATHER}`
	);
	const current = response.data.current;
	return current;
};

export async function sendCard(card: Record<string, any>) {
	const url = `https://chat.googleapis.com/v1/spaces/AAAAKk0pErQ/messages?key=${config.WEBHOOK_KEY_WEATHER}&token=${config.WEBHOOK_TOKEN_WEATHER}`;
	try {
		const response = await axios.post(
			url,
			{ cardsV2: [card] },
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const status = error.response?.status;
			const statusText = error.response?.statusText;
			const data = error.response?.data;
			const url = error.config?.url;

			console.error("Error en la solicitud:");
			console.error(`URL: ${url}`);
			console.error(`Estado HTTP: ${status} ${statusText}`);
			console.error(
				`Detalle del error:`,
				data || "Sin detalles disponibles"
			);
		} else {
			console.error("Error inesperado:", error);
		}
	}
}
