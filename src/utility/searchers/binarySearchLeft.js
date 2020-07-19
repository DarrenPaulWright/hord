export default (array, item, comparer, isInsert = false) => {
	let low = 0;
	let high = array.length - 1;
	let mid = 0;
	let diff = 0;

	while (low <= high) {
		diff = comparer(array[mid = high + low >>> 1], item);

		if (diff < 0) {
			low = mid + 1;
		}
		else if (diff > 0 || (mid !== 0 && comparer(array[mid - 1], item) === 0)) {
			high = mid - 1;
		}
		else {
			return mid;
		}
	}

	return isInsert ? ((diff > 0 && --mid) || mid) : -1;
};
