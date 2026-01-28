// Angel & Demon Bots - Origami-style biblically accurate angels and demonic beings
if (typeof window.celestialBots === 'undefined') {
    window.celestialBots = {
        
        angelBots: [],
        demonBots: [],
        
        angelConfig: {
            name: 'Seraphim',
            description: 'Biblically accurate angel - multiple wings, rings of eyes',
            health: 100,
            damage: 15,
            speed: 3,
            orbitRadius: 150,
            style: {
                baseColor: '#ffd700',
                glowColor: 'rgba(255, 215, 0, 0.5)',
                eyeColor: '#ffffff',
                wingColor: '#fffacd',
                rings: 3,
                eyesPerRing: 6,
                wings: 6
            }
        },
        
        demonConfig: {
            name: 'Infernal',
            description: 'Demonic being - horns, dark flames, twisted form',
            health: 80,
            damage: 25,
            speed: 5,
            aggroRadius: 300,
            style: {
                baseColor: '#8b0000',
                glowColor: 'rgba(139, 0, 0, 0.6)',
                eyeColor: '#ff0000',
                hornColor: '#2d0000',
                flames: true,
                horns: 4
            }
        },
        
        spawnAngel(x, y) {
            const angel = {
                id: 'angel_' + Date.now(),
                x: x || m?.pos?.x || 400,
                y: y || m?.pos?.y || 300,
                vx: 0,
                vy: 0,
                angle: Math.random() * Math.PI * 2,
                health: this.angelConfig.health,
                maxHealth: this.angelConfig.health,
                orbitAngle: Math.random() * Math.PI * 2,
                eyePhase: 0,
                wingPhase: 0,
                active: true
            };
            this.angelBots.push(angel);
            console.log('🕊️ Seraphim angel summoned');
            return angel;
        },
        
        spawnDemon(x, y) {
            const demon = {
                id: 'demon_' + Date.now(),
                x: x || m?.pos?.x || 400,
                y: y || m?.pos?.y || 300,
                vx: 0,
                vy: 0,
                targetX: null,
                targetY: null,
                health: this.demonConfig.health,
                maxHealth: this.demonConfig.health,
                attackCooldown: 0,
                flamePhase: 0,
                active: true
            };
            this.demonBots.push(demon);
            console.log('😈 Infernal demon summoned');
            return demon;
        },
        
        update() {
            if (typeof m === 'undefined' || !m.alive) return;
            
            // Update angels (orbit around player)
            this.angelBots.forEach((angel, idx) => {
                if (!angel.active) return;
                
                angel.orbitAngle += 0.02;
                angel.eyePhase += 0.05;
                angel.wingPhase += 0.1;
                
                const targetX = m.pos.x + Math.cos(angel.orbitAngle + idx * (Math.PI * 2 / Math.max(1, this.angelBots.length))) * this.angelConfig.orbitRadius;
                const targetY = m.pos.y + Math.sin(angel.orbitAngle + idx * (Math.PI * 2 / Math.max(1, this.angelBots.length))) * this.angelConfig.orbitRadius;
                
                angel.x += (targetX - angel.x) * 0.1;
                angel.y += (targetY - angel.y) * 0.1;
            });
            
            // Update demons (hunt enemies)
            this.demonBots.forEach(demon => {
                if (!demon.active) return;
                
                demon.flamePhase += 0.15;
                demon.attackCooldown = Math.max(0, demon.attackCooldown - 1);
                
                // Find nearest enemy
                let nearestEnemy = null;
                let nearestDist = Infinity;
                
                if (typeof mob !== 'undefined') {
                    for (let i = 0; i < mob.length; i++) {
                        if (mob[i].alive) {
                            const dist = Math.hypot(mob[i].position.x - demon.x, mob[i].position.y - demon.y);
                            if (dist < nearestDist && dist < this.demonConfig.aggroRadius) {
                                nearestDist = dist;
                                nearestEnemy = mob[i];
                            }
                        }
                    }
                }
                
                if (nearestEnemy) {
                    const dx = nearestEnemy.position.x - demon.x;
                    const dy = nearestEnemy.position.y - demon.y;
                    const dist = Math.hypot(dx, dy);
                    
                    demon.vx = (dx / dist) * this.demonConfig.speed;
                    demon.vy = (dy / dist) * this.demonConfig.speed;
                    demon.x += demon.vx;
                    demon.y += demon.vy;
                    
                    // Attack if close
                    if (dist < 50 && demon.attackCooldown <= 0) {
                        nearestEnemy.damage(this.demonConfig.damage / 100);
                        demon.attackCooldown = 60;
                    }
                } else {
                    // Return to player
                    const dx = m.pos.x - demon.x;
                    const dy = m.pos.y - demon.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist > 100) {
                        demon.vx = (dx / dist) * this.demonConfig.speed * 0.5;
                        demon.vy = (dy / dist) * this.demonConfig.speed * 0.5;
                        demon.x += demon.vx;
                        demon.y += demon.vy;
                    }
                }
            });
        },
        
        draw(ctx) {
            // Draw angels
            this.angelBots.forEach(angel => {
                if (!angel.active) return;
                
                ctx.save();
                ctx.translate(angel.x, angel.y);
                
                // Glow
                ctx.shadowColor = this.angelConfig.style.glowColor;
                ctx.shadowBlur = 30;
                
                // Outer rings with eyes (biblically accurate)
                for (let ring = 0; ring < this.angelConfig.style.rings; ring++) {
                    const ringRadius = 20 + ring * 15;
                    ctx.strokeStyle = this.angelConfig.style.baseColor;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
                    ctx.stroke();
                    
                    // Eyes on ring
                    for (let eye = 0; eye < this.angelConfig.style.eyesPerRing; eye++) {
                        const eyeAngle = (eye / this.angelConfig.style.eyesPerRing) * Math.PI * 2 + angel.eyePhase + ring * 0.5;
                        const eyeX = Math.cos(eyeAngle) * ringRadius;
                        const eyeY = Math.sin(eyeAngle) * ringRadius;
                        
                        ctx.fillStyle = this.angelConfig.style.eyeColor;
                        ctx.beginPath();
                        ctx.arc(eyeX, eyeY, 4, 0, Math.PI * 2);
                        ctx.fill();
                        
                        ctx.fillStyle = '#4169e1';
                        ctx.beginPath();
                        ctx.arc(eyeX, eyeY, 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                
                // Wings (origami style)
                for (let wing = 0; wing < this.angelConfig.style.wings; wing++) {
                    const wingAngle = (wing / this.angelConfig.style.wings) * Math.PI * 2;
                    const flapOffset = Math.sin(angel.wingPhase + wing) * 5;
                    
                    ctx.save();
                    ctx.rotate(wingAngle);
                    ctx.fillStyle = this.angelConfig.style.wingColor;
                    ctx.globalAlpha = 0.7;
                    
                    // Origami fold pattern
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(40 + flapOffset, -15);
                    ctx.lineTo(60, 0);
                    ctx.lineTo(40 + flapOffset, 15);
                    ctx.closePath();
                    ctx.fill();
                    
                    ctx.strokeStyle = this.angelConfig.style.baseColor;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    
                    // Fold lines
                    ctx.beginPath();
                    ctx.moveTo(20, 0);
                    ctx.lineTo(45 + flapOffset, -8);
                    ctx.moveTo(20, 0);
                    ctx.lineTo(45 + flapOffset, 8);
                    ctx.stroke();
                    
                    ctx.restore();
                }
                
                // Core
                ctx.fillStyle = this.angelConfig.style.baseColor;
                ctx.beginPath();
                ctx.arc(0, 0, 10, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            });
            
            // Draw demons
            this.demonBots.forEach(demon => {
                if (!demon.active) return;
                
                ctx.save();
                ctx.translate(demon.x, demon.y);
                
                // Dark flames
                ctx.shadowColor = 'rgba(255, 0, 0, 0.5)';
                ctx.shadowBlur = 20;
                
                for (let flame = 0; flame < 8; flame++) {
                    const flameAngle = (flame / 8) * Math.PI * 2;
                    const flameLen = 15 + Math.sin(demon.flamePhase + flame) * 8;
                    
                    ctx.fillStyle = `rgba(${139 + Math.random() * 50}, 0, 0, 0.6)`;
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(
                        Math.cos(flameAngle - 0.2) * 12,
                        Math.sin(flameAngle - 0.2) * 12
                    );
                    ctx.lineTo(
                        Math.cos(flameAngle) * flameLen,
                        Math.sin(flameAngle) * flameLen
                    );
                    ctx.lineTo(
                        Math.cos(flameAngle + 0.2) * 12,
                        Math.sin(flameAngle + 0.2) * 12
                    );
                    ctx.closePath();
                    ctx.fill();
                }
                
                // Body (twisted origami)
                ctx.fillStyle = this.demonConfig.style.baseColor;
                ctx.beginPath();
                ctx.moveTo(0, -15);
                ctx.lineTo(12, 0);
                ctx.lineTo(8, 15);
                ctx.lineTo(-8, 15);
                ctx.lineTo(-12, 0);
                ctx.closePath();
                ctx.fill();
                
                // Horns
                for (let horn = 0; horn < this.demonConfig.style.horns; horn++) {
                    const hornAngle = (horn / this.demonConfig.style.horns) * Math.PI - Math.PI / 2;
                    ctx.save();
                    ctx.rotate(hornAngle);
                    ctx.fillStyle = this.demonConfig.style.hornColor;
                    ctx.beginPath();
                    ctx.moveTo(-3, -15);
                    ctx.lineTo(0, -30);
                    ctx.lineTo(3, -15);
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();
                }
                
                // Eyes
                ctx.fillStyle = this.demonConfig.style.eyeColor;
                ctx.shadowColor = 'red';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(-5, -5, 3, 0, Math.PI * 2);
                ctx.arc(5, -5, 3, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            });
        },
        
        init() {
            // Use setInterval to update and draw bots (non-invasive approach)
            setInterval(() => {
                if (typeof ctx !== 'undefined' && typeof m !== 'undefined' && m.alive) {
                    this.update();
                    this.draw(ctx);
                }
            }, 16);
            
            console.log('%c👼😈 Celestial Bots Loaded! Angels & Demons ready!', 'color: #9b59b6; font-weight: bold;');
        }
    };
    
    window.celestialBots.init();
}
