// Unlock Codes System (fixed + upgraded)
(function () {
    if (window.unlockCodesLoaded) return;
    window.unlockCodesLoaded = true;

    const STORE_KEY = 'unlocked_codes_v2';
    const getGun = (name) => (Array.isArray(b?.guns) ? b.guns.find(g => g.name === name) : null);

    const api = {
        unlockedCodes: [],
        codes: {
            QROW2025: {
                name: 'Qrow Transformation',
                description: 'Boosted stats + Qrow weapon set + pets',
                apply() {
                    if (typeof m !== 'undefined') {
                        m.maxHealth = Math.max(m.maxHealth || 1, 10);
                        m.health = Math.min(m.maxHealth, Math.max(m.health || 1, 10));
                        m.maxEnergy = Math.max(m.maxEnergy || 1, 5);
                        m.energy = Math.min(m.maxEnergy, Math.max(m.energy || 1, 5));
                    }
                    api.grantQrowWeapons();
                    api.spawnQrowPets();
                    simulation?.inGameConsole("<span style='color:#FFD700'>QROW TRANSFORMATION ACTIVATED</span>", 70);
                }
            },
            PHOTON2025: {
                name: 'Photonic Arsenal',
                description: 'Unlock photonic pack weapons/tech',
                apply() {
                    api.grantPhotonicArsenal();
                    simulation?.inGameConsole("<span style='color:#00FFFF'>PHOTONIC ARSENAL UNLOCKED</span>", 60);
                }
            },
            SPEED2025: {
                name: 'Movement Master',
                description: 'Max out available movement techs',
                apply() {
                    api.grantMovementTechs();
                    simulation?.inGameConsole("<span style='color:#FF00FF'>MOVEMENT MASTER ENABLED</span>", 60);
                }
            },
            GODMODE: {
                name: 'Divine Power',
                description: 'Very high health/energy and strong defense',
                apply() {
                    if (typeof m !== 'undefined') {
                        m.maxHealth = Math.max(m.maxHealth || 1, 100);
                        m.health = m.maxHealth;
                        m.maxEnergy = Math.max(m.maxEnergy || 1, 20);
                        m.energy = m.maxEnergy;
                    }
                    if (typeof tech !== 'undefined') {
                        tech.damage = Math.max(tech.damage || 1, 3);
                        tech.harmReduction = Math.min(tech.harmReduction || 1, 0.2);
                    }
                    simulation?.inGameConsole("<span style='color:#FFD700'>GODMODE ENABLED</span>", 80);
                }
            },
            SCYTHE14: {
                name: 'Scythe Prism (14)',
                description: 'Unlock all 14 colored scythes',
                apply() {
                    api.grantScythe14();
                    simulation?.inGameConsole("<span style='color:#ff5'>14 COLOR SCYTHES UNLOCKED</span>", 70);
                }
            },
        },

        qrowWeapons: [
            {
                name: "hakuman's okami",
                descriptionFunction() { return `Counter stance sword - block then devastate`; },
                ammo: Infinity,
                ammoPack: 0,
                have: false,
                fire() {
                    const angle = Math.atan2(simulation.mouseInGame.y - m.pos.y, simulation.mouseInGame.x - m.pos.x);
                    for (let i = -3; i <= 3; i++) {
                        const spread = angle + i * 0.15;
                        b.nail({ x: m.pos.x + Math.cos(spread) * 60, y: m.pos.y + Math.sin(spread) * 60 }, { x: Math.cos(spread) * 45, y: Math.sin(spread) * 45 }, 40);
                    }
                },
                do() {}
            },
            {
                name: "yamato",
                descriptionFunction() { return `Dimension-cutting teleport slashes`; },
                ammo: Infinity,
                ammoPack: 0,
                have: false,
                fire() {
                    Matter.Body.setPosition(player, { x: simulation.mouseInGame.x, y: simulation.mouseInGame.y });
                    for (let i = 0; i < 8; i++) {
                        const angle = (Math.PI * 2 * i) / 8;
                        b.laser({ x: m.pos.x, y: m.pos.y }, { x: m.pos.x + Math.cos(angle) * 300, y: m.pos.y + Math.sin(angle) * 300 }, 60);
                    }
                },
                do() {}
            },
            {
                name: "ebony & ivory",
                descriptionFunction() { return `Twin revolvers with infinite ammo`; },
                ammo: Infinity,
                ammoPack: 0,
                have: false,
                fire() {
                    const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
                    b.nail({ x: m.pos.x - 15, y: m.pos.y }, { x: dir.x * 60, y: dir.y * 60 }, 25);
                    b.nail({ x: m.pos.x + 15, y: m.pos.y }, { x: dir.x * 60, y: dir.y * 60 }, 25);
                },
                do() {}
            },
        ],

        ensureWeaponOwned(name) {
            if (!Array.isArray(b?.guns)) return false;
            const idx = b.guns.findIndex(g => g.name === name);
            if (idx === -1) return false;
            b.guns[idx].have = true;
            if (!b.inventory.includes(idx)) b.inventory.push(idx);
            return true;
        },

        grantQrowWeapons() {
            if (!Array.isArray(b?.guns)) return;
            this.qrowWeapons.forEach(weapon => {
                if (!b.guns.find(g => g.name === weapon.name)) b.guns.push(weapon);
                this.ensureWeaponOwned(weapon.name);
            });
            simulation?.makeGunHUD?.();
        },

        grantScythe14() {
            const keys = ["crimson", "azure", "emerald", "violet", "gold", "glacier", "toxic", "obsidian", "rose", "amber", "neon", "storm", "magma", "lunar"];
            keys.forEach(k => this.ensureWeaponOwned(`${k} scythe`));
            simulation?.makeGunHUD?.();
        },

        spawnQrowPets() {
            if (!Array.isArray(simulation?.ephemera)) return;
            if (!simulation.ephemera.find(e => e.name === 'nine-tailed-fox')) {
                simulation.ephemera.push({
                    name: 'nine-tailed-fox',
                    do() {
                        const angle = m.cycle * 0.03;
                        const x = m.pos.x + Math.cos(angle) * 100;
                        const y = m.pos.y + Math.sin(angle) * 100 - 30;
                        simulation.drawList.push({ x, y, radius: 20, color: 'rgba(255,215,0,0.4)', time: simulation.drawTime });
                        if (m.cycle % 60 === 0 && Array.isArray(mob)) {
                            const target = mob.find(mm => mm && mm.alive !== false && mm.position && Math.hypot(mm.position.x - x, mm.position.y - y) < 400);
                            if (target) b.laser({ x, y }, target.position, 30);
                        }
                    }
                });
            }
            if (!simulation.ephemera.find(e => e.name === 'red-phoenix')) {
                simulation.ephemera.push({
                    name: 'red-phoenix',
                    do() {
                        const angle = -m.cycle * 0.02;
                        const x = m.pos.x + Math.cos(angle) * 120;
                        const y = m.pos.y + Math.sin(angle) * 60 - 50;
                        simulation.drawList.push({ x, y, radius: 16, color: 'rgba(255,69,0,0.42)', time: simulation.drawTime });
                        if (m.cycle % 120 === 0) m.health = Math.min(m.maxHealth, m.health + 0.05);
                    }
                });
            }
        },

        grantPhotonicArsenal() {
            if (!window.photonicContent?.weapons || !Array.isArray(b?.guns)) return;
            window.photonicContent.weapons.forEach(w => {
                if (!b.guns.find(g => g.name === w.name)) b.guns.push(w);
                this.ensureWeaponOwned(w.name);
            });
            simulation?.makeGunHUD?.();
        },

        grantMovementTechs() {
            if (!Array.isArray(tech?.tech)) return;
            tech.tech.forEach(t => {
                if (t.name && t.name.toLowerCase().includes('movement')) t.count = t.maxCount || 1;
            });
        },

        tryUnlock(code) {
            const upper = (code || '').toUpperCase().trim();
            const target = this.codes[upper];
            if (!target) return { success: false, message: 'Invalid code' };
            if (this.unlockedCodes.includes(upper)) return { success: false, message: 'Already unlocked!' };
            this.unlockedCodes.push(upper);
            localStorage.setItem(STORE_KEY, JSON.stringify(this.unlockedCodes));
            target.apply();
            return { success: true, name: target.name };
        },

        applyUnlockedCodes() {
            this.unlockedCodes.forEach(c => this.codes[c]?.apply());
        },

        loadSavedCodes() {
            try {
                const saved = localStorage.getItem(STORE_KEY);
                if (saved) this.unlockedCodes = JSON.parse(saved) || [];
            } catch (_) {
                this.unlockedCodes = [];
            }
        },

        bindUI() {
            const btn = document.getElementById('unlock-code-btn');
            const input = document.getElementById('unlock-code');
            const status = document.getElementById('unlock-status');
            if (!btn || !input || !status) return;

            const submit = () => {
                const result = this.tryUnlock(input.value);
                if (result.success) {
                    status.style.color = '#0a0';
                    status.textContent = `✓ Unlocked: ${result.name}`;
                    input.value = '';
                } else {
                    status.style.color = '#c00';
                    status.textContent = `✗ ${result.message}`;
                }
                setTimeout(() => { status.textContent = ''; }, 2500);
            };

            btn.addEventListener('click', submit);
            input.addEventListener('keypress', (e) => { if (e.key === 'Enter') submit(); });
        },

        init() {
            this.loadSavedCodes();
            this.applyUnlockedCodes();
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.bindUI());
            } else {
                this.bindUI();
            }
            console.log('%c🔓 Unlock Codes System Loaded (fixed)', 'color: #FFD700; font-weight: bold;');
        }
    };

    window.unlockCodes = api;
    api.init();
})();
