const PARTICLE_COLORS = [
    'rgba(255,255,255,1)',
    'rgba(245,245,245,1)',
    'rgba(230,230,230,1)',
    'rgba(210,210,210,1)',
    'rgba(185,185,185,1)'
];

const DEFAULT_PARTICLE_CONFIG = {
    amount: 120,
    repeatAmount: 80,
    repeatDelayMs: 50,
    pixelSize: 4,
    snapSize: 2
};

let particleOverlayCanvas = null;
let particleOverlayCtx = null;
let particleHostElement = null;
let particleAnimationFrameId = null;
let particleRepeatTimeoutId = null;
let particles = [];

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function choice(items) {
    return items[(Math.random() * items.length) | 0];
}

class ExplosionParticle {
    constructor(x, y, scale) {
        const angle = Math.random() * Math.PI * 2;
        const speed = rand(1.5, 7.5) * scale;

        this.x = x + rand(-8, 8) * scale;
        this.y = y + rand(-8, 8) * scale;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - rand(0, 1.2) * scale;
        this.size = rand(10, 34) * scale;
        this.growth = rand(0.15, 0.45) * scale;
        this.life = 1;
        this.decay = rand(0.012, 0.026);
        this.rotation = rand(0, Math.PI * 2);
        this.spin = rand(-0.04, 0.04);
        this.color = choice(PARTICLE_COLORS);
        this.type = Math.floor(rand(0, 3));
        this.thickness = rand(0.18, 0.38);
        this.arcStart = rand(0, Math.PI * 2);
        this.arcLength = rand(Math.PI * 1.1, Math.PI * 1.9);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.975;
        this.vy *= 0.975;
        this.size += this.growth;
        this.rotation += this.spin;
        this.life -= this.decay;
    }

    draw(ctx) {
        if (this.life <= 0) return;

        const snapSize = DEFAULT_PARTICLE_CONFIG.snapSize;
        const drawX = Math.round(this.x / snapSize) * snapSize;
        const drawY = Math.round(this.y / snapSize) * snapSize;

        ctx.save();
        ctx.translate(drawX, drawY);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.life * 0.95;

        if (this.type === 0) {
            drawPixelRing(ctx, this.size, this.thickness, this.color);
        } else if (this.type === 1) {
            drawPixelBrokenRing(
                ctx,
                this.size,
                this.thickness,
                this.color,
                this.arcStart,
                this.arcLength
            );
        } else {
            drawPixelBlob(ctx, this.size, this.color);
        }

        ctx.restore();
    }
}

function drawPixelRing(ctx, size, thickness, color) {
    const px = DEFAULT_PARTICLE_CONFIG.pixelSize;
    const outer = size;
    const inner = size * (1 - thickness);

    ctx.fillStyle = color;

    for (let x = -outer; x <= outer; x += px) {
        for (let y = -outer; y <= outer; y += px) {
            const distance = Math.sqrt(x * x + y * y);

            if (distance <= outer && distance >= inner) {
                ctx.fillRect(
                    Math.round(x / px) * px,
                    Math.round(y / px) * px,
                    px,
                    px
                );
            }
        }
    }
}

function drawPixelBrokenRing(ctx, size, thickness, color, start, length) {
    const px = DEFAULT_PARTICLE_CONFIG.pixelSize;
    const outer = size;
    const inner = size * (1 - thickness);

    ctx.fillStyle = color;

    for (let x = -outer; x <= outer; x += px) {
        for (let y = -outer; y <= outer; y += px) {
            const distance = Math.sqrt(x * x + y * y);
            let angle = Math.atan2(y, x);

            if (angle < 0) angle += Math.PI * 2;

            let relativeAngle = angle - start;
            if (relativeAngle < 0) relativeAngle += Math.PI * 2;

            if (distance <= outer && distance >= inner && relativeAngle <= length) {
                ctx.fillRect(
                    Math.round(x / px) * px,
                    Math.round(y / px) * px,
                    px,
                    px
                );
            }
        }
    }
}

function drawPixelBlob(ctx, size, color) {
    const px = DEFAULT_PARTICLE_CONFIG.pixelSize;
    const radius = size * 0.7;

    ctx.fillStyle = color;

    for (let x = -radius; x <= radius; x += px) {
        for (let y = -radius; y <= radius; y += px) {
            const distance = Math.sqrt(x * x + y * y);

            if (distance < radius + Math.random() * px * 1.5) {
                ctx.fillRect(
                    Math.round(x / px) * px,
                    Math.round(y / px) * px,
                    px,
                    px
                );
            }
        }
    }
}

