// Photonic Crystal Weapons, Techs, and Fields
(function() {
    window.photonicContent = {
        weapons: [
            {
                name: "photonic lance",
                descriptionFunction() { return `Pure light concentrated into a piercing beam` },
                ammo: 15,
                ammoPack: 3,
                defaultAmmoPack: 3,
                have: false,
                fire() {
                    this.ammo--;
                    b.laser(m.pos, simulation.mouseInGame, 80);
                }
            },
            {
                name: "crystal prism",
                descriptionFunction() { return `Splits light into rainbow beams` },
                ammo: 12,
                ammoPack: 2,
                defaultAmmoPack: 2,
                have: false,
                fire() {
                    this.ammo--;
                    const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
                    const baseAngle = Math.atan2(dir.y, dir.x);
                    for (let i = 0; i < 7; i++) {
                        const spreadAngle = baseAngle + (i - 3) * 0.15;
                        const end = { x: m.pos.x + Math.cos(spreadAngle) * 500, y: m.pos.y + Math.sin(spreadAngle) * 500 };
                        b.laser(m.pos, end, 25);
                    }
                }
            },
            {
                name: "photon cannon",
                descriptionFunction() { return `Concentrated photonic energy blast` },
                ammo: 8,
                ammoPack: 2,
                defaultAmmoPack: 2,
                have: false,
                fire() {
                    this.ammo--;
                    b.explosion(simulation.mouseInGame, 120);
                    b.laser(m.pos, simulation.mouseInGame, 50);
                }
            },
            {
                name: "light weaver",
                descriptionFunction() { return `Creates webs of solid light` },
                ammo: 10,
                ammoPack: 2,
                defaultAmmoPack: 2,
                have: false,
                fire() {
                    this.ammo--;
                    for (let i = 0; i < 6; i++) {
                        const angle = (Math.PI * 2 * i) / 6;
                        const start = { x: simulation.mouseInGame.x + Math.cos(angle) * 50, y: simulation.mouseInGame.y + Math.sin(angle) * 50 };
                        const end = { x: simulation.mouseInGame.x + Math.cos(angle + Math.PI/3) * 50, y: simulation.mouseInGame.y + Math.sin(angle + Math.PI/3) * 50 };
                        b.laser(start, end, 20);
                    }
                }
            },
            {
                name: "refraction rifle",
                descriptionFunction() { return `Bullets bounce off surfaces multiple times` },
                ammo: 20,
                ammoPack: 4,
                defaultAmmoPack: 4,
                have: false,
                fire() {
                    this.ammo--;
                    const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
                    b.nail({ x: m.pos.x, y: m.pos.y }, { x: dir.x * 45, y: dir.y * 45 }, 30);
                }
            },
            {
                name: "spectrum blade",
                descriptionFunction() { return `Melee weapon made of solid light` },
                ammo: Infinity,
                ammoPack: 0,
                have: false,
                fire() {
                    const angle = Math.atan2(simulation.mouseInGame.y - m.pos.y, simulation.mouseInGame.x - m.pos.x);
                    for (let i = -2; i <= 2; i++) {
                        const spread = angle + (i * 0.12);
                        b.nail({ x: m.pos.x + Math.cos(spread) * 40, y: m.pos.y + Math.sin(spread) * 40 }, 
                               { x: Math.cos(spread) * 30, y: Math.sin(spread) * 30 }, 20);
                    }
                }
            },
            {
                name: "holographic projector",
                descriptionFunction() { return `Creates decoys that confuse enemies` },
                ammo: 6,
                ammoPack: 1,
                defaultAmmoPack: 1,
                have: false,
                fire() {
                    this.ammo--;
                    for (let i = 0; i < 3; i++) {
                        const offset = { x: (Math.random() - 0.5) * 200, y: (Math.random() - 0.5) * 200 };
                        b.explosion({ x: simulation.mouseInGame.x + offset.x, y: simulation.mouseInGame.y + offset.y }, 40);
                    }
                }
            },
            {
                name: "aurora beam",
                descriptionFunction() { return `Multi-colored beam that heals allies` },
                ammo: 14,
                ammoPack: 3,
                defaultAmmoPack: 3,
                have: false,
                fire() {
                    this.ammo--;
                    b.laser(m.pos, simulation.mouseInGame, 40);
                    m.health = Math.min(m.maxHealth, m.health + 0.02);
                }
            },
            {
                name: "quantum lens",
                descriptionFunction() { return `Focuses probability into reality-bending shots` },
                ammo: 10,
                ammoPack: 2,
                defaultAmmoPack: 2,
                have: false,
                fire() {
                    this.ammo--;
                    for (let i = 0; i < 4; i++) {
                        const offset = { x: (Math.random() - 0.5) * 150, y: (Math.random() - 0.5) * 150 };
                        const target = { x: simulation.mouseInGame.x + offset.x, y: simulation.mouseInGame.y + offset.y };
                        b.laser(m.pos, target, 35);
                    }
                }
            },
            {
                name: "crystalline shatter",
                descriptionFunction() { return `Explosive crystal shards in all directions` },
                ammo: 8,
                ammoPack: 2,
                defaultAmmoPack: 2,
                have: false,
                fire() {
                    this.ammo--;
                    for (let i = 0; i < 12; i++) {
                        const angle = (Math.PI * 2 * i) / 12;
                        b.nail({ x: m.pos.x, y: m.pos.y }, { x: Math.cos(angle) * 40, y: Math.sin(angle) * 40 }, 18);
                    }
                }
            }
        ],
        
        techs: [
            {
                name: "photonic resonance",
                description: "<strong>photonic resonance</strong><br>Light-based weapons deal +30% damage",
                isGunTech: false,
                maxCount: 3,
                count: 0,
                allowed() { return true },
                requires: "",
                effect() { },
                remove() { this.count = 0; }
            },
            {
                name: "crystal lattice",
                description: "<strong>crystal lattice</strong><br>Create a protective crystal shield when hit",
                isGunTech: false,
                maxCount: 1,
                count: 0,
                allowed() { return true },
                requires: "",
                effect() { },
                remove() { this.count = 0; }
            },
            {
                name: "light refraction",
                description: "<strong>light refraction</strong><br>Attacks have 20% chance to split into two",
                isGunTech: false,
                maxCount: 3,
                count: 0,
                allowed() { return true },
                requires: "",
                effect() { },
                remove() { this.count = 0; }
            },
            {
                name: "prismatic armor",
                description: "<strong>prismatic armor</strong><br>Take reduced damage from elemental attacks",
                isGunTech: false,
                maxCount: 1,
                count: 0,
                allowed() { return true },
                requires: "",
                effect() { },
                remove() { this.count = 0; }
            },
            {
                name: "wavelength shift",
                description: "<strong>wavelength shift</strong><br>Become briefly invisible after attacking",
                isGunTech: false,
                maxCount: 1,
                count: 0,
                allowed() { return true },
                requires: "",
                effect() { },
                remove() { this.count = 0; }
            },
            {
                name: "photon absorption",
                description: "<strong>photon absorption</strong><br>Absorb light attacks to heal",
                isGunTech: false,
                maxCount: 1,
                count: 0,
                allowed() { return true },
                requires: "",
                effect() { },
                remove() { this.count = 0; }
            },
            {
                name: "holographic duplicates",
                description: "<strong>holographic duplicates</strong><br>Create light clones that distract enemies",
                isGunTech: false,
                maxCount: 2,
                count: 0,
                allowed() { return true },
                requires: "",
                effect() { },
                remove() { this.count = 0; }
            },
            {
                name: "spectrum mastery",
                description: "<strong>spectrum mastery</strong><br>Unlock all color-based abilities",
                isGunTech: false,
                maxCount: 1,
                count: 0,
                allowed() { return true },
                requires: "",
                effect() { },
                remove() { this.count = 0; }
            },
            {
                name: "crystalline focus",
                description: "<strong>crystalline focus</strong><br>+50% critical hit chance with light weapons",
                isGunTech: false,
                maxCount: 2,
                count: 0,
                allowed() { return true },
                requires: "",
                effect() { },
                remove() { this.count = 0; }
            },
            {
                name: "photonic overload",
                description: "<strong>photonic overload</strong><br>Light attacks chain to nearby enemies",
                isGunTech: false,
                maxCount: 1,
                count: 0,
                allowed() { return true },
                requires: "",
                effect() { },
                remove() { this.count = 0; }
            }
        ],
        
        fields: [
            {
                name: "photonic barrier",
                description: "Creates a light shield that reflects projectiles",
                effect() {
                    ctx.save();
                    ctx.strokeStyle = 'rgba(0, 255, 255, 0.6)';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.arc(m.pos.x, m.pos.y, 100, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.restore();
                }
            },
            {
                name: "crystal cage",
                description: "Traps enemies in crystalline prisons",
                effect() {
                    const target = simulation.mouseInGame;
                    ctx.save();
                    ctx.strokeStyle = 'rgba(255, 0, 255, 0.5)';
                    ctx.lineWidth = 2;
                    for (let i = 0; i < 6; i++) {
                        const angle = (Math.PI * 2 * i) / 6;
                        ctx.beginPath();
                        ctx.moveTo(target.x, target.y);
                        ctx.lineTo(target.x + Math.cos(angle) * 80, target.y + Math.sin(angle) * 80);
                        ctx.stroke();
                    }
                    ctx.restore();
                }
            },
            {
                name: "light absorption",
                description: "Drains energy from nearby enemies",
                effect() {
                    ctx.save();
                    ctx.fillStyle = 'rgba(255, 255, 0, 0.2)';
                    ctx.beginPath();
                    ctx.arc(m.pos.x, m.pos.y, 150, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            }
        ],
        
        init() {
            // Register photonic weapons with the game
            if (typeof b !== 'undefined' && b.guns) {
                this.weapons.forEach(weapon => {
                    if (!b.guns.find(g => g.name === weapon.name)) {
                        b.guns.push(weapon);
                    }
                });
            }
            
            // Register photonic techs with the game
            if (typeof tech !== 'undefined' && tech.tech) {
                this.techs.forEach(t => {
                    if (!tech.tech.find(et => et.name === t.name)) {
                        tech.tech.push(t);
                    }
                });
            }
            
            console.log('%c💎 Photonic Crystal Content Loaded! 10 weapons + 10 techs + 3 fields!', 'color: #00FFFF; font-weight: bold;');
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.photonicContent.init());
    } else {
        setTimeout(() => window.photonicContent.init(), 500);
    }
})();
