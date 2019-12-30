export default (array, item, comparer, isInsert = false, high = array.length) => {
	let low = 0;
	let mid = 0;
	const max = high - 1;
	let diff = 0;

	while (low !== high) {
		diff = comparer(array[mid = high + low >>> 1], item);

		if (diff < 0 || diff === 0 && mid < max && comparer(array[mid + 1], item) === 0) {
			low = mid + 1;
		}
		else if (diff > 0) {
			high = mid;
		}
		else {
			return mid;
		}
	}

	return isInsert === true ? (diff > 0 && --mid || mid) : -1;
};
