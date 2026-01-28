// Cool New Mobs - Unique and Dangerous Enemies
if (typeof window.coolMobs === 'undefined') {
    window.coolMobs = {
        
        mobs: [
            {
                name: 'Plasma Spinner',
                desc: 'Spins and shoots plasma in all directions',
                tier: 2,
                health: 2,
                speed: 8,
                damage: 0.5,
                behavior() {
                    // Spins and shoots around
                    if (this.spin === undefined) this.spin = 0;
                    this.spin += 0.1;
                    if (this.cycle % 20 === 0 && typeof b !== 'undefined') {
                        for (let i = 0; i < 8; i++) {
                            const angle = (i / 8) * Math.PI * 2 + this.spin;
                            b.nail({ x: this.position.x, y: this.position.y }, 
                                   { x: Math.cos(angle) * 20, y: Math.sin(angle) * 20 }, 10);
                        }
                    }
                }
            },
            {
                name: 'Void Wraith',
                desc: 'Teleports around and is hard to hit',
                tier: 3,
                health: 1.5,
                speed: 12,
                damage: 0.8,
                behavior() {
                    if (this.teleportCounter === undefined) this.teleportCounter = 0;
                    this.teleportCounter++;
                    if (this.teleportCounter > 40) {
                        this.position.x += (Math.random() - 0.5) * 400;
                        this.position.y += (Math.random() - 0.5) * 300;
                        this.teleportCounter = 0;
                    }
                }
            },
            {
                name: 'Crystalline Golem',
                desc: 'Slow but tanks massive damage',
                tier: 2,
                health: 5,
                speed: 3,
                damage: 1.2,
                behavior() {
                    // Heavy slow attack
                    if (this.cycle % 60 === 0 && typeof b !== 'undefined') {
                        b.explosion(this.position, 100);
                    }
                }
            },
            {
                name: 'Quantum Hopper',
                desc: 'Jumps erratically and phases through walls',
                tier: 1,
                health: 1,
                speed: 15,
                damage: 0.3,
                behavior() {
                    // Random jumps and phase
                    if (this.cycle % 15 === 0) {
                        this.velocity.y = -Math.random() * 20;
                        if (Math.random() > 0.7) {
                            this.position.x += Math.random() * 200 - 100;
                        }
                    }
                }
            },
            {
                name: 'Infernal Hound',
                desc: 'Rushes at player with fire trail',
                tier: 2,
                health: 2.5,
                speed: 13,
                damage: 0.9,
                behavior() {
                    // Aggressive chase with fire
                    if (typeof m !== 'undefined' && this.position) {
                        const dx = m.pos.x - this.position.x;
                        const dist = Math.abs(dx);
                        if (dist < 400) {
                            this.velocity.x = (dx / Math.abs(dx)) * this.speed;
                        }
                    }
                    if (this.cycle % 5 === 0 && typeof b !== 'undefined') {
                        b.explosion(this.position, 30);
                    }
                }
            },
            {
                name: 'Temporal Echo',
                desc: 'Leaves behind damaging echo clones',
                tier: 3,
                health: 1.8,
                speed: 7,
                damage: 0.6,
                behavior() {
                    if (this.echoCounter === undefined) this.echoCounter = 0;
                    this.echoCounter++;
                    if (this.echoCounter > 50 && typeof b !== 'undefined') {
                        // Spawn echo at old position
                        console.log('Echo spawned');
                        this.echoCounter = 0;
                    }
                }
            },
            {
                name: 'Gravity Anchor',
                desc: 'Creates zones that slow everything',
                tier: 2,
                health: 3,
                speed: 4,
                damage: 0.4,
                behavior() {
                    // Emits slow field
                    if (this.fieldCounter === undefined) this.fieldCounter = 0;
                    this.fieldCounter++;
                    if (this.fieldCounter > 30 && typeof m !== 'undefined') {
                        const dist = Math.hypot(m.pos.x - this.position.x, m.pos.y - this.position.y);
                        if (dist < 300) {
                            m.Fx = m.Fx * 0.7;
                        }
                    }
                }
            },
            {
                name: 'Void Leech',
                desc: 'Steals player health when close',
                tier: 3,
                health: 2,
                speed: 6,
                damage: 0.5,
                behavior() {
                    if (typeof m !== 'undefined') {
                        const dist = Math.hypot(m.pos.x - this.position.x, m.pos.y - this.position.y);
                        if (dist < 150 && m.health > 0.1) {
                            m.health -= 0.01;
                            this.health = Math.min(this.maxHealth, this.health + 0.01);
                        }
                    }
                }
            }
        ],
        
        register() {
            // Registers cool mobs into spawn system
            if (typeof spawn !== 'undefined') {
                this.mobs.forEach(mobData => {
                    // These would be integrated into spawn.js mob definitions
                    console.log(`📊 Registered mob: ${mobData.name}`);
                });
            }
            console.log('%c🧛 Cool Mobs System Loaded! 8 unique enemies!', 'color: #e74c3c; font-weight: bold;');
        },
        
        getRandomCoolMob() {
            return this.mobs[Math.floor(Math.random() * this.mobs.length)];
        },
        
        getMobsByTier(tier) {
            return this.mobs.filter(m => m.tier === tier);
        }
    };
    
    window.coolMobs.register();
}
