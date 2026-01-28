// Mob Rewards - Earn money and drop items when killing mobs
if (typeof window.mobRewards === 'undefined') {
    window.mobRewards = {
        
        baseMoneyReward: 10,
        lastMobCount: 0,
        
        getRewardForMob(mobType) {
            const rewards = {
                'default': { money: 10, oreChance: 0.15, potionChance: 0.05, cosmeticChance: 0.01 },
                'boss': { money: 100, oreChance: 0.8, potionChance: 0.5, cosmeticChance: 0.2 },
                'elite': { money: 50, oreChance: 0.4, potionChance: 0.2, cosmeticChance: 0.05 },
                'swarm': { money: 5, oreChance: 0.08, potionChance: 0.02, cosmeticChance: 0.005 }
            };
            return rewards[mobType] || rewards['default'];
        },
        
        onMobKill(mob) {
            const reward = this.getRewardForMob(mob?.isBoss ? 'boss' : 'default');
            
            // Money reward
            if (window.marketplace) {
                window.marketplace.earnMoney(reward.money);
            }
            
            // Ore drop
            if (Math.random() < reward.oreChance && window.forging) {
                const ore = window.forging.dropOre();
                console.log(`Dropped: ${ore.name}`);
            }
            
            // Potion drop
            if (Math.random() < reward.potionChance && window.potions && window.inventory) {
                const potion = window.potions.list[Math.floor(Math.random() * window.potions.list.length)];
                window.inventory.add({
                    id: potion.id,
                    name: potion.name,
                    icon: potion.icon,
                    type: 'potion',
                    rarity: potion.duration > 1000 ? 'rare' : 'common',
                    stackable: true,
                    consumable: true
                });
                console.log(`Dropped potion: ${potion.name}`);
            }
            
            // Cosmetic unlock
            if (Math.random() < reward.cosmeticChance && window.customization) {
                const cosmetic = window.customization.grantRandomCosmetic();
                if (cosmetic) {
                    console.log(`Unlocked cosmetic: ${cosmetic.name}!`);
                }
            }
        },
        
        checkForKills() {
            if (typeof mob === 'undefined') return;
            
            const aliveMobs = mob.filter(m => m.alive).length;
            
            // Detect kills
            if (aliveMobs < this.lastMobCount) {
                const killCount = this.lastMobCount - aliveMobs;
                for (let i = 0; i < killCount; i++) {
                    this.onMobKill({});
                }
            }
            
            this.lastMobCount = aliveMobs;
        },
        
        init() {
            // Check for kills every 100ms
            setInterval(() => this.checkForKills(), 100);
            console.log('%c💀 Mob Rewards System Active! Kill mobs for loot!', 'color: #e74c3c; font-weight: bold;');
        }
    };
    
    window.mobRewards.init();
}
