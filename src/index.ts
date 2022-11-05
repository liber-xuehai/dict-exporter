import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

import parse from './parser';
export { parse };

export const projectRoot = path.join(__dirname, '../');

export function run() {
	const css = fs.readFileSync(path.join(projectRoot, 'src/style.css')).toString();
	const config = { css };

	const data = JSON.parse(fs.readFileSync(path.join(projectRoot, 'data.json')).toString() || '{}');
	const cache = YAML.parse(fs.readFileSync(path.join(projectRoot, 'cache.yaml')).toString() || '{}');

	const response = parse(data, cache, config);
	fs.writeFileSync(path.join(projectRoot, 'cache.yaml'), YAML.stringify(response.cache, null, 2));
	fs.writeFileSync(path.join(projectRoot, 'index.html'), response.html);
}

if (require.main === module) {
	run();
}