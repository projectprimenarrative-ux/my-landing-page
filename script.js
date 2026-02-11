// Quantum Audio Engine
class QuantumAudio {
    constructor() {
        this.context = null;
        this.masterGain = null;
        this.oscillators = [];
        this.baseFreq = 220; // A3 (Standard mid-range)
    }

    init() {
        if (this.context) return; // Already running

        try {
            // Create Context strictly inside the user action
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();

            // Master Volume - Set DIRECTLY (No Ramps to avoid timing bugs)
            this.masterGain = this.context.createGain();
            this.masterGain.gain.setValueAtTime(0.5, this.context.currentTime);
            this.masterGain.connect(this.context.destination);

            // FORCE UNLOCK
            this.unlockAudio();

            // STARTUP CHIRP (Verification Sound)
            const chirp = this.context.createOscillator();
            chirp.frequency.setValueAtTime(880, this.context.currentTime); // High A5
            chirp.connect(this.masterGain);
            chirp.start();
            chirp.stop(this.context.currentTime + 0.1); // Short blip

            // Layer 1: Foundation
            this.createOscillator(this.baseFreq, 'sine', 0, 0.5);

            // Layer 2: Harmony
            this.createOscillator(this.baseFreq * 1.5, 'triangle', 0.1, 0.2);

            // Force Resume
            if (this.context.state === 'suspended') {
                this.context.resume();
            }

        } catch (e) {
            console.error('Web Audio Error:', e);
        }
    }

    unlockAudio() {
        // Create an empty three-second buffer at the sample rate of the AudioContext
        const buffer = this.context.createBuffer(1, 1, 22050);
        const source = this.context.createBufferSource();
        source.buffer = buffer;
        source.connect(this.context.destination);
        source.start(0);
    }

    createOscillator(freq, type, detune, vol) {
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.context.currentTime);
        osc.detune.setValueAtTime(detune * 100, this.context.currentTime);

        gain.gain.setValueAtTime(vol, this.context.currentTime);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();

        this.oscillators.push({ osc, gain });
    }

    fadeIn() {
        if (!this.masterGain) return;
        const now = this.context.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(0, now);
        this.masterGain.gain.linearRampToValueAtTime(0.5, now + 2); // 50% Volume in 2s
    }
}

// --- Interaction Logic ---
document.addEventListener('DOMContentLoaded', () => {

    // ONE-TIME SETUP
    let audioInitialized = false;
    const audioSystem = new QuantumAudio();

    const startAudioInteraction = (e) => {
        if (audioInitialized) return;

        // This runs strictly on user tap/click
        audioSystem.init();
        audioInitialized = true;

        // Clean up listeners
        document.removeEventListener('click', startAudioInteraction);
        document.removeEventListener('touchstart', startAudioInteraction);
        document.removeEventListener('keydown', startAudioInteraction);
    };

    // Aggressive Listeners
    document.addEventListener('click', startAudioInteraction);
    document.addEventListener('touchstart', startAudioInteraction);
    document.addEventListener('keydown', startAudioInteraction);

    // Attach listener to Profile Group as normal
    const profileGroup = document.querySelector('.profile-group');
    const liquidHeader = document.querySelector('.liquid-header');

    // Make the entire header clickable for better UX
    if (liquidHeader) {
        liquidHeader.addEventListener('click', (e) => {
            console.log('Header Clicked - Toggling Glow'); // DEBUG

            // Toggle Glow on Liquid Header (Top Container)
            liquidHeader.classList.toggle('glow-active');

            // Toggle Glow on Spines and Bottom Containers (Synchronized Pulse)
            const spineBig = document.querySelector('.spine-connector');
            const spineSmall = document.querySelector('.spine-connector-small');
            const groups = document.querySelectorAll('.group-container');

            if (spineBig) spineBig.classList.toggle('glow-active');
            if (spineSmall) spineSmall.classList.toggle('glow-active');

            // Toggle glow on ALL groups (including profile group if not already handled by parent)
            groups.forEach(group => group.classList.toggle('glow-active'));

            // Haptic feedback
            if (navigator.vibrate) navigator.vibrate(50);
        });
    }
});

// --- Action Logic ---
function downloadVCard() {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:Vijay Ragavan G
N:G;Vijay;Ragavan;;
ORG:Triiq Innovations Private Limited
TITLE:CEO Prime Directive / Innovation Catalyst
TEL;TYPE=CELL:+919342262534
EMAIL:contact@primedirective.tech
END:VCARD`;
    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'Vijay_Ragavan_G.vcf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}

function openWhatsApp() {
    window.open('https://wa.me/919342262534?text=Hi%20Vijay,%20I%20came%20across%20your%20profile%20and%20would%20like%20to%20connect.', '_blank');
}
