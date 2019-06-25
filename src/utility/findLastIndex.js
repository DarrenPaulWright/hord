import someRight from './someRight';

export default (array, finder) => {
	let output;

	someRight(array, (item, index) => {
		if (finder(item)) {
			output = index;
			return true;
		}
	});

	return (output === undefined) ? -1 : output;
}
