import getServerSideProps from "./getServerSideProps";

const getTranslations = (files, options) => async (ctx) => {
	let translationFiles = files;
	if (typeof translationFiles === "string") translationFiles = [translationFiles];
	return getServerSideProps(ctx, translationFiles, options);
};

export default getTranslations;
