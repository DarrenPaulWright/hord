export default (mainLinks) => (nodes) => {
	return new Promise((resolve) => {
		resolve(mainLinks.filter({
			target: {
				id: {$in: nodes.map((item) => item.id)}
			}
		}));
	});
}
