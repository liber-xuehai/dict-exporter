import { Dictionary } from './type-utils';
import { Explains } from './types';

export function encodeExplain(explains: Explains): Dictionary<Array<string>> {
	if (!(explains instanceof Array)) {
		return explains;
	}
	const result: Dictionary<Array<string>> = {};
	for (let explain of explains) {
		explain = explain.trim();
		let matched = explain.match(/^([a-z]{1,4}\.)\ (.*)$/);
		let speech: string, meanings: string;
		if (!matched) {
			speech = '';
			meanings = explain;
		} else {
			speech = matched[1];
			meanings = matched[2];
		}
		const parsedMeanings = meanings.split(/[;；]/).map(word => word.trim());
		if (speech in result) {
			result[speech].push.apply(result[speech], parsedMeanings);
		} else {
			result[speech] = parsedMeanings;
		}
	}
	return result;
}

export function decodeExplain(explains: Explains): Array<string> {
	if (explains instanceof Array) {
		return explains;
	}
	const result: Array<string> = [];
	for (const key in explains) {
		result.push((key ? key + ' ' : '') + explains[key].join('；'));
	}
	return result;
}