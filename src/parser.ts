import { HTML } from './template';
import { Dictionary } from './type-utils';
import { BasicElement, Config, Element, Explains } from './types';
import { encodeExplain, decodeExplain } from './utils';

export function getDate(timestamp: string | number): string {
	const date = new Date(+timestamp);
	const y = date.getFullYear();
	const m = date.getMonth() + 1;
	const d = date.getDate();
	return `${d}/${m}/${y}`;
}

export default function parse(data: any, cache: any, config: Config) {
	const dataWords: Array<Element> = data?.words || [];
	const cacheWords: Array<Element> = cache?.words || [];

	const meanings: Dictionary<Explains> = {};
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

	const pool: Dictionary<BasicElement> = {};
	for (const element of dataWords.concat(cacheWords)) {
		if (element.deleted) { continue; }
		pool[JSON.stringify({ w: element.words, t: element.modifiedTime })] = {
			words: element.words,
			explains: meanings[element.words],
			modifiedTime: element.modifiedTime,
		};
	}

	const result: Array<BasicElement> = [];
	for (const key in pool) {
		result.push(pool[key]);
	}
	result.sort((a: BasicElement, b: BasicElement) => (a.modifiedTime - b.modifiedTime));

	const renderTable = (words: Array<BasicElement>): string => {
		let counter = 0;
		const res: Array<string> = [];
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

	const body: Array<string> = [];
	for (let start = 0, end: number; start < result.length; start = end) {
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