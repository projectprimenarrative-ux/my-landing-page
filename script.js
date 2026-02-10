// Surreal Fluid Quantum Field Animation
const canvas = document.getElementById('quantum-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
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

        // Wrap around screen
        if (this.x < -20) this.x = canvas.width + 20;
        if (this.x > canvas.width + 20) this.x = -20;
        if (this.y < -20) this.y = canvas.height + 20;
        if (this.y > canvas.height + 20) this.y = -20;

        // Gentle Mouse Repulsion
        if (mouse.x != undefined) {
            let dx = this.x - mouse.x;
            let dy = this.y - mouse.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let force = (100 - distance) / 100;
                this.vx += forceDirectionX * force * 0.05;
                this.vy += forceDirectionY * force * 0.05;
            }
        }
        this.vx *= 0.98;
        this.vy *= 0.98;
    }

    draw() {
        ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, 0.8)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.abs(this.size), 0, Math.PI * 2);
        ctx.fill();
    }
}

// --- Supernova Explosion Logic ---
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

function init() {
    particles = [];
    const count = window.innerWidth < 480 ? 60 : 120;
    for (let i = 0; i < count; i++) {
        particles.push(new SurrealParticle());
    }
    resize();
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Render Background Field
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Connect nearby particles
        for (let j = i; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.beginPath();
                let opacity = 1 - (distance / 100);
                ctx.strokeStyle = `rgba(255, 112, 67, ${opacity * 0.2})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    // 2. Render Explosion Particles
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

// Mouse/Touch Interaction
let mouse = { x: undefined, y: undefined };
window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });
window.addEventListener('touchmove', e => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; });
window.addEventListener('touchend', () => { mouse.x = undefined; mouse.y = undefined; });


// --- Interaction Triggers ---

// Removed Logo Listener as requested.
// const logo = document.querySelector('.illustration-container');
// if (logo) ...

// Attach listener to Profile Group (Name Container)
const profileGroup = document.querySelector('.profile-group');
if (profileGroup) {
    profileGroup.addEventListener('click', (e) => {
        // Toggle Wireframe Animation on Body
        document.body.classList.toggle('wireframe-active');

        // Trigger Supernova from Logo Center (visualizing the system activation)
        triggerSupernova();
    });
}

init();
animate();


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
