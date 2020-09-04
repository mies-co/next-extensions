import getServerSidePropsLng from "./getServerSidePropsLng";

const getTranslations = (files, runtimeOptions) => (ctx) => {
	let translationFiles = files;
	if (typeof translationFiles === "string") translationFiles = [translationFiles];
	return getServerSidePropsLng(ctx, translationFiles, runtimeOptions);
};

export default getTranslations;
