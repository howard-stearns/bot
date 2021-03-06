'use strict';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const socket = io();

recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

startButton.onclick = _ => {
    console.log('start');
    startButton.style.display = 'none';
    pet.src = "https://i.pinimg.com/474x/e4/48/43/e448436432630ea5688cb73e6afb69a3.jpg"
    recognition.start();
};

recognition.onerror = event => {
    console.error(event.error);
    outputYou.textContent = 'Error: ' + event.error;
    recognition.stop(); // Make sure we get an 'end' event, regardless.
};
recognition.onspeechstart = _ => console.log('Speech has been detected.');
recognition.onspeechend = _ => {
    console.log('stop');
    recognition.stop(); // Triggers attempt to construct a result.
};

var thinking = false;
recognition.onresult = event => {
    const results = event.results;
    let last = results.length - 1;
    let text = results[last][0].transcript;
    console.log(`Result has been detected at ${last}.`);
    outputYou.textContent = text;
    outputBot.textContent = '';
    console.log('Confidence: ' + results[0][0].confidence);
    thinking = true;
    socket.emit('pet message', text);
};

// IWBNI we got nomatch, per spec. Instead, we sometimes get a 'no-speech' error, and sometimes just the 'end' event.
recognition.onend = _ => {
    if (synth.speaking || thinking) return; // We'll start when it finishes.
    console.log('nothing to echo');
    recognition.start();
}

const synth = window.speechSynthesis;
function synthVoice(text) {
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    utterance.onend = _ => {
	console.log('spoken');
	recognition.start();
    }
    synth.speak(utterance);
}

const references = [r1, r2, r3, r4, r5];
socket.on('bot reply', (replyText, urls) => {
    thinking = false;
    outputBot.textContent = replyText || '(No answer...)';
    references.forEach((link, index) => {
	const url = urls[index],
	      path = url && new URL(url).pathname.split('/');
	var dirIndex = path ? path.length - 2 : 0;
	link.href=url;
	link.innerHTML = path ? path.slice(dirIndex).join('/') : '';
    });
    if (!replyText) {
	recognition.start();
    } else if (command(replyText)) {
	synthVoice('ok');
    } else {
	synthVoice(replyText);
    }
});

function command(text) {
    const commandKey = 'command',
	  commands = {
	      pet: url => pet.src = url,
	      home: _ => window.location.href = "index.html"
	  };
    if (!text.startsWith(commandKey)) return;
    let [key, command, ...args] = text.split(' ');
    commands[command](...args);
    return true;
}

    
