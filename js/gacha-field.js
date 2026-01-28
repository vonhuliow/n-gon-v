// Gacha Field Ability System - Inspired by gacha anime mechanics
if (typeof window.gachaField === 'undefined') {
    window.gachaField = {
        rarity: {
            common: { color: '#95a5a6', chance: 0.45, rarity: 'common' },
            uncommon: { color: '#3498db', chance: 0.30, rarity: 'uncommon' },
            rare: { color: '#9b59b6', chance: 0.15, rarity: 'rare' },
            legendary: { color: '#f1c40f', chance: 0.08, rarity: 'legendary' },
            mythic: { color: '#e74c3c', chance: 0.02, rarity: 'mythic' }
        },
        
        abilities: [
            // Common
            { id: 'lucky_draw', name: 'Lucky Draw', rarity: 'common', icon: '🎲', desc: '+20% rare drops', effect() { if(m) m.luckBonus = 0.2; } },
            { id: 'fortune', name: 'Fortune', rarity: 'common', icon: '🍀', desc: '+15% money earned', effect() { if(m) m.moneyMultiplier = 1.15; } },
            { id: 'basic_luck', name: 'Basic Luck', rarity: 'common', icon: '⭐', desc: '+10% damage', effect() { if(m) m.damageMultiplier = 1.1; } },
            
            // Uncommon
            { id: 'summon_ally', name: 'Summon Ally', rarity: 'uncommon', icon: '👥', desc: 'Summon 2 helper drones', effect() { for(let i=0; i<2; i++) { if(typeof b !== 'undefined') b.drone(); } } },
            { id: 'gacha_spin', name: 'Gacha Spin', rarity: 'uncommon', icon: '🎪', desc: 'Random stat boost', effect() { this.randomBoost(); } },
            { id: 'blessing', name: 'Blessing', rarity: 'uncommon', icon: '✨', desc: '+25% all stats', effect() { if(m) { m.damageMultiplier = 1.25; m.Fx = m.Fx * 1.25; m.jumpForce = m.jumpForce * 1.25; } } },
            
            // Rare
            { id: 'summon_dragon', name: 'Summon Dragon', rarity: 'rare', icon: '🐉', desc: 'Summon powerful dragon ally', effect() { if(window.celestialBots) window.celestialBots.summonDragon?.(); } },
            { id: 'celestial_blessing', name: 'Celestial Blessing', rarity: 'rare', icon: '🌟', desc: '+50% damage & speed', effect() { if(m) { m.damageMultiplier = 1.5; m.Fx = m.Fx * 1.5; } } },
            { id: 'infinite_luck', name: 'Infinite Luck', rarity: 'rare', icon: '🎰', desc: '+50% drops for 30s', effect() { if(m) m.luckBonus = 0.5; } },
            
            // Legendary
            { id: 'perfect_pull', name: 'Perfect Pull', rarity: 'legendary', icon: '✨💎', desc: 'All stats x2 for 20s', effect() { this.applyLegendaryBuff(); } },
            { id: 'wish_granted', name: 'Wish Granted', rarity: 'legendary', icon: '🎇', desc: 'Summon 5 allies + 100% buff', effect() { for(let i=0; i<5; i++) { if(typeof b !== 'undefined') b.drone(); } if(m) { m.damageMultiplier = 2; m.Fx = m.Fx * 2; } } },
            { id: 'legendary_resonance', name: 'Legendary Resonance', rarity: 'legendary', icon: '💫', desc: 'Golden aura + all effects x3', effect() { this.applyResonance(); } },
            
            // Mythic
            { id: 'divine_ascension', name: 'Divine Ascension', rarity: 'mythic', icon: '👑✨', desc: 'Godmode + summon divine army', effect() { if(m) m.immuneToHarm = true; for(let i=0; i<10; i++) { if(typeof b !== 'undefined') b.laser(m.pos, { x: m.pos.x + Math.random()*400-200, y: m.pos.y + Math.random()*400-200 }, 50); } } },
        ],
        
        activeAbility: null,
        lastGacha: 0,
        gachaCooldown: 300, // frames
        
        performGacha() {
            if (simulation.cycle - this.lastGacha < this.gachaCooldown) return null;
            
            const rand = Math.random();
            let selected = null;
            let cumulative = 0;
            
            for (const [key, rarity] of Object.entries(this.rarity)) {
                cumulative += rarity.chance;
                if (rand <= cumulative) {
                    const abilitiesOfRarity = this.abilities.filter(a => a.rarity === key);
                    selected = abilitiesOfRarity[Math.floor(Math.random() * abilitiesOfRarity.length)];
                    break;
                }
            }
            
            if (selected) {
                this.activeAbility = selected;
                this.lastGacha = simulation.cycle;
                if (selected.effect) selected.effect.call(this);
                console.log(`✨ Gacha Pull! Obtained: ${selected.name} (${selected.rarity})`);
            }
            return selected;
        },
        
        randomBoost() {
            const boosts = [
                () => { if(m) m.damageMultiplier = 1.5; },
                () => { if(m) m.Fx = m.Fx * 1.5; },
                () => { if(m) m.jumpForce = m.jumpForce * 1.5; },
                () => { if(m) m.health = Math.min(m.maxHealth, m.health + 0.3); }
            ];
            boosts[Math.floor(Math.random() * boosts.length)]();
        },
        
        applyLegendaryBuff() {
            if (typeof m === 'undefined') return;
            m.damageMultiplier = 2;
            m.Fx = m.Fx * 2;
            m.jumpForce = m.jumpForce * 2;
            setTimeout(() => {
                if (m) {
                    m.damageMultiplier = 1;
                    m.Fx = m.Fx / 2;
                    m.jumpForce = m.jumpForce / 2;
                }
            }, 20000);
        },
        
        applyResonance() {
            if (typeof m === 'undefined') return;
            m.damageMultiplier = 3;
            m.Fx = m.Fx * 3;
            m.jumpForce = m.jumpForce * 3;
            m.fillColor = '#ffd700';
            setTimeout(() => {
                if (m) {
                    m.damageMultiplier = 1;
                    m.Fx = m.Fx / 3;
                    m.jumpForce = m.jumpForce / 3;
                }
            }, 15000);
        },
        
        init() {
            console.log('%c🎰 Gacha Field System Loaded! Perform gacha pulls!', 'color: #f1c40f; font-weight: bold;');
        }
    };
    
    window.gachaField.init();
}
