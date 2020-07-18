export default (matcher) => (items) => {
	return new Promise((resolve) => {
		resolve(items.filter(matcher));
	});
};
