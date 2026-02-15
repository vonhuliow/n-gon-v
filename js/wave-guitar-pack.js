// Wave Guitar + Spore Arsenal Pack
(function () {
    if (window.waveGuitarPackLoaded) return;
    window.waveGuitarPackLoaded = true;

    const state = window.waveGuitarPackState || {
        deadIds: new Set(),
        kills: {},
    };
    window.waveGuitarPackState = state;

    const getGun = (name) => Array.isArray(b?.guns) ? b.guns.find(g => g.name === name) : null;

    const registerKills = () => {
        if (!Array.isArray(mob)) return;
        for (let i = 0; i < mob.length; i++) {
            const target = mob[i];
            if (!target || target.alive !== false) continue;
            const id = target.id ?? `k:${i}:${Math.round(target.position?.x || 0)}:${Math.round(target.position?.y || 0)}`;
            if (state.deadIds.has(id)) continue;
            state.deadIds.add(id);
            const active = b.activeGun !== null ? b.guns[b.activeGun]?.name : null;
            if (active) state.kills[active] = (state.kills[active] || 0) + 1;
        }
    };

    const runWaveFrequencyAlwaysOn = () => {
        const wave = getGun('wave');
        if (!wave) return;
        tech.isInfiniteWaveAmmo = true;
        if (wave.ammo !== Infinity) {
            wave.savedAmmo = wave.ammo;
            wave.ammo = Infinity;
            simulation?.updateGunHUD?.();
        }
    };

    const launchGuitarModel = (origin, angle, tier) => {
        const bodyMain = Bodies.circle(origin.x, origin.y, 20 + tier, spawn.propsIsNotHoldable);
        const neck = Bodies.rectangle(origin.x + 32, origin.y - 2, 56, 10, spawn.propsIsNotHoldable);
        const head = Bodies.circle(origin.x + 62, origin.y - 2, 7, spawn.propsIsNotHoldable);
        const bridge = Bodies.rectangle(origin.x - 10, origin.y + 8, 22, 6, spawn.propsIsNotHoldable);
        const guitar = Body.create({ parts: [bodyMain, neck, head, bridge] });
        Body.rotate(guitar, angle);
        guitar.collisionFilter.category = cat.bullet;
        guitar.collisionFilter.mask = cat.mob | cat.mobBullet | cat.body;
        guitar.endCycle = m.cycle + 52 + tier * 8;
        guitar.tier = tier;
        guitar.do = function () {
            if (this.endCycle < m.cycle) {
                b.explosion(this.position, 30 + this.tier * 12);
                Composite.remove(engine.world, this);
                const idx = bullet.indexOf(this);
                if (idx !== -1) bullet.splice(idx, 1);
                return;
            }
            simulation.drawList.push({ x: this.position.x, y: this.position.y, radius: 14 + this.tier * 2, color: 'rgba(0,255,220,0.24)', time: simulation.drawTime });
            const wave = getGun('wave');
            if (wave && m.cycle % Math.max(8, 14 - this.tier) === 0) {
                wave.fire.call(wave);
            }
        };
        Composite.add(engine.world, guitar);
        Matter.Body.setVelocity(guitar, { x: Math.cos(angle) * (22 + tier * 2.2), y: Math.sin(angle) * (22 + tier * 2.2) });
        bullet.push(guitar);
    };

    const waveGuitar = {
        name: 'resonance guitar',
        descriptionFunction() {
            const k = state.kills[this.name] || 0;
            return `<strong>resonance guitar</strong><br>auto-enables frequency mode for wave<br>kills: <strong>${k}</strong>`;
        },
        ammo: 20,
        ammoPack: 4,
        defaultAmmoPack: 4,
        have: false,
        fire() {
            this.ammo--;
            runWaveFrequencyAlwaysOn();
            const kills = state.kills[this.name] || 0;
            const tier = Math.min(5, Math.floor(kills / 7));
            const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
            const angle = Math.atan2(dir.y, dir.x);
            launchGuitarModel({ x: m.pos.x, y: m.pos.y }, angle, tier);
            b.explosion(simulation.mouseInGame, 35 + tier * 9);
        },
        do() {
            runWaveFrequencyAlwaysOn();
        }
    };

    const sporeWeapons = [
        {
            name: 'spore cathedral',
            descriptionFunction() { return `spore swarm with expanding blast`; },
            ammo: 16,
            ammoPack: 3,
            defaultAmmoPack: 3,
            have: false,
            fire() {
                this.ammo--;
                const spores = getGun('spores');
                if (spores) {
                    for (let i = 0; i < 4; i++) spores.fire.call(spores);
                }
                b.explosion(simulation.mouseInGame, 38);
            },
            do() {}
        },
        {
            name: 'mycelium choir',
            descriptionFunction() { return `spore bursts mixed with guided rockets`; },
            ammo: 14,
            ammoPack: 3,
            defaultAmmoPack: 3,
            have: false,
            fire() {
                this.ammo--;
                const spores = getGun('spores');
                if (spores) spores.fire.call(spores);
                const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
                const angle = Math.atan2(dir.y, dir.x);
                b.missile({ x: m.pos.x, y: m.pos.y }, -Math.atan2(dir.x, dir.y) - Math.PI / 2, 0, 90);
                b.missile({ x: m.pos.x, y: m.pos.y }, -Math.atan2(Math.cos(angle + 0.2), Math.sin(angle + 0.2)) - Math.PI / 2, 0, 80);
            },
            do() {}
        },
        {
            name: 'spore nova engine',
            descriptionFunction() { return `dense spore ring with chain detonations`; },
            ammo: 10,
            ammoPack: 2,
            defaultAmmoPack: 2,
            have: false,
            fire() {
                this.ammo--;
                const spores = getGun('spores');
                if (spores) {
                    for (let i = 0; i < 6; i++) spores.fire.call(spores);
                }
                for (let i = 0; i < 3; i++) setTimeout(() => b.explosion(simulation.mouseInGame, 42 + i * 10), i * 120);
            },
            do() {}
        }
    ];

    const originalFusion = {
        name: 'arsenal remixer',
        descriptionFunction() { return `uses original weapon behaviors in a single trigger`; },
        ammo: 12,
        ammoPack: 2,
        defaultAmmoPack: 2,
        have: false,
        fire() {
            this.ammo--;
            const allowed = ['shotgun', 'super balls', 'wave', 'missiles', 'grenades', 'spores', 'drones', 'foam', 'harpoon', 'mine'];
            const activeSet = allowed
                .map(name => getGun(name))
                .filter(g => g && g.have && g.fire && (g.ammo > 0 || g.ammo === Infinity));

            activeSet.slice(0, 6).forEach(g => {
                try { g.fire.call(g); } catch (_) {}
            });

            b.explosion(simulation.mouseInGame, 50 + activeSet.length * 4);
        },
        do() {}
    };

    const photonicShift = {
        name: 'photonic transmuter',
        descriptionFunction() {
            const k = state.kills[this.name] || 0;
            const form = this.ascended ? 'crystal ascended' : 'prism core';
            return `<strong>photonic transmuter</strong><br>form: <strong>${form}</strong> kills: <strong>${k}</strong>`;
        },
        ammo: 14,
        ammoPack: 3,
        defaultAmmoPack: 3,
        have: false,
        ascended: false,
        fire() {
            this.ammo--;
            const kills = state.kills[this.name] || 0;
            const hasPhotonic = Array.isArray(window.photonicContent?.weapons) && window.photonicContent.weapons.some(w => getGun(w.name)?.have);
            if (!this.ascended && (kills >= 12 || hasPhotonic)) {
                this.ascended = true;
                simulation.inGameConsole("<span style='color:#8be9fd'>PHOTONIC SHIFT: ASCENDED</span>", 60);
            }

            const tier = this.ascended ? 3 : 1;
            const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
            const angle = Math.atan2(dir.y, dir.x);
            launchGuitarModel({ x: m.pos.x, y: m.pos.y }, angle, tier);
            b.missile({ x: m.pos.x, y: m.pos.y }, -Math.atan2(dir.x, dir.y) - Math.PI / 2, 0, 95 + tier * 20);
            b.explosion(simulation.mouseInGame, 45 + tier * 22);
        },
        do() {}
    };

    const pack = [waveGuitar, ...sporeWeapons, originalFusion, photonicShift];

    const register = () => {
        if (!Array.isArray(b?.guns)) return;
        pack.forEach(g => {
            if (!b.guns.find(existing => existing.name === g.name)) b.guns.push(g);
        });
    };

    const attach = () => {
        register();
        if (Array.isArray(simulation?.ephemera) && !simulation.ephemera.find(e => e.name === 'wave-guitar-pack-core')) {
            simulation.ephemera.push({ name: 'wave-guitar-pack-core', do: registerKills });
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(attach, 400));
    } else {
        setTimeout(attach, 400);
    }

    console.log('%c🎸 Wave Guitar Pack Loaded', 'color:#00e5ff;font-weight:bold;');
})();
