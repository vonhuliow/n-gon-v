/*
  Big Arsenal Update (single downloadable file)
  Includes:
  - 24 extra weapons
  - 12 bot techs
  - scythe color arsenal (14 exact-style colors)
  - hacker overhaul systems
  - playtest mega update systems
  - killforge arsenal (42 kill-upgrade weapons incl. nuke)
  - wave guitar pack (auto-frequency guitar model, spore set, original fusion, photonic transmuter)
  - field recovery fixes + upgraded unlock code system
  - registration logic to inject into b.guns and tech.tech
*/

// Massive weapon pack: 24 additional weapons
(function () {
    const getDir = () => Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
    const getAngle = () => {
        const dir = getDir();
        return Math.atan2(dir.y, dir.x);
    };

    const makeBurstNail = (name, description, ammo, ammoPack, speed, damage, pellets, spread) => ({
        name,
        descriptionFunction() { return description; },
        ammo,
        ammoPack,
        defaultAmmoPack: ammoPack,
        have: false,
        fire() {
            this.ammo--;
            const baseAngle = getAngle();
            const half = Math.floor(pellets / 2);
            for (let i = -half; i <= half; i++) {
                const angle = baseAngle + i * spread;
                b.nail({ x: m.pos.x, y: m.pos.y }, { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }, damage);
            }
        },
        do() { }
    });

    const makeLaserScatter = (name, description, ammo, ammoPack, branches, jitter, baseDamage, branchDamage) => ({
        name,
        descriptionFunction() { return description; },
        ammo,
        ammoPack,
        defaultAmmoPack: ammoPack,
        have: false,
        fire() {
            this.ammo--;
            b.laser(m.pos, simulation.mouseInGame, baseDamage);
            for (let i = 0; i < branches; i++) {
                b.laser(simulation.mouseInGame, {
                    x: simulation.mouseInGame.x + (Math.random() - 0.5) * jitter,
                    y: simulation.mouseInGame.y + (Math.random() - 0.5) * jitter,
                }, branchDamage);
            }
        },
        do() { }
    });

    const weaponPack = [
        makeBurstNail("storm rifle", "High-rate nail storm in a tight cone", 28, 6, 45, 12, 5, 0.08),
        makeBurstNail("ember spreader", "Incendiary spread-shot with medium knockback", 20, 4, 38, 16, 7, 0.1),
        makeBurstNail("needle cyclone", "A spinning fan of piercing shards", 22, 5, 48, 14, 9, 0.07),
        makeBurstNail("horizon carbine", "Fast and accurate long-lane puncture shots", 30, 6, 55, 11, 3, 0.04),
        makeBurstNail("shrapnel bloom", "Short-range blast that saturates a wide arc", 16, 3, 34, 18, 11, 0.11),

        makeLaserScatter("sunlance", "Focused beam with solar flares at impact", 12, 3, 4, 180, 90, 28),
        makeLaserScatter("ion harp", "Electric lines jump to nearby angles", 14, 3, 5, 220, 75, 24),
        makeLaserScatter("spectral prism", "Beam splits into refracted rays", 10, 2, 6, 260, 95, 22),
        makeLaserScatter("relay emitter", "Primary laser relays into micro-zaps", 16, 4, 3, 140, 68, 30),

        {
            name: "orbital breaker",
            descriptionFunction() { return "Launches a heavy missile followed by two decoys"; },
            ammo: 10,
            ammoPack: 2,
            defaultAmmoPack: 2,
            have: false,
            fire() {
                this.ammo--;
                const baseAngle = getAngle();
                b.missile({ x: m.pos.x, y: m.pos.y }, -baseAngle + Math.PI / 2, 0, 100);
                b.missile({ x: m.pos.x, y: m.pos.y }, -baseAngle + Math.PI / 2 + 0.15, 0, 70);
                b.missile({ x: m.pos.x, y: m.pos.y }, -baseAngle + Math.PI / 2 - 0.15, 0, 70);
            },
            do() { }
        },
        {
            name: "quake mortar",
            descriptionFunction() { return "Delayed blast cluster around target zone"; },
            ammo: 9,
            ammoPack: 2,
            defaultAmmoPack: 2,
            have: false,
            fire() {
                this.ammo--;
                const p = { x: simulation.mouseInGame.x, y: simulation.mouseInGame.y };
                setTimeout(() => b.explosion(p, 115), 260);
                setTimeout(() => b.explosion({ x: p.x + 70, y: p.y }, 70), 330);
                setTimeout(() => b.explosion({ x: p.x - 70, y: p.y }, 70), 390);
                setTimeout(() => b.explosion({ x: p.x, y: p.y - 70 }, 70), 450);
            },
            do() { }
        },
        {
            name: "plasma fan",
            descriptionFunction() { return "Radial plasma spikes expand from the player"; },
            ammo: 13,
            ammoPack: 3,
            defaultAmmoPack: 3,
            have: false,
            fire() {
                this.ammo--;
                for (let i = 0; i < 10; i++) {
                    const angle = (Math.PI * 2 * i) / 10;
                    b.nail({ x: m.pos.x, y: m.pos.y }, { x: Math.cos(angle) * 36, y: Math.sin(angle) * 36 }, 13);
                }
            },
            do() { }
        },
        {
            name: "gravity rake",
            descriptionFunction() { return "Dual explosions rake a path through crowds"; },
            ammo: 11,
            ammoPack: 2,
            defaultAmmoPack: 2,
            have: false,
            fire() {
                this.ammo--;
                const dir = getDir();
                b.explosion({ x: m.pos.x + dir.x * 90, y: m.pos.y + dir.y * 90 }, 85);
                b.explosion({ x: m.pos.x + dir.x * 170, y: m.pos.y + dir.y * 170 }, 95);
            },
            do() { }
        },
        {
            name: "avalanche cannon",
            descriptionFunction() { return "Heavy shard salvo with a final impact burst"; },
            ammo: 12,
            ammoPack: 2,
            defaultAmmoPack: 2,
            have: false,
            fire() {
                this.ammo--;
                const baseAngle = getAngle();
                for (let i = -3; i <= 3; i++) {
                    const angle = baseAngle + i * 0.09;
                    b.nail({ x: m.pos.x, y: m.pos.y }, { x: Math.cos(angle) * 40, y: Math.sin(angle) * 40 }, 16);
                }
                setTimeout(() => b.explosion(simulation.mouseInGame, 60), 180);
            },
            do() { }
        },
        {
            name: "arc thrower",
            descriptionFunction() { return "Rapid electric pulses that fork to nearby points"; },
            ammo: 18,
            ammoPack: 4,
            defaultAmmoPack: 4,
            have: false,
            fire() {
                this.ammo--;
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        b.laser(m.pos, {
                            x: simulation.mouseInGame.x + (Math.random() - 0.5) * 120,
                            y: simulation.mouseInGame.y + (Math.random() - 0.5) * 120,
                        }, 32);
                    }, i * 40);
                }
            },
            do() { }
        },
        {
            name: "comet rail",
            descriptionFunction() { return "One ultra-fast penetrator with splash"; },
            ammo: 8,
            ammoPack: 2,
            defaultAmmoPack: 2,
            have: false,
            fire() {
                this.ammo--;
                const dir = getDir();
                b.nail({ x: m.pos.x, y: m.pos.y }, { x: dir.x * 70, y: dir.y * 70 }, 34);
                setTimeout(() => b.explosion(simulation.mouseInGame, 52), 90);
            },
            do() { }
        },
        {
            name: "echo repeater",
            descriptionFunction() { return "Triple-tap burst with short cadence"; },
            ammo: 24,
            ammoPack: 5,
            defaultAmmoPack: 5,
            have: false,
            fire() {
                this.ammo--;
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        const dir = getDir();
                        b.nail({ x: m.pos.x, y: m.pos.y }, { x: dir.x * 44, y: dir.y * 44 }, 15);
                    }, i * 55);
                }
            },
            do() { }
        },
        {
            name: "phase splitter",
            descriptionFunction() { return "Shots split into offset timelines around target"; },
            ammo: 17,
            ammoPack: 4,
            defaultAmmoPack: 4,
            have: false,
            fire() {
                this.ammo--;
                for (let i = 0; i < 4; i++) {
                    const offset = {
                        x: (Math.random() - 0.5) * 130,
                        y: (Math.random() - 0.5) * 130
                    };
                    const target = { x: simulation.mouseInGame.x + offset.x, y: simulation.mouseInGame.y + offset.y };
                    const dir = Vector.normalise(Vector.sub(target, m.pos));
                    b.nail({ x: m.pos.x, y: m.pos.y }, { x: dir.x * 39, y: dir.y * 39 }, 13);
                }
            },
            do() { }
        },
        {
            name: "starforge",
            descriptionFunction() { return "Core detonation followed by ring shrapnel"; },
            ammo: 9,
            ammoPack: 2,
            defaultAmmoPack: 2,
            have: false,
            fire() {
                this.ammo--;
                b.explosion(simulation.mouseInGame, 95);
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI * 2 * i) / 6;
                    b.nail({ x: simulation.mouseInGame.x, y: simulation.mouseInGame.y }, { x: Math.cos(angle) * 30, y: Math.sin(angle) * 30 }, 14);
                }
            },
            do() { }
        },
        {
            name: "tremor beam",
            descriptionFunction() { return "Laser with periodic impact quakes"; },
            ammo: 10,
            ammoPack: 2,
            defaultAmmoPack: 2,
            have: false,
            fire() {
                this.ammo--;
                b.laser(m.pos, simulation.mouseInGame, 88);
                setTimeout(() => b.explosion(simulation.mouseInGame, 55), 80);
                setTimeout(() => b.explosion(simulation.mouseInGame, 45), 180);
            },
            do() { }
        },
        {
            name: "void bloom",
            descriptionFunction() { return "Dark bloom projectile that erupts outward"; },
            ammo: 11,
            ammoPack: 2,
            defaultAmmoPack: 2,
            have: false,
            fire() {
                this.ammo--;
                const dir = getDir();
                b.nail({ x: m.pos.x, y: m.pos.y }, { x: dir.x * 46, y: dir.y * 46 }, 21);
                setTimeout(() => {
                    for (let i = 0; i < 8; i++) {
                        const angle = (Math.PI * 2 * i) / 8;
                        b.nail({ x: simulation.mouseInGame.x, y: simulation.mouseInGame.y }, { x: Math.cos(angle) * 28, y: Math.sin(angle) * 28 }, 10);
                    }
                }, 120);
            },
            do() { }
        },
        {
            name: "cinder lance",
            descriptionFunction() { return "Linear superheated lance with aftershock"; },
            ammo: 13,
            ammoPack: 3,
            defaultAmmoPack: 3,
            have: false,
            fire() {
                this.ammo--;
                const dir = getDir();
                b.nail({ x: m.pos.x, y: m.pos.y }, { x: dir.x * 62, y: dir.y * 62 }, 26);
                setTimeout(() => b.explosion({ x: m.pos.x + dir.x * 230, y: m.pos.y + dir.y * 230 }, 65), 70);
            },
            do() { }
        },
        {
            name: "wildfire array",
            descriptionFunction() { return "Alternating spread and blast pulse"; },
            ammo: 14,
            ammoPack: 3,
            defaultAmmoPack: 3,
            have: false,
            fire() {
                this.ammo--;
                const baseAngle = getAngle();
                for (let i = -2; i <= 2; i++) {
                    const angle = baseAngle + i * 0.1;
                    b.nail({ x: m.pos.x, y: m.pos.y }, { x: Math.cos(angle) * 41, y: Math.sin(angle) * 41 }, 14);
                }
                b.explosion(simulation.mouseInGame, 58);
            },
            do() { }
        },
        {
            name: "neutron bloom",
            descriptionFunction() { return "Compact orb burst with delayed ring detonations"; },
            ammo: 8,
            ammoPack: 1,
            defaultAmmoPack: 1,
            have: false,
            fire() {
                this.ammo--;
                const p = { x: simulation.mouseInGame.x, y: simulation.mouseInGame.y };
                b.explosion(p, 80);
                for (let i = 0; i < 4; i++) {
                    const angle = (Math.PI * 2 * i) / 4;
                    setTimeout(() => b.explosion({ x: p.x + Math.cos(angle) * 85, y: p.y + Math.sin(angle) * 85 }, 44), 180 + i * 40);
                }
            },
            do() { }
        },
        {
            name: "cascade repeater",
            descriptionFunction() { return "Layered burst that ramps projectile speed"; },
            ammo: 25,
            ammoPack: 5,
            defaultAmmoPack: 5,
            have: false,
            fire() {
                this.ammo--;
                const dir = getDir();
                b.nail({ x: m.pos.x, y: m.pos.y }, { x: dir.x * 32, y: dir.y * 32 }, 10);
                b.nail({ x: m.pos.x, y: m.pos.y }, { x: dir.x * 42, y: dir.y * 42 }, 12);
                b.nail({ x: m.pos.x, y: m.pos.y }, { x: dir.x * 52, y: dir.y * 52 }, 14);
            },
            do() { }
        },
        {
            name: "skyfall engine",
            descriptionFunction() { return "Calls in aerial strikes around cursor"; },
            ammo: 9,
            ammoPack: 2,
            defaultAmmoPack: 2,
            have: false,
            fire() {
                this.ammo--;
                const p = { x: simulation.mouseInGame.x, y: simulation.mouseInGame.y };
                const points = [
                    { x: p.x, y: p.y },
                    { x: p.x + 90, y: p.y - 45 },
                    { x: p.x - 90, y: p.y + 45 },
                    { x: p.x + 45, y: p.y + 90 },
                    { x: p.x - 45, y: p.y - 90 }
                ];
                points.forEach((point, idx) => setTimeout(() => b.explosion(point, 66), 120 + idx * 60));
            },
            do() { }
        }
    ];

    window.ngonArsenalWeapons = weaponPack;
})();