function ensureParticleOverlay() {
    if (particleOverlayCanvas && particleOverlayCtx && particleHostElement) {
        syncParticleOverlaySize();
        return particleOverlayCanvas;
    }

    const baseCanvas = document.getElementById('canvas');
    if (!baseCanvas) return null;

    particleHostElement = baseCanvas.parentElement || document.body;

    if (getComputedStyle(particleHostElement).position === 'static') {
        particleHostElement.style.position = 'relative';
    }

    particleOverlayCanvas = document.createElement('canvas');
    particleOverlayCanvas.id = 'particle-canvas';
    particleOverlayCanvas.setAttribute('aria-hidden', 'true');
    particleOverlayCanvas.style.position = 'absolute';
    particleOverlayCanvas.style.inset = '0';
    particleOverlayCanvas.style.width = '100%';
    particleOverlayCanvas.style.height = '100%';
    particleOverlayCanvas.style.pointerEvents = 'none';
    particleOverlayCanvas.style.imageRendering = 'pixelated';
    particleOverlayCanvas.style.zIndex = '2';

    particleHostElement.appendChild(particleOverlayCanvas);

    particleOverlayCtx = particleOverlayCanvas.getContext('2d');
    particleOverlayCtx.imageSmoothingEnabled = false;

    syncParticleOverlaySize();
    window.addEventListener('resize', syncParticleOverlaySize);

    return particleOverlayCanvas;
}

function syncParticleOverlaySize() {
    if (!particleOverlayCanvas) return;

    const baseCanvas = document.getElementById('canvas');
    if (!baseCanvas) return;

    particleOverlayCanvas.width = baseCanvas.width;
    particleOverlayCanvas.height = baseCanvas.height;
}

function clearParticles() {
    particles = [];

    if (particleRepeatTimeoutId !== null) {
        window.clearTimeout(particleRepeatTimeoutId);
        particleRepeatTimeoutId = null;
    }

    if (particleAnimationFrameId !== null) {
        window.cancelAnimationFrame(particleAnimationFrameId);
        particleAnimationFrameId = null;
    }

    if (particleOverlayCtx && particleOverlayCanvas) {
        particleOverlayCtx.clearRect(0, 0, particleOverlayCanvas.width, particleOverlayCanvas.height);
    }
}

function spawnExplosion(x, y, scale, amount) {
    const normalizedScale = Math.max(scale || 1, 0.1);

    for (let i = 0; i < amount; i++) {
        particles.push(new ExplosionParticle(x, y, normalizedScale));
    }

    startParticleLoop();
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();

        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function drawParticles() {
    if (!particleOverlayCtx || !particleOverlayCanvas) return;

    particleOverlayCtx.clearRect(0, 0, particleOverlayCanvas.width, particleOverlayCanvas.height);

    for (const particle of particles) {
        particle.draw(particleOverlayCtx);
    }
}

function particleFrame() {
    updateParticles();
    drawParticles();

    if (particles.length === 0) {
        particleAnimationFrameId = null;
        return;
    }

    particleAnimationFrameId = window.requestAnimationFrame(particleFrame);
}

function startParticleLoop() {
    if (particleAnimationFrameId !== null) return;
    particleAnimationFrameId = window.requestAnimationFrame(particleFrame);
}

function getParticleTileSize() {
    if (typeof TILE_SIZE === 'number') return TILE_SIZE;
    return 16;
}

function triggerParticleAtPixel(x, y, scale = 1, options = {}) {
    if (!ensureParticleOverlay()) return;

    const amount = options.amount ?? DEFAULT_PARTICLE_CONFIG.amount;
    const repeatAmount = options.repeatAmount ?? DEFAULT_PARTICLE_CONFIG.repeatAmount;
    const repeatDelayMs = options.repeatDelayMs ?? DEFAULT_PARTICLE_CONFIG.repeatDelayMs;

    spawnExplosion(x, y, scale, amount);

    if (repeatAmount > 0) {
        particleRepeatTimeoutId = window.setTimeout(() => {
            spawnExplosion(x, y, scale, repeatAmount);
            particleRepeatTimeoutId = null;
        }, repeatDelayMs);
    }
}

function particleTrigger(x, y, scale = 1, options = {}) {
    const tileSize = getParticleTileSize();
    const pixelX = (x + 0.5) * tileSize;
    const pixelY = (y + 0.5) * tileSize;

    triggerParticleAtPixel(pixelX, pixelY, scale, options);
}
