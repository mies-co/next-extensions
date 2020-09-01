import dotenv from "dotenv";
import hoistNonReactStatics from "hoist-non-react-statics";
import * as React from "react";

const SecretsContext = React.createContext({});
export const useSecrets = () => React.useContext(SecretsContext);

export const getServerSidePropsSecrets = () => {
	const secrets = dotenv.config()?.parsed;
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

	WithSecrets.getInitialProps = async context => {
		const {
			props: { secrets }
		} = getServerSidePropsSecrets();

		return {
			secrets
		};
	};

	return hoistNonReactStatics(WithSecrets, ComposedComponent);
};

export default withSecrets;
