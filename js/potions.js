// Potions System - 35+ potions with temporary effects
if (typeof window.potions === 'undefined') {
    window.potions = {
        activeEffects: [],
        
        list: [
            // Health & Defense (1-8)
            { id: 'health_potion', name: 'Health Potion', icon: '❤️', duration: 0, effect: 'instant', desc: 'Restore 25% health', apply() { if(m) m.health = Math.min(m.maxHealth, m.health + 0.25); } },
            { id: 'mega_health', name: 'Mega Health Potion', icon: '💖', duration: 0, effect: 'instant', desc: 'Restore 50% health', apply() { if(m) m.health = Math.min(m.maxHealth, m.health + 0.5); } },
            { id: 'full_heal', name: 'Full Restore', icon: '💝', duration: 0, effect: 'instant', desc: 'Restore 100% health', apply() { if(m) m.health = m.maxHealth; } },
            { id: 'regen_potion', name: 'Regeneration', icon: '💚', duration: 1200, effect: 'regen', desc: 'Heal over 20s', apply() { if(m) m.health = Math.min(m.maxHealth, m.health + 0.01); } },
            { id: 'shield_potion', name: 'Shield Potion', icon: '🛡️', duration: 900, effect: 'shield', desc: 'Block damage 15s', apply() { if(m) m.immuneToHarm = true; }, remove() { if(m) m.immuneToHarm = false; } },
            { id: 'iron_skin', name: 'Iron Skin', icon: '🔩', duration: 1200, effect: 'defense', desc: '-50% damage taken', tempMod: { incomingDamage: 0.5 } },
            { id: 'diamond_shell', name: 'Diamond Shell', icon: '💎', duration: 900, effect: 'defense', desc: '-75% damage taken', tempMod: { incomingDamage: 0.25 } },
            { id: 'absorption', name: 'Absorption', icon: '🫧', duration: 600, effect: 'absorb', desc: 'Extra hit points', apply() { if(m) m.health += 0.3; } },
            
            // Speed & Movement (9-16)
            { id: 'speed_potion', name: 'Speed Potion', icon: '💨', duration: 1800, effect: 'speed', desc: '+50% speed 30s', tempMod: { speed: 1.5 } },
            { id: 'mega_speed', name: 'Mega Speed', icon: '⚡', duration: 900, effect: 'speed', desc: '+100% speed 15s', tempMod: { speed: 2.0 } },
            { id: 'sonic_boost', name: 'Sonic Boost', icon: '🚀', duration: 600, effect: 'speed', desc: '+200% speed 10s', tempMod: { speed: 3.0 } },
            { id: 'feather_fall', name: 'Feather Fall', icon: '🪶', duration: 1800, effect: 'gravity', desc: 'Slow falling', tempMod: { gravity: 0.3 } },
            { id: 'leaping', name: 'Leaping Potion', icon: '🦘', duration: 1200, effect: 'jump', desc: '+100% jump height', tempMod: { jump: 2.0 } },
            { id: 'super_jump', name: 'Super Jump', icon: '🦸', duration: 600, effect: 'jump', desc: '+300% jump height', tempMod: { jump: 4.0 } },
            { id: 'dash_potion', name: 'Dash Potion', icon: '💫', duration: 1800, effect: 'dash', desc: 'Enable air dash', tempMod: { canDash: true } },
            { id: 'flight', name: 'Flight Elixir', icon: '🕊️', duration: 600, effect: 'flight', desc: 'Temporary flight', tempMod: { canFly: true } },
            
            // Damage & Combat (17-26)
            { id: 'damage_potion', name: 'Damage Potion', icon: '⚔️', duration: 1800, effect: 'damage', desc: '+50% damage 30s', tempMod: { damage: 1.5 } },
            { id: 'mega_damage', name: 'Mega Damage', icon: '🗡️', duration: 900, effect: 'damage', desc: '+100% damage 15s', tempMod: { damage: 2.0 } },
            { id: 'berserker', name: 'Berserker Rage', icon: '😤', duration: 600, effect: 'damage', desc: '+200% damage, +50% speed', tempMod: { damage: 3.0, speed: 1.5 } },
            { id: 'fire_power', name: 'Fire Power', icon: '🔥', duration: 1200, effect: 'fire', desc: 'Attacks burn enemies', tempMod: { fireDamage: true } },
            { id: 'ice_power', name: 'Ice Power', icon: '❄️', duration: 1200, effect: 'ice', desc: 'Attacks slow enemies', tempMod: { slowDamage: true } },
            { id: 'lightning', name: 'Lightning Strike', icon: '⚡', duration: 1200, effect: 'lightning', desc: 'Chain lightning on hit', tempMod: { chainDamage: true } },
            { id: 'poison_coat', name: 'Poison Coating', icon: '🧪', duration: 1200, effect: 'poison', desc: 'Attacks poison enemies', tempMod: { poisonDamage: true } },
            { id: 'vampiric', name: 'Vampiric Essence', icon: '🧛', duration: 1200, effect: 'lifesteal', desc: 'Heal on damage dealt', tempMod: { lifesteal: 0.1 } },
            { id: 'critical_eye', name: 'Critical Eye', icon: '🎯', duration: 1200, effect: 'crit', desc: '+50% crit chance', tempMod: { critChance: 0.5 } },
            { id: 'explosive', name: 'Explosive Shots', icon: '💥', duration: 900, effect: 'explosive', desc: 'Bullets explode', tempMod: { explosive: true } },
            
            // Utility (27-35)
            { id: 'invisibility', name: 'Invisibility', icon: '👻', duration: 900, effect: 'invisible', desc: 'Invisible 15s', apply() { if(m) m.isInvisible = true; }, remove() { if(m) m.isInvisible = false; } },
            { id: 'giant_potion', name: 'Giant Growth', icon: '🦣', duration: 1200, effect: 'size', desc: '2x size, +100% dmg', tempMod: { size: 2.0, damage: 2.0 } },
            { id: 'shrink_potion', name: 'Shrinking', icon: '🐜', duration: 1200, effect: 'size', desc: '0.5x size, harder to hit', tempMod: { size: 0.5 } },
            { id: 'magnet', name: 'Magnet Potion', icon: '🧲', duration: 1800, effect: 'magnet', desc: 'Attract pickups', tempMod: { magnetRange: 300 } },
            { id: 'lucky', name: 'Luck Potion', icon: '🍀', duration: 1800, effect: 'luck', desc: 'Better drops 30s', tempMod: { luckBonus: 0.5 } },
            { id: 'wealthy', name: 'Wealth Potion', icon: '💰', duration: 1800, effect: 'wealth', desc: '2x money earned', tempMod: { moneyMult: 2.0 } },
            { id: 'xray', name: 'X-Ray Vision', icon: '👁️', duration: 1200, effect: 'xray', desc: 'See through walls', tempMod: { xrayVision: true } },
            { id: 'time_slow', name: 'Time Dilation', icon: '⏱️', duration: 600, effect: 'time', desc: 'Slow time around you', tempMod: { timeScale: 0.5 } },
            { id: 'chaos', name: 'Chaos Elixir', icon: '🌀', duration: 900, effect: 'chaos', desc: 'Random effects!', apply() { this.applyRandomEffect(); } },
            
            // Legendary (36-40)
            { id: 'godmode', name: 'Divine Blessing', icon: '✨', duration: 600, effect: 'godmode', desc: 'Invincible 10s', apply() { if(m) m.immuneToHarm = true; }, remove() { if(m) m.immuneToHarm = false; } },
            { id: 'omega', name: 'Omega Serum', icon: '🌟', duration: 900, effect: 'omega', desc: 'All stats +100%', tempMod: { damage: 2.0, speed: 2.0, jump: 2.0 } },
            { id: 'phoenix', name: 'Phoenix Tear', icon: '🔶', duration: 0, effect: 'revive', desc: 'Auto-revive on death', apply() { if(m) m.hasRevive = true; } },
            { id: 'black_hole', name: 'Black Hole Brew', icon: '🕳️', duration: 1200, effect: 'vortex', desc: 'Pull enemies in', tempMod: { vortexPull: true } },
            { id: 'supernova', name: 'Supernova Elixir', icon: '☀️', duration: 600, effect: 'supernova', desc: 'Massive AOE damage', apply() { this.triggerSupernova(); } },
        ],
        
        applyRandomEffect() {
            const randomPotion = this.list[Math.floor(Math.random() * this.list.length)];
            if (randomPotion.id !== 'chaos') {
                this.use(randomPotion.id);
            }
        },
        
        triggerSupernova() {
            if (typeof b !== 'undefined' && typeof simulation !== 'undefined') {
                for (let i = 0; i < 20; i++) {
                    const angle = (i / 20) * Math.PI * 2;
                    const dist = 200;
                    const x = (m?.pos?.x || 400) + Math.cos(angle) * dist;
                    const y = (m?.pos?.y || 300) + Math.sin(angle) * dist;
                    b.explosion({ x, y }, 100);
                }
            }
        },
        
        use(potionId) {
            const potion = this.list.find(p => p.id === potionId);
            if (!potion) return false;
            
            console.log(`Using potion: ${potion.name}`);
            
            if (potion.apply) {
                potion.apply.call(this);
            }
            
            if (potion.duration > 0) {
                this.activeEffects.push({
                    ...potion,
                    startTime: Date.now(),
                    endTime: Date.now() + (potion.duration * 16.67)
                });
            }
            
            return true;
        },
        
        update() {
            const now = Date.now();
            for (let i = this.activeEffects.length - 1; i >= 0; i--) {
                const effect = this.activeEffects[i];
                
                // Apply tempMod effects continuously
                if (effect.tempMod && typeof m !== 'undefined') {
                    if (effect.tempMod.damage) m.damageMultiplier = (m.damageMultiplier || 1) * effect.tempMod.damage;
                    if (effect.tempMod.speed) m.Fx = (m.Fx || 0.016) * effect.tempMod.speed;
                    if (effect.tempMod.jump) m.jumpForce = (m.jumpForce || 0.42) * effect.tempMod.jump;
                    if (effect.tempMod.incomingDamage) m.incomingDamageMultiplier = effect.tempMod.incomingDamage;
                    if (effect.tempMod.gravity) m.fieldFx = (m.fieldFx || 1) * effect.tempMod.gravity;
                    if (effect.tempMod.size && m.radius) m.radius = m.radius * effect.tempMod.size;
                    if (effect.tempMod.magnetRange) m.magnetRange = effect.tempMod.magnetRange;
                    if (effect.tempMod.moneyMult) m.moneyMultiplier = effect.tempMod.moneyMult;
                }
                
                if (now >= effect.endTime) {
                    if (effect.remove) effect.remove();
                    this.activeEffects.splice(i, 1);
                    console.log(`Effect expired: ${effect.name}`);
                }
            }
        },
        
        getActiveEffects() {
            return this.activeEffects.map(e => e.name);
        },
        
        init() {
            setInterval(() => this.update(), 100);
            console.log('%c🧪 Potions System Loaded! 40 potions available!', 'color: #9b59b6; font-weight: bold;');
        }
    };
    
    window.potions.init();
}
