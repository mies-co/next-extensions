import path from "path";

import * as React from "react";
import get from "lodash/get";

import getSecrets from "./getSecrets";

const SecretsContext = React.createContext({});

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
			const secrets = await getSecrets({ req: ctx.req });

			return {
				...composedInitialProps,
				secrets,
			};
		};
	}

	return ComposedWithSecrets;
};

export default withSecrets;
