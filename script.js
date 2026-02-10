// Neon Circuit Logic Animation (Pure Digital)
const canvas = document.getElementById('quantum-canvas');
const ctx = canvas.getContext('2d');

let circuits = [];
let logoCenter = { x: 0, y: 0 };
let tick = 0;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let logoElement = document.querySelector('.illustration-container');
    if (logoElement) {
        let rect = logoElement.getBoundingClientRect();
        logoCenter.x = rect.left + rect.width / 2;
        logoCenter.y = rect.top + rect.height / 2;
    } else {
        logoCenter.x = canvas.width / 2;
        logoCenter.y = 120;
    }
}

window.addEventListener('resize', resize);
window.addEventListener('load', resize);

// --- Neon Circuit Logic ---
class CircuitPacket {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.floor(Math.random() * canvas.width);
        this.y = Math.floor(Math.random() * canvas.height);
        this.size = Math.random() * 2 + 1.5; // Slightly thicker
        this.speed = Math.random() * 3 + 2; // Faster data flow
        this.direction = Math.floor(Math.random() * 4); // 0: Up, 1: Right, 2: Down, 3: Left
        this.life = Math.random() * 100 + 50;
        this.history = []; // Trail
        this.maxLength = 15; // Longer trails for more "glow" presence
        this.hue = Math.random() > 0.5 ? 180 : 30; // Cyan (Tech) or Cosmic Orange
        // Chance for white/gold data packets
        if (Math.random() < 0.1) this.hue = 60;
    }

    update() {
        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > this.maxLength) {
            this.history.shift();
        }

        // Rectilinear movement
        if (this.direction === 0) this.y -= this.speed;
        else if (this.direction === 1) this.x += this.speed;
        else if (this.direction === 2) this.y += this.speed;
        else if (this.direction === 3) this.x -= this.speed;

        // Random Turn (Logic Switch)
        if (Math.random() < 0.05) {
            this.direction = Math.floor(Math.random() * 4);
        }

        this.life--;
        // Bounds check
        if (this.life <= 0 || this.x < -50 || this.x > canvas.width + 50 || this.y < -50 || this.y > canvas.height + 50) {
            this.reset();
        }
    }

    draw() {
        if (this.history.length < 2) return;

        ctx.beginPath();
        // Core Trail
        ctx.strokeStyle = `hsla(${this.hue}, 100%, 70%, 1)`;
        ctx.lineWidth = 2;
        ctx.moveTo(this.history[0].x, this.history[0].y);
        for (let i = 1; i < this.history.length; i++) {
            ctx.lineTo(this.history[i].x, this.history[i].y);
        }
        ctx.lineTo(this.x, this.y);
        ctx.stroke();

        // Outer Glow (Neon Effect)
        ctx.shadowBlur = 15;
        ctx.shadowColor = `hsla(${this.hue}, 100%, 50%, 1)`;
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset for performance

        // Data Packet Head (Bright Core)
        ctx.fillStyle = `hsla(${this.hue}, 100%, 95%, 1)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Extra Head Glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsla(${this.hue}, 100%, 50%, 1)`;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

function init() {
    circuits = [];

    // Increased Circuit Count since background particles are gone
    // We want the screen to feel busy but organized
    const circuitCount = window.innerWidth < 480 ? 15 : 30;
    for (let i = 0; i < circuitCount; i++) {
        circuits.push(new CircuitPacket());
    }

    resize();
}

function animate() {
    requestAnimationFrame(animate);

    // Darkest background for maximum contrast
    // Using clearRect helps with the crisp neon look, but we want trails to fade? 
    // Actually, "Neon Traveling" usually looks best with a clean slate each frame 
    // because we draw the trail manually in the class.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render Circuits (Digital)
    for (let i = 0; i < circuits.length; i++) {
        circuits[i].update();
        circuits[i].draw();
    }

    // Render Supernova (if triggered)
    for (let i = 0; i < explosionParticles.length; i++) {
        explosionParticles[i].update();
        explosionParticles[i].draw();
        if (explosionParticles[i].life <= 0) {
            explosionParticles.splice(i, 1);
            i--;
        }
    }

    tick++;
}


// --- Supernova Explosion Logic (Kept) ---
let explosionParticles = [];

class ExplosionParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speed = Math.random() * 5 + 2;
        this.angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.life = 100;
        this.hue = Math.random() * 20 + 10; // Orange Hues
        this.alpha = 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.life -= 2;
        this.alpha = this.life / 100;
        this.size *= 0.95;
    }

    draw() {
        ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function triggerSupernova() {
    if (navigator.vibrate) navigator.vibrate(50);
    for (let i = 0; i < 80; i++) {
        explosionParticles.push(new ExplosionParticle(logoCenter.x, logoCenter.y));
    }
}

// Attach listener to Profile Group 
const profileGroup = document.querySelector('.profile-group');
if (profileGroup) {
    profileGroup.addEventListener('click', (e) => {
        document.body.classList.toggle('wireframe-active');
        triggerSupernova();
    });
}

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

init();
animate();
