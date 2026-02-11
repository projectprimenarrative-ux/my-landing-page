// Quantum Audio Engine
class QuantumAudio {
    constructor() {
        this.context = null;
        this.masterGain = null;
        this.audioBuffer = null;
        this.sourceNode = null;
        this.isMuted = true;
        this.isLoaded = false;
    }

    async init() {
        if (this.context) return; // Already running

        try {
            // Create Context strictly inside the user action
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();

            // Master Volume
            this.masterGain = this.context.createGain();
            this.masterGain.gain.setValueAtTime(0, this.context.currentTime); // Start MUTED
            this.masterGain.connect(this.context.destination);

            // Load the MP3
            await this.loadAudio('audio.mp3');

        } catch (e) {
            console.error('Web Audio Error:', e);
        }
    }

    async loadAudio(url) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            this.audioBuffer = await this.context.decodeAudioData(arrayBuffer);
            this.isLoaded = true;
            console.log('Audio Loaded');

            // If user already clicked "On" while loading, start now
            if (!this.isMuted) {
                this.play();
                this.fadeIn();
            }
        } catch (e) {
            console.error('Failed to load audio:', e);
        }
    }

    play() {
        if (!this.context || !this.audioBuffer) return;

        // Stop previous if exists
        if (this.sourceNode) {
            try { this.sourceNode.stop(); } catch (e) { }
        }

        this.sourceNode = this.context.createBufferSource();
        this.sourceNode.buffer = this.audioBuffer;
        this.sourceNode.loop = true; // Loop the MP3
        this.sourceNode.connect(this.masterGain);
        this.sourceNode.start(0);
    }

    stop() {
        if (this.sourceNode) {
            try {
                this.sourceNode.stop();
                this.sourceNode = null;
            } catch (e) { }
        }
    }

    toggleSound(enable) {
        if (!this.context) this.init(); // Initialize on first click

        // Ensure context is running
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }

        this.isMuted = !enable;

        if (enable) {
            // If loaded, play and fade in. If not loaded, init() will handle it.
            if (this.isLoaded) {
                // Only start a new source if one isn't playing or if we want to restart
                // For ambient loops, usually we just set volume up. 
                // But if we stopped it completely to save resources, we need to restart.
                // Let's restart to be safe and ensure sync.
                this.play();
                this.fadeIn();
            }
        } else {
            this.fadeOut();
        }
    }

    fadeIn() {
        if (!this.masterGain) return;
        const now = this.context.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.linearRampToValueAtTime(0.5, now + 1.5); // Smooth fade in
    }

    fadeOut() {
        if (!this.masterGain) return;
        const now = this.context.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.linearRampToValueAtTime(0, now + 0.5); // Quick fade out

        // Stop the source after fade to save resources
        setTimeout(() => {
            if (this.isMuted) this.stop();
        }, 600);
    }
}

// --- Interaction Logic ---
document.addEventListener('DOMContentLoaded', () => {

    // AUDIO SETUP
    const audioSystem = new QuantumAudio();
    const soundBtn = document.getElementById('sound-toggle');
    const soundWaves = document.getElementById('sound-waves');
    const bgVideo = document.getElementById('bg-video');

    // State Tracking - Default to ON
    let isSoundOn = true;

    // Helper to update UI
    const updateUI = (active) => {
        if (soundBtn && soundWaves) {
            if (active) {
                soundBtn.classList.add('active');
                soundWaves.style.opacity = '1';
            } else {
                soundBtn.classList.remove('active');
                soundWaves.style.opacity = '0';
            }
        }
    }

    // Initialize - Attempt Autoplay
    updateUI(true); // Show as ON immediately

    // Try to play immediately (might be blocked)
    const tryAutoplay = async () => {
        try {
            await audioSystem.toggleSound(true);
            if (bgVideo) bgVideo.muted = false;
            console.log("Autoplay success");
        } catch (e) {
            console.log("Autoplay blocked, waiting for interaction");
            // If blocked, we are technically "off" until interaction, strictly speaking
            // But we keep UI "ON" to show intent, catch first click
        }
    };

    tryAutoplay();

    // Global Unlocker - Ensures sound starts on first interaction if autoplay failed
    // Or if user just interacts with the page in general
    const unlockHandler = () => {
        if (isSoundOn) {
            audioSystem.context.resume().then(() => {
                if (audioSystem.isLoaded && !audioSystem.sourceNode) {
                    audioSystem.play();
                    audioSystem.fadeIn();
                }
            });
            if (bgVideo) bgVideo.muted = false;
        }
        document.removeEventListener('click', unlockHandler);
        document.removeEventListener('touchstart', unlockHandler);
        document.removeEventListener('keydown', unlockHandler);
    };

    document.addEventListener('click', unlockHandler);
    document.addEventListener('touchstart', unlockHandler);
    document.addEventListener('keydown', unlockHandler);


    // Toggle Handler
    if (soundBtn) {
        soundBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Don't trigger the global unlocker twice if clicking this

            isSoundOn = !isSoundOn;

            // 1. Toggle Audio Engine
            audioSystem.toggleSound(isSoundOn);

            // 2. Toggle Video Audio
            if (bgVideo) {
                bgVideo.muted = !isSoundOn;
            }

            // 3. Update UI
            updateUI(isSoundOn);

            // Haptic
            if (isSoundOn && navigator.vibrate) navigator.vibrate(20);
        });
    }

    // Attach listener to Profile Group as normal for GLOW effects
    const liquidHeader = document.querySelector('.liquid-header');

    // Make the entire header clickable for better UX
    if (liquidHeader) {
        liquidHeader.addEventListener('click', (e) => {
            // Toggle Glow on Liquid Header (Top Container)
            liquidHeader.classList.toggle('glow-active');

            // Toggle Glow on Spines and Bottom Containers (Synchronized Pulse)
            const spineBig = document.querySelector('.spine-connector');
            const spineSmall = document.querySelector('.spine-connector-small');
            const groups = document.querySelectorAll('.group-container');

            if (spineBig) spineBig.classList.toggle('glow-active');
            if (spineSmall) spineSmall.classList.toggle('glow-active');

            // Toggle glow on ALL groups
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
