// Superhero Abilities System
if (typeof window.superheroAbilities === 'undefined') {
    window.superheroAbilities = {
        abilities: [
            {
                name: 'Super Strength',
                icon: '💪',
                desc: '+200% damage for 15 seconds',
                cooldown: 300,
                activate() {
                    if (typeof m === 'undefined') return;
                    m.damageMultiplier = 3;
                    setTimeout(() => { if (m) m.damageMultiplier = 1; }, 15000);
                    console.log('💪 Super Strength Activated!');
                }
            },
            {
                name: 'Speed Force',
                icon: '⚡',
                desc: '+300% speed for 10 seconds',
                cooldown: 300,
                activate() {
                    if (typeof m === 'undefined') return;
                    m.Fx = m.Fx * 4;
                    m.jumpForce = m.jumpForce * 2;
                    setTimeout(() => { if (m) { m.Fx = m.Fx / 4; m.jumpForce = m.jumpForce / 2; } }, 10000);
                    console.log('⚡ Speed Force Activated!');
                }
            },
            {
                name: 'Invulnerability Shield',
                icon: '🛡️',
                desc: 'Immunity to all damage for 8 seconds',
                cooldown: 400,
                activate() {
                    if (typeof m === 'undefined') return;
                    m.immuneToHarm = true;
                    setTimeout(() => { if (m) m.immuneToHarm = false; }, 8000);
                    console.log('🛡️ Invulnerability Shield Activated!');
                }
            },
            {
                name: 'Laser Vision',
                icon: '👁️‍🗨️',
                desc: 'Fire laser beam from eyes',
                cooldown: 150,
                activate() {
                    if (typeof m !== 'undefined' && typeof simulation !== 'undefined' && typeof b !== 'undefined') {
                        const angle = Math.atan2(simulation.mouseInGame.y - m.pos.y, simulation.mouseInGame.x - m.pos.x);
                        for (let i = 0; i < 5; i++) {
                            b.laser({ x: m.pos.x, y: m.pos.y }, 
                                   { x: simulation.mouseInGame.x + Math.random()*100 - 50, y: simulation.mouseInGame.y + Math.random()*100 - 50 }, 
                                   100 - i * 15);
                        }
                        console.log('👁️‍🗨️ Laser Vision Fired!');
                    }
                }
            },
            {
                name: 'Sonic Boom',
                icon: '💥',
                desc: 'Shockwave that damages all nearby enemies',
                cooldown: 250,
                activate() {
                    if (typeof m !== 'undefined' && typeof b !== 'undefined') {
                        b.explosion(m.pos, 300);
                        console.log('💥 Sonic Boom Activated!');
                    }
                }
            },
            {
                name: 'Flight Mode',
                icon: '🕊️',
                desc: 'Temporary flight for 12 seconds',
                cooldown: 350,
                activate() {
                    if (typeof m === 'undefined') return;
                    m.canFly = true;
                    m.gravityScale = 0.1;
                    setTimeout(() => { if (m) { m.canFly = false; m.gravityScale = 1; } }, 12000);
                    console.log('🕊️ Flight Mode Activated!');
                }
            },
            {
                name: 'Teleportation',
                icon: '⏭️',
                desc: 'Instantly teleport to cursor',
                cooldown: 200,
                activate() {
                    if (typeof m !== 'undefined' && typeof simulation !== 'undefined') {
                        m.pos.x = simulation.mouseInGame.x;
                        m.pos.y = simulation.mouseInGame.y;
                        console.log('⏭️ Teleportation Used!');
                    }
                }
            },
            {
                name: 'Healing Factor',
                icon: '💚',
                desc: 'Restore 50% health over 5 seconds',
                cooldown: 400,
                activate() {
                    if (typeof m === 'undefined') return;
                    const healAmount = m.maxHealth * 0.5;
                    let healed = 0;
                    const healInterval = setInterval(() => {
                        if (typeof m !== 'undefined') {
                            m.health = Math.min(m.maxHealth, m.health + healAmount / 50);
                            healed++;
                            if (healed >= 50) clearInterval(healInterval);
                        }
                    }, 100);
                    console.log('💚 Healing Factor Activated!');
                }
            }
        ],
        
        activeAbilities: [],
        activeCooldowns: {},
        
        activateAbility(abilityName) {
            const ability = this.abilities.find(a => a.name === abilityName);
            if (!ability) return false;
            
            if (this.activeCooldowns[abilityName] && Date.now() - this.activeCooldowns[abilityName] < ability.cooldown * 16.67) {
                console.log(`❌ ${abilityName} is on cooldown!`);
                return false;
            }
            
            ability.activate();
            this.activeCooldowns[abilityName] = Date.now();
            return true;
        },
        
        init() {
            console.log('%c🦸 Superhero Abilities System Loaded!', 'color: #e74c3c; font-weight: bold;');
        }
    };
    
    window.superheroAbilities.init();
}
