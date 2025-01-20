import axios from "axios";
import { config } from "../../config/environment";

export async function sendMessage(message: string) {
	const url = `https://chat.googleapis.com/v1/spaces/AAAABkKCtSQ/messages?key=${config.WEBHOOK_KEY_REDMINE}&token=${config.WEBHOOK_TOKEN_REDMINE}`;
	try {
		const response = await axios.post(
			url,
			{ text: message },
			{ headers: { "Content-Type": "application/json" } }
		);
		console.log("Mensaje enviado:", response.data);
	} catch (error) {
		console.error(error);
	}
}

export function formatMessage(missing: any[]): string {
	const intro = `*Nooooooo!* 🚨 \nFaltan horitas por agregar\n\n`;
	const details = missing.map(({ date, hours, day, icon }) =>
		hours === 0
			? `${icon} ${date} (${day}): Ni una hora registrada 😱`
			: `${icon} ${date} (${day}): Solo ${hours} horas. Ponle empeño ✍️`
	);
	return intro + details.join("\n");
}
