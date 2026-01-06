const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');

let width, height, particles;

// Налаштування
const PARTICLE_COUNT = 80;
const PARTICLE_COLOR = 'rgba(108, 242, 194, 0.4)'; // Mint з прозорістю
const LINE_COLOR = 'rgba(108, 242, 194, 0.1)';

function init() {
    resize();
    createParticles();
    animate();
}

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);

function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.5,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        });
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Відбивання від стінок
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = PARTICLE_COLOR;
        ctx.fill();
    });

    requestAnimationFrame(animate);
}

init();