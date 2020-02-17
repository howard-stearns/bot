'use strict';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

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

recognition.onresult = event => {
    const results = event.results;
    let last = results.length - 1;
    let text = results[last][0].transcript.toLowerCase();
    console.log(`Result has been detected at ${last}.`);
    outputYou.textContent = text;
    console.log('Confidence: ' + results[0][0].confidence);

    switch (text) {
    case 'now sit':
    case 'set':
    case 'please sit':
    case 'sit':
	pet.src = "https://bullyade.com/wp-content/uploads/2018/06/child-training-dog-sit-750x350.jpg";
	break;
    case 'shake':
	pet.src = "https://images.baxterboo.com/global/images/article/E99933E5-5056-800A-6B89B889D79D6223.jpg";
	break;
    case 'rollover':
	pet.src = "http://allpetnews.com/wp-content/uploads/2011/10/Dog-Rolling-Over.jpg";
	break;
    case 'play dead':
    case 'play dad':	
	pet.src = "https://i.imgflip.com/2kut2n.jpg"
	break;
    case 'fetch':
	pet.src = "https://external-preview.redd.it/BWK5kX3wW4x29MP3xmKNz1zddCI1ZllktemE7jmIFz0.jpg?auto=webp&s=744992c4d37b092ad477ae3134bb8e03b911c49f"
	break;
    case 'find friends':
    case 'find dogs':
    case 'find other dogs':
    case 'find pets':
    case 'find other pets':
	pet.src = "https://www.robinkbennett.com/wp-content/uploads/2013/11/shutterstock_51472228-760x432.jpg"
	break;
    case 'find people':
	pet.src = "https://cdn2-www.dogtime.com/assets/uploads/2012/05/people-friendly-dog-2.jpg";
	break;
    case 'find food':
	pet.src = "https://d3eh3svpl1busq.cloudfront.net/NgixRrFkBQeTlDCSdcOpdSPEAchKObDh/assets/static/optimized/rev-d7f2ff0/wp-content/uploads/2018/04/dog-with-pizza-in-mouth.jpg"
	break;
    case 'go back':
    case 'stop':
    case 'quit':	
	window.location.href = "index.html";
	break;
    case 'speak':
    case 'bark':
	synthVoice('woof');
	break;
    default:
	synthVoice('hmm');
    }
};

// IWBNI we got nomatch, per spec. Instead, we sometimes get a 'no-speech' error, and sometimes just the 'end' event.
recognition.onend = _ => {
    if (synth.speaking) return; // We'll start when it finishes.
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
