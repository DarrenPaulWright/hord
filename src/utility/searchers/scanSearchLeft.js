export default (array, item, comparer, isInsert = false) => {
	let diff = 0;

	for (let index = 0; index < array.length; index++) {
		diff = comparer(array[index], item);

		if (diff === 0) {
			return index;
		}
		if (diff > 0) {
			return isInsert ? index - 1 : -1;
		}
	}

	return isInsert ? array.length - 1 : -1;
}
