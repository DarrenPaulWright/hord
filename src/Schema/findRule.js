export default function(path, schemaValues) {
	return path.reduce((result, key) => result.content.find((item) => item.key === key), schemaValues);
};
