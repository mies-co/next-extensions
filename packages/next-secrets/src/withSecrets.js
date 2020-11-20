import mergeInitialProps from "@mies-co/next-utils/mergeInitialProps";

import dotenv from "dotenv";
import hoistNonReactStatics from "hoist-non-react-statics";
import _ from "lodash";
import * as React from "react";

const SecretsContext = React.createContext({});
export const useSecrets = (...keys) => {
	const secrets = React.useContext(SecretsContext);
	if (!keys.length) return secrets;
	return _.pickBy(secrets, (v, k) => keys.includes(k));
};

// Use the keys of .env in order to know which env variables to provide.
export const getSecrets = () => {
	const parsed = dotenv.config()?.parsed || {};

	let secrets = {};

	if (process.env.X_DEPLOYMENT_TOOL === "lambda") {
		secrets = Object.entries(parsed).reduce((acc, [k, v]) => {
			// Support env variables provided by AWS lambda, or fallback to the dotenv value
			// Advice: when deploying serverless, deploy a .env that has empty values, just to get the keys from here, but the values from the runtime environment
			const secret = process.env[k] || v;
			if (secret) acc[k] = secret;
			return acc;
		}, {});
	} else {
		// Fallback to Vercel deployment strategy (no empty .env for security)
		secrets = process.env;
	}

	return secrets;
};

export const getServerSidePropsSecrets = () => {
	const secrets = getSecrets();
	return { props: { secrets } };
};

const withSecrets = ComposedComponent => {
	const WithSecrets = props => {
		const { secrets: _secrets, ...rest } = props;
		const [secrets, setSecrets] = React.useState(_secrets);

		return (
			<SecretsContext.Provider value={secrets}>
				<ComposedComponent secrets={secrets} {...rest} />
			</SecretsContext.Provider>
		);
	};

	WithSecrets.defaultProps = {
		secrets: {}
	};

	WithSecrets.getInitialProps = mergeInitialProps(ComposedComponent, async (context, initialProps) => {
		const secrets = getSecrets();

		return {
			...initialProps,
			secrets
		};
	});

	return hoistNonReactStatics(WithSecrets, ComposedComponent, { getInitialProps: true });
};

export default withSecrets;
