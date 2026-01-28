// Extended Superhero Abilities - More Powers!
if (typeof window.extendedSuperhero === 'undefined') {
    window.extendedSuperhero = {
        additionalAbilities: [
            {
                name: 'Earthquake Stomp',
                icon: '⛰️',
                desc: 'Smash ground, damage all nearby',
                cooldown: 350,
                activate() {
                    if (typeof m !== 'undefined' && typeof b !== 'undefined') {
                        for (let i = 0; i < 15; i++) {
                            const angle = (i / 15) * Math.PI * 2;
                            b.explosion({ x: m.pos.x + Math.cos(angle) * 150, y: m.pos.y + Math.sin(angle) * 150 }, 80);
                        }
                        console.log('⛰️ Earthquake Stomp Triggered!');
                    }
                }
            },
            {
                name: 'Time Warp',
                icon: '⏰',
                desc: 'Slow time for 5 seconds',
                cooldown: 400,
                activate() {
                    if (typeof m !== 'undefined') {
                        m.isTimeDilated = true;
                        setTimeout(() => { if (m) m.isTimeDilated = false; }, 5000);
                        console.log('⏰ Time Warp Activated!');
                    }
                }
            },
            {
                name: 'Gravity Well',
                icon: '🌀',
                desc: 'Pull all enemies toward you',
                cooldown: 300,
                activate() {
                    if (typeof m !== 'undefined' && typeof mob !== 'undefined') {
                        const pullForce = 200;
                        mob.forEach(enemy => {
                            if (enemy && enemy.position) {
                                const dx = m.pos.x - enemy.position.x;
                                const dy = m.pos.y - enemy.position.y;
                                const dist = Math.sqrt(dx*dx + dy*dy);
                                if (dist < 500) {
                                    Body.setVelocity(enemy, { x: (dx/dist) * 15, y: (dy/dist) * 15 });
                                }
                            }
                        });
                        console.log('🌀 Gravity Well Activated!');
                    }
                }
            },
            {
                name: 'Resurrection',
                icon: '✨',
                desc: 'Revive with 100% health (1 use)',
                cooldown: 1000,
                activate() {
                    if (typeof m !== 'undefined') {
                        m.health = m.maxHealth;
                        console.log('✨ Resurrection Activated!');
                    }
                }
            },
            {
                name: 'Meteor Strike',
                icon: '☄️',
                desc: 'Rain meteors from sky',
                cooldown: 400,
                activate() {
                    if (typeof b !== 'undefined' && typeof simulation !== 'undefined') {
                        for (let i = 0; i < 10; i++) {
                            setTimeout(() => {
                                const x = simulation.mouseInGame.x + (Math.random() - 0.5) * 300;
                                const y = simulation.mouseInGame.y - 200;
                                b.explosion({ x, y }, 150);
                            }, i * 100);
                        }
                        console.log('☄️ Meteor Strike Activated!');
                    }
                }
            },
            {
                name: 'Dimensional Shield',
                icon: '🔷',
                desc: 'Block all damage for 6 seconds',
                cooldown: 450,
                activate() {
                    if (typeof m !== 'undefined') {
                        m.dimensionalShield = true;
                        m.shieldHealth = m.maxHealth * 1.5;
                        setTimeout(() => { if (m) m.dimensionalShield = false; }, 6000);
                        console.log('🔷 Dimensional Shield Activated!');
                    }
                }
            },
            {
                name: 'Omnislash',
                icon: '⚔️',
                desc: '10 rapid slashes at cursor',
                cooldown: 250,
                activate() {
                    if (typeof b !== 'undefined' && typeof simulation !== 'undefined') {
                        for (let i = 0; i < 10; i++) {
                            setTimeout(() => {
                                const angle = (i / 10) * Math.PI * 2;
                                const dist = 100;
                                const target = {
                                    x: simulation.mouseInGame.x + Math.cos(angle) * dist,
                                    y: simulation.mouseInGame.y + Math.sin(angle) * dist
                                };
                                b.laser(simulation.mouseInGame, target, 80 - i * 5);
                            }, i * 50);
                        }
                        console.log('⚔️ Omnislash Activated!');
                    }
                }
            },
            {
                name: 'Mass Multiplication',
                icon: '👥',
                desc: 'Spawn 5 clones to fight',
                cooldown: 500,
                activate() {
                    if (typeof b !== 'undefined' && typeof m !== 'undefined') {
                        for (let i = 0; i < 5; i++) {
                            setTimeout(() => {
                                const offset = { x: Math.random() * 200 - 100, y: Math.random() * 200 - 100 };
                                b.drone(m.pos.x + offset.x, m.pos.y + offset.y);
                            }, i * 100);
                        }
                        console.log('👥 Mass Multiplication Activated!');
                    }
                }
            }
        ],
        
        activatePower(abilityName) {
            const ability = this.additionalAbilities.find(a => a.name === abilityName);
            if (!ability) return false;
            
            if (ability.activate) ability.activate();
            return true;
        },
        
        getRandomAbility() {
            return this.additionalAbilities[Math.floor(Math.random() * this.additionalAbilities.length)];
        },
        
        init() {
            console.log('%c⚔️ Extended Superhero Abilities Loaded! +8 new powers!', 'color: #e74c3c; font-weight: bold;');
        }
    };
    
    window.extendedSuperhero.init();
}
