// Unlock Codes System - Special codes unlock exclusive content
(function() {
    window.unlockCodes = {
        unlockedCodes: [],
        
        codes: {
            'QROW2025': {
                name: 'Qrow Transformation',
                description: 'Owner-Only transformation with insane stats',
                unlocked: false,
                apply() {
                    if (typeof m !== 'undefined') {
                        m.health = 10;
                        m.maxHealth = 10;
                        m.energy = 5;
                        m.damageMultiplier = 8;
                        m.accelMag = (m.accelMag || 0.001) * 3;
                        m.incomingDamageMultiplier = 0.1;
                    }
                    window.unlockCodes.grantQrowWeapons();
                    window.unlockCodes.spawnQrowPets();
                    console.log('%c🔥 QROW TRANSFORMATION ACTIVATED!', 'color: #FFD700; font-size: 20px; font-weight: bold;');
                }
            },
            'PHOTON2025': {
                name: 'Photonic Arsenal',
                description: 'Unlocks all photonic crystal weapons and techs',
                unlocked: false,
                apply() {
                    window.unlockCodes.grantPhotonicArsenal();
                    console.log('%c💎 PHOTONIC ARSENAL UNLOCKED!', 'color: #00FFFF; font-size: 16px; font-weight: bold;');
                }
            },
            'SPEED2025': {
                name: 'Movement Master',
                description: 'Unlocks all movement techs',
                unlocked: false,
                apply() {
                    window.unlockCodes.grantMovementTechs();
                    console.log('%c⚡ MOVEMENT MASTER UNLOCKED!', 'color: #FF00FF; font-size: 16px; font-weight: bold;');
                }
            },
            'GODMODE': {
                name: 'Divine Power',
                description: 'Maximum stats and invulnerability',
                unlocked: false,
                apply() {
                    if (typeof m !== 'undefined') {
                        m.health = 100;
                        m.maxHealth = 100;
                        m.damageMultiplier = 50;
                        m.incomingDamageMultiplier = 0;
                    }
                    console.log('%c👑 GODMODE ENABLED!', 'color: #FFD700; font-size: 20px; font-weight: bold;');
                }
            }
        },
        
        qrowWeapons: [
            {
                name: "hakuman's okami",
                descriptionFunction() { return `Counter stance sword - block then devastate` },
                ammo: Infinity,
                ammoPack: 0,
                have: false,
                fire() {
                    const angle = Math.atan2(simulation.mouseInGame.y - m.pos.y, simulation.mouseInGame.x - m.pos.x);
                    for (let i = -3; i <= 3; i++) {
                        const spread = angle + (i * 0.15);
                        b.nail({ x: m.pos.x + Math.cos(spread) * 60, y: m.pos.y + Math.sin(spread) * 60 }, 
                               { x: Math.cos(spread) * 45, y: Math.sin(spread) * 45 }, 40);
                    }
                }
            },
            {
                name: "yamato",
                descriptionFunction() { return `Dimension-cutting teleport slashes` },
                ammo: Infinity,
                ammoPack: 0,
                have: false,
                fire() {
                    const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
                    m.pos.x = simulation.mouseInGame.x;
                    m.pos.y = simulation.mouseInGame.y;
                    for (let i = 0; i < 8; i++) {
                        const angle = (Math.PI * 2 * i) / 8;
                        b.laser({ x: m.pos.x, y: m.pos.y }, { x: m.pos.x + Math.cos(angle) * 300, y: m.pos.y + Math.sin(angle) * 300 }, 60);
                    }
                }
            },
            {
                name: "ebony & ivory",
                descriptionFunction() { return `Twin revolvers with infinite ammo` },
                ammo: Infinity,
                ammoPack: 0,
                have: false,
                fire() {
                    const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
                    b.nail({ x: m.pos.x - 15, y: m.pos.y }, { x: dir.x * 60, y: dir.y * 60 }, 25);
                    b.nail({ x: m.pos.x + 15, y: m.pos.y }, { x: dir.x * 60, y: dir.y * 60 }, 25);
                }
            },
            {
                name: "lunar crescents",
                descriptionFunction() { return `Orbiting moon blades that auto-attack` },
                ammo: 20,
                ammoPack: 4,
                defaultAmmoPack: 4,
                have: false,
                fire() {
                    this.ammo--;
                    for (let i = 0; i < 4; i++) {
                        const angle = (Math.PI * 2 * i) / 4 + simulation.cycle * 0.1;
                        const pos = { x: m.pos.x + Math.cos(angle) * 80, y: m.pos.y + Math.sin(angle) * 80 };
                        b.nail(pos, { x: Math.cos(angle + Math.PI/2) * 30, y: Math.sin(angle + Math.PI/2) * 30 }, 35);
                    }
                }
            }
        ],
        
        grantQrowWeapons() {
            if (typeof b !== 'undefined' && b.guns) {
                this.qrowWeapons.forEach(weapon => {
                    if (!b.guns.find(g => g.name === weapon.name)) {
                        b.guns.push(weapon);
                        weapon.have = true;
                        if (!b.inventory.includes(b.guns.length - 1)) {
                            b.inventory.push(b.guns.length - 1);
                        }
                    }
                });
                if (typeof simulation !== 'undefined') simulation.makeGunHUD();
            }
        },
        
        spawnQrowPets() {
            // Nine-Tailed Fox pet
            if (typeof simulation !== 'undefined') {
                simulation.ephemera.push({
                    name: 'nine-tailed-fox',
                    do() {
                        const angle = simulation.cycle * 0.03;
                        const x = m.pos.x + Math.cos(angle) * 100;
                        const y = m.pos.y + Math.sin(angle) * 100 - 30;
                        ctx.save();
                        ctx.fillStyle = '#FFD700';
                        ctx.beginPath();
                        ctx.arc(x, y, 20, 0, Math.PI * 2);
                        ctx.fill();
                        for (let i = 0; i < 9; i++) {
                            const tailAngle = angle + (i * Math.PI * 2 / 9);
                            ctx.strokeStyle = '#000';
                            ctx.lineWidth = 3;
                            ctx.beginPath();
                            ctx.moveTo(x, y);
                            ctx.lineTo(x + Math.cos(tailAngle) * 40, y + Math.sin(tailAngle) * 40);
                            ctx.stroke();
                        }
                        ctx.restore();
                        
                        // Auto-attack nearest enemy
                        if (simulation.cycle % 60 === 0 && typeof mob !== 'undefined') {
                            for (let i = 0; i < mob.length; i++) {
                                if (mob[i].alive) {
                                    const dist = Math.hypot(mob[i].position.x - x, mob[i].position.y - y);
                                    if (dist < 400) {
                                        b.laser({ x, y }, mob[i].position, 30);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                });
                
                // Red Phoenix pet
                simulation.ephemera.push({
                    name: 'red-phoenix',
                    do() {
                        const angle = -simulation.cycle * 0.02;
                        const x = m.pos.x + Math.cos(angle) * 120;
                        const y = m.pos.y + Math.sin(angle) * 60 - 50;
                        ctx.save();
                        ctx.fillStyle = '#FF4500';
                        ctx.beginPath();
                        ctx.arc(x, y, 15, 0, Math.PI * 2);
                        ctx.fill();
                        // Wings
                        ctx.beginPath();
                        ctx.moveTo(x - 30, y);
                        ctx.lineTo(x, y - 10);
                        ctx.lineTo(x + 30, y);
                        ctx.closePath();
                        ctx.fill();
                        ctx.restore();
                        
                        // Heal player
                        if (simulation.cycle % 120 === 0 && typeof m !== 'undefined' && m.alive) {
                            m.health = Math.min(m.maxHealth, m.health + 0.05);
                        }
                    }
                });
            }
        },
        
        grantPhotonicArsenal() {
            // Add photonic weapons
            if (window.photonicContent) {
                window.photonicContent.weapons.forEach(w => {
                    w.have = true;
                    if (typeof b !== 'undefined' && !b.guns.find(g => g.name === w.name)) {
                        b.guns.push(w);
                        b.inventory.push(b.guns.length - 1);
                    }
                });
                if (typeof simulation !== 'undefined') simulation.makeGunHUD();
            }
        },
        
        grantMovementTechs() {
            if (window.movementTechs && typeof tech !== 'undefined') {
                window.movementTechs.forEach(t => {
                    const existing = tech.tech.find(et => et.name === t.name);
                    if (existing) existing.count = existing.maxCount;
                });
            }
        },
        
        tryUnlock(code) {
            const upperCode = code.toUpperCase().trim();
            if (this.codes[upperCode]) {
                if (!this.codes[upperCode].unlocked) {
                    this.codes[upperCode].unlocked = true;
                    this.unlockedCodes.push(upperCode);
                    localStorage.setItem('unlocked_codes', JSON.stringify(this.unlockedCodes));
                    this.codes[upperCode].apply();
                    const message = upperCode === 'QROW2025' ? 'you have awakened ✓' : this.codes[upperCode].name;
                    return { success: true, name: message };
                }
                return { success: false, message: 'Already unlocked!' };
            }
            return { success: false, message: 'Invalid code' };
        },
        
        applyUnlockedCodes() {
            this.unlockedCodes.forEach(code => {
                if (this.codes[code]) {
                    this.codes[code].apply();
                }
            });
        },
        
        loadSavedCodes() {
            try {
                const saved = localStorage.getItem('unlocked_codes');
                if (saved) {
                    this.unlockedCodes = JSON.parse(saved);
                    this.unlockedCodes.forEach(code => {
                        if (this.codes[code]) this.codes[code].unlocked = true;
                    });
                }
            } catch (e) {
                console.log('No saved unlock codes');
            }
        },
        
        init() {
            this.loadSavedCodes();
            
            // Setup unlock button listener
            document.addEventListener('DOMContentLoaded', () => {
                const btn = document.getElementById('unlock-code-btn');
                const input = document.getElementById('unlock-code');
                const status = document.getElementById('unlock-status');
                
                if (btn && input && status) {
                    btn.addEventListener('click', () => {
                        const result = window.unlockCodes.tryUnlock(input.value);
                        if (result.success) {
                            status.style.color = '#0a0';
                            status.textContent = `✓ Unlocked: ${result.name}!`;
                            input.value = '';
                        } else {
                            status.style.color = '#c00';
                            status.textContent = `✗ ${result.message}`;
                        }
                        setTimeout(() => status.textContent = '', 3000);
                    });
                    
                    input.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') btn.click();
                    });
                }
            });
            
            console.log('%c🔓 Unlock Codes System Loaded!', 'color: #FFD700; font-weight: bold;');
        }
    };
    
    window.unlockCodes.init();
})();
