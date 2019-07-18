export default () => (links) => {
	return new Promise((resolve) => {
		resolve(links.map((link) => link.source).concat(links.map((link) => link.target))
			.unique());
	});
}
