// Bullet runtime safety fix - guards against invalid explosion positions causing bullet.js crashes
(function () {
    if (window.bulletRuntimeFixLoaded) return;
    window.bulletRuntimeFixLoaded = true;

    const boot = () => {
        if (!window.b || typeof b.explosion !== 'function') return;
        if (b.explosion.__safeWrapped) return;

        const originalExplosion = b.explosion.bind(b);
        const safeExplosion = function (where, ...rest) {
            const fallback = {
                x: (m?.pos?.x ?? player?.position?.x ?? 0),
                y: (m?.pos?.y ?? player?.position?.y ?? 0)
            };
            const pos = (where && Number.isFinite(where.x) && Number.isFinite(where.y)) ? where : fallback;
            try {
                return originalExplosion(pos, ...rest);
            } catch (error) {
                console.warn('[bullet-runtime-fix] prevented explosion crash', error);
                return null;
            }
        };
        safeExplosion.__safeWrapped = true;
        b.explosion = safeExplosion;
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 300));
    } else {
        setTimeout(boot, 300);
    }
})();
