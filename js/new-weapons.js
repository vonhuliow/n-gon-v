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