// Additional bot-focused tech pack
(function () {
    const botTechs = [
        {
            name: "swarm uplink",
            description: "<strong>swarm uplink</strong><br>construct <strong>1</strong> random <strong class='color-bot'>bot</strong>",
            isGunTech: false,
            isBotTech: true,
            maxCount: 3,
            count: 0,
            allowed() { return typeof b !== 'undefined' && b.randomBot; },
            requires: "",
            effect() { if (b.randomBot) b.randomBot(); },
            remove() { this.count = 0; }
        },
        {
            name: "bot fabrication line",
            description: "<strong>bot fabrication line</strong><br>construct <strong>2</strong> random <strong class='color-bot'>bots</strong>",
            isGunTech: false,
            isBotTech: true,
            maxCount: 2,
            count: 0,
            allowed() { return typeof b !== 'undefined' && b.randomBot; },
            requires: "",
            effect() { if (b.randomBot) { b.randomBot(); b.randomBot(); } },
            remove() { this.count = 0; }
        },
        {
            name: "orbital doctrine",
            description: "<strong>orbital doctrine</strong><br>construct an <strong class='color-bot'>orbital-bot</strong>",
            isGunTech: false,
            isBotTech: true,
            maxCount: 2,
            count: 0,
            allowed() { return typeof b !== 'undefined' && b.orbitBot; },
            requires: "",
            effect() { if (b.orbitBot) b.orbitBot(); },
            remove() { this.count = 0; }
        },
        {
            name: "laser protocol",
            description: "<strong>laser protocol</strong><br>construct a <strong class='color-bot'>laser-bot</strong>",
            isGunTech: false,
            isBotTech: true,
            maxCount: 2,
            count: 0,
            allowed() { return typeof b !== 'undefined' && b.laserBot; },
            requires: "",
            effect() { if (b.laserBot) b.laserBot(); },
            remove() { this.count = 0; }
        },
        {
            name: "nail foundry",
            description: "<strong>nail foundry</strong><br>construct a <strong class='color-bot'>nail-bot</strong>",
            isGunTech: false,
            isBotTech: true,
            maxCount: 3,
            count: 0,
            allowed() { return typeof b !== 'undefined' && b.nailBot; },
            requires: "",
            effect() { if (b.nailBot) b.nailBot(); },
            remove() { this.count = 0; }
        },
        {
            name: "foam matrix",
            description: "<strong>foam matrix</strong><br>construct a <strong class='color-bot'>foam-bot</strong>",
            isGunTech: false,
            isBotTech: true,
            maxCount: 3,
            count: 0,
            allowed() { return typeof b !== 'undefined' && b.foamBot; },
            requires: "",
            effect() { if (b.foamBot) b.foamBot(); },
            remove() { this.count = 0; }
        },
        {
            name: "boom relay",
            description: "<strong>boom relay</strong><br>construct a <strong class='color-bot'>boom-bot</strong>",
            isGunTech: false,
            isBotTech: true,
            maxCount: 2,
            count: 0,
            allowed() { return typeof b !== 'undefined' && b.boomBot; },
            requires: "",
            effect() { if (b.boomBot) b.boomBot(); },
            remove() { this.count = 0; }
        },
        {
            name: "dynamo circuit",
            description: "<strong>dynamo circuit</strong><br>construct a <strong class='color-bot'>dynamo-bot</strong>",
            isGunTech: false,
            isBotTech: true,
            maxCount: 2,
            count: 0,
            allowed() { return typeof b !== 'undefined' && b.dynamoBot; },
            requires: "",
            effect() { if (b.dynamoBot) b.dynamoBot(); },
            remove() { this.count = 0; }
        },
        {
            name: "harmonic servos",
            description: "<strong>harmonic servos</strong><br>construct a <strong class='color-bot'>sound-bot</strong>",
            isGunTech: false,
            isBotTech: true,
            maxCount: 2,
            count: 0,
            allowed() { return typeof b !== 'undefined' && b.soundBot; },
            requires: "",
            effect() { if (b.soundBot) b.soundBot(); },
            remove() { this.count = 0; }
        },
        {
            name: "bot convergence",
            description: "<strong>bot convergence</strong><br>convert all bots to <strong class='color-bot'>laser-bots</strong>",
            isGunTech: false,
            isBotTech: true,
            maxCount: 1,
            count: 0,
            allowed() { return typeof b !== 'undefined' && b.convertBotsTo; },
            requires: "at least 2 bots",
            effect() { if (b.convertBotsTo) b.convertBotsTo("laser-bot"); },
            remove() { this.count = 0; }
        },
        {
            name: "bot overclock",
            description: "<strong>bot overclock</strong><br>temporary <strong>+20%</strong> global <strong class='color-d'>damage</strong>",
            isGunTech: false,
            isBotTech: true,
            maxCount: 2,
            count: 0,
            allowed() { return typeof tech !== 'undefined'; },
            requires: "",
            effect() { if (tech && typeof tech.damage === 'number') tech.damage *= 1.2; },
            remove() { if (tech && typeof tech.damage === 'number') tech.damage /= 1.2; this.count = 0; }
        },
        {
            name: "bot shield lattice",
            description: "<strong>bot shield lattice</strong><br><strong>0.95x</strong> <strong class='color-defense'>damage taken</strong>",
            isGunTech: false,
            isBotTech: true,
            maxCount: 2,
            count: 0,
            allowed() { return typeof tech !== 'undefined'; },
            requires: "",
            effect() { if (tech && typeof tech.harmReduction === 'number') tech.harmReduction *= 0.95; },
            remove() { if (tech && typeof tech.harmReduction === 'number') tech.harmReduction /= 0.95; this.count = 0; }
        }
    ];

    window.ngonBotTechs = botTechs;
})();


