// Quantum Audio Engine
class QuantumAudio {
    constructor() {
        this.context = null;
        this.masterGain = null;
        this.oscillators = [];
        this.isPlaying = false;
        this.baseFreq = 130.81; // C3 (Higher than A2 for phone speakers)
    }

    init() {
        if (this.context) return;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
            this.masterGain = this.context.createGain();
            this.masterGain.gain.setValueAtTime(0, this.context.currentTime); // Start silent
            this.masterGain.connect(this.context.destination);

            // Create "Quantum Chord" (Root, +4 cents, +7 cents for binaural beat)
            this.createOscillator(this.baseFreq, 'sine', 0); // Fundamental
            this.createOscillator(this.baseFreq * 1.5, 'sine', 0.1); // Perfect Fifth (Stability)
            this.createOscillator(this.baseFreq * 0.5, 'triangle', 0.05); // Sub-Octave (Groundedness)

            this.isPlaying = true;
            console.log('Quantum Audio Initialized');
        } catch (e) {
            console.error('Web Audio API not supported:', e);
        }
    }

    createOscillator(freq, type, detune) {
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.context.currentTime);
        osc.detune.setValueAtTime(detune * 100, this.context.currentTime); // Slight detune for "wave" effect

        gain.gain.setValueAtTime(0.1, this.context.currentTime); // Low individual volume

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();

        this.oscillators.push({ osc, gain });
    }

    start() {
        if (!this.context) this.init();

        console.log('Audio Start Triggered. State:', this.context.state);

        if (this.context.state === 'suspended') {
            this.context.resume().then(() => {
                console.log('Audio Context Resumed. New State:', this.context.state);
            });
        }

        // Fade In
        const now = this.context.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.linearRampToValueAtTime(0.5, now + 2); // Louder (0.5), Faster Fade (2s)
        console.log('Audio Fading In...');
    }
}

// --- Interaction Logic ---
document.addEventListener('DOMContentLoaded', () => {
    // Audio System - Auto-Start on First Interaction
    const audioSystem = new QuantumAudio();

    const startAudio = () => {
        audioSystem.start();
        // Remove listeners once started
        document.removeEventListener('click', startAudio);
        document.removeEventListener('touchstart', startAudio);
        document.removeEventListener('scroll', startAudio);
    };

    // Listen for ANY user interaction to trigger sound
    document.addEventListener('click', startAudio);
    document.addEventListener('touchstart', startAudio);
    document.addEventListener('scroll', startAudio);

    // Attach listener to Profile Group (Name Container)
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
