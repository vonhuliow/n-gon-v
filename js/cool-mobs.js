// Cool Mobs Expansion - adds pressure waves and themed mob surges
(function () {
    if (window.coolMobsLoaded) return;
    window.coolMobsLoaded = true;

    const coolMobs = {
        defs: [
            { name: 'Plasma Spinner', tier: 2, burst: 'radial' },
            { name: 'Void Wraith', tier: 3, burst: 'teleport' },
            { name: 'Crystalline Golem', tier: 2, burst: 'slam' },
            { name: 'Quantum Hopper', tier: 1, burst: 'jump' },
            { name: 'Infernal Hound', tier: 2, burst: 'rush' },
            { name: 'Temporal Echo', tier: 3, burst: 'echo' },
            { name: 'Gravity Anchor', tier: 2, burst: 'slow' },
            { name: 'Void Leech', tier: 3, burst: 'leech' },
            { name: 'Shard Stalker', tier: 2, burst: 'shard' },
            { name: 'Pulse Djinn', tier: 3, burst: 'pulse' },
            { name: 'Rift Beetle', tier: 2, burst: 'rift' },
            { name: 'Storm Rook', tier: 2, burst: 'storm' },
            { name: 'Ash Mantis', tier: 2, burst: 'ash' },
            { name: 'Signal Hydra', tier: 3, burst: 'hydra' },
            { name: 'Null Crawler', tier: 1, burst: 'null' },
            { name: 'Fractal Drifter', tier: 3, burst: 'fractal' },
            { name: 'Ion Marauder', tier: 2, burst: 'ion' },
            { name: 'Warden Drone', tier: 2, burst: 'drone' },
        ],
        nextWave: 0,

        spawnWave() {
            if (typeof spawn === 'undefined' || !spawn.randomMob) return;
            const base = 2 + Math.floor((simulation?.difficulty || 1) / 8);
            for (let i = 0; i < base; i++) {
                const x = m.pos.x + (Math.random() - 0.5) * 1500;
                const y = m.pos.y + (Math.random() - 0.5) * 850;
                spawn.randomMob(x, y, 1);
            }
            if (simulation?.difficulty > 10 && spawn.randomGroup) {
                spawn.randomGroup(m.pos.x + (Math.random() - 0.5) * 1100, m.pos.y + (Math.random() - 0.5) * 700, 1);
            }
            simulation.inGameConsole(`<span style='color:#e74c3c'>ENEMY SURGE</span> +${base} mobs`, 45);
        },

        doBursts() {
            if (!Array.isArray(mob)) return;
            for (let i = 0; i < mob.length; i++) {
                const enemy = mob[i];
                if (!enemy || enemy.alive === false || !enemy.position) continue;
                if (m.cycle % 120 === 0 && Math.random() < 0.08) {
                    b.explosion(enemy.position, 26 + Math.random() * 24);
                }
                if (m.cycle % 30 === 0 && Math.random() < 0.06) {
                    const dir = Vector.normalise(Vector.sub(m.pos, enemy.position));
                    b.nail(enemy.position, { x: dir.x * 20, y: dir.y * 20 }, 8 + Math.random() * 7);
                }
            }
        },

        tick() {
            if (m.cycle > this.nextWave) {
                this.spawnWave();
                this.nextWave = m.cycle + Math.max(260, 520 - (simulation?.difficulty || 1) * 8);
            }
            this.doBursts();
        }
    };

    window.coolMobs = coolMobs;

    const attach = () => {
        if (simulation?.ephemera) {
            simulation.ephemera.push({ name: 'cool-mobs-overdrive', do() { coolMobs.tick(); } });
            console.log(`%c🧛 Cool Mobs Loaded (${coolMobs.defs.length} themed types + surge spawner)`, 'color:#e74c3c;font-weight:bold;');
            return true;
        }
        return false;
    };

    if (!attach()) {
        const interval = setInterval(() => {
            if (attach()) clearInterval(interval);
        }, 300);
    }
})();
