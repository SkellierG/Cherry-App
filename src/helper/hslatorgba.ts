export function hslStringToRgb(hslaString: string) {
	// Extraemos los valores de H, S, L y A del string HSLA usando una expresión regular.
	const regex = /hsla\((\d+),\s*(\d+)%\s*,\s*(\d+)%\s*,\s*(\d(\.\d+)?)\)/;
	const match = hslaString.match(regex);

	if (!match) {
		throw new Error("Invalid HSLA string format");
	}

	// Parseamos los valores de H, S, L y A.
	const h = parseInt(match[1], 10);
	let s = parseInt(match[2], 10);
	let l = parseInt(match[3], 10);
	const a = parseFloat(match[4]);

	// Convertimos HSL a RGB
	s /= 100;
	l /= 100;

	const C = (1 - Math.abs(2 * l - 1)) * s;
	const X = C * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - C / 2;

	let r, g, b;

	if (h >= 0 && h < 60) {
		r = C;
		g = X;
		b = 0;
	} else if (h >= 60 && h < 120) {
		r = X;
		g = C;
		b = 0;
	} else if (h >= 120 && h < 180) {
		r = 0;
		g = C;
		b = X;
	} else if (h >= 180 && h < 240) {
		r = 0;
		g = X;
		b = C;
	} else if (h >= 240 && h < 300) {
		r = X;
		g = 0;
		b = C;
	} else {
		r = C;
		g = 0;
		b = X;
	}

	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);

	// Devuelve el color en formato RGBA

	//console.log(`rgba(${r}, ${g}, ${b}, ${a})`);

	return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function convertHslaToRgba(jsonObject: any) {
	let result: any = {};

	for (const [key, value] of Object.entries(jsonObject)) {
		if (typeof value === "string" && value.startsWith("hsla")) {
			result[key] = hslStringToRgb(value);
		} else if (typeof value === "object" && value !== null) {
			// Si el valor es un objeto, lo procesamos recursivamente
			result[key] = convertHslaToRgba(value);
		} else {
			result[key] = value;
		}
	}

	return result;
}
