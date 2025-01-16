// Paths to audio files
const sounds = {
    rain: 'sounds/rain.mp3',
    ocean: 'sounds/ocean.mp3',
    fire: 'sounds/fire.mp3',
    birds: 'sounds/birds.mp3',
    thunder: 'sounds/thunder.mp3',
};

// AudioContext and GainNodes setup
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const gainNodes = {};

// Function to play a sound and link it to a gain node
function playSound(type) {
    const soundUrl = sounds[type];
    fetch(soundUrl)
        .then(response => response.arrayBuffer())
        .then(buffer => audioContext.decodeAudioData(buffer))
        .then(audioBuffer => {
            const source = audioContext.createBufferSource();
            const gainNode = audioContext.createGain();

            source.buffer = audioBuffer;
            source.loop = true;
            source.connect(gainNode).connect(audioContext.destination);

            // Store the gain node for volume control
            gainNodes[type] = gainNode;

            // Start the sound
            source.start(0);
        });
}

// Function to adjust volume
function adjustVolume(type, value) {
    if (gainNodes[type]) {
        gainNodes[type].gain.value = value;
    }
}

// Start button logic
const startButton = document.getElementById('start-button');
startButton.addEventListener('click', () => {
    // Resume AudioContext on user interaction
    audioContext.resume().then(() => {
        // Start playing all sounds
        playSound('rain');
        playSound('ocean');
        playSound('fire');
        playSound('birds');
        playSound('thunder');

        // Hide the start button
        startButton.style.display = 'none';
    }).catch(error => {
        console.error('Error resuming audio context:', error);
    });
});

// Link sliders to their respective sounds
document.getElementById('rain-slider').addEventListener('input', (e) => {
    adjustVolume('rain', e.target.value);
});
document.getElementById('ocean-slider').addEventListener('input', (e) => {
    adjustVolume('ocean', e.target.value);
});
document.getElementById('fire-slider').addEventListener('input', (e) => {
    adjustVolume('fire', e.target.value);
});
document.getElementById('birds-slider').addEventListener('input', (e) => {
    adjustVolume('birds', e.target.value);
});
document.getElementById('thunder-slider').addEventListener('input', (e) => {
    adjustVolume('thunder', e.target.value);
});

// Presets for sound combinations
const presets = {
    rainyDay: { rain: 1, ocean: 0.5, fire: 0, birds: 0, thunder: 0.3 },
    oceanEscape: { rain: 0, ocean: 1, fire: 0, birds: 0.4, thunder: 0 },
    cozyFire: { rain: 0.2, ocean: 0, fire: 1, birds: 0, thunder: 0.1 },
    allOff: { rain: 0, ocean: 0, fire: 0, birds: 0, thunder: 0 },
};


// Function to apply a preset
function applyPreset(presetName) {
    const preset = presets[presetName];
    for (let sound in preset) {
        const volume = preset[sound];
        adjustVolume(sound, volume); // Update the sound volume
        document.getElementById(`${sound}-slider`).value = volume; // Update the slider position
    }
}

// Event listeners for preset buttons
document.getElementById('preset-rainy-day').addEventListener('click', () => {
    applyPreset('rainyDay');
});

document.getElementById('preset-ocean-escape').addEventListener('click', () => {
    applyPreset('oceanEscape');
});

document.getElementById('preset-cozy-fire').addEventListener('click', () => {
    applyPreset('cozyFire');
});
document.getElementById('all-off-button').addEventListener('click', () => {
    applyPreset('allOff'); // Use the All Off preset
});
