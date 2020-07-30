import getServerSideProps from "./getServerSideProps";

const getTranslations = (files, runtimeOptions) => (ctx) => {
	let translationFiles = files;
	if (typeof translationFiles === "string") translationFiles = [translationFiles];
	return getServerSideProps(ctx, translationFiles, runtimeOptions);
};

export default getTranslations;
