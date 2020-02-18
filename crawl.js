'use strict';

const fs = require('fs');
const readline = require('readline');
const path = require('path');
const elasticlunr = require('elasticlunr');
const source = 'https://github.com/howard-stearns/bot/blob/master/';

elasticlunr.tokenizer.seperator = /[\s\-|={}<>()[\].?!]+/;

var index = module.exports = elasticlunr(function () {
    this.addField('text');
    this.setRef('id');
    this.saveDocument(false);
});


function indexDirectory(directory) {
    fs.readdir(directory, (error, filenames) => {
	if (error) return console.error(error);
	filenames.map(filename => {
	    if (path.extname(filename) !== '.rive') return;
	    var lineNumber = 0;
	    const pathname = path.join(directory, filename);
	    const reader = readline.createInterface({
		input: fs.createReadStream(pathname),
		output: null,
		console: false
	    });
	    reader.on('line', line => {
		var n = ++lineNumber;
		index.addDoc({
		    text: line,
		    id: source + pathname + '#L' + n
		});
	    });
	    reader.on('close', _ => console.log('index', pathname, lineNumber));
	});
    });
}
indexDirectory('pet');
indexDirectory('aiden');
indexDirectory('alice');

