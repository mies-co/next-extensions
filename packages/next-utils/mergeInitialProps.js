const mergeInitialProps = (ComposedComponent, newInitialProps = () => ({})) => async context => {
	let composedInitialProps = {};
	if (typeof ComposedComponent.getInitialProps === "function") {
		composedInitialProps = await ComposedComponent.getInitialProps(context);
	}

	return await newInitialProps(context, composedInitialProps);
};

module.exports = mergeInitialProps;
exports = module.exports;
