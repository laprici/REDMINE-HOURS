export const rangeUV: (uvi: number) => string = (uvi: number) => {
	const ranges = [
		{ max: 3, label: "Bajo" },
		{ max: 6, label: "Moderado" },
		{ max: 8, label: "Alto" },
		{ max: 11, label: "Muy alto" },
	];
	return ranges.find((range) => uvi <= range.max)!.label;
};
