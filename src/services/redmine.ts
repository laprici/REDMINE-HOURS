import axios from "axios";
import { config } from "../config/environment";

export async function getRedmineEntries(from: string, to: string) {
	try {
		const { data } = await axios.get(
			`${config.URL_REDMINE}time_entries.json`,
			{
				headers: { "X-Redmine-API-Key": config.API_KEY },
				params: { user_id: config.USER_ID, from, to },
			}
		);
		return data?.time_entries || [];
	} catch (error: any) {
		throw new Error("Error al obtener las horas de Redmine");
	}
}
