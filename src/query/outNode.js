export default () => (links) => {
	return new Promise((resolve) => {
		resolve(links.map((link) => link.source).unique());
	});
};
