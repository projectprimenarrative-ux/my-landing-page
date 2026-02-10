// Surreal Fluid Quantum Field + Neon Circuit Logic
const canvas = document.getElementById('quantum-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
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

// --- 1. Organic Quantum Particles (Background) ---
class SurrealParticle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 0.5;
        this.baseSize = this.size;
        this.angleX = Math.random() * Math.PI * 2;
        this.angleY = Math.random() * Math.PI * 2;
        this.speedX = Math.random() * 0.02 + 0.005;
        this.speedY = Math.random() * 0.02 + 0.005;
        this.hue = Math.random() > 0.5 ? 16 : 30;
    }

    update() {
        this.x += Math.cos(this.angleX) * 0.5 + this.vx;
        this.y += Math.sin(this.angleY) * 0.5 + this.vy;
        this.angleX += this.speedX;
        this.angleY += this.speedY;
        this.size = this.baseSize + Math.sin(tick * 0.05 + this.angleX) * 0.5;

        // Wrap
        if (this.x < -20) this.x = canvas.width + 20;
        if (this.x > canvas.width + 20) this.x = -20;
        if (this.y < -20) this.y = canvas.height + 20;
        if (this.y > canvas.height + 20) this.y = -20;
    }

    draw() {
        ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, 0.4)`; // Lower opacity for background
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.abs(this.size), 0, Math.PI * 2);
        ctx.fill();
    }
}

// --- 2. Neon Circuit Logic (Foreground) ---
class CircuitPacket {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.floor(Math.random() * canvas.width);
        this.y = Math.floor(Math.random() * canvas.height);
        this.size = Math.random() * 2 + 1;
        this.speed = Math.random() * 2 + 2;
        this.direction = Math.floor(Math.random() * 4); // 0: Up, 1: Right, 2: Down, 3: Left
        this.life = Math.random() * 100 + 50;
        this.history = []; // Trail
        this.maxLength = 10;
        this.hue = Math.random() > 0.5 ? 180 : 30; // Cyan (Tech) or Orange (Theme)
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
        if (this.life <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }

    draw() {
        if (this.history.length < 2) return;

        ctx.beginPath();
        ctx.strokeStyle = `hsla(${this.hue}, 100%, 70%, 0.8)`;
        ctx.lineWidth = 1.5;
        // Draw Trail
        ctx.moveTo(this.history[0].x, this.history[0].y);
        for (let i = 1; i < this.history.length; i++) {
            ctx.lineTo(this.history[i].x, this.history[i].y);
        }
        ctx.lineTo(this.x, this.y);
        ctx.stroke();

        // Draw Head
        ctx.fillStyle = `hsla(${this.hue}, 100%, 90%, 1)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${this.hue}, 100%, 50%, 0.8)`;
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset
    }
}

function init() {
    particles = [];
    circuits = [];

    // Background Quantum Count
    const particleCount = window.innerWidth < 480 ? 40 : 80;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new SurrealParticle());
    }

    // Foreground Circuit Count
    const circuitCount = window.innerWidth < 480 ? 10 : 20;
    for (let i = 0; i < circuitCount; i++) {
        circuits.push(new CircuitPacket());
    }

    resize();
}

function animate() {
    requestAnimationFrame(animate);
    // Dark fade effect for trails
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Note: fillRect instead of clearRect creates trails for everything, 
    // but for specific circuit trails we use history array. 
    // Let's use clearRect to keep background clean, and handle trails manually in Circuit class.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Render Background (Organic)
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Connections
        for (let j = i; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                ctx.beginPath();
                let opacity = 1 - (distance / 100);
                ctx.strokeStyle = `rgba(255, 112, 67, ${opacity * 0.1})`; // Very faint lines
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    // 2. Render Circuits (Digital)
    for (let i = 0; i < circuits.length; i++) {
        circuits[i].update();
        circuits[i].draw();
    }

    // 3. Render Supernova (if triggered)
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


// --- Supernova Explosion Logic (Kept from before) ---
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

// Attach listener to Profile Group (Name Container)
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
