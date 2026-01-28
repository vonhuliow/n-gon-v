// Marketplace System - Buy items with money earned from kills
if (typeof window.marketplace === 'undefined') {
    window.marketplace = {
        isOpen: false,
        money: 0,
        
        categories: ['potions', 'ores', 'weapons', 'cosmetics', 'special'],
        currentCategory: 'potions',
        
        items: {
            potions: [
                { id: 'health_potion', name: 'Health Potion', icon: '❤️', price: 50, desc: 'Restore 25% health' },
                { id: 'speed_potion', name: 'Speed Potion', icon: '💨', price: 75, desc: '+50% speed for 30s' },
                { id: 'damage_potion', name: 'Damage Potion', icon: '⚔️', price: 100, desc: '+50% damage for 30s' },
                { id: 'shield_potion', name: 'Shield Potion', icon: '🛡️', price: 80, desc: 'Block next 3 hits' },
                { id: 'invisibility_potion', name: 'Invisibility Potion', icon: '👻', price: 150, desc: 'Invisible for 15s' },
                { id: 'regen_potion', name: 'Regeneration Potion', icon: '💚', price: 120, desc: 'Heal over time 20s' },
                { id: 'giant_potion', name: 'Giant Potion', icon: '🦣', price: 200, desc: 'Grow 2x size, +100% damage' },
                { id: 'shrink_potion', name: 'Shrink Potion', icon: '🐜', price: 150, desc: 'Shrink 50%, harder to hit' },
            ],
            ores: [
                { id: 'copper_ore', name: 'Copper Ore', icon: '🟤', price: 25, desc: 'Basic crafting material' },
                { id: 'iron_ore', name: 'Iron Ore', icon: '⬜', price: 50, desc: 'Standard ore for weapons' },
                { id: 'gold_ore', name: 'Gold Ore', icon: '🟡', price: 100, desc: 'Premium ore' },
                { id: 'diamond_ore', name: 'Diamond Ore', icon: '💎', price: 250, desc: 'Rare and valuable' },
                { id: 'mythril_ore', name: 'Mythril Ore', icon: '🔵', price: 400, desc: 'Magical properties' },
                { id: 'adamantite_ore', name: 'Adamantite Ore', icon: '🔴', price: 500, desc: 'Extremely durable' },
                { id: 'void_ore', name: 'Void Ore', icon: '🟣', price: 750, desc: 'From another dimension' },
                { id: 'celestial_ore', name: 'Celestial Ore', icon: '✨', price: 1000, desc: 'Divine material' },
            ],
            weapons: [
                { id: 'plasma_blade', name: 'Plasma Blade', icon: '⚡', price: 500, desc: 'Energy melee weapon' },
                { id: 'void_cannon', name: 'Void Cannon', icon: '🌀', price: 800, desc: 'Fires black hole projectiles' },
                { id: 'thunder_staff', name: 'Thunder Staff', icon: '🌩️', price: 600, desc: 'Chain lightning attacks' },
                { id: 'frost_bow', name: 'Frost Bow', icon: '🏹', price: 450, desc: 'Freezing arrows' },
            ],
            cosmetics: [
                { id: 'rainbow_trail', name: 'Rainbow Trail', icon: '🌈', price: 300, desc: 'Leave a rainbow trail' },
                { id: 'fire_aura', name: 'Fire Aura', icon: '🔥', price: 400, desc: 'Burning visual effect' },
                { id: 'star_crown', name: 'Star Crown', icon: '👑', price: 500, desc: 'Sparkling crown' },
                { id: 'demon_horns', name: 'Demon Horns', icon: '😈', price: 350, desc: 'Menacing horns' },
            ],
            special: [
                { id: 'extra_life', name: 'Extra Life', icon: '💖', price: 1000, desc: 'Revive once on death' },
                { id: 'double_money', name: 'Money Doubler', icon: '💰', price: 1500, desc: '2x money for 5 minutes' },
                { id: 'luck_charm', name: 'Luck Charm', icon: '🍀', price: 800, desc: 'Better drop rates' },
            ]
        },
        
        earnMoney(amount) {
            this.money += amount;
            this.updateDisplay();
            this.showFloatingMoney(amount);
        },
        
        showFloatingMoney(amount) {
            if (typeof m === 'undefined' || !m.pos) return;
            const floater = document.createElement('div');
            floater.style.cssText = `
                position: fixed;
                left: 50%;
                top: 40%;
                transform: translateX(-50%);
                color: #ffd700;
                font-size: 24px;
                font-weight: bold;
                text-shadow: 2px 2px 4px black;
                z-index: 3000;
                pointer-events: none;
                animation: floatUp 1.5s ease-out forwards;
            `;
            floater.textContent = `+$${amount}`;
            document.body.appendChild(floater);
            setTimeout(() => floater.remove(), 1500);
        },
        
        updateDisplay() {
            const display = document.getElementById('money-amount');
            if (display) display.textContent = this.money;
        },
        
        buy(itemId) {
            let item = null;
            for (const cat of this.categories) {
                item = this.items[cat].find(i => i.id === itemId);
                if (item) break;
            }
            if (!item) return false;
            
            if (this.money < item.price) {
                alert('Not enough money!');
                return false;
            }
            
            this.money -= item.price;
            this.updateDisplay();
            
            const invItem = {
                id: item.id,
                name: item.name,
                icon: item.icon,
                type: this.currentCategory === 'potions' ? 'potion' : this.currentCategory,
                rarity: item.price > 500 ? 'legendary' : item.price > 200 ? 'rare' : item.price > 75 ? 'uncommon' : 'common',
                stackable: ['potions', 'ores'].includes(this.currentCategory),
                consumable: this.currentCategory === 'potions'
            };
            
            if (window.inventory) {
                window.inventory.add(invItem);
            }
            
            this.render();
            return true;
        },
        
        toggle() {
            this.isOpen = !this.isOpen;
            this.render();
        },
        
        setCategory(cat) {
            this.currentCategory = cat;
            this.render();
        },
        
        render() {
            let panel = document.getElementById('marketplace-panel');
            if (!panel) {
                panel = document.createElement('div');
                panel.id = 'marketplace-panel';
                panel.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 600px;
                    max-height: 700px;
                    background: linear-gradient(180deg, #0f0f23 0%, #1a1a3e 100%);
                    border: 3px solid #ffd700;
                    border-radius: 15px;
                    padding: 20px;
                    z-index: 2000;
                    display: none;
                    overflow-y: auto;
                    font-family: Arial, sans-serif;
                    box-shadow: 0 0 40px rgba(255, 215, 0, 0.4);
                `;
                document.body.appendChild(panel);
            }
            
            if (!this.isOpen) {
                panel.style.display = 'none';
                return;
            }
            
            panel.style.display = 'block';
            
            let html = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h2 style="color: #ffd700; margin: 0;">🏪 Marketplace</h2>
                    <div style="color: #ffd700; font-size: 20px;">💰 $${this.money}</div>
                    <button onclick="window.marketplace.toggle()" style="background: #e74c3c; border: none; color: white; padding: 8px 15px; border-radius: 5px; cursor: pointer;">✕</button>
                </div>
                <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
            `;
            
            this.categories.forEach(cat => {
                const isActive = cat === this.currentCategory;
                html += `<button onclick="window.marketplace.setCategory('${cat}')" style="
                    background: ${isActive ? '#ffd700' : '#333'};
                    color: ${isActive ? '#000' : '#fff'};
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    text-transform: capitalize;
                ">${cat}</button>`;
            });
            
            html += '</div><div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">';
            
            const currentItems = this.items[this.currentCategory] || [];
            currentItems.forEach(item => {
                const canAfford = this.money >= item.price;
                html += `
                    <div style="
                        background: rgba(255,255,255,0.05);
                        border: 2px solid ${canAfford ? '#2ecc71' : '#e74c3c'};
                        border-radius: 10px;
                        padding: 15px;
                        display: flex;
                        align-items: center;
                        gap: 15px;
                    ">
                        <div style="font-size: 40px;">${item.icon}</div>
                        <div style="flex: 1;">
                            <div style="color: white; font-weight: bold;">${item.name}</div>
                            <div style="color: #aaa; font-size: 12px;">${item.desc}</div>
                            <div style="color: #ffd700; margin-top: 5px;">$${item.price}</div>
                        </div>
                        <button onclick="window.marketplace.buy('${item.id}')" style="
                            background: ${canAfford ? '#2ecc71' : '#555'};
                            border: none;
                            color: white;
                            padding: 10px 15px;
                            border-radius: 5px;
                            cursor: ${canAfford ? 'pointer' : 'not-allowed'};
                        " ${canAfford ? '' : 'disabled'}>Buy</button>
                    </div>
                `;
            });
            
            html += '</div>';
            panel.innerHTML = html;
        },
        
        init() {
            document.addEventListener('keydown', (e) => {
                if (e.key.toLowerCase() === 'm') {
                    this.toggle();
                }
            });
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes floatUp {
                    0% { opacity: 1; transform: translateX(-50%) translateY(0); }
                    100% { opacity: 0; transform: translateX(-50%) translateY(-50px); }
                }
            `;
            document.head.appendChild(style);
            
            console.log('%c🏪 Marketplace Loaded! Press M to open!', 'color: #ffd700; font-weight: bold;');
        }
    };
    
    window.marketplace.init();
}
