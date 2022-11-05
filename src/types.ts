import { Dictionary } from './type-utils';

export interface Config {
	css: string;
}

export type Explains = Array<string> | Dictionary<Array<string>>;

export interface BasicElement {
	words: string;
	explains: Explains;
	modifiedTime: number;
	deleted?: boolean;
}

export interface Element extends BasicElement {
	dictionaryId: string;
	wordsBookId: string;
	cnExplains: null | Explains;
	lowerWord: string;
	dictionaryType: "ENG";
	deleted: boolean;
}