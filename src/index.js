const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

const parse = require('./parser');


const projectRoot = path.join(__dirname, '../');



function run() {
	// const css = fs.readFileSync(path.join(projectRoot, 'style.css')).toString();
	const css = '';
	const config = { css }

	const data = JSON.parse(fs.readFileSync(path.join(projectRoot, 'data.json')).toString() || '{}');
	const cache = YAML.parse(fs.readFileSync(path.join(projectRoot, 'cache.yaml')).toString() || '{}');

	const response = parse(data, cache, config);
	fs.writeFileSync(path.join(projectRoot, 'cache.yaml'), YAML.stringify(response.cache, null, 2));
	fs.writeFileSync(path.join(projectRoot, 'index.html'), response.html);
}

if (require.main === module) {
	run();
}

module.exports = {
	run,
	parse,
	projectRoot,
};