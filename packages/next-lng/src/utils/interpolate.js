const interpolate = (translation, interpolations = {}) => {
	let interpolatedTranslation = translation;

	Object.entries(interpolations).forEach(([key, val]) => {
		const regex = new RegExp(`(\{\{${key}\}\})+`, "gm");
		interpolatedTranslation = interpolatedTranslation.replace(regex, val);
	});

	return interpolatedTranslation;
};

export default interpolate;
