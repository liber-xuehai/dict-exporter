const HTML = `
	<!DOCTYPE html>
	<html lang="zh-Hans">
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="initial-scale=1, width=device-width">
			<title>EXPORT</title>
			<link rel="stylesheet" href="./style.css">
			{{ header }}
		</head>
		<body>
			{{ body }}
		</body>
	</html>
`;

function getDate(timestamp) {
	const date = new Date(+timestamp);
	const y = date.getFullYear();
	const m = date.getMonth() + 1;
	const d = date.getDate();
	return `${d}/${m}/${y}`;
}

function encodeExplain(explains) {
	if (!(explains instanceof Array)) {
		return explains;
	}
	const result = {};
	for (let explain of explains) {
		explain = explain.trim();
		let matched = explain.match(/^([a-z]{1,4}\.)\ (.*)$/);
		if (!matched) {
			matched = [null, '', explain];
		}
		matched[2] = matched[2].split(/[;；]/).map(word => word.trim());
		if (matched[1] in result) {
			result[matched[1]].push.apply(result[matched[1]], matched[2]);
		} else {
			result[matched[1]] = matched[2];
		}
	}
	return result;
}

function decodeExplain(explains) {
	if (explains instanceof Array) {
		return explains;
	}
	const result = [];
	for (const key in explains) {
		result.push((key ? key + ' ' : '') + explains[key].join('；'));
	}
	return result;
}

function parse(data, cache, config) {
	const dataWords = data?.words || [];
	const cacheWords = cache?.words || [];
	// const isEqual = (i, j) => (dataWords[i].words === cacheWords[j].words && dataWords[i].modifiedTime === cacheWords[j].modifiedTime);

	const meanings = {};
	for (const element of cacheWords) {
		if (element.explains) {
			meanings[element.words] = encodeExplain(element.explains);
		}
	}
	for (const element of dataWords) {
		if (!(element.words in meanings)) {
			meanings[element.words] = encodeExplain(element.explains);
		}
	}

	const pool = {};
	for (const element of dataWords.concat(cacheWords)) {
		if (element.deleted) { continue; }
		pool[JSON.stringify({ w: element.words, t: element.modifiedTime })] = {
			words: element.words,
			explains: meanings[element.words],
			modifiedTime: element.modifiedTime,
		};
	}

	const result = [];
	for (const key in pool) {
		result.push(pool[key]);
	}
	result.sort((a, b) => (a.modifiedTime - b.modifiedTime));

	const renderTable = (words) => {
		let counter = 0;
		const res = [];
		res.push('<table class="dict">');
		// res.push('<thead><tr><th>#</th><th>Words</th><th>Explains</th></tr></thead>');
		res.push('<tbody>');
		for (const element of words) {
			++counter;
			res.push('<tr><td>' + [
				counter,
				element.words,
				decodeExplain(element.explains).join('<br>'),
			].join('</td><td>') + '</td></tr>')
		}
		res.push('</tbody></table>');
		return res.join('\n');
	}

	const body = [];
	for (let start = 0, end; start < result.length; start = end) {
		const date = getDate(result[start].modifiedTime);
		end = start;
		while (end < result.length && getDate(result[end].modifiedTime) === date) {
			end++;
		}
		// console.log('>>', start, end, date);
		body.push('<h2 class="date">' + date + '</h2>');
		body.push(renderTable(result.slice(start, end)));
	}

	const html = HTML
		.replace('{{ header }}', '<style>' + config.css + '</style>')
		.replace('{{ body }}', body.join('\n'));

	cache.words = result;

	return {
		cache,
		html,
	};
}

module.exports = parse;