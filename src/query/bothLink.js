export default (mainLinks) => (nodes) => {
	const nodeIds = nodes.map((item) => item.id);

	return new Promise((resolve) => {
		resolve(mainLinks
			.filter({
				source: {
					id: { $in: nodeIds }
				}
			})
			.concat(mainLinks.filter({
				target: {
					id: { $in: nodeIds }
				}
			}))
			.unique());
	});
};
