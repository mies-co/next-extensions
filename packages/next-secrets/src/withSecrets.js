import path from "path";

import * as React from "react";
import get from "lodash/get";

import getAbsoluteUrl from "@mies-co/next-utils/getAbsoluteUrl";
import "@mies-co/next-utils/customConsole";

import secretsConfig from "./config";
import getSecrets from "./getSecrets";

const SecretsContext = React.createContext({});

const {
	options: { apiUri, shallow },
} = secretsConfig;

export const useSecrets = () => React.useContext(SecretsContext);

const withSecrets = (ComposedComponent) => {
	const ComposedWithSecrets = (props) => {
		const { secrets, url, ...rest } = props;
		const copiedSecrets = secrets;
		return (
			<SecretsContext.Provider value={secrets}>
				<ComposedComponent secrets={secrets} {...rest} />
			</SecretsContext.Provider>
		);
	};

	if (ComposedComponent.getInitialProps) {
		ComposedWithSecrets.getInitialProps = async (ctx) => {
			const composedInitialProps = await ComposedComponent.getInitialProps(ctx);

			const absUrl = getAbsoluteUrl({ uri: apiUri, req: ctx.req });
			const secrets = await getSecrets({ url: absUrl });

			return {
				...composedInitialProps,
				secrets,
			};
		};
	}

	return ComposedWithSecrets;
};

export default withSecrets;
