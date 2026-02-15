/*
  Big Arsenal Update (single downloadable file)
  Includes:
  - 24 extra weapons
  - 12 bot techs
  - 34 scythe remix weapons + scythe remix tech
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


// 32+ scythe remixes inspired by the provided scythe mod style
(function () {
    const ensureScytheState = () => {
        if (typeof tech === "undefined") return;
        if (typeof tech.scytheRemixDamageMult !== "number") tech.scytheRemixDamageMult = 1;
        if (typeof tech.scytheRemixDrainMult !== "number") tech.scytheRemixDrainMult = 1;
    };

    const paintSlash = (x, y, color, size = 28) => {
        if (!simulation || !simulation.drawList) return;
        simulation.drawList.push({
            x,
            y,
            radius: size,
            color,
            time: simulation.drawTime
        });
    };

    const createRemixScythe = (cfg) => ({
        name: cfg.name,
        descriptionFunction() {
            return `throw a <b>${cfg.displayName}</b> in a <strong style="color:${cfg.color}">${cfg.styleWord}</strong> style<br>drains <strong class='color-h'>health</strong> instead of ammunition<br><span style="color:${cfg.color}">${cfg.abilityText}</span>`;
        },
        ammo: Infinity,
        ammoPack: Infinity,
        defaultAmmoPack: Infinity,
        have: false,
        fire() {
            if (this.cycle > m.cycle) return;
            ensureScytheState();
            const drain = cfg.drain * (tech?.scytheRemixDrainMult || 1);
            if (tech?.isEnergyHealth) {
                if (m.energy <= drain + 0.02) return;
                m.energy -= drain;
            } else {
                if (m.health <= drain + 0.05) return;
                m.health -= drain;
                if (m.displayHealth) m.displayHealth();
            }

            this.cycle = m.cycle + cfg.cooldown;
            const baseDamage = cfg.damage * (tech?.scytheRemixDamageMult || 1);
            const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
            const angle = Math.atan2(dir.y, dir.x);
            const target = { x: simulation.mouseInGame.x, y: simulation.mouseInGame.y };

            const totalBlades = cfg.blades + (tech?.scytheRemixExtraBlade ? 1 : 0);
            for (let i = 0; i < totalBlades; i++) {
                const spread = (i - (totalBlades - 1) / 2) * cfg.spread;
                const a = angle + spread;
                const v = { x: Math.cos(a) * cfg.speed, y: Math.sin(a) * cfg.speed };
                const origin = {
                    x: m.pos.x + Math.cos(a) * 24,
                    y: m.pos.y + Math.sin(a) * 24,
                };
                b.nail(origin, v, baseDamage);
                paintSlash(origin.x, origin.y, cfg.color, 16 + i * 2);
            }

            if (tech?.scytheRemixArc) {
                b.laser(m.pos, target, Math.round(baseDamage * 1.2));
            }

            if (cfg.mode === "nova") {
                for (let i = 0; i < 8; i++) {
                    const a = (Math.PI * 2 * i) / 8;
                    b.nail({ x: m.pos.x, y: m.pos.y }, { x: Math.cos(a) * (cfg.speed * 0.7), y: Math.sin(a) * (cfg.speed * 0.7) }, baseDamage * 0.75);
                }
                paintSlash(m.pos.x, m.pos.y, cfg.accent, 42);
            } else if (cfg.mode === "quake") {
                b.explosion(target, cfg.blast);
                setTimeout(() => b.explosion({ x: target.x + 50, y: target.y - 30 }, Math.round(cfg.blast * 0.6)), 120);
                setTimeout(() => b.explosion({ x: target.x - 50, y: target.y + 30 }, Math.round(cfg.blast * 0.6)), 220);
                paintSlash(target.x, target.y, cfg.color, cfg.blast * 0.7);
            } else if (cfg.mode === "chain") {
                b.laser(m.pos, target, Math.round(baseDamage * 2.2));
                for (let i = 0; i < 3; i++) {
                    b.laser(target, {
                        x: target.x + (Math.random() - 0.5) * 180,
                        y: target.y + (Math.random() - 0.5) * 180,
                    }, Math.round(baseDamage));
                }
                paintSlash(target.x, target.y, cfg.accent, 30);
            } else if (cfg.mode === "orbit") {
                for (let i = 0; i < 6; i++) {
                    const a = angle + (Math.PI * 2 * i) / 6;
                    const pos = { x: m.pos.x + Math.cos(a) * 80, y: m.pos.y + Math.sin(a) * 80 };
                    b.nail(pos, { x: Math.cos(a) * 12, y: Math.sin(a) * 12 }, baseDamage * 0.55);
                    paintSlash(pos.x, pos.y, cfg.color, 18);
                }
            }
        },
        cycle: 0,
        do() {
            if (b.activeGun !== null && b.guns[b.activeGun]?.name === this.name && input.fire) this.fire();
        }
    });

    const remixConfigs = [
        ["crimson reaver", "Crimson Reaver", "crimson", "#dc143c", "#ff6677", "hematic", "Scythe burst with blood-red quake", "quake"],
        ["azure crescent", "Azure Crescent", "azure", "#1e90ff", "#9cd6ff", "frost", "Cold crescent blades and chaining sparks", "chain"],
        ["verdant harvest", "Verdant Harvest", "verdant", "#2e8b57", "#7dffb1", "biotic", "Poison-tinged orbiting sickles", "orbit"],
        ["violet eclipse", "Violet Eclipse", "violet", "#8a2be2", "#d6b3ff", "void", "Purple eclipse nova slash", "nova"],
        ["solar scythe", "Solar Scythe", "solar", "#ff8c00", "#ffd18c", "solar", "Solar chain arcs and ember blades", "chain"],
        ["glacier hook", "Glacier Hook", "glacier", "#66cfff", "#d5f6ff", "glacial", "Icy quake impact and shard fan", "quake"],
        ["toxic pendulum", "Toxic Pendulum", "toxic", "#7fff00", "#d2ff99", "corrosive", "Corrosive orbit with rapid cuts", "orbit"],
        ["obsidian fang", "Obsidian Fang", "obsidian", "#4b4b6a", "#acaccc", "shadow", "Dark nova that fractures nearby", "nova"],
        ["rose arc", "Rose Arc", "rose", "#ff4f81", "#ffc2d5", "floral", "Rose-pink chain slashes", "chain"],
        ["amber sickle", "Amber Sickle", "amber", "#ffbf00", "#ffe391", "amber", "Heavy amber quake slices", "quake"],
        ["neon edge", "Neon Edge", "neon", "#39ff14", "#b7ffab", "neon", "Neon nova with hyper spread", "nova"],
        ["sable tide", "Sable Tide", "sable", "#222", "#666", "sable", "Black orbit blades with gray trails", "orbit"],
        ["tempest sickle", "Tempest Sickle", "tempest", "#00bcd4", "#9bf6ff", "storm", "Storm chain forks and lash", "chain"],
        ["magma hook", "Magma Hook", "magma", "#ff3b30", "#ff9c95", "magma", "Magma quake blast and embers", "quake"],
        ["lunar reap", "Lunar Reap", "lunar", "#c0c0ff", "#ececff", "lunar", "Moonlit nova petals", "nova"],
        ["aether claw", "Aether Claw", "aether", "#7fffd4", "#d6fff3", "aether", "Aether orbiting cutters", "orbit"],
        ["hollow comet", "Hollow Comet", "hollow", "#b0b0b0", "#f0f0f0", "astral", "Comet chain strikes", "chain"],
        ["prism reaper", "Prism Reaper", "prism", "#ff66ff", "#ffd0ff", "prismatic", "Prismatic quake and splinters", "quake"],
        ["cobalt cleaver", "Cobalt Cleaver", "cobalt", "#0047ab", "#94b8ff", "cobalt", "Cobalt nova spread", "nova"],
        ["jade guillotine", "Jade Guillotine", "jade", "#00a86b", "#9fffd8", "jade", "Jade orbit carve", "orbit"],
        ["arcane hook", "Arcane Hook", "arcane", "#9932cc", "#d7a9ff", "arcane", "Arcane chain ribbons", "chain"],
        ["rust talon", "Rust Talon", "rust", "#b7410e", "#ffbf9f", "oxidized", "Rust quake maul", "quake"],
        ["polar blade", "Polar Blade", "polar", "#aeefff", "#ffffff", "polar", "Polar nova fan", "nova"],
        ["dusk hanger", "Dusk Hanger", "dusk", "#5f4b8b", "#c7b4f3", "dusk", "Dusk orbit crescents", "orbit"],
        ["sunset reaper", "Sunset Reaper", "sunset", "#ff6f61", "#ffd2cc", "sunset", "Sunset chain arcs", "chain"],
        ["infernal curve", "Infernal Curve", "infernal", "#d7263d", "#ff96a4", "infernal", "Infernal quake burst", "quake"],
        ["mint scythe", "Mint Scythe", "mint", "#3eb489", "#c4ffe8", "mint", "Mint nova sweep", "nova"],
        ["stormglass sickle", "Stormglass Sickle", "stormglass", "#3a86ff", "#b9d3ff", "stormglass", "Stormglass orbit spin", "orbit"],
        ["radiant prune", "Radiant Prune", "radiant", "#ffd700", "#fff3a6", "radiant", "Radiant chain pulse", "chain"],
        ["nightbloom", "Nightbloom", "nightbloom", "#6a0dad", "#d7b3ff", "nightbloom", "Nightbloom quake wave", "quake"],
        ["frostflare", "Frostflare", "frostflare", "#00ffff", "#a0ffff", "frostflare", "Frostflare nova crescents", "nova"],
        ["embervine", "Embervine", "embervine", "#ff4500", "#ffc3a6", "embervine", "Embervine orbit blades", "orbit"],
        ["teal phalanx", "Teal Phalanx", "teal", "#008080", "#8ce3e3", "teal", "Teal phalanx chain cuts", "chain"],
        ["royal crescent", "Royal Crescent", "royal", "#7851a9", "#d6c4f0", "royal", "Royal crescent quake", "quake"]
    ];

    const scytheRemixWeapons = remixConfigs.map((c, idx) => createRemixScythe({
        name: c[0],
        displayName: c[1],
        styleWord: c[2],
        color: c[3],
        accent: c[4],
        flavor: c[5],
        abilityText: c[6],
        mode: c[7],
        blades: 3 + (idx % 4),
        spread: 0.08 + (idx % 3) * 0.03,
        speed: 33 + (idx % 5) * 3,
        damage: 12 + (idx % 6) * 2,
        blast: 55 + (idx % 5) * 10,
        cooldown: 15 + (idx % 5) * 4,
        drain: 0.035 + (idx % 4) * 0.008,
    }));

    const scytheRemixTechs = [
        {
            name: "chromatic honing",
            description: "<strong>chromatic honing</strong><br><strong>1.18x</strong> scythe remix <strong class='color-d'>damage</strong>",
            isGunTech: true,
            maxCount: 2,
            count: 0,
            frequency: 2,
            frequencyDefault: 2,
            allowed() { return tech?.haveGunCheck ? tech.haveGunCheck("crimson reaver") || tech.haveGunCheck("azure crescent") : true; },
            requires: "any scythe remix",
            effect() { ensureScytheState(); tech.scytheRemixDamageMult *= 1.18; },
            remove() { ensureScytheState(); tech.scytheRemixDamageMult /= 1.18; }
        },
        {
            name: "hemocore polish",
            description: "<strong>hemocore polish</strong><br><strong>0.9x</strong> scythe remix health drain",
            isGunTech: true,
            maxCount: 2,
            count: 0,
            frequency: 2,
            frequencyDefault: 2,
            allowed() { return true; },
            requires: "any scythe remix",
            effect() { ensureScytheState(); tech.scytheRemixDrainMult *= 0.9; },
            remove() { ensureScytheState(); tech.scytheRemixDrainMult /= 0.9; }
        },
        {
            name: "arc-lattice",
            description: "<strong>arc-lattice</strong><br>scythe remixes chain extra <strong class='color-laser'>lasers</strong>",
            isGunTech: true,
            maxCount: 1,
            count: 0,
            frequency: 2,
            frequencyDefault: 2,
            allowed() { return true; },
            requires: "any scythe remix",
            effect() { tech.scytheRemixArc = true; },
            remove() { tech.scytheRemixArc = false; }
        },
        {
            name: "void lacquer",
            description: "<strong>void lacquer</strong><br><strong>+1</strong> blade per scythe remix throw",
            isGunTech: true,
            maxCount: 1,
            count: 0,
            frequency: 2,
            frequencyDefault: 2,
            allowed() { return true; },
            requires: "any scythe remix",
            effect() { tech.scytheRemixExtraBlade = true; },
            remove() { tech.scytheRemixExtraBlade = false; }
        }
    ];

    if (typeof b !== "undefined" && b.guns) {
        scytheRemixWeapons.forEach((gun) => {
            if (!b.guns.find((g) => g.name === gun.name)) b.guns.push(gun);
        });
    }

    if (typeof tech !== "undefined" && Array.isArray(tech.tech)) {
        scytheRemixTechs.forEach((entry) => {
            if (!tech.tech.find((t) => t.name === entry.name)) tech.tech.push(entry);
        });
    }

    console.log(`%c🗡️ Scythe Remix Pack Loaded: ${scytheRemixWeapons.length} weapons`, "color: #8a2be2; font-weight: bold;");
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
