import getConfig from "next/config";

const { serverRuntimeConfig: { secrets = {} } = {} } = getConfig() || {};
const getServerSideProps = async (context) => {
	return {
		props: {
			secrets,
		},
	};
};

export default getServerSideProps;
