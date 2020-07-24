// Override the exports of Next.js page
// Used to override an exported getServerSideProps for instance

// customHandle is a name that you know your page is exporting. For instance the name of your HOC that is using this function
const setPageExports = (customHandle, customExports = []) => {
	// BREAK immediately in the browser
	if (typeof window !== "undefined") return;

	const pagesToIgnore = ["_document.js", "_app.js", "_error.js"];
	const pageCacheKey = Object.keys(require.cache).find((key) => {
		if (key.includes("/pages/") && !pagesToIgnore.some((x) => key.endsWith(x))) return true;
		return false;
	});
	// Get the index of the child that is wrapped by our component
	const safeChildren = (require.cache[pageCacheKey] || {}).children || [{ exports: {} }];
	const pageCacheChildIdx = safeChildren.findIndex((x) => (x.exports || {})[customHandle]);

	// BREAK because no idx found
	if (pageCacheChildIdx < 0) return;

	const pageCacheChild = safeChildren[pageCacheChildIdx];

	for (let i = 0; i < customExports.length; i++) {
		const { options = {}, ...newExport } = customExports[i];

		Object.entries(newExport).forEach(([key, v]) => {
			let val = v;

			// Enables to pass a function to get the existing export for that value
			if (typeof val === "function" && options.getExisting) val = v((require.cache[pageCacheKey].children[pageCacheChildIdx] || {}).exports[key]);

			// Do not override
			if (!options.override && !pageCacheChild.exports[key]) return ((require.cache[pageCacheKey].children[pageCacheChildIdx] || {}).exports[key] = val);

			// Override
			return ((require.cache[pageCacheKey].children[pageCacheChildIdx] || {}).exports[key] = val);
		});
	}
};

module.exports = setPageExports;
exports = module.exports;
