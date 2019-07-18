export default (mainLinks) => (nodes) => {
	return new Promise((resolve) => {
		resolve(mainLinks.filter({
			source: {
				id: {$in: nodes.map((item) => item.id)}
			}
		}));
	});
}
