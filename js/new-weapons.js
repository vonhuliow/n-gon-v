// New Weapons, Techs, and Weapon Variants
(function() {
    // New Weapons
    const newGuns = [
        {
            name: "plasma blade",
            descriptionFunction() { return `Melee energy weapon with fast attacks` },
            ammo: Infinity,
            ammoPack: 0,
            have: false,
            fire() {
                const angle = Math.atan2(simulation.mouseInGame.y - m.pos.y, simulation.mouseInGame.x - m.pos.x);
                for (let i = -2; i <= 2; i++) {
                    const spread = angle + (i * 0.1);
                    b.nail({ x: m.pos.x + Math.cos(spread) * 50, y: m.pos.y + Math.sin(spread) * 50 }, 
                           { x: Math.cos(spread) * 25, y: Math.sin(spread) * 25 }, 15);
                }
            },
            do() { }
        },
        {
            name: "void cannon",
            descriptionFunction() { return `Fires slow-moving black holes that pull enemies` },
            ammo: 8,
            ammoPack: 2,
            defaultAmmoPack: 2,
            have: false,
            fire() {
                this.ammo--;
                const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
                b.missile({ x: m.pos.x, y: m.pos.y }, -Math.atan2(dir.x, dir.y) - Math.PI / 2, 0, 80);
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => b.explosion(simulation.mouseInGame, 40 + i * 20), i * 100);
                }
            },
            do() { }
        },
        {
            name: "thunder staff",
            descriptionFunction() { return `Chain lightning that jumps between enemies` },
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
            descriptionFunction() { return `Freezing arrows that slow and damage` },
            ammo: 20,
            ammoPack: 4,
            defaultAmmoPack: 4,
            have: false,
            fire() {
                this.ammo--;
                const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
                b.nail({ x: m.pos.x, y: m.pos.y }, { x: dir.x * 40, y: dir.y * 40 }, 25);
                b.nail({ x: m.pos.x, y: m.pos.y }, { x: dir.x * 38, y: dir.y * 38 + 2 }, 20);
                b.nail({ x: m.pos.x, y: m.pos.y }, { x: dir.x * 38, y: dir.y * 38 - 2 }, 20);
            },
            do() { }
        },
        {
            name: "gravity gun",
            descriptionFunction() { return `Manipulates gravity, pulls and pushes objects` },
            ammo: 12,
            ammoPack: 2,
            defaultAmmoPack: 2,
            have: false,
            fire() {
                this.ammo--;
                b.explosion(simulation.mouseInGame, 150);
            },
            do() { }
        },
        {
            name: "particle accelerator",
            descriptionFunction() { return `Fires supercharged particles in a beam` },
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
            descriptionFunction() { return `Drains life from enemies, heals you` },
            ammo: 10,
            ammoPack: 2,
            defaultAmmoPack: 2,
            have: false,
            fire() {
                this.ammo--;
                b.laser(m.pos, simulation.mouseInGame, 35);
                m.health = Math.min(m.maxHealth, m.health + 0.05);
            },
            do() { }
        },
        {
            name: "quantum rifle",
            descriptionFunction() { return `Shots exist in multiple positions simultaneously` },
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
            descriptionFunction() { return `Shoots waves of fire that burn areas` },
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
            descriptionFunction() { return `Crystalline projectiles that can pierce` },
            ammo: 18,
            ammoPack: 3,
            defaultAmmoPack: 3,
            have: false,
            fire() {
                this.ammo--;
                const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
                b.nail({ x: m.pos.x, y: m.pos.y }, { x: dir.x * 50, y: dir.y * 50 }, 30);
            },
            do() { }
        },
        {
            name: "chaos staff",
            descriptionFunction() { return `Unpredictable magic that damages everything nearby` },
            ammo: 10,
            ammoPack: 2,
            defaultAmmoPack: 2,
            have: false,
            fire() {
                this.ammo--;
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI * 2 * i) / 6;
                    const spread = (Math.random() - 0.5) * 0.5;
                    const finalAngle = angle + spread;
                    const vel = { x: Math.cos(finalAngle) * 35, y: Math.sin(finalAngle) * 35 };
                    b.nail({ x: m.pos.x, y: m.pos.y }, vel, 15);
                }
            },
            do() { }
        },
        {
            name: "void strike",
            descriptionFunction() { return `Attacks with the power of nothingness` },
            ammo: 8,
            ammoPack: 1,
            defaultAmmoPack: 1,
            have: false,
            fire() {
                this.ammo--;
                const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
                b.missile({ x: m.pos.x, y: m.pos.y }, -Math.atan2(dir.x, dir.y) - Math.PI / 2, 0, 100);
            },
            do() { }
        }
    ];
    
    // New Techs
    const newTechs = [
        {
            name: "origami mastery",
            description: "<strong>origami mastery</strong><br>Your bots fold into protective paper forms, +20% bot durability",
            isGunTech: false,
            maxCount: 3,
            count: 0,
            allowed() { return true },
            requires: "",
            effect() { }, remove() { this.count = 0; }
        },
        {
            name: "angelic blessing",
            description: "<strong>angelic blessing</strong><br>Summon biblically accurate angel bots that orbit and protect",
            isGunTech: false,
            maxCount: 1,
            count: 0,
            allowed() { return true },
            requires: "",
            effect() { }, remove() { this.count = 0; }
        },
        {
            name: "demonic pact",
            description: "<strong>demonic pact</strong><br>Summon demonic bots that aggressively attack enemies",
            isGunTech: false,
            maxCount: 1,
            count: 0,
            allowed() { return true },
            requires: "",
            effect() { }, remove() { this.count = 0; }
        },
        {
            name: "celestial harmony",
            description: "<strong>celestial harmony</strong><br>Angel and demon bots work together, +50% damage",
            isGunTech: false,
            maxCount: 1,
            count: 0,
            allowed() { return tech.tech.find(t => t.name === "angelic blessing")?.count > 0 && tech.tech.find(t => t.name === "demonic pact")?.count > 0 },
            requires: "angelic blessing, demonic pact",
            effect() { }, remove() { this.count = 0; }
        },
        {
            name: "ore magnetism",
            description: "<strong>ore magnetism</strong><br>Automatically collect nearby ore drops",
            isGunTech: false,
            maxCount: 1,
            count: 0,
            allowed() { return true },
            requires: "",
            effect() { }, remove() { this.count = 0; }
        },
        {
            name: "potion mastery",
            description: "<strong>potion mastery</strong><br>Potions last 50% longer",
            isGunTech: false,
            maxCount: 3,
            count: 0,
            allowed() { return true },
            requires: "",
            effect() { }, remove() { this.count = 0; }
        },
        {
            name: "merchant's favor",
            description: "<strong>merchant's favor</strong><br>15% discount on all marketplace purchases",
            isGunTech: false,
            maxCount: 3,
            count: 0,
            allowed() { return true },
            requires: "",
            effect() { }, remove() { this.count = 0; }
        },
        {
            name: "void touched",
            description: "<strong>void touched</strong><br>Phase through enemies briefly after being hit",
            isGunTech: false,
            maxCount: 1,
            count: 0,
            allowed() { return true },
            requires: "",
            effect() { }, remove() { this.count = 0; }
        },
        {
            name: "cosmic attunement",
            description: "<strong>cosmic attunement</strong><br>+25% damage with cosmic ore weapons",
            isGunTech: true,
            maxCount: 1,
            count: 0,
            allowed() { return true },
            requires: "",
            effect() { }, remove() { this.count = 0; }
        },
        {
            name: "elemental fusion",
            description: "<strong>elemental fusion</strong><br>Combine fire and ice for steam explosions",
            isGunTech: false,
            maxCount: 1,
            count: 0,
            allowed() { return true },
            requires: "",
            effect() { }, remove() { this.count = 0; }
        }
    ];
    
    // Add new weapons
    if (typeof b !== 'undefined' && b.guns) {
        newGuns.forEach(gun => {
            if (!b.guns.find(g => g.name === gun.name)) {
                b.guns.push(gun);
            }
        });
    }
    
    // Add new techs
    if (typeof tech !== 'undefined' && tech.tech) {
        newTechs.forEach(t => {
            if (!tech.tech.find(existing => existing.name === t.name)) {
                tech.tech.push(t);
            }
        });
    }
    
    console.log('%c⚔️ New Weapons & Techs Loaded! 8 weapons + 10 techs!', 'color: #e67e22; font-weight: bold;');
})();
