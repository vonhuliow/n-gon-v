// Enhanced Experiment Mode - Player & Weapon Upgrades
if (typeof window.experimentBuffs === 'undefined') {
    window.experimentBuffs = {
        
        playerBuffs: [
            { name: '💪 Mega Health', desc: '+100% health pool', apply(player) { player.health = 2; player.maxHealth = 2; } },
            { name: '⚡ Lightning Reflexes', desc: '+50% movement speed', apply(player) { player.accelMag = (player.accelMag || 0.001) * 1.5; } },
            { name: '🛡️ Titanium Skin', desc: '-50% incoming damage', apply(player) { player.incomingDamageMultiplier = 0.5; } },
            { name: '🔥 Plasma Core', desc: '+75% weapon damage', apply(player) { player.damageMultiplier = 1.75; } },
            { name: '⭐ Godmode', desc: '+ALL stats x2', apply(player) { 
                player.health = 2;
                player.accelMag = (player.accelMag || 0.001) * 2;
                player.damageMultiplier = 2;
                player.incomingDamageMultiplier = 0.3;
            }},
            { name: '🌪️ Speed Demon', desc: '+200% acceleration', apply(player) { player.accelMag = (player.accelMag || 0.001) * 3; } },
            { name: '💎 Diamond Durability', desc: '-75% damage taken', apply(player) { player.incomingDamageMultiplier = 0.25; } },
            { name: '🎯 Sniper Vision', desc: '+30% precision & range', apply(player) { player.precision = (player.precision || 1) * 1.3; } }
        ],
        
        weaponVariants: [
            { name: '⚡ Electric Shock', desc: 'Weapon shoots electricity chains', variant: 'electric' },
            { name: '🔥 Inferno Blast', desc: 'Weapon creates fire explosions', variant: 'inferno' },
            { name: '❄️ Frozen Tundra', desc: 'Weapon freezes enemies on impact', variant: 'frozen' },
            { name: '💜 Void Pierce', desc: 'Weapon ignores armor & shields', variant: 'void' },
            { name: '🌊 Tidal Wave', desc: 'Weapon pushes enemies away', variant: 'tidal' },
            { name: '☢️ Toxic Cloud', desc: 'Weapon leaves poisonous trails', variant: 'toxic' },
            { name: '💥 Explosive Rounds', desc: 'Weapon explodes on hit', variant: 'explosive' },
            { name: '⚛️ Quantum Beam', desc: 'Weapon splits into multiple shots', variant: 'quantum' },
            { name: '🌀 Vortex Crush', desc: 'Weapon pulls & crushes enemies', variant: 'vortex' },
            { name: '✨ Celestial Judgment', desc: 'Weapon calls meteors from sky', variant: 'celestial' }
        ],
        
        activeBuffs: {
            player: [],
            weapon: null
        },
        
        drawBuffMenu(ctx) {
            // This will integrate with experiment mode menu
            console.log('📊 Experiment Buffs:', this.activeBuffs);
        },
        
        addPlayerBuff(buffName) {
            const buff = this.playerBuffs.find(b => b.name === buffName);
            if(buff && typeof m !== 'undefined' && m.alive) {
                buff.apply(m);
                this.activeBuffs.player.push(buff);
                console.log('✓ Applied buff:', buffName);
                return true;
            }
            return false;
        },
        
        applyWeaponVariant(variantName) {
            const variant = this.weaponVariants.find(w => w.name === variantName);
            if(variant) {
                this.activeBuffs.weapon = variant;
                console.log('✓ Weapon variant activated:', variantName);
                return true;
            }
            return false;
        },
        
        randomPlayerBuff() {
            return this.playerBuffs[Math.floor(Math.random() * this.playerBuffs.length)];
        },
        
        randomWeaponVariant() {
            return this.weaponVariants[Math.floor(Math.random() * this.weaponVariants.length)];
        }
    };
    
    // Integration with experiment mode if it exists
    if(typeof window.experimentMode !== 'undefined') {
        const origMenu = window.experimentMode.drawMenu;
        window.experimentMode.drawMenu = function() {
            origMenu.call(this);
            // Experiment mode now has access to buffs
        };
    }
    
    // Integration with unlock codes - apply unlocked content when game starts
    window.experimentBuffs.applyUnlockedContent = function() {
        if (window.unlockCodes && window.unlockCodes.unlockedCodes.length > 0) {
            window.unlockCodes.applyUnlockedCodes();
            console.log('%c🔓 Applied unlocked content!', 'color: #FFD700; font-weight: bold;');
        }
        if (window.photonicContent) {
            window.photonicContent.init();
        }
    };
    
    console.log('%c🎯 Experiment Buffs Loaded! 8 player upgrades + 10 weapon variants!', 'color: #FF6347; font-weight: bold;');
}
