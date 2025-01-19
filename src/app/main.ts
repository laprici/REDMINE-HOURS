import { sendMessage, formatMessage } from "./messaging";

async function main() {
	try {
		const missing = await checkHours(7);
		if (missing && missing.length > 0) {
			const message = formatMessage(missing);
			await sendMessage(message);
		}
	} catch (error: any) {
		console.error(error);
	}
}

main();
