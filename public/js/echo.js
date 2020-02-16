'use strict';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();


recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

startButton.onclick = _ => {
    console.log('start');
    recognition.start();
};

recognition.onerror = event => outputYou.textContent = 'Error: ' + event.error;
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

    synthVoice(text);
};

function synthVoice(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    synth.speak(utterance);
}
