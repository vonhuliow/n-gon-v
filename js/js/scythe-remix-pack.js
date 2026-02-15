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
