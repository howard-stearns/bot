'use strict';

const RiveScript = require('rivescript');
const express = require('express');
const app = express();
const bot = new RiveScript();

bot.loadDirectory("rs").then(_ => {
    bot.sortReplies();
    bot.setUservar ('browser', 'isGroupChat', 'true'); // Disables "interview" mode.
    //bot.reply('server', "Hello, bot!").then(reply => console.log("The bot says: " + reply));
    //bot.reply('server', "shake").then(reply => console.log("The bot says: " + reply));
}).catch(console.error);

app.use(express.static(__dirname + '/public'));

const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

const io = require('socket.io')(server);
io.on('connection', function (socket) {
    console.log('a user connected');
});

io.on('connection', function (socket) {
    socket.on('chat message', (text) => {
	bot.reply('browser', text).then(reply => socket.emit('bot reply', reply));
    });
});
