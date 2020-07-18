export default (array, item, comparer, isInsert = false, high = array.length - 1) => {
	let diff = 0;

	for (let index = high; index > -1; index--) {
		diff = comparer(array[index], item);

		if (diff === 0) {
			return index;
		}
		if (diff < 0) {
			return isInsert ? index : -1;
		}
	}

	return -1;
};
