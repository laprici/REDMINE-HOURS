export function getMessage(
	missing: { date: string; hours: number; day: string; icon: string }[]
) {
	const msg = `*Nooooooo!* 🚨 \nFaltan horitas por agregar\n\n`;
	const details = missing.map(({ date, hours, day, icon }) => {
		return hours === 0
			? `${icon} ${date} (${day}): Ni una hora registrada 😱`
			: `${icon} ${date} (${day}): Solo ${hours} horas. Ponle empeño ✍️`;
	});
	return msg + details.join("\n");
}
