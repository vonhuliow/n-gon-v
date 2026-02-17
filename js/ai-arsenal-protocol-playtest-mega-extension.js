// AI Arsenal Protocol - playtest mega extension
(function () {
    if (window.aiArsenalProtocolLoaded) return;
    window.aiArsenalProtocolLoaded = true;

    const KILL_GATE = 1_000_000;
    const state = window.aiArsenalProtocolState || {
        seenDead: new Set(),
        totalKills: 0,
        gunKills: {},
        aiForge: {
            building: false,
            startCycle: 0,
            prompt: '',
            ready: false,
            generatedName: ''
        },
        scopeStage: 0,
        scopeBaseZoom: null,
        fieldMode: 0,
    };
    window.aiArsenalProtocolState = state;

    const saveKills = () => {
        try { localStorage.setItem('ai_arsenal_total_kills', String(state.totalKills)); } catch (_) {}
    };
    const loadKills = () => {
        try {
            const raw = localStorage.getItem('ai_arsenal_total_kills');
            const value = Number(raw);
            if (Number.isFinite(value) && value > 0) state.totalKills = value;
        } catch (_) {}
    };
    loadKills();

    const getGun = (name) => (Array.isArray(b?.guns) ? b.guns.find(g => g.name === name) : null);
    const activeGunName = () => (b?.activeGun !== null && b?.activeGun !== undefined ? b.guns?.[b.activeGun]?.name : '');

    const makeModelProjectile = (origin, angle, scale = 1, tint = '#6cf') => {
        const core = Bodies.polygon(origin.x, origin.y, 6, 12 * scale, spawn.propsIsNotHoldable);
        const ringA = Bodies.circle(origin.x - 12 * scale, origin.y, 5 * scale, spawn.propsIsNotHoldable);
        const ringB = Bodies.circle(origin.x + 12 * scale, origin.y, 5 * scale, spawn.propsIsNotHoldable);
        const finTop = Bodies.rectangle(origin.x, origin.y - 9 * scale, 16 * scale, 3 * scale, spawn.propsIsNotHoldable);
        const finBottom = Bodies.rectangle(origin.x, origin.y + 9 * scale, 16 * scale, 3 * scale, spawn.propsIsNotHoldable);
        const shot = Body.create({ parts: [core, ringA, ringB, finTop, finBottom] });
        shot.collisionFilter.category = cat.bullet;
        shot.collisionFilter.mask = cat.mob | cat.mobBullet | cat.body;
        shot.damageTint = tint;
        shot.endCycle = m.cycle + Math.round(70 + 40 * scale);
        shot.do = function () {
            if (m.cycle > this.endCycle) {
                b.explosion(this.position, 25 + scale * 22);
                Composite.remove(engine.world, this);
                const index = bullet.indexOf(this);
                if (index !== -1) bullet.splice(index, 1);
                return;
            }
            simulation.drawList.push({
                x: this.position.x,
                y: this.position.y,
                radius: 10 + 8 * scale,
                color: `${this.damageTint}66`,
                time: simulation.drawTime
            });
        };
        Matter.Body.setAngle(shot, angle);
        Matter.Body.setVelocity(shot, { x: Math.cos(angle) * (24 + scale * 6), y: Math.sin(angle) * (24 + scale * 6) });
        Composite.add(engine.world, shot);
        bullet.push(shot);
        return shot;
    };

    const chargeBar = (value, max) => {
        const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
        return `<span style='display:inline-block;width:140px;border:1px solid #5ef;background:#111;height:8px;vertical-align:middle'><span style='display:inline-block;height:8px;width:${pct}%;background:linear-gradient(90deg,#38f,#7ef)'></span></span> <strong>${pct}%</strong>`;
    };

    const makeChargedWeapon = (index, hue) => ({
        name: `ai relic ${index + 1}`,
        ammo: 18,
        ammoPack: 3,
        defaultAmmoPack: 3,
        have: false,
        charge: 0,
        chargeMax: 220,
        descriptionFunction() {
            const kills = state.gunKills[this.name] || 0;
            const gated = state.totalKills < KILL_GATE;
            const lock = gated ? `<br><span style='color:#f66'>LOCKED: ${state.totalKills.toLocaleString()} / ${KILL_GATE.toLocaleString()} kills</span>` : '';
            return `<strong>${this.name}</strong><br>model projectile + charged blast<br>charge ${chargeBar(this.charge, this.chargeMax)}<br>kills <strong>${kills}</strong>${lock}`;
        },
        fire() {
            if (state.totalKills < KILL_GATE) {
                simulation.inGameConsole(`<span style='color:#f66'>KILL GATE: ${state.totalKills.toLocaleString()} / ${KILL_GATE.toLocaleString()}</span>`, 60);
                return;
            }
            if (this.ammo !== Infinity) this.ammo--;
            const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
            const angle = Math.atan2(dir.y, dir.x);
            const power = 1 + this.charge / this.chargeMax * 2.4;
            const tint = `hsl(${hue}, 92%, 64%)`;
            makeModelProjectile({ x: m.pos.x, y: m.pos.y }, angle, power, tint);
            if (this.charge > this.chargeMax * 0.8) {
                b.explosion(simulation.mouseInGame, 34 + power * 18);
            }
            this.charge = 0;
        },
        do() {
            if (this.charge < this.chargeMax) this.charge += 1.25;
        }
    });

    const relicWeapons = Array.from({ length: 34 }, (_, i) => makeChargedWeapon(i, (i * 37) % 360));

    const sniperFactory = (name, color, baseDamage) => ({
        name,
        ammo: 12,
        ammoPack: 2,
        defaultAmmoPack: 2,
        have: false,
        charge: 0,
        chargeMax: 160,
        descriptionFunction() {
            return `<strong>${name}</strong><br>RMB cycles scope zoom x1 → x1.6 → x2.4<br>charged precision shot ${chargeBar(this.charge, this.chargeMax)}`;
        },
        fire() {
            if (this.ammo !== Infinity) this.ammo--;
            const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
            const angle = Math.atan2(dir.y, dir.x);
            const scale = 1 + this.charge / this.chargeMax * 1.8;
            makeModelProjectile({ x: m.pos.x, y: m.pos.y }, angle, scale, color);
            b.explosion({ x: simulation.mouseInGame.x, y: simulation.mouseInGame.y }, baseDamage + 20 * scale);
            this.charge = 0;
        },
        do() {
            this.charge = Math.min(this.chargeMax, this.charge + 1.8);
        }
    });

    const sniperPack = [
        sniperFactory('scopebreaker sniper', '#9cf', 32),
        sniperFactory('seraphim longshot', '#ffd166', 40),
        sniperFactory('voidglass marksman', '#ef476f', 46)
    ];

    const aiForgeWeapon = {
        name: 'ai-forged prototype',
        ammo: Infinity,
        ammoPack: Infinity,
        defaultAmmoPack: Infinity,
        have: false,
        descriptionFunction() {
            if (!state.aiForge.ready) {
                return `<strong>ai-forged prototype</strong><br>open AI menu with <strong>J</strong><br>design takes <strong>60 seconds</strong>`;
            }
            return `<strong>${state.aiForge.generatedName || 'ai-forged prototype'}</strong><br>player-designed payload online`;
        },
        fire() {
            if (!state.aiForge.ready) {
                simulation.inGameConsole("<span style='color:#8be9fd'>Press J to open forge chat</span>", 70);
                return;
            }
            const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
            const angle = Math.atan2(dir.y, dir.x);
            makeModelProjectile({ x: m.pos.x, y: m.pos.y }, angle, 2.8, '#8be9fd');
            b.explosion(simulation.mouseInGame, 80);
        },
        do() {}
    };

    console.log('AI Arsenal Protocol Loaded');
})();