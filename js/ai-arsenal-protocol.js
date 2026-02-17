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


    const buildForgedWeapon = () => {
        const prompt = (state.aiForge.prompt || 'prototype').slice(0, 24);
        const weaponName = `ai forged: ${prompt}`;
        if (Array.isArray(b?.guns) && b.guns.find(g => g.name === weaponName)) {
            state.aiForge.generatedName = weaponName;
            return;
        }
        const forged = {
            name: weaponName,
            ammo: 18,
            ammoPack: 4,
            defaultAmmoPack: 4,
            have: true,
            descriptionFunction() {
                return `<strong>${weaponName}</strong><br>forged from AI prompt after 60s`;
            },
            fire() {
                if (this.ammo !== Infinity) this.ammo--;
                const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
                const angle = Math.atan2(dir.y, dir.x);
                makeModelProjectile({ x: m.pos.x, y: m.pos.y }, angle, 3.2, '#9bf6ff');
                b.explosion(simulation.mouseInGame, 96);
            },
            do() {}
        };
        b.guns.push(forged);
        const idx = b.guns.length - 1;
        if (!b.inventory.includes(idx)) b.inventory.push(idx);
        state.aiForge.generatedName = weaponName;
        simulation?.makeGunHUD?.();
        simulation?.updateGunHUD?.();
    };

    const ensureForbiddenTech = () => {
        if (!Array.isArray(tech?.tech)) return;
        if (tech.tech.find(t => t.name === 'forbidden ai foundry')) return;
        const techEntry = {
            name: 'forbidden ai foundry',
            descriptionFunction() {
                return `shows AI forge in tech list, but this option cannot be selected<br><em>weapon + tech + field fusion locked by protocol</em>`;
            },
            isGunTech: true,
            maxCount: 1,
            count: 0,
            frequency: 1,
            frequencyDefault: 1,
            allowed() { return false; },
            requires: 'UNSELECTABLE',
            effect() {
                // intentionally unreachable
            },
            remove() {}
        };
        const anchor = tech.tech.findIndex(t => t.name === 'spherical harmonics');
        if (anchor >= 0) tech.tech.splice(anchor, 0, techEntry);
        else tech.tech.push(techEntry);
    };

    const ensureFieldModes = () => {
        if (!Array.isArray(simulation?.ephemera) || simulation.ephemera.find(e => e.name === 'ai-field-modes')) return;
        simulation.ephemera.push({
            name: 'ai-field-modes',
            do() {
                if (!m?.alive) return;
                if (state.fieldMode === 1) {
                    simulation.drawList.push({ x: m.pos.x, y: m.pos.y, radius: 60, color: 'rgba(120,230,255,0.18)', time: simulation.drawTime });
                    if (simulation.cycle % 90 === 0) m.health = Math.min(m.maxHealth, m.health + 0.02);
                } else if (state.fieldMode === 2) {
                    simulation.drawList.push({ x: m.pos.x, y: m.pos.y, radius: 78, color: 'rgba(255,120,220,0.16)', time: simulation.drawTime });
                    if (simulation.cycle % 45 === 0) b.explosion({ x: m.pos.x, y: m.pos.y }, 18);
                } else if (state.fieldMode === 3) {
                    simulation.drawList.push({ x: m.pos.x, y: m.pos.y, radius: 95, color: 'rgba(255,215,0,0.14)', time: simulation.drawTime });
                    if (simulation.cycle % 8 === 0) {
                        m.velocity.x *= 1.015;
                        m.velocity.y *= 1.015;
                    }
                }
            }
        });
    };

    const ensureCoreEphemera = () => {
        if (!Array.isArray(simulation?.ephemera) || simulation.ephemera.find(e => e.name === 'ai-arsenal-core')) return;
        simulation.ephemera.push({
            name: 'ai-arsenal-core',
            do() {
                if (!Array.isArray(mob)) return;
                for (let i = 0; i < mob.length; i++) {
                    const target = mob[i];
                    if (!target || target.alive !== false) continue;
                    const id = target.id ?? `${i}:${Math.round(target.position?.x || 0)}:${Math.round(target.position?.y || 0)}:${target.radius || 0}`;
                    if (state.seenDead.has(id)) continue;
                    state.seenDead.add(id);
                    state.totalKills += 1;
                    const active = activeGunName();
                    if (active) state.gunKills[active] = (state.gunKills[active] || 0) + 1;
                    if (state.totalKills % 50 === 0) saveKills();
                }

                if (state.aiForge.building && simulation.cycle > state.aiForge.startCycle + 60 * 60) {
                    state.aiForge.building = false;
                    state.aiForge.ready = true;
                    buildForgedWeapon();
                    state.aiForge.ready = true;
                    simulation.inGameConsole(`<span style='color:#8be9fd'>Forge complete: ${state.aiForge.generatedName}</span>`, 120);
                }
            }
        });
    };

    const ensureGuns = () => {
        if (!Array.isArray(b?.guns)) return;
        [...relicWeapons, ...sniperPack, aiForgeWeapon].forEach((gun) => {
            if (!b.guns.find(g => g.name === gun.name)) b.guns.push(gun);
        });
    };

    const ensureOverlay = () => {
        if (document.getElementById('ai-forge-overlay')) return;
        const wrap = document.createElement('div');
        wrap.id = 'ai-forge-overlay';
        wrap.style.cssText = 'display:none;position:fixed;z-index:99999;inset:0;background:rgba(0,0,0,0.72);font-family:Arial,sans-serif;';
        wrap.innerHTML = `
            <div style="max-width:560px;margin:7vh auto;padding:16px;border:1px solid #8be9fd;background:#0d1220;color:#dff7ff;box-shadow:0 0 40px #000;">
                <h3 style="margin:0 0 8px 0;color:#8be9fd">AI Weapon Forge (60s build)</h3>
                <p style="margin:0 0 8px 0;font-size:13px;opacity:.9">Describe your weapon. The forge builds it after one minute.</p>
                <textarea id="ai-forge-input" style="width:100%;height:130px;background:#080d18;color:#dff7ff;border:1px solid #345;padding:8px;">my weapon: </textarea>
                <div style="display:flex;gap:8px;margin-top:8px;">
                    <button id="ai-forge-start" style="background:#123;color:#8be9fd;border:1px solid #8be9fd;padding:8px 10px;cursor:pointer;">Start Forge</button>
                    <button id="ai-forge-close" style="background:#222;color:#ddd;border:1px solid #777;padding:8px 10px;cursor:pointer;">Close</button>
                </div>
                <div id="ai-forge-status" style="margin-top:8px;font-size:12px;color:#9df"></div>
            </div>`;
        document.body.appendChild(wrap);

        wrap.querySelector('#ai-forge-close').addEventListener('click', () => { wrap.style.display = 'none'; });
        wrap.querySelector('#ai-forge-start').addEventListener('click', () => {
            const prompt = String(wrap.querySelector('#ai-forge-input').value || '').trim();
            state.aiForge.building = true;
            state.aiForge.ready = false;
            state.aiForge.startCycle = simulation.cycle;
            state.aiForge.prompt = prompt;
            wrap.querySelector('#ai-forge-status').textContent = 'Forge in progress... return in about 60 seconds.';
            simulation.inGameConsole("<span style='color:#8be9fd'>AI forge started (60s)</span>", 90);
        });
    };

    const openForgeOverlay = () => {
        ensureOverlay();
        const overlay = document.getElementById('ai-forge-overlay');
        if (overlay) overlay.style.display = 'block';
    };

    const setupKeybinds = () => {
        if (window.aiArsenalKeybindsBound) return;
        window.aiArsenalKeybindsBound = true;
        document.addEventListener('keydown', (event) => {
            if (event.key === 'j' || event.key === 'J') {
                openForgeOverlay();
            }
            if (event.key === 'v' || event.key === 'V') {
                state.fieldMode = (state.fieldMode + 1) % 4;
                const labels = ['off', 'aegis bloom', 'shock hymn', 'sun-thread'];
                simulation.inGameConsole(`<span style='color:#aef'>Field mode: ${labels[state.fieldMode]}</span>`, 70);
            }
        });

        document.addEventListener('contextmenu', (event) => {
            const name = activeGunName();
            if (!name || !name.includes('sniper')) return;
            event.preventDefault();
            if (state.scopeBaseZoom === null) state.scopeBaseZoom = simulation.zoomScale || 1000;
            state.scopeStage = (state.scopeStage + 1) % 3; // 0 -> 1 -> 2 -> 0
            const mult = [1, 1.6, 2.4][state.scopeStage];
            simulation.zoomTransition(state.scopeBaseZoom * mult, 22);
            simulation.inGameConsole(`<span style='color:#ffd166'>Scope zoom: x${mult}</span>`, 45);
        });
    };

    const attach = () => {
        ensureGuns();
        ensureForbiddenTech();
        ensureCoreEphemera();
        ensureFieldModes();
        setupKeybinds();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(attach, 500));
    } else {
        setTimeout(attach, 500);
    }

    console.log('%c🤖 AI Arsenal Protocol Loaded (34 relic weapons + snipers + kill gate)', 'color:#8be9fd;font-weight:bold;');
})();
