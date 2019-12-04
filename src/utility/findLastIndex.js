export default (array, callback) => {
	for (let index = array.length - 1; index !== -1; index--) {
		if (callback(array[index])) {
			return index;
		}
	}

	return -1;
}
