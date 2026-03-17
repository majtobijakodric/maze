(function () {
    const PARTICLE_COLORS = [
        'rgba(255,255,255,1)',
        'rgba(245,245,245,1)',
        'rgba(230,230,230,1)',
        'rgba(210,210,210,1)',
        'rgba(185,185,185,1)'
    ];

    const DEFAULT_CONFIG = {
        amount: 120,
        repeatAmount: 80,
        repeatDelayMs: 50,
        pixelSize: 4,
        snapSize: 2
    };

    let overlayCanvas = null;
    let overlayCtx = null;
    let hostElement = null;
    let animationFrameId = null;
    const particles = [];

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

            const snapSize = DEFAULT_CONFIG.snapSize;
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
        const px = DEFAULT_CONFIG.pixelSize;
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
        const px = DEFAULT_CONFIG.pixelSize;
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
        const px = DEFAULT_CONFIG.pixelSize;
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

    function ensureOverlay() {
        if (overlayCanvas && overlayCtx && hostElement) {
            syncOverlaySize();
            return;
        }

        const baseCanvas = document.getElementById('canvas');
        if (!baseCanvas) return null;

        hostElement = baseCanvas.parentElement || document.body;

        if (getComputedStyle(hostElement).position === 'static') {
            hostElement.style.position = 'relative';
        }

        overlayCanvas = document.createElement('canvas');
        overlayCanvas.id = 'particle-canvas';
        overlayCanvas.setAttribute('aria-hidden', 'true');
        overlayCanvas.style.position = 'absolute';
        overlayCanvas.style.inset = '0';
        overlayCanvas.style.width = '100%';
        overlayCanvas.style.height = '100%';
        overlayCanvas.style.pointerEvents = 'none';
        overlayCanvas.style.imageRendering = 'pixelated';
        overlayCanvas.style.zIndex = '2';

        hostElement.appendChild(overlayCanvas);

        overlayCtx = overlayCanvas.getContext('2d');
        overlayCtx.imageSmoothingEnabled = false;

        syncOverlaySize();
        window.addEventListener('resize', syncOverlaySize);

        return overlayCanvas;
    }

    function syncOverlaySize() {
        if (!overlayCanvas) return;

        const baseCanvas = document.getElementById('canvas');
        if (!baseCanvas) return;

        overlayCanvas.width = baseCanvas.width;
        overlayCanvas.height = baseCanvas.height;
    }

    function spawnExplosion(x, y, scale, amount) {
        const normalizedScale = Math.max(scale || 1, 0.1);

        for (let i = 0; i < amount; i++) {
            particles.push(new ExplosionParticle(x, y, normalizedScale));
        }

        startLoop();
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
        if (!overlayCtx || !overlayCanvas) return;

        overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

        for (const particle of particles) {
            particle.draw(overlayCtx);
        }
    }

    function frame() {
        updateParticles();
        drawParticles();

        if (particles.length === 0) {
            animationFrameId = null;
            return;
        }

        animationFrameId = window.requestAnimationFrame(frame);
    }

    function startLoop() {
        if (animationFrameId !== null) return;
        animationFrameId = window.requestAnimationFrame(frame);
    }

    function getTileSize() {
        if (typeof TILE_SIZE === 'number') return TILE_SIZE;
        return 16;
    }

    function triggerAtPixel(x, y, scale = 1, options = {}) {
        if (!ensureOverlay()) return;

        const amount = options.amount ?? DEFAULT_CONFIG.amount;
        const repeatAmount = options.repeatAmount ?? DEFAULT_CONFIG.repeatAmount;
        const repeatDelayMs = options.repeatDelayMs ?? DEFAULT_CONFIG.repeatDelayMs;

        spawnExplosion(x, y, scale, amount);

        if (repeatAmount > 0) {
            window.setTimeout(() => {
                spawnExplosion(x, y, scale, repeatAmount);
            }, repeatDelayMs);
        }
    }

    function triggerAtMaze(x, y, scale = 1, options = {}) {
        const tileSize = getTileSize();
        const pixelX = (x + 0.5) * tileSize;
        const pixelY = (y + 0.5) * tileSize;

        triggerAtPixel(pixelX, pixelY, scale, options);
    }

    function particleTrigger(x, y, scale = 1, options = {}) {
        triggerAtMaze(x, y, scale, options);
    }

    window.ParticleExplosion = {
        triggerAtPixel,
        triggerAtMaze
    };
    window.particleTrigger = particleTrigger;
})();
