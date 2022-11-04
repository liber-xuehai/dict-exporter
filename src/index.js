const fs = require('fs');
const path = require('path');

const parse = require('./parser');


const projectRoot = path.join(__dirname, '../');



function run() {
	const data = JSON.parse(fs.readFileSync(path.join(projectRoot, 'data.json')).toString() || '{}');
	const cache = JSON.parse(fs.readFileSync(path.join(projectRoot, 'cache.json')).toString() || '{}');
	// const css = fs.readFileSync(path.join(projectRoot, 'style.css')).toString();
	const css = '';

	const response = parse(data, cache, { css });
	fs.writeFileSync(path.join(projectRoot, 'cache.json'), JSON.stringify(response.cache, null, 2));
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