// Exact-style scythe arsenal (14 color variants), based on the provided scythe implementation style
(function () {
    const variantConfigs = [
        { key: "crimson", color: "crimson", trail: "rgba(220,20,60,", dmg: 1.00, drain: 0.10, spin: 1.00, blast: 0, stun: 0 },
        { key: "azure", color: "dodgerblue", trail: "rgba(30,144,255,", dmg: 1.05, drain: 0.10, spin: 1.02, blast: 0, stun: 0 },
        { key: "emerald", color: "seagreen", trail: "rgba(46,139,87,", dmg: 1.02, drain: 0.09, spin: 1.00, blast: 0, stun: 0 },
        { key: "violet", color: "blueviolet", trail: "rgba(138,43,226,", dmg: 1.08, drain: 0.11, spin: 1.06, blast: 0, stun: 0 },
        { key: "gold", color: "#ffd700", trail: "rgba(255,215,0,", dmg: 1.12, drain: 0.12, spin: 0.98, blast: 18, stun: 0 },
        { key: "glacier", color: "#6ad7ff", trail: "rgba(106,215,255,", dmg: 0.98, drain: 0.08, spin: 1.03, blast: 0, stun: 0 },
        { key: "toxic", color: "chartreuse", trail: "rgba(127,255,0,", dmg: 1.06, drain: 0.11, spin: 1.01, blast: 0, stun: 20 },
        { key: "obsidian", color: "#555", trail: "rgba(85,85,85,", dmg: 1.14, drain: 0.12, spin: 0.95, blast: 0, stun: 0 },
        { key: "rose", color: "#ff4f81", trail: "rgba(255,79,129,", dmg: 1.03, drain: 0.09, spin: 1.04, blast: 0, stun: 0 },
        { key: "amber", color: "#ffbf00", trail: "rgba(255,191,0,", dmg: 1.07, drain: 0.10, spin: 0.97, blast: 10, stun: 0 },
        { key: "neon", color: "#39ff14", trail: "rgba(57,255,20,", dmg: 1.04, drain: 0.09, spin: 1.12, blast: 0, stun: 0 },
        { key: "storm", color: "#00bcd4", trail: "rgba(0,188,212,", dmg: 1.06, drain: 0.10, spin: 1.08, blast: 0, stun: 16 },
        { key: "magma", color: "#ff3b30", trail: "rgba(255,59,48,", dmg: 1.15, drain: 0.12, spin: 0.96, blast: 22, stun: 0 },
        { key: "lunar", color: "#c0c0ff", trail: "rgba(192,192,255,", dmg: 1.00, drain: 0.08, spin: 1.00, blast: 0, stun: 0 }
    ];

    function cleanupScythe(g) {
        if (!g.scythe) return;
        Matter.Body.setAngularVelocity(g.scythe, 0);
        Composite.remove(engine.world, g.scythe);
        g.scythe.parts.forEach(part => {
            Composite.remove(engine.world, part);
            const index = bullet.indexOf(part);
            if (index !== -1) bullet.splice(index, 1);
        });
        g.scythe = undefined;
        g.bladeTrails = [];
        m.fireCDcycle = 0;
        if (g.constraint) {
            Composite.remove(engine.world, g.constraint);
            g.constraint = undefined;
        }
    }

    function createScytheVariant(cfg) {
        return {
            name: `${cfg.key} scythe`,
            descriptionFunction() {
                return `throw a <b>${cfg.key} scythe</b> that keeps velocity on collision<br>drains <strong class='color-h'>health</strong> instead of ammo<br><span style='color:${cfg.color}'>${(cfg.dmg * 100).toFixed(0)}% damage profile</span>`;
            },
            ammo: Infinity,
            ammoPack: Infinity,
            defaultAmmoPack: Infinity,
            have: false,
            fire() { },
            cycle: 0,
            cycle2: 0,
            scythe: undefined,
            bladeSegments: undefined,
            bladeTrails: [],
            angle: 0,
            constraint: undefined,
            durability: 200,
            maxDurability: 200,
            haveEphemera: false,
            right: true,
            do() {
                if (this.cycle2 === 0) {
                    const oldEffect = powerUps.ammo.effect;
                    powerUps.ammo.effect = () => {
                        oldEffect();
                        for (let i = 0, len = b.inventory.length; i < len; ++i) {
                            const gun = b.guns[b.inventory[i]];
                            if (gun?.name === this.name && tech.durabilityScythe) {
                                gun.durability += (tech.isAmmoForGun && b.guns[b.activeGun].name === this.name) ? 30 : 15;
                            }
                        }
                    };
                }
                this.cycle2++;

                if (!this.haveEphemera) {
                    this.haveEphemera = true;
                    simulation.ephemera.push({
                        name: `${this.name}-ephemera`,
                        do: () => {
                            if (b.activeGun === null || b.guns[b.activeGun].name !== this.name) {
                                for (let i = 0, len = b.inventory.length; i < len; ++i) {
                                    const g = b.guns[b.inventory[i]];
                                    if (g?.name === this.name && g.scythe) {
                                        g.cycle = 0;
                                        cleanupScythe(g);
                                    }
                                }
                            }
                        },
                    });
                }

                if (tech.isAmmoScythe) {
                    this.ammoPack = 1;
                    this.defaultAmmoPack = 1;
                } else {
                    this.ammo = Infinity;
                    this.ammoPack = Infinity;
                    this.defaultAmmoPack = Infinity;
                }

                this.durability = Math.max(0, Math.min(this.durability, this.maxDurability));
                if (b.activeGun !== null && input.fire && (tech.isEnergyHealth ? m.energy >= 0.11 : m.health >= 0.11) && this.durability > 0) {
                    if (!this.scythe && b.guns[b.activeGun].name === this.name) {
                        this.angle = m.angle;
                        if (tech.durabilityScythe) {
                            if (!(this.angle > -Math.PI / 2 && this.angle < Math.PI / 2)) {
                                this.right = false;
                                ({ scythe: this.scythe, bladeSegments: this.bladeSegments } = this.createScythe(player.position, false));
                            } else {
                                this.right = true;
                                ({ scythe: this.scythe, bladeSegments: this.bladeSegments } = this.createScythe(player.position, true));
                            }
                        } else {
                            ({ scythe: this.scythe, bladeSegments: this.bladeSegments } = this.createAndSwingScythe());
                        }

                        if (!tech.isAmmoScythe && !b.guns[b.activeGun].ammo == 0 && !tech.durabilityScythe) {
                            const drain = cfg.drain;
                            if (tech.isEnergyHealth) {
                                m.energy -= drain;
                                if (tech.isPhaseScythe) m.immuneCycle = this.cycle;
                            } else {
                                m.health -= drain;
                                m.displayHealth();
                            }
                        }
                    }
                }

                if (tech.durabilityScythe) {
                    if (!(m.angle > -Math.PI / 2 && m.angle < Math.PI / 2) && this.right === true && this.scythe) cleanupScythe(this);
                    else if ((m.angle > -Math.PI / 2 && m.angle < Math.PI / 2) && this.right === false && this.scythe) cleanupScythe(this);
                    if (this.scythe && (!input.fire || !this.durability)) cleanupScythe(this);
                }

                if (this.scythe && m.cycle > this.cycle + 30 && !tech.durabilityScythe) {
                    cleanupScythe(this);
                } else {
                    if (this.scythe && !tech.isMeleeScythe && !tech.durabilityScythe) {
                        const ang = Math.PI * 0.15 * cfg.spin;
                        if (!(this.angle > -Math.PI / 2 && this.angle < Math.PI / 2)) {
                            Matter.Body.setAngularVelocity(this.scythe, -ang - (tech.scytheRad ? tech.scytheRad * 0.1 : 0));
                        } else {
                            Matter.Body.setAngularVelocity(this.scythe, ang + (tech.scytheRad ? tech.scytheRad * 0.1 : 0));
                        }
                        Matter.Body.setVelocity(this.scythe, { x: Math.cos(this.angle) * 30, y: Math.sin(this.angle) * 30 });
                    } else if (this.scythe && (tech.isMeleeScythe || tech.durabilityScythe)) {
                        if (!(this.angle > -Math.PI / 2 && this.angle < Math.PI / 2)) {
                            Matter.Body.setAngularVelocity(this.scythe, -Math.PI * 0.1 + (tech.isStunScythe ? 0.1 : 0) - (tech.scytheRad ? tech.scytheRad * 0.1 : 0));
                        } else {
                            Matter.Body.setAngularVelocity(this.scythe, Math.PI * 0.1 - (tech.isStunScythe ? 0.1 : 0) + (tech.scytheRad ? tech.scytheRad * 0.1 : 0));
                        }
                        if (tech.durabilityScythe) {
                            if (!this.constraint) {
                                this.constraint = Constraint.create({
                                    pointA: player.position,
                                    bodyB: this.scythe,
                                    pointB: (!(this.angle > -Math.PI / 2 && this.angle < Math.PI / 2)) ? { x: 50, y: 100 } : { x: -50, y: 100 },
                                    stiffness: 0.9,
                                    damping: 0.001
                                });
                                Composite.add(engine.world, this.constraint);
                            }
                        } else {
                            Matter.Body.setPosition(this.scythe, player.position);
                        }
                    }
                }

                if (this.scythe) {
                    for (let i = 0; i < this.bladeSegments.length; i++) {
                        const blade = this.bladeSegments[i];
                        const trail = this.bladeTrails[i] || [];
                        const vertices = blade.vertices.map(vertex => ({ x: vertex.x, y: vertex.y }));
                        trail.push(vertices);
                        if (trail.length > 10) trail.shift();
                        this.bladeTrails[i] = trail;
                    }

                    for (let i = 0; i < this.bladeTrails.length; i++) {
                        const trail = this.bladeTrails[i];
                        const alphaStep = 1 / trail.length;
                        let alpha = 0;
                        for (let j = 0; j < trail.length; j++) {
                            const vertices = trail[j];
                            ctx.beginPath();
                            ctx.moveTo(vertices[0].x, vertices[0].y);
                            for (let k = 1; k < vertices.length; k++) ctx.lineTo(vertices[k].x, vertices[k].y);
                            alpha += alphaStep;
                            ctx.closePath();
                            if (tech.isEnergyHealth) {
                                const eyeColor = m.fieldMeterColor;
                                const r = eyeColor[1], g = eyeColor[2], b = eyeColor[3];
                                ctx.fillStyle = `#${r}${r}${g}${g}${b}${b}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
                            } else if (tech.isAmmoScythe) {
                                ctx.fillStyle = `#c0c0c0${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
                            } else if (tech.isStunScythe) {
                                ctx.fillStyle = `#4b0082${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
                            } else {
                                ctx.fillStyle = `${cfg.trail}${alpha})`;
                            }
                            ctx.fill();
                        }
                    }

                    for (let i = 0; i < this.bladeSegments.length; i++) {
                        ctx.beginPath();
                        ctx.lineJoin = "miter";
                        ctx.miterLimit = 100;
                        ctx.strokeStyle = tech.isEnergyHealth ? m.fieldMeterColor : tech.isAmmoScythe ? "#c0c0c0" : tech.isStunScythe ? "indigo" : cfg.color;
                        ctx.lineWidth = 5;
                        ctx.fillStyle = "black";
                        ctx.moveTo(this.bladeSegments[i].vertices[0].x, this.bladeSegments[i].vertices[0].y);
                        for (let j = 0; j < this.bladeSegments[i].vertices.length; j++) ctx.lineTo(this.bladeSegments[i].vertices[j].x, this.bladeSegments[i].vertices[j].y);
                        ctx.closePath();
                        ctx.stroke();
                        ctx.fill();
                        ctx.lineJoin = "round";
                        ctx.miterLimit = 10;
                    }
                }

                if (this.scythe) {
                    for (let i = 0; i < mob.length; i++) {
                        if (Matter.Query.collides(this.scythe, [mob[i]]).length > 0) {
                            if (tech.durabilityScythe) this.durability--;
                            const dmg = (m.damageDone ? m.damageDone : m.dmgScale) * 0.12 * 2.73 * cfg.dmg * (tech.scytheGlobalMult || 1) * (tech.isLongBlade ? 1.3 : 1) * (tech.scytheRange ? tech.scytheRange * 1.15 : 1) * (tech.isDoubleScythe ? 0.9 : 1) * (tech.scytheRad ? tech.scytheRad * 1.5 : 1);
                            mob[i].damage(dmg, true);
                            simulation.drawList.push({ x: mob[i].position.x, y: mob[i].position.y, radius: Math.sqrt(dmg) * 50, color: simulation.mobDmgColor, time: simulation.drawTime });
                            if (cfg.blast > 0) b.explosion(mob[i].position, cfg.blast);
                            if (cfg.stun > 0 || tech.isStunScythe) mobs.statusStun(mob[i], Math.max(cfg.stun, 90));
                            if (!tech.isMeleeScythe) {
                                const angle = Math.atan2(mob[i].position.y - this.scythe.position.y, mob[i].position.x - this.scythe.position.x);
                                this.scythe.force.x += Math.cos(angle) * 2;
                                this.scythe.force.y += Math.sin(angle) * 2;
                            }
                            break;
                        }
                    }
                }
            },
            createAndSwingScythe(x = player.position.x, y = player.position.y, angle = m.angle) {
                if (this.cycle < m.cycle) {
                    this.cycle = m.cycle + 60 + (tech.scytheRange * 6);
                    m.fireCDcycle = Infinity;
                    const handleWidth = 20;
                    const handleHeight = 200 + (tech.isLongBlade ? 30 : 0) + (tech.isMeleeScythe ? 140 : 0);
                    const handle = Bodies.rectangle(x, y, handleWidth, handleHeight, spawn.propsIsNotHoldable);
                    bullet[bullet.length] = handle; bullet[bullet.length - 1].do = () => { };
                    const bladeWidth = 100, bladeHeight = 20;
                    const numBlades = 10 + (tech.isLongBlade ? 1 : 0) + (tech.isMeleeScythe ? 2 : 0);
                    const extensionFactor = 5.5;
                    const bladeSegments = [];

                    const makeBlade = (bladeX, bladeY, rotateBy) => {
                        const vertices = [
                            { x: bladeX, y: bladeY - bladeHeight / 2 },
                            { x: bladeX + bladeWidth / 2, y: bladeY + bladeHeight / 2 },
                            { x: bladeX - bladeWidth / 2, y: bladeY + bladeHeight / 2 },
                            { x: bladeX, y: bladeY - bladeHeight / 2 + 10 },
                        ];
                        const blade = Bodies.fromVertices(bladeX, bladeY, vertices, spawn.propsIsNotHoldable);
                        bullet[bullet.length] = blade; bullet[bullet.length - 1].do = () => { };
                        Matter.Body.rotate(blade, rotateBy);
                        bladeSegments.push(blade);
                    };

                    for (let i = 0; i < numBlades; i++) {
                        const ext = (i / (numBlades - 1)) * extensionFactor;
                        makeBlade(x - handleWidth / 2 + i * (bladeWidth / 2) - ext * (bladeWidth / 2), y + handleHeight / 2 - i * (bladeHeight / (3 ** i)), -Math.sin(i * (Math.PI / 180) * 5));
                    }
                    if (tech.isDoubleScythe) {
                        for (let i = 0; i < numBlades; i++) {
                            const ext = (i / (numBlades - 1)) * extensionFactor;
                            makeBlade(x + handleWidth / 2 - i * (bladeWidth / 2) + ext * (bladeWidth / 2), y - handleHeight / 2 - i * (bladeHeight / (3 ** i)), -Math.sin(i * (Math.PI / 180) * 5) + Math.PI);
                        }
                    }

                    const scythe = Body.create({ parts: [handle, ...bladeSegments] });
                    Composite.add(engine.world, scythe);
                    Matter.Body.setPosition(scythe, { x, y });
                    scythe.collisionFilter.category = cat.bullet;
                    scythe.collisionFilter.mask = cat.mobBullet | cat.mob;
                    if ((angle > -Math.PI / 2 && angle < Math.PI / 2)) Body.scale(scythe, -1, 1, { x, y });
                    scythe.frictionAir -= 0.01;
                    return { scythe, bladeSegments };
                }
            },
            createScythe(position = player.position, right = true) {
                let x = position.x, y = position.y;
                const handleWidth = 20, handleHeight = 220;
                const handle = Bodies.rectangle(x, y, handleWidth, handleHeight, spawn.propsIsNotHoldable);
                const pommel = Bodies.fromVertices(x, y + handleHeight / 2, [
                    { x, y: y + handleHeight / 2 + 20 }, { x: x + 15, y: y + handleHeight / 2 }, { x, y: y + handleHeight / 2 - 20 }, { x: x - 15, y: y + handleHeight / 2 }
                ], spawn.propsIsNotHoldable);
                const handle2 = Bodies.fromVertices(x + 50, y - handleHeight / 2 - 70, [
                    { x: x + 120, y: y - 140 }, { x: x + 100, y: y - 140 }, { x: x + 23, y }, { x: x + 3, y }
                ], spawn.propsIsNotHoldable);
                const joint = Bodies.polygon(x + 100, y - handleHeight - 20, 5, 30, spawn.propsIsNotHoldable);
                const joint2 = Bodies.polygon(x, y - handleHeight / 2, 3, 20, spawn.propsIsNotHoldable);
                Body.rotate(joint2, Math.PI / 2);

                const blade1 = Bodies.fromVertices(x + 50, y - handleHeight / 2 - 150, [{ x: x - 5, y: y - 10 }, { x: x - 15, y: y + 10 }, { x: x - 100, y: y - 35 }, { x: x - 60, y }], spawn.propsIsNotHoldable);
                const blade2 = Bodies.fromVertices(x + 100, y - handleHeight / 2 - 150, [{ x: x - 10, y: y - 10 }, { x: x + 15, y: y + 10 }, { x: x - 100, y: y - 30 }, { x: x - 60, y }], spawn.propsIsNotHoldable);
                const blade3 = Bodies.fromVertices(x + 150, y - handleHeight / 2 - 130, [{ x: x - 10, y: y - 10 }, { x: x + 15, y: y + 10 }, { x: x - 90, y: y - 30 }, { x: x - 60, y }], spawn.propsIsNotHoldable);
                const blade4 = Bodies.fromVertices(x - 20, y - handleHeight / 2 - 160, [{ x, y: y - 10 }, { x: x + 15, y: y + 10 }, { x: x - 90, y: y - 25 }, { x: x - 60, y: y + 5 }], spawn.propsIsNotHoldable);
                const blade5 = Bodies.fromVertices(x - 90, y - handleHeight / 2 - 160, [{ x, y: y - 30 }, { x: x + 15, y: y - 10 }, { x: x - 90, y: y - 25 }, { x: x - 60, y }], spawn.propsIsNotHoldable);
                const blade6 = Bodies.fromVertices(x - 150, y - handleHeight / 2 - 150, [{ x: x + 10, y: y - 15 }, { x: x + 30, y: y + 4 }, { x: x - 90, y: y + 10 }, { x: x - 30, y: y + 20 }], spawn.propsIsNotHoldable);

                const scythe = Body.create({ parts: [handle, handle2, pommel, blade6, blade5, blade4, blade1, blade2, blade3, joint, joint2] });
                Composite.add(engine.world, scythe);
                Matter.Body.setPosition(scythe, { x, y });
                Matter.Body.setVelocity(scythe, { x: 0, y: 0 });
                scythe.collisionFilter.category = cat.bullet;
                scythe.collisionFilter.mask = cat.mobBullet | cat.powerup | cat.mob | cat.body | cat.bullet;
                Body.scale(scythe, -1, 1);
                if (!right) Body.scale(scythe, -1, 1);
                return { scythe, bladeSegments: [handle, handle2, pommel, blade6, blade5, blade4, blade1, blade2, blade3, joint, joint2] };
            },
        };
    }

    const scytheVariants = variantConfigs.map(createScytheVariant);

    const scytheTech = [
        {
            name: "scythe overclock",
            descriptionFunction() { return `<strong>1.15x</strong> all scythe variant <strong class='color-d'>damage</strong>`; },
            isGunTech: true,
            maxCount: 3,
            count: 0,
            frequency: 2,
            frequencyDefault: 2,
            allowed() { return scytheVariants.some(g => tech.haveGunCheck(g.name)); },
            requires: "any scythe variant",
            effect() { tech.scytheGlobalMult = (tech.scytheGlobalMult || 1) * 1.15; },
            remove() { tech.scytheGlobalMult = (tech.scytheGlobalMult || 1) / 1.15; }
        }
    ];

    if (typeof b !== 'undefined' && Array.isArray(b.guns)) {
        scytheVariants.forEach(g => {
            if (!b.guns.find(existing => existing.name === g.name)) b.guns.push(g);
        });
        b.guns = b.guns.filter((obj, index, self) => index === self.findIndex(item => item.name === obj.name));
    }

    if (typeof tech !== 'undefined' && Array.isArray(tech.tech)) {
        scytheTech.forEach(t => {
            if (!tech.tech.find(existing => existing.name === t.name)) tech.tech.push(t);
        });
        tech.tech = tech.tech.filter((obj, index, self) => index === self.findIndex(item => item.name === obj.name));
    }

    console.log(`%cscythe arsenal installed (${scytheVariants.length} variants)`, "color: crimson; font-weight: bold;");
})();


// Hacker Overhaul: working movement techs, lock-on sniper, evolving weapon, summon tech keybinds, and extra mob pressure
(function () {
    const ho = window.hackerOverhaul || {
        deadIDs: new Set(),
        gunKills: {},
        movement: {
            speedStacks: 0,
            jumpStacks: 0,
            airDash: 0,
            blink: 0,
            gravityShift: 0,
            regenDash: 0,
            phaseStride: 0,
            hackerAura: 0,
            recoilCancel: 0,
            overclock: 0,
        },
        summonUnlocked: {},
        summonCooldowns: {},
        constructs: [],
        extraMobIntensity: 0,
        initialized: false,
        nextMobSpawnCycle: 0,
        initedHUD: false,
    };
    window.hackerOverhaul = ho;

    const getActiveGunName = () => (b.activeGun !== null && b.guns[b.activeGun]) ? b.guns[b.activeGun].name : null;

    const registerKill = () => {
        if (!Array.isArray(mob)) return;
        for (let i = 0; i < mob.length; i++) {
            const target = mob[i];
            if (!target) continue;
            const id = target.id ?? `${Math.round(target.position?.x || 0)}:${Math.round(target.position?.y || 0)}:${i}`;
            if (target.alive === false && !ho.deadIDs.has(id)) {
                ho.deadIDs.add(id);
                const gunName = getActiveGunName();
                if (gunName) ho.gunKills[gunName] = (ho.gunKills[gunName] || 0) + 1;
            }
        }
    };

    const getClosestMobToCursor = (maxRange = 650) => {
        if (!Array.isArray(mob) || !simulation?.mouseInGame) return null;
        let best = null;
        let bestD2 = maxRange * maxRange;
        for (let i = 0; i < mob.length; i++) {
            const target = mob[i];
            if (!target || target.alive === false || !target.position) continue;
            const dx = target.position.x - simulation.mouseInGame.x;
            const dy = target.position.y - simulation.mouseInGame.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < bestD2) {
                best = target;
                bestD2 = d2;
            }
        }
        return best;
    };

    const lockOnSniper = {
        name: "lock-on sniper",
        descriptionFunction() { return "<strong>LOCK-ON</strong> sniper highlights nearest target and fires a precision burst"; },
        ammo: 14,
        ammoPack: 2,
        defaultAmmoPack: 2,
        have: false,
        cycle: 0,
        lockID: null,
        fire() {
            if (this.ammo <= 0 || m.cycle < this.cycle) return;
            const target = getClosestMobToCursor(750);
            if (!target) {
                simulation.inGameConsole("<span style='color:#f66'>LOCK-ON FAILED</span>", 30);
                this.cycle = m.cycle + 12;
                return;
            }
            this.ammo--;
            this.cycle = m.cycle + 18;
            const hitPos = { x: target.position.x, y: target.position.y };
            b.laser(m.pos, hitPos, 180);
            b.explosion(hitPos, 55);
            if (target.damage) target.damage(0.95, true);
            simulation.inGameConsole(`<span style='color:#9ff'>LOCKED</span> <span style='color:#fff'>ID:${target.id ?? "?"}</span>`, 26);
        },
        do() {
            if (b.activeGun === null || !b.guns[b.activeGun] || b.guns[b.activeGun].name !== this.name) return;
            const target = getClosestMobToCursor(750);
            const nextID = target?.id ?? null;
            if (nextID !== this.lockID) {
                this.lockID = nextID;
                if (target) {
                    simulation.inGameConsole(`<span style='color:#0ff'>TARGET LOCK</span> x:${target.position.x.toFixed(0)} y:${target.position.y.toFixed(0)}`, 20);
                    simulation.drawList.push({ x: target.position.x, y: target.position.y, radius: 35, color: "rgba(0,255,255,0.45)", time: simulation.drawTime });
                } else {
                    simulation.inGameConsole("<span style='color:#888'>SCANNING...</span>", 12);
                }
            }
        }
    };

    const adaptiveWeapon = {
        name: "adaptive exploit rifle",
        descriptionFunction() {
            const kills = ho.gunKills[this.name] || 0;
            const tier = kills >= 60 ? 4 : kills >= 35 ? 3 : kills >= 18 ? 2 : kills >= 8 ? 1 : 0;
            return `<strong>evolves on kill</strong><br>kills: <strong>${kills}</strong> tier: <strong>${tier}</strong>`;
        },
        ammo: 22,
        ammoPack: 5,
        defaultAmmoPack: 5,
        have: false,
        fire() {
            if (this.ammo <= 0) return;
            this.ammo--;
            const kills = ho.gunKills[this.name] || 0;
            const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
            const tier = kills >= 60 ? 4 : kills >= 35 ? 3 : kills >= 18 ? 2 : kills >= 8 ? 1 : 0;
            const pellets = 1 + tier;
            const spread = 0.04 + tier * 0.03;
            const speed = 48 + tier * 4;
            const dmg = 15 + tier * 5;
            for (let i = 0; i < pellets; i++) {
                const angle = Math.atan2(dir.y, dir.x) + (i - (pellets - 1) / 2) * spread;
                b.nail({ x: m.pos.x, y: m.pos.y }, { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }, dmg);
            }
            if (tier >= 2) b.explosion(simulation.mouseInGame, 28 + tier * 6);
            if (tier >= 3) b.laser(m.pos, simulation.mouseInGame, 45 + tier * 12);
            if (tier >= 4) simulation.inGameConsole("<span style='color:#0f0'>ADAPTIVE WEAPON TIER MAX</span>", 20);
        },
        do() { }
    };

    const summonKeys = "1234567890qwertyuiopasdfghjklzxcvbnm".split(""); // 36 keys
    const extraKeys = ["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8"]; // +8 => 44 summon techs
    const keyList = summonKeys.concat(extraKeys);

    const summonAtCursor = (tier, mode) => {
        if (!simulation?.mouseInGame || !Matter?.Bodies || !Matter?.Composite || !engine?.world) return;
        const x = simulation.mouseInGame.x;
        const y = simulation.mouseInGame.y;
        if (mode === "block") {
            const poly = Matter.Bodies.polygon(x, y, 4 + (tier % 5), 18 + tier * 1.3, {
                friction: 0.04,
                restitution: 0.45,
                density: 0.002,
                classType: "body"
            });
            body.push(poly);
            Matter.Composite.add(engine.world, poly);
        } else if (mode === "turret") {
            ho.constructs.push({ x, y, born: m.cycle, life: 650 + tier * 10, mode: "turret", power: 8 + tier * 0.6 });
        } else if (mode === "mine") {
            ho.constructs.push({ x, y, born: m.cycle, life: 420 + tier * 8, mode: "mine", power: 20 + tier * 1.2 });
        } else if (mode === "blast") {
            b.explosion({ x, y }, 35 + tier * 2);
        } else {
            ho.constructs.push({ x, y, born: m.cycle, life: 500 + tier * 8, mode: "drone", power: 10 + tier * 0.7 });
        }
    };

    const movementTechs = [
        ["hacker stride", "+8% movement acceleration", "speedStacks"],
        ["kernel leap", "+7% jump force", "jumpStacks"],
        ["air packet dash", "double-tap jump to dash in air", "airDash"],
        ["blink packet", "press shift to blink to cursor", "blink"],
        ["gravity patch", "small anti-gravity while airborne", "gravityShift"],
        ["regen sprint", "moving fast regenerates energy", "regenDash"],
        ["phase stride", "temporary invulnerability while dashing", "phaseStride"],
        ["hacker aura", "small passive damage bonus", "hackerAura"],
        ["recoil nullifier", "reduced knockback and drift", "recoilCancel"],
        ["overclocked locomotion", "all movement buffs amplified", "overclock"],
    ].map(([name, text, key]) => ({
        name,
        description: `<strong>${name}</strong><br>${text}`,
        isGunTech: false,
        maxCount: 3,
        count: 0,
        allowed() { return true; },
        requires: "",
        effect() { ho.movement[key] = (ho.movement[key] || 0) + 1; },
        remove() { ho.movement[key] = Math.max(0, (ho.movement[key] || 0) - 1); this.count = 0; }
    }));

    const hackerBuffTechs = Array.from({ length: 8 }, (_, i) => ({
        name: `hacker protocol ${i + 1}`,
        description: `<strong>hacker protocol ${i + 1}</strong><br>+${4 + i}% damage, +${2 + i}% mobility`,
        isGunTech: false,
        maxCount: 1,
        count: 0,
        allowed() { return true; },
        requires: "",
        effect() {
            ho.movement.hackerAura += 1;
            ho.movement.speedStacks += 1;
            ho.extraMobIntensity += 0.2;
        },
        remove() {
            ho.movement.hackerAura = Math.max(0, ho.movement.hackerAura - 1);
            ho.movement.speedStacks = Math.max(0, ho.movement.speedStacks - 1);
            ho.extraMobIntensity = Math.max(0, ho.extraMobIntensity - 0.2);
            this.count = 0;
        }
    }));

    const summonModes = ["block", "turret", "drone", "mine", "blast"];
    const summonTechs = keyList.map((key, idx) => ({
        name: `architect daemon ${idx + 1}`,
        description: `<strong>architect daemon ${idx + 1}</strong><br>press <strong>${key.toUpperCase()}</strong> to summon a ${summonModes[idx % summonModes.length]}`,
        isGunTech: false,
        maxCount: 1,
        count: 0,
        allowed() { return true; },
        requires: "architect's touch or hacker tech",
        effect() { ho.summonUnlocked[key] = { tier: idx + 1, mode: summonModes[idx % summonModes.length] }; },
        remove() { delete ho.summonUnlocked[key]; this.count = 0; }
    }));

    // 50+ working techs total = 10 movement + 8 hacker + 44 summon = 62
    const allNewTech = [...movementTechs, ...hackerBuffTechs, ...summonTechs];

    const registerTechsAndWeapons = () => {
        if (typeof b !== "undefined" && Array.isArray(b.guns)) {
            [lockOnSniper, adaptiveWeapon].forEach((gun) => {
                if (!b.guns.find((g) => g.name === gun.name)) b.guns.push(gun);
            });
        }
        if (typeof tech !== "undefined" && Array.isArray(tech.tech)) {
            allNewTech.forEach((entry) => {
                if (!tech.tech.find((t) => t.name === entry.name)) tech.tech.push(entry);
            });
        }
    };

    const applyMovement = () => {
        if (typeof m === "undefined") return;
        const speedMult = 1 + ho.movement.speedStacks * 0.08 + ho.movement.overclock * 0.03;
        const jumpMult = 1 + ho.movement.jumpStacks * 0.07 + ho.movement.overclock * 0.03;
        if (typeof tech !== "undefined" && typeof tech.baseJumpForce === "number") {
            m.jumpForce = tech.baseJumpForce * m.fieldJump * m.squirrelJump * jumpMult / player.mass / player.mass;
        }
        m.FxAir = (m.FxAir || 0.016) * (1 + ho.movement.recoilCancel * 0.01);
        m.airSpeedLimit = (m.airSpeedLimit || 125) * speedMult;
        if (ho.movement.gravityShift > 0 && !m.onGround && input.up) {
            player.force.y -= 0.0001 * ho.movement.gravityShift;
        }
        if (ho.movement.regenDash > 0 && Math.abs(m.Vx) > 7 && m.energy < m.maxEnergy) {
            m.energy = Math.min(m.maxEnergy, m.energy + 0.0012 * ho.movement.regenDash);
        }
        if (ho.movement.hackerAura > 0 && typeof tech?.damage === "number") {
            tech.damage = Math.max(tech.damage, 1 + ho.movement.hackerAura * 0.025);
        }
    };

    const updateConstructs = () => {
        if (!Array.isArray(ho.constructs)) return;
        ho.constructs = ho.constructs.filter((c) => m.cycle < c.born + c.life);
        for (let i = 0; i < ho.constructs.length; i++) {
            const c = ho.constructs[i];
            if (c.mode === "turret") {
                const target = getClosestMobToCursor(500);
                if (target && m.cycle % 18 === 0) {
                    const dir = Vector.normalise(Vector.sub(target.position, c));
                    b.nail({ x: c.x, y: c.y }, { x: dir.x * 35, y: dir.y * 35 }, c.power);
                }
            } else if (c.mode === "mine") {
                if (m.cycle % 45 === 0) b.explosion({ x: c.x, y: c.y }, 25 + c.power * 0.6);
            } else if (c.mode === "drone") {
                const target = getClosestMobToCursor(420);
                if (target && m.cycle % 20 === 0) b.laser({ x: c.x, y: c.y }, target.position, 20 + c.power);
            }
            simulation.drawList.push({ x: c.x, y: c.y, radius: 16, color: "rgba(0,255,120,0.25)", time: simulation.drawTime });
        }
    };

    const spawnMoreMobs = () => {
        if (typeof spawn === "undefined" || !spawn.randomMob || m.cycle < ho.nextMobSpawnCycle) return;
        const baseCount = 1 + Math.floor(ho.extraMobIntensity) + (simulation?.difficulty > 10 ? 1 : 0);
        for (let i = 0; i < baseCount; i++) {
            const x = m.pos.x + (Math.random() - 0.5) * 1200;
            const y = m.pos.y + (Math.random() - 0.5) * 650;
            spawn.randomMob(x, y, 1);
        }
        ho.nextMobSpawnCycle = m.cycle + Math.max(240, 520 - Math.floor(ho.extraMobIntensity * 60));
    };

    if (!ho.initialized) {
        window.addEventListener("keydown", (evt) => {
            const key = evt.key.toLowerCase();
            const summon = ho.summonUnlocked[key];
            if (summon) {
                const cdKey = `summon:${key}`;
                const last = ho.summonCooldowns[cdKey] || -9999;
                if (m.cycle > last + 28) {
                    ho.summonCooldowns[cdKey] = m.cycle;
                    summonAtCursor(summon.tier, summon.mode);
                    simulation.inGameConsole(`<span style='color:#0f0'>SUMMON ${summon.mode.toUpperCase()}</span> key:${key.toUpperCase()}`, 24);
                }
            }

            if (key === "shift" && ho.movement.blink > 0) {
                Matter.Body.setPosition(player, { x: simulation.mouseInGame.x, y: simulation.mouseInGame.y });
                if (ho.movement.phaseStride > 0) m.immuneCycle = m.cycle + 22 + ho.movement.phaseStride * 10;
            }
        });

        simulation.ephemera.push({
            name: "hacker-overhaul-core",
            do() {
                registerKill();
                applyMovement();
                updateConstructs();
                spawnMoreMobs();
                if (!ho.initedHUD) {
                    ho.initedHUD = true;
                    simulation.inGameConsole("<span style='color:#6cf'>HACKER OVERHAUL ACTIVE</span>", 90);
                }
            }
        });

        registerTechsAndWeapons();
        ho.initialized = true;
        console.log(`%c🧠 Hacker Overhaul Loaded: ${allNewTech.length} techs, lock-on sniper, adaptive weapon`, "color:#6cf;font-weight:bold;");
    }
})();


// Playtest Mega Update: 200+ new systems/items for chaos playtests
(function () {
    if (window.playtestMegaLoaded) return;
    window.playtestMegaLoaded = true;

    const state = window.playtestMegaState || {
        rideMobUnlocked: 0,
        ridingMobId: null,
        sungJinWooUnlocked: 0,
        summonPower: 0,
        shadowArmy: [],
        unlockSummonKeys: {},
        nextBiblicalWave: 0,
        nextChaosWave: 0,
    };
    window.playtestMegaState = state;

    const getClosestMob = (range = 180) => {
        if (!Array.isArray(mob)) return null;
        let best = null;
        let bestD2 = range * range;
        for (let i = 0; i < mob.length; i++) {
            const target = mob[i];
            if (!target || target.alive === false || !target.position) continue;
            const dx = target.position.x - m.pos.x;
            const dy = target.position.y - m.pos.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < bestD2) {
                best = target;
                bestD2 = d2;
            }
        }
        return best;
    };

    const doRideMob = () => {
        if (!state.rideMobUnlocked || !state.ridingMobId) return;
        const rider = mob.find(x => x && x.id === state.ridingMobId && x.alive !== false);
        if (!rider) {
            state.ridingMobId = null;
            simulation.inGameConsole("<span style='color:#ccc'>ride ended</span>", 20);
            return;
        }
        Matter.Body.setPosition(player, {
            x: rider.position.x,
            y: rider.position.y - (rider.radius || 40) - 26
        });
        Matter.Body.setVelocity(player, {
            x: rider.velocity?.x || 0,
            y: rider.velocity?.y || 0
        });
        m.immuneCycle = m.cycle + 2;
        simulation.drawList.push({
            x: rider.position.x,
            y: rider.position.y,
            radius: (rider.radius || 30) + 20,
            color: "rgba(0,255,170,0.2)",
            time: simulation.drawTime
        });
    };

    const spawnShadow = (x, y, power = 1) => {
        state.shadowArmy.push({ x, y, power, born: m.cycle, life: 600 + power * 40 });
    };

    const updateShadowArmy = () => {
        state.shadowArmy = state.shadowArmy.filter(s => s && m.cycle < s.born + s.life);
        for (let i = 0; i < state.shadowArmy.length; i++) {
            const s = state.shadowArmy[i];
            const target = getClosestMob(600);
            if (target && m.cycle % Math.max(12, 26 - state.sungJinWooUnlocked * 2) === 0) {
                const dir = Vector.normalise(Vector.sub(target.position, s));
                b.nail({ x: s.x, y: s.y }, { x: dir.x * (30 + s.power * 3), y: dir.y * (30 + s.power * 3) }, 8 + s.power * 3);
            }
            simulation.drawList.push({ x: s.x, y: s.y, radius: 14 + s.power * 1.5, color: "rgba(75,0,130,0.22)", time: simulation.drawTime });
            s.x += Math.sin((m.cycle + i * 7) * 0.09) * 0.9;
            s.y += Math.cos((m.cycle + i * 5) * 0.09) * 0.9;
        }
    };

    const biblicalMobNames = [
        "ophanim wheel", "seraphim host", "cherubim warden", "throne bearer", "dominion caster", "virtue sentinel",
        "power herald", "principality judge", "archon of rings", "many-eyed witness", "heavenly gyre", "flame choir"
    ];

    const spawnBiblicalWave = () => {
        if (!spawn?.randomMob) return;
        const count = 3 + Math.floor((simulation?.difficulty || 1) / 7);
        for (let i = 0; i < count; i++) {
            const x = m.pos.x + (Math.random() - 0.5) * 1600;
            const y = m.pos.y + (Math.random() - 0.5) * 900;
            spawn.randomMob(x, y, 1);
        }
        const name = biblicalMobNames[Math.floor(Math.random() * biblicalMobNames.length)];
        simulation.inGameConsole(`<span style='color:#ffd166'>BIBLICAL WAVE:</span> ${name} x${count}`, 55);
    };

    const chaosSpawnLoop = () => {
        if (m.cycle > state.nextBiblicalWave) {
            spawnBiblicalWave();
            state.nextBiblicalWave = m.cycle + Math.max(280, 560 - (simulation?.difficulty || 1) * 8);
        }
        if (m.cycle > state.nextChaosWave && spawn?.randomGroup) {
            spawn.randomGroup(m.pos.x + (Math.random() - 0.5) * 1200, m.pos.y + (Math.random() - 0.5) * 700, 1);
            state.nextChaosWave = m.cycle + 360;
        }
    };

    const makePlaytestWeapon = (idx) => ({
        name: `playtest relic ${idx}`,
        descriptionFunction() { return `chaos prototype #${idx} with mixed projectile patterns`; },
        ammo: 14 + (idx % 10),
        ammoPack: 3 + (idx % 4),
        defaultAmmoPack: 3 + (idx % 4),
        have: false,
        fire() {
            this.ammo--;
            const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
            const base = Math.atan2(dir.y, dir.x);
            const pellets = 2 + (idx % 4);
            for (let i = 0; i < pellets; i++) {
                const a = base + (i - (pellets - 1) / 2) * (0.08 + (idx % 3) * 0.04);
                b.nail({ x: m.pos.x, y: m.pos.y }, { x: Math.cos(a) * (36 + idx % 16), y: Math.sin(a) * (36 + idx % 16) }, 11 + (idx % 8));
            }
            if (idx % 3 === 0) b.explosion(simulation.mouseInGame, 20 + (idx % 7) * 8);
            if (idx % 5 === 0) b.laser(m.pos, simulation.mouseInGame, 20 + (idx % 6) * 12);
        },
        do() { }
    });

    const summonKeyPool = "1234567890qwertyuiopasdfghjklzxcvbnm".split("");

    const summonAtCursor = (tier) => {
        const x = simulation.mouseInGame.x;
        const y = simulation.mouseInGame.y;
        const mode = tier % 4;
        if (mode === 0) {
            const poly = Matter.Bodies.polygon(x, y, 3 + (tier % 5), 16 + tier * 0.5, spawn.propsIsNotHoldable);
            body.push(poly);
            Composite.add(engine.world, poly);
        } else if (mode === 1) {
            b.explosion({ x, y }, 24 + tier);
        } else if (mode === 2) {
            spawnShadow(x, y, 1 + Math.floor(tier / 10));
        } else {
            if (spawn?.randomMob) spawn.randomMob(x + (Math.random() - 0.5) * 140, y + (Math.random() - 0.5) * 140, 1);
        }
    };

    const specialTechs = [
        {
            name: "beast rider protocol",
            description: "<strong>beast rider protocol</strong><br>press <strong>R</strong> near a mob to ride it",
            isGunTech: false,
            maxCount: 1,
            count: 0,
            allowed() { return true; },
            requires: "",
            effect() { state.rideMobUnlocked = 1; },
            remove() { state.rideMobUnlocked = 0; state.ridingMobId = null; this.count = 0; }
        },
        {
            name: "shadow monarch core",
            description: "<strong>shadow monarch core</strong><br>gain Sung Jin-Woo style boosts + shadow summons",
            isGunTech: false,
            maxCount: 1,
            count: 0,
            allowed() { return true; },
            requires: "",
            effect() { state.sungJinWooUnlocked = 1; state.summonPower += 3; },
            remove() { state.sungJinWooUnlocked = 0; this.count = 0; }
        },
        {
            name: "monarch command",
            description: "<strong>monarch command</strong><br>spawns 5 shadow soldiers instantly",
            isGunTech: false,
            maxCount: 3,
            count: 0,
            allowed() { return true; },
            requires: "shadow monarch core",
            effect() {
                for (let i = 0; i < 5; i++) spawnShadow(m.pos.x + (Math.random() - 0.5) * 200, m.pos.y + (Math.random() - 0.5) * 120, 2 + this.count);
            },
            remove() { this.count = 0; }
        },
        {
            name: "angel eyes",
            description: "<strong>angel eyes</strong><br>reveals and weakens nearby mobs",
            isGunTech: false,
            maxCount: 2,
            count: 0,
            allowed() { return true; },
            requires: "",
            effect() { state.summonPower += 1; },
            remove() { state.summonPower = Math.max(0, state.summonPower - 1); this.count = 0; }
        },
    ];

    const funTechs = Array.from({ length: 120 }, (_, i) => ({
        name: `fun tech ${i + 1}`,
        description: `<strong>fun tech ${i + 1}</strong><br>playtest modifier +${(i % 9) + 2}% damage, +${(i % 5) + 1}% speed`,
        isGunTech: false,
        maxCount: 1,
        count: 0,
        allowed() { return true; },
        requires: "",
        effect() {
            tech.damage = (tech.damage || 1) * (1 + 0.01 * ((i % 9) + 2));
            m.airSpeedLimit = (m.airSpeedLimit || 125) * (1 + 0.005 * ((i % 5) + 1));
        },
        remove() { this.count = 0; }
    }));

    const summonTechs = Array.from({ length: 60 }, (_, i) => {
        const key = summonKeyPool[i % summonKeyPool.length];
        return {
            name: `summon sigil ${i + 1}`,
            description: `<strong>summon sigil ${i + 1}</strong><br>press <strong>${key.toUpperCase()}</strong> to summon chaos construct`,
            isGunTech: false,
            maxCount: 1,
            count: 0,
            allowed() { return true; },
            requires: "",
            effect() { state.unlockSummonKeys[key] = Math.max(state.unlockSummonKeys[key] || 0, i + 1); },
            remove() { if (state.unlockSummonKeys[key] === i + 1) delete state.unlockSummonKeys[key]; this.count = 0; }
        };
    });

    const appearanceTechs = Array.from({ length: 20 }, (_, i) => ({
        name: `playtest aura ${i + 1}`,
        description: `<strong>playtest aura ${i + 1}</strong><br>visual aura layer ${i + 1}`,
        isGunTech: false,
        maxCount: 1,
        count: 0,
        allowed() { return true; },
        requires: "",
        effect() { state.summonPower += 0.2; },
        remove() { this.count = 0; }
    }));

    const playtestWeapons = Array.from({ length: 30 }, (_, i) => makePlaytestWeapon(i + 1));
    const allTech = [...specialTechs, ...funTechs, ...summonTechs, ...appearanceTechs];

    const registerAll = () => {
        if (Array.isArray(b?.guns)) {
            playtestWeapons.forEach(g => {
                if (!b.guns.find(x => x.name === g.name)) b.guns.push(g);
            });
        }
        if (Array.isArray(tech?.tech)) {
            allTech.forEach(t => {
                if (!tech.tech.find(x => x.name === t.name)) tech.tech.push(t);
            });
        }
    };

    window.addEventListener("keydown", (e) => {
        const key = e.key.toLowerCase();

        if (key === "r" && state.rideMobUnlocked) {
            if (state.ridingMobId) {
                state.ridingMobId = null;
                simulation.inGameConsole("<span style='color:#8ecae6'>dismounted</span>", 30);
            } else {
                const target = getClosestMob(220);
                if (target) {
                    state.ridingMobId = target.id;
                    simulation.inGameConsole(`<span style='color:#8ecae6'>mounted mob #${target.id ?? '?'}</span>`, 30);
                }
            }
        }

        const tier = state.unlockSummonKeys[key];
        if (tier && simulation?.mouseInGame) {
            summonAtCursor(tier);
            simulation.inGameConsole(`<span style='color:#90be6d'>summon sigil</span> key ${key.toUpperCase()} tier ${tier}`, 20);
        }
    });

    const ephemeraTick = {
        name: "playtest-mega-core",
        do() {
            doRideMob();
            updateShadowArmy();
            chaosSpawnLoop();

            if (state.sungJinWooUnlocked) {
                m.immuneCycle = Math.max(m.immuneCycle, m.cycle + 1);
                tech.damage = Math.max(tech.damage || 1, 1.4 + state.summonPower * 0.03);
                m.energy = Math.min(m.maxEnergy, m.energy + 0.0025);
                if (m.cycle % 120 === 0) spawnShadow(m.pos.x + (Math.random() - 0.5) * 120, m.pos.y + (Math.random() - 0.5) * 120, 2 + Math.floor(state.summonPower * 0.2));
            }

            if (state.summonPower > 0) {
                simulation.drawList.push({
                    x: m.pos.x,
                    y: m.pos.y,
                    radius: 26 + state.summonPower,
                    color: `hsla(${(m.cycle * 2) % 360}, 100%, 60%, 0.18)`,
                    time: simulation.drawTime
                });
            }
        }
    };

    const attach = () => {
        registerAll();
        if (Array.isArray(simulation?.ephemera) && !simulation.ephemera.find(e => e.name === ephemeraTick.name)) {
            simulation.ephemera.push(ephemeraTick);
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => setTimeout(attach, 400));
    } else {
        setTimeout(attach, 400);
    }

    const totalNewThings = playtestWeapons.length + allTech.length + biblicalMobNames.length;
    console.log(`%c🔥 Playtest Mega Update Loaded: ${totalNewThings} new things`, "color:#ff4d6d;font-weight:bold;");
})();


// Killforge Arsenal: 40+ weapons that upgrade with kills, including a nuke weapon and modeled projectiles
(function () {
    if (window.killforgeArsenalLoaded) return;
    window.killforgeArsenalLoaded = true;

    const state = window.killforgeState || {
        deadIds: new Set(),
        killsByGun: {},
        colorShift: 0,
        weaponHue: 0,
    };
    window.killforgeState = state;

    const markKills = () => {
        if (!Array.isArray(mob)) return;
        for (let i = 0; i < mob.length; i++) {
            const target = mob[i];
            if (!target || target.alive !== false) continue;
            const id = target.id ?? `m${i}:${Math.round(target.position?.x || 0)}:${Math.round(target.position?.y || 0)}`;
            if (state.deadIds.has(id)) continue;
            state.deadIds.add(id);
            if (b.activeGun !== null && b.guns[b.activeGun]) {
                const gunName = b.guns[b.activeGun].name;
                state.killsByGun[gunName] = (state.killsByGun[gunName] || 0) + 1;
            }
        }
    };

    const spawnDetailedProjectile = (x, y, angle, speed, tier, colorA, colorB) => {
        const core = Bodies.circle(x, y, 8 + tier, spawn.propsIsNotHoldable);
        const ring = Bodies.polygon(x, y, 6, 12 + tier, spawn.propsIsNotHoldable);
        const fin1 = Bodies.rectangle(x + 12, y + 6, 18, 4, spawn.propsIsNotHoldable);
        const fin2 = Bodies.rectangle(x + 12, y - 6, 18, 4, spawn.propsIsNotHoldable);
        const missile = Body.create({ parts: [core, ring, fin1, fin2] });
        Body.rotate(missile, angle);
        missile.collisionFilter.category = cat.bullet;
        missile.collisionFilter.mask = cat.mob | cat.mobBullet | cat.body;
        missile.endCycle = m.cycle + 45 + tier * 6;
        missile.colorA = colorA;
        missile.colorB = colorB;
        missile.blast = 20 + tier * 10;
        missile.pierce = tier >= 3;
        missile.damageScale = 12 + tier * 5;
        missile.do = function () {
            if (this.endCycle < m.cycle) {
                b.explosion(this.position, this.blast);
                Composite.remove(engine.world, this);
                const idx = bullet.indexOf(this);
                if (idx !== -1) bullet.splice(idx, 1);
                return;
            }
            simulation.drawList.push({ x: this.position.x, y: this.position.y, radius: 10 + tier * 2, color: this.colorA, time: simulation.drawTime });
            if (m.cycle % 3 === 0) simulation.drawList.push({ x: this.position.x, y: this.position.y, radius: 6 + tier, color: this.colorB, time: simulation.drawTime });
            if (m.cycle % 8 === 0) {
                const target = mob.find(v => v && v.alive !== false && v.position && Vector.magnitudeSquared(Vector.sub(v.position, this.position)) < (130 + tier * 40) ** 2);
                if (target) {
                    target.damage((0.12 + tier * 0.06), true);
                    if (!this.pierce) {
                        b.explosion(this.position, this.blast);
                        Composite.remove(engine.world, this);
                        const idx = bullet.indexOf(this);
                        if (idx !== -1) bullet.splice(idx, 1);
                    }
                }
            }
        };
        Composite.add(engine.world, missile);
        Matter.Body.setVelocity(missile, { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed });
        bullet.push(missile);
    };

    const makeKillforgeWeapon = (name, colorA, colorB, ammoBase, mode) => ({
        name,
        descriptionFunction() {
            const k = state.killsByGun[this.name] || 0;
            const tier = Math.min(6, Math.floor(k / 8));
            return `<strong>Killforge</strong> weapon<br>kills: <strong>${k}</strong> tier: <strong>${tier}</strong>`;
        },
        ammo: ammoBase,
        ammoPack: Math.max(2, Math.floor(ammoBase / 5)),
        defaultAmmoPack: Math.max(2, Math.floor(ammoBase / 5)),
        have: false,
        fire() {
            this.ammo--;
            const kills = state.killsByGun[this.name] || 0;
            const tier = Math.min(6, Math.floor(kills / 8));
            const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
            const angle = Math.atan2(dir.y, dir.x);

            if (mode === "nuke") {
                const x = m.pos.x + Math.cos(angle) * 26;
                const y = m.pos.y + Math.sin(angle) * 26;
                spawnDetailedProjectile(x, y, angle, 16 + tier * 1.3, 3 + tier, "rgba(255,80,80,0.35)", "rgba(255,220,120,0.2)");
                if (tier >= 2) {
                    setTimeout(() => b.explosion(simulation.mouseInGame, 90 + tier * 16), 380);
                }
                return;
            }

            const shots = 1 + (tier >= 2 ? 1 : 0) + (tier >= 5 ? 1 : 0);
            const spread = 0.05 + tier * 0.01;
            for (let i = 0; i < shots; i++) {
                const a = angle + (i - (shots - 1) / 2) * spread;
                const x = m.pos.x + Math.cos(a) * 24;
                const y = m.pos.y + Math.sin(a) * 24;
                spawnDetailedProjectile(x, y, a, 22 + tier * 2.3, tier, colorA, colorB);
            }
            if (tier >= 4) b.laser(m.pos, simulation.mouseInGame, 14 + tier * 6);
        },
        do() {
            if (b.activeGun !== null && b.guns[b.activeGun]?.name === this.name) {
                const hue = (m.cycle * 2 + (state.killsByGun[this.name] || 0) * 3) % 360;
                simulation.drawList.push({ x: m.pos.x + Math.cos(m.angle) * 32, y: m.pos.y + Math.sin(m.angle) * 32, radius: 9, color: `hsla(${hue},100%,60%,0.35)`, time: simulation.drawTime });
            }
        }
    });

    const weaponNames = [
        "killforge alpha", "killforge beta", "killforge gamma", "killforge delta", "killforge epsilon", "killforge zeta", "killforge eta", "killforge theta",
        "killforge iota", "killforge kappa", "killforge lambda", "killforge mu", "killforge nu", "killforge xi", "killforge omicron", "killforge pi",
        "killforge rho", "killforge sigma", "killforge tau", "killforge upsilon", "killforge phi", "killforge chi", "killforge psi", "killforge omega",
        "phantom forge 1", "phantom forge 2", "phantom forge 3", "phantom forge 4", "phantom forge 5", "phantom forge 6", "phantom forge 7", "phantom forge 8",
        "arc forge 1", "arc forge 2", "arc forge 3", "arc forge 4", "arc forge 5", "arc forge 6", "arc forge 7", "arc forge 8", "arc forge 9"
    ]; // 41

    const killforgeWeapons = weaponNames.map((n, i) => {
        const hue = (i * 29) % 360;
        const colorA = `hsla(${hue},100%,62%,0.28)`;
        const colorB = `hsla(${(hue + 140) % 360},100%,58%,0.2)`;
        return makeKillforgeWeapon(n, colorA, colorB, 12 + (i % 10), "normal");
    });
    killforgeWeapons.push(makeKillforgeWeapon("killforge nuke", "rgba(255,70,70,0.34)", "rgba(255,235,120,0.22)", 6, "nuke")); // 42

    const colorTechs = [
        {
            name: "humanoid shell",
            description: "<strong>humanoid shell</strong><br>renders a humanoid overlay that follows player motion",
            isGunTech: false,
            maxCount: 1,
            count: 0,
            allowed() { return true; },
            requires: "",
            effect() { state.humanoid = 1; },
            remove() { state.humanoid = 0; this.count = 0; }
        }
    ];

    const animatedColorTechs = Array.from({ length: 28 }, (_, i) => ({
        name: `animated spectrum ${i + 1}`,
        description: `<strong>animated spectrum ${i + 1}</strong><br>adds animated color layer to player and active weapon`,
        isGunTech: false,
        maxCount: 1,
        count: 0,
        allowed() { return true; },
        requires: "",
        effect() { state.colorShift += 1; },
        remove() { state.colorShift = Math.max(0, state.colorShift - 1); this.count = 0; }
    }));

    const register = () => {
        if (Array.isArray(b?.guns)) {
            killforgeWeapons.forEach(g => {
                if (!b.guns.find(existing => existing.name === g.name)) b.guns.push(g);
            });
        }
        if (Array.isArray(tech?.tech)) {
            [...colorTechs, ...animatedColorTechs].forEach(t => {
                if (!tech.tech.find(existing => existing.name === t.name)) tech.tech.push(t);
            });
        }
    };

    const drawHumanoidAndWeaponFX = () => {
        markKills();

        if (state.humanoid) {
            const x = m.pos.x;
            const y = m.pos.y;
            simulation.drawList.push({ x, y: y - 30, radius: 10, color: "rgba(255,220,190,0.35)", time: simulation.drawTime }); // head
            simulation.drawList.push({ x, y: y - 10, radius: 14, color: "rgba(90,170,255,0.24)", time: simulation.drawTime }); // torso
            simulation.drawList.push({ x: x - 14, y: y - 8, radius: 7, color: "rgba(90,170,255,0.2)", time: simulation.drawTime });
            simulation.drawList.push({ x: x + 14, y: y - 8, radius: 7, color: "rgba(90,170,255,0.2)", time: simulation.drawTime });
            simulation.drawList.push({ x: x - 7, y: y + 16, radius: 8, color: "rgba(90,170,255,0.18)", time: simulation.drawTime });
            simulation.drawList.push({ x: x + 7, y: y + 16, radius: 8, color: "rgba(90,170,255,0.18)", time: simulation.drawTime });
        }

        if (state.colorShift > 0) {
            const hue = (m.cycle * (1 + state.colorShift * 0.03)) % 360;
            simulation.drawList.push({ x: m.pos.x, y: m.pos.y, radius: 24 + state.colorShift * 0.7, color: `hsla(${hue},100%,60%,0.22)`, time: simulation.drawTime });
            if (b.activeGun !== null && b.guns[b.activeGun]) {
                const p = { x: m.pos.x + Math.cos(m.angle) * 36, y: m.pos.y + Math.sin(m.angle) * 36 };
                simulation.drawList.push({ x: p.x, y: p.y, radius: 11 + state.colorShift * 0.3, color: `hsla(${(hue + 120) % 360},100%,60%,0.26)`, time: simulation.drawTime });
            }
        }
    };

    const attach = () => {
        register();
        if (Array.isArray(simulation?.ephemera) && !simulation.ephemera.find(e => e.name === "killforge-core")) {
            simulation.ephemera.push({ name: "killforge-core", do: drawHumanoidAndWeaponFX });
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => setTimeout(attach, 400));
    } else {
        setTimeout(attach, 400);
    }

    console.log(`%c⚙️ Killforge Arsenal Loaded: ${killforgeWeapons.length} upgrading weapons + ${1 + animatedColorTechs.length} color/humanoid techs`, "color:#7c3aed;font-weight:bold;");
})();


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


// Field Recovery Fixes: re-enable broken field usage for modded runs
(function () {
    if (window.fieldRecoveryFixLoaded) return;
    window.fieldRecoveryFixLoaded = true;

    const safeRebuildField = () => {
        if (typeof m === 'undefined') return;
        if (!Array.isArray(m.fieldUpgrades)) m.fieldUpgrades = [];
        if (typeof m.fieldMode !== 'number' || m.fieldMode < 0 || m.fieldMode >= m.fieldUpgrades.length) {
            m.fieldMode = 0;
        }
        if (typeof m.setField === 'function' && m.fieldUpgrades.length > 0) {
            try {
                const name = m.fieldUpgrades[m.fieldMode]?.name || m.fieldUpgrades[0]?.name;
                if (name) m.setField(name);
            } catch (_) {
                // no-op safety fallback
            }
        }
    };

    const addRecoveryTech = () => {
        if (!Array.isArray(tech?.tech)) return;
        const entry = {
            name: 'field recovery patch',
            description: '<strong>field recovery patch</strong><br>rebuilds field state and restores usable field mode',
            isGunTech: false,
            maxCount: 1,
            count: 0,
            allowed() { return true; },
            requires: '',
            effect() {
                safeRebuildField();
                simulation?.inGameConsole("<span style='color:#7bdff2'>field system recovered</span>", 50);
            },
            remove() { this.count = 0; }
        };
        if (!tech.tech.find(t => t.name === entry.name)) tech.tech.push(entry);
    };

    window.addEventListener('keydown', (e) => {
        if (e.key === 'F8') {
            safeRebuildField();
            simulation?.inGameConsole("<span style='color:#7bdff2'>F8 field recovery applied</span>", 45);
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addRecoveryTech);
    } else {
        setTimeout(addRecoveryTech, 300);
    }

    if (Array.isArray(simulation?.ephemera)) {
        simulation.ephemera.push({
            name: 'field-recovery-watchdog',
            do() {
                if (typeof m === 'undefined') return;
                if (m.cycle % 300 === 0 && (!Array.isArray(m.fieldUpgrades) || m.fieldUpgrades.length === 0)) {
                    safeRebuildField();
                }
            }
        });
    }

    console.log('%c🛠️ Field recovery fixes loaded (F8 quick restore)', 'color:#7bdff2;font-weight:bold;');
})();


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


// Legacy custom weapons + integration for large arsenal/bot-tech packs
(function () {
    const coreWeapons = [
        {
            name: "plasma blade",
            descriptionFunction() { return "Melee energy weapon with fast attacks"; },
            ammo: Infinity,
            ammoPack: 0,
            have: false,
            fire() {
                const angle = Math.atan2(simulation.mouseInGame.y - m.pos.y, simulation.mouseInGame.x - m.pos.x);
                for (let i = -2; i <= 2; i++) {
                    const spread = angle + i * 0.1;
                    b.nail({ x: m.pos.x + Math.cos(spread) * 50, y: m.pos.y + Math.sin(spread) * 50 }, { x: Math.cos(spread) * 25, y: Math.sin(spread) * 25 }, 15);
                }
            },
            do() { }
        },
        {
            name: "void cannon",
            descriptionFunction() { return "Fires slow-moving black holes that pull enemies"; },
            ammo: 8,
            ammoPack: 2,
            defaultAmmoPack: 2,
            have: false,
            fire() {
                this.ammo--;
                const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
                b.missile({ x: m.pos.x, y: m.pos.y }, -Math.atan2(dir.x, dir.y) - Math.PI / 2, 0, 80);
                for (let i = 0; i < 3; i++) setTimeout(() => b.explosion(simulation.mouseInGame, 40 + i * 20), i * 100);
            },
            do() { }
        },
        {
            name: "thunder staff",
            descriptionFunction() { return "Chain lightning that jumps between enemies"; },
            ammo: 15,
            ammoPack: 3,
            defaultAmmoPack: 3,
            have: false,
            fire() {
                this.ammo--;
                b.laser(m.pos, simulation.mouseInGame, 100);
                for (let i = 0; i < 5; i++) {
                    const offset = { x: (Math.random() - 0.5) * 200, y: (Math.random() - 0.5) * 200 };
                    b.laser(simulation.mouseInGame, { x: simulation.mouseInGame.x + offset.x, y: simulation.mouseInGame.y + offset.y }, 50);
                }
            },
            do() { }
        },
        {
            name: "frost bow",
            descriptionFunction() { return "Freezing arrows that slow and damage"; },
            ammo: 20,
            ammoPack: 4,
            defaultAmmoPack: 4,
            have: false,
            fire() {
                this.ammo--;
                const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
                b.nail({ x: m.pos.x, y: m.pos.y }, { x: dir.x * 40, y: dir.y * 40 }, 25);
                b.nail({ x: m.pos.x, y: m.pos.y }, { x: dir.x * 38, y: dir.y * 40 + 2 }, 20);
                b.nail({ x: m.pos.x, y: m.pos.y }, { x: dir.x * 38, y: dir.y * 40 - 2 }, 20);
            },
            do() { }
        },
        {
            name: "gravity gun",
            descriptionFunction() { return "Manipulates gravity, pulls and pushes objects"; },
            ammo: 12,
            ammoPack: 2,
            defaultAmmoPack: 2,
            have: false,
            fire() { this.ammo--; b.explosion(simulation.mouseInGame, 150); },
            do() { }
        },
        {
            name: "particle accelerator",
            descriptionFunction() { return "Fires supercharged particles in a beam"; },
            ammo: 6,
            ammoPack: 1,
            defaultAmmoPack: 1,
            have: false,
            fire() {
                this.ammo--;
                for (let i = 0; i < 15; i++) {
                    setTimeout(() => {
                        const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
                        b.nail({ x: m.pos.x, y: m.pos.y }, { x: dir.x * 60, y: dir.y * 60 }, 8);
                    }, i * 30);
                }
            },
            do() { }
        },
        {
            name: "soul reaper",
            descriptionFunction() { return "Drains life from enemies, heals you"; },
            ammo: 10,
            ammoPack: 2,
            defaultAmmoPack: 2,
            have: false,
            fire() { this.ammo--; b.laser(m.pos, simulation.mouseInGame, 35); m.health = Math.min(m.maxHealth, m.health + 0.05); },
            do() { }
        },
        {
            name: "quantum rifle",
            descriptionFunction() { return "Shots exist in multiple positions simultaneously"; },
            ammo: 16,
            ammoPack: 3,
            defaultAmmoPack: 3,
            have: false,
            fire() {
                this.ammo--;
                for (let i = 0; i < 3; i++) {
                    const offset = { x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100 };
                    const target = { x: simulation.mouseInGame.x + offset.x, y: simulation.mouseInGame.y + offset.y };
                    const dir = Vector.normalise(Vector.sub(target, m.pos));
                    b.nail({ x: m.pos.x, y: m.pos.y }, { x: dir.x * 35, y: dir.y * 35 }, 18);
                }
            },
            do() { }
        },
        {
            name: "inferno cannon",
            descriptionFunction() { return "Shoots waves of fire that burn areas"; },
            ammo: 12,
            ammoPack: 2,
            defaultAmmoPack: 2,
            have: false,
            fire() {
                this.ammo--;
                b.explosion(simulation.mouseInGame, 80);
                for (let i = 0; i < 4; i++) {
                    const angle = (Math.PI * 2 * i) / 4;
                    const target = { x: simulation.mouseInGame.x + Math.cos(angle) * 100, y: simulation.mouseInGame.y + Math.sin(angle) * 100 };
                    b.explosion(target, 50);
                }
            },
            do() { }
        },
        {
            name: "ice spear",
            descriptionFunction() { return "Crystalline projectiles that can pierce"; },
            ammo: 18,
            ammoPack: 3,
            defaultAmmoPack: 3,
            have: false,
            fire() { this.ammo--; const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos)); b.nail({ x: m.pos.x, y: m.pos.y }, { x: dir.x * 50, y: dir.y * 50 }, 30); },
            do() { }
        },
        {
            name: "chaos staff",
            descriptionFunction() { return "Unpredictable magic that damages everything nearby"; },
            ammo: 10,
            ammoPack: 2,
            defaultAmmoPack: 2,
            have: false,
            fire() {
                this.ammo--;
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI * 2 * i) / 6 + (Math.random() - 0.5) * 0.5;
                    b.nail({ x: m.pos.x, y: m.pos.y }, { x: Math.cos(angle) * 35, y: Math.sin(angle) * 35 }, 15);
                }
            },
            do() { }
        },
        {
            name: "void strike",
            descriptionFunction() { return "Attacks with the power of nothingness"; },
            ammo: 8,
            ammoPack: 1,
            defaultAmmoPack: 1,
            have: false,
            fire() { this.ammo--; const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos)); b.missile({ x: m.pos.x, y: m.pos.y }, -Math.atan2(dir.x, dir.y) - Math.PI / 2, 0, 100); },
            do() { }
        },
        {
            name: "ivory",
            descriptionFunction() { return "Twin-gun: fast precision shots that mark targets"; },
            ammo: 28,
            ammoPack: 6,
            defaultAmmoPack: 6,
            have: false,
            fire() {
                this.ammo--;
                const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
                b.nail({ x: m.pos.x, y: m.pos.y }, { x: dir.x * 54, y: dir.y * 54 }, 14);
                b.laser(m.pos, simulation.mouseInGame, 22);
                if (b.guns.find(g => g.name === 'ebony' && g.have)) {
                    b.nail({ x: m.pos.x, y: m.pos.y }, { x: dir.x * 48, y: dir.y * 48 }, 10);
                }
            },
            do() { }
        },
        {
            name: "ebony",
            descriptionFunction() { return "Twin-gun: wider shadow bursts that pair with ivory"; },
            ammo: 26,
            ammoPack: 6,
            defaultAmmoPack: 6,
            have: false,
            fire() {
                this.ammo--;
                const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
                const base = Math.atan2(dir.y, dir.x);
                for (let i = -1; i <= 1; i++) {
                    const a = base + i * 0.08;
                    b.nail({ x: m.pos.x, y: m.pos.y }, { x: Math.cos(a) * 46, y: Math.sin(a) * 46 }, 12);
                }
                if (b.guns.find(g => g.name === 'ivory' && g.have)) {
                    b.explosion(simulation.mouseInGame, 24);
                }
            },
            do() { }
        },
        {
            name: "sonic guitar",
            descriptionFunction() { return "Summons a guitar model and fires wave-like sound ammo"; },
            ammo: 18,
            ammoPack: 4,
            defaultAmmoPack: 4,
            have: false,
            fire() {
                this.ammo--;
                const x = m.pos.x;
                const y = m.pos.y;
                const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
                const angle = Math.atan2(dir.y, dir.x);

                const body = Bodies.circle(x, y, 18, spawn.propsIsNotHoldable);
                const neck = Bodies.rectangle(x + 28, y - 2, 52, 10, spawn.propsIsNotHoldable);
                const head = Bodies.circle(x + 54, y - 2, 7, spawn.propsIsNotHoldable);
                const guitar = Body.create({ parts: [body, neck, head] });
                Body.rotate(guitar, angle);
                Composite.add(engine.world, guitar);
                guitar.collisionFilter.category = cat.bullet;
                guitar.collisionFilter.mask = cat.mob | cat.mobBullet;
                Matter.Body.setVelocity(guitar, { x: dir.x * 24, y: dir.y * 24 });
                guitar.endCycle = m.cycle + 45;
                guitar.do = function () {
                    if (this.endCycle < m.cycle) {
                        b.explosion(this.position, 34);
                        Composite.remove(engine.world, this);
                        const idx = bullet.indexOf(this);
                        if (idx !== -1) bullet.splice(idx, 1);
                        return;
                    }
                    for (let i = 0; i < 3; i++) {
                        const a = angle + Math.sin((m.cycle + i * 8) * 0.2) * 0.35;
                        b.laser(this.position, { x: this.position.x + Math.cos(a) * 120, y: this.position.y + Math.sin(a) * 120 }, 12);
                    }
                };
                bullet.push(guitar);

                for (let i = 0; i < 5; i++) {
                    const a = angle + (i - 2) * 0.18;
                    b.laser({ x, y }, { x: x + Math.cos(a) * 220, y: y + Math.sin(a) * 220 }, 16);
                }
            },
            do() { }
        }
    ];

    const generalTechs = [
        { name: "origami mastery", description: "<strong>origami mastery</strong><br>Your bots fold into protective paper forms, +20% bot durability", isGunTech: false, maxCount: 3, count: 0, allowed() { return true; }, requires: "", effect() { }, remove() { this.count = 0; } },
        { name: "angelic blessing", description: "<strong>angelic blessing</strong><br>Summon biblically accurate angel bots that orbit and protect", isGunTech: false, maxCount: 1, count: 0, allowed() { return true; }, requires: "", effect() { }, remove() { this.count = 0; } },
        { name: "demonic pact", description: "<strong>demonic pact</strong><br>Summon demonic bots that aggressively attack enemies", isGunTech: false, maxCount: 1, count: 0, allowed() { return true; }, requires: "", effect() { }, remove() { this.count = 0; } },
        { name: "celestial harmony", description: "<strong>celestial harmony</strong><br>Angel and demon bots work together, +50% damage", isGunTech: false, maxCount: 1, count: 0, allowed() { return tech.tech.find(t => t.name === "angelic blessing")?.count > 0 && tech.tech.find(t => t.name === "demonic pact")?.count > 0; }, requires: "angelic blessing, demonic pact", effect() { }, remove() { this.count = 0; } },
        { name: "ore magnetism", description: "<strong>ore magnetism</strong><br>Automatically collect nearby ore drops", isGunTech: false, maxCount: 1, count: 0, allowed() { return true; }, requires: "", effect() { }, remove() { this.count = 0; } },
        { name: "potion mastery", description: "<strong>potion mastery</strong><br>Potions last 50% longer", isGunTech: false, maxCount: 3, count: 0, allowed() { return true; }, requires: "", effect() { }, remove() { this.count = 0; } },
        { name: "merchant's favor", description: "<strong>merchant's favor</strong><br>15% discount on all marketplace purchases", isGunTech: false, maxCount: 3, count: 0, allowed() { return true; }, requires: "", effect() { }, remove() { this.count = 0; } },
        { name: "void touched", description: "<strong>void touched</strong><br>Phase through enemies briefly after being hit", isGunTech: false, maxCount: 1, count: 0, allowed() { return true; }, requires: "", effect() { }, remove() { this.count = 0; } },
        { name: "cosmic attunement", description: "<strong>cosmic attunement</strong><br>+25% damage with cosmic ore weapons", isGunTech: false, maxCount: 1, count: 0, allowed() { return true; }, requires: "", effect() { }, remove() { this.count = 0; } },
        { name: "elemental fusion", description: "<strong>elemental fusion</strong><br>Combine fire and ice for steam explosions", isGunTech: false, maxCount: 1, count: 0, allowed() { return true; }, requires: "", effect() { }, remove() { this.count = 0; } }
    ];

    const weaponPacks = [
        ...coreWeapons,
        ...(Array.isArray(window.ngonArsenalWeapons) ? window.ngonArsenalWeapons : [])
    ];

    const techPacks = [
        ...generalTechs,
        ...(Array.isArray(window.ngonBotTechs) ? window.ngonBotTechs : [])
    ];

    if (typeof b !== "undefined" && b.guns) {
        weaponPacks.forEach(gun => {
            if (!b.guns.find(g => g.name === gun.name)) b.guns.push(gun);
        });
    }

    if (typeof tech !== "undefined" && tech.tech) {
        techPacks.forEach(entry => {
            if (!tech.tech.find(existing => existing.name === entry.name)) tech.tech.push(entry);
        });
    }

    console.log(`%c⚔️ Arsenal Loaded! ${weaponPacks.length} weapons + ${techPacks.length} techs`, "color: #e67e22; font-weight: bold;");
})();


// ===== AI ARSENAL PROTOCOL =====
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
                    state.aiForge.generatedName = `ai-forged ${state.aiForge.prompt.slice(0, 18) || 'prototype'}`;
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
