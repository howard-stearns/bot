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

recognition.onresult = event => {
    const results = event.results;
    let last = results.length - 1;
    let text = results[last][0].transcript;
    console.log(`Result has been detected at ${last}.`);
    outputYou.textContent = text;
    console.log('Confidence: ' + results[0][0].confidence);

    socket.emit('search message', text);
};

// IWBNI we got nomatch, per spec. Instead, we sometimes get a 'no-speech' error, and sometimes just the 'end' event.
recognition.onend = _ => {

    console.log('nothing to echo');
    recognition.start();
}

const references = [r1, r2, r3, r4, r5];
socket.on('search reply', urls => {
    references.forEach((link, index) => {
	const url = urls[index],
	      path = url && new URL(url).pathname.split('/');
	var dirIndex = path ? path.length - 2 : 0;
	link.href=url;
	link.innerHTML = path ? path.slice(dirIndex).join('/') : '';
    });
});
    
