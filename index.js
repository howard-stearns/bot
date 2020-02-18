'use strict';

const express = require('express');
const RiveScript = require('rivescript');
const index = require('./crawl.js');

const app = express();
const bots = {
    aiden: new RiveScript(),
    alice: new RiveScript(),
    pet: new RiveScript({errors: {replyNotMatched: ''}})
};
const testUser = 'internal test user';
const browserUser = 'a user'; // Could be something persisted with each individual user.

['aiden', 'alice', 'pet'].forEach(name => {
    var bot = bots[name];
    bot.loadDirectory(name).then(_ => {
	bot.sortReplies();
	if (name !== 'pet') return;
	bot.setUservar (browserUser, 'isGroupChat', 'true'); // Disables "interview" mode.
	// bot.setUservar (testUser, 'isGroupChat', 'true'); // Disables "interview" mode.	
	// ["Hi",
	//  "what is your name",
	//  "Gin",
	//  "what is your name",
	//  "I think I'd like to change your name to Dave",
	//  "what is your name",
	//  "what is my name",
	//  "Howard",
	//  "what is my name",
	//  "this really shouldn't match anything",
	//  "Dave, I'm tired",
	//  "What do you know?"
	// ].reduce((promise, text) => {
    	//     return promise.then(_ => bot.reply(testUser, text).then(reply => console.log(text, '=>', reply)));
	// }, Promise.resolve());
    }).catch(console.error);
});

app.use(express.static(__dirname + '/public'));

const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

const io = require('socket.io')(server);
function search(text) {
    return index.search(text, {}).map(r => r.ref);
}

io.on('connection', socket => {
    
    socket.on('search message', text => socket.emit('search reply', search(text)));
    
    ['aiden', 'alice', 'pet'].forEach(name => {
	var bot = bots[name];
	socket.on(name + ' message',
		  text => {
		      bot.reply(browserUser, text).then(reply => socket.emit('bot reply', reply,
									     search(text)));
		  });
    });
});
