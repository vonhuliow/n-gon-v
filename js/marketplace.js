// Marketplace System - Buy items with money earned from kills + gacha expansion
if (typeof window.marketplace === 'undefined') {
    window.marketplace = {
        isOpen: false,
        money: 0,

        categories: ['potions', 'ores', 'weapons', 'cosmetics', 'special', 'gacha'],
        currentCategory: 'potions',

        items: {
            potions: [
                { id: 'health_potion', name: 'Health Potion', icon: '❤️', price: 50, desc: 'Restore 25% health' },
                { id: 'mega_health', name: 'Mega Health', icon: '💖', price: 130, desc: 'Restore 50% health' },
                { id: 'regen_potion', name: 'Regeneration', icon: '💚', price: 120, desc: 'Heal over time' },
                { id: 'shield_potion', name: 'Shield Potion', icon: '🛡️', price: 100, desc: 'Damage reduction shield' },
                { id: 'speed_potion', name: 'Speed Potion', icon: '💨', price: 95, desc: '+50% speed for 30s' },
                { id: 'damage_potion', name: 'Damage Potion', icon: '⚔️', price: 130, desc: '+50% damage for 30s' },
                { id: 'void_draught', name: 'Void Draught', icon: '🕳️', price: 250, desc: 'Huge damage surge' },
                { id: 'omega', name: 'Omega Serum', icon: '🌟', price: 420, desc: 'All-stat boost' },
                { id: 'phoenix', name: 'Phoenix Ember', icon: '🔥', price: 300, desc: 'Burst heal + ring blast' },
                { id: 'haste_core', name: 'Haste Core', icon: '⚡', price: 280, desc: 'High speed/jump' },
            ],
            ores: [
                { id: 'copper_ore', name: 'Copper Ore', icon: '🟤', price: 25, desc: 'Basic crafting material' },
                { id: 'iron_ore', name: 'Iron Ore', icon: '⬜', price: 50, desc: 'Standard ore' },
                { id: 'gold_ore', name: 'Gold Ore', icon: '🟡', price: 100, desc: 'Premium ore' },
                { id: 'diamond_ore', name: 'Diamond Ore', icon: '💎', price: 250, desc: 'Rare and valuable' },
                { id: 'mythril_ore', name: 'Mythril Ore', icon: '🔵', price: 400, desc: 'Magical properties' },
                { id: 'adamantite_ore', name: 'Adamantite Ore', icon: '🔴', price: 500, desc: 'Extremely durable' },
                { id: 'void_ore', name: 'Void Ore', icon: '🟣', price: 750, desc: 'From another dimension' },
                { id: 'celestial_ore', name: 'Celestial Ore', icon: '✨', price: 1000, desc: 'Divine material' },
            ],
            weapons: [
                { id: 'plasma_blade', name: 'Plasma Blade', icon: '⚡', price: 500, desc: 'Energy melee weapon' },
                { id: 'void_cannon', name: 'Void Cannon', icon: '🌀', price: 800, desc: 'Fires singularity rounds' },
                { id: 'thunder_staff', name: 'Thunder Staff', icon: '🌩️', price: 600, desc: 'Chain arc bolts' },
                { id: 'frost_bow', name: 'Frost Bow', icon: '🏹', price: 450, desc: 'Freezing arrow rain' },
            ],
            cosmetics: [
                { id: 'sun_halo', name: 'Sun Halo', icon: '🪽', price: 280, desc: 'Golden ring above player', equipable: true, equipType: 'cosmetic', model: { type: 'halo', color: '#ffd166' } },
                { id: 'void_horns', name: 'Void Horns', icon: '😈', price: 300, desc: 'Dark crystal horns', equipable: true, equipType: 'cosmetic', model: { type: 'horns', color: '#b5179e' } },
                { id: 'aqua_wings', name: 'Aqua Wings', icon: '🦋', price: 360, desc: 'Fluid shoulder wings', equipable: true, equipType: 'cosmetic', model: { type: 'wings', color: 'rgba(72,202,228,.65)' } },
                { id: 'orbit_shards', name: 'Orbit Shards', icon: '🪐', price: 420, desc: 'Three orbiting shards', equipable: true, equipType: 'cosmetic', model: { type: 'orbital', color: '#90e0ef' } },
                { id: 'ember_halo', name: 'Ember Halo', icon: '🔥', price: 500, desc: 'High rarity fiery halo', equipable: true, equipType: 'cosmetic', model: { type: 'halo', color: '#ff595e' } },
                { id: 'royal_horns', name: 'Royal Horns', icon: '👑', price: 620, desc: 'Legend-tier horn model', equipable: true, equipType: 'cosmetic', model: { type: 'horns', color: '#ffd700' } },
            ],
            special: [
                { id: 'extra_life', name: 'Extra Life', icon: '💖', price: 1000, desc: 'Revive once on death' },
                { id: 'double_money', name: 'Money Doubler', icon: '💰', price: 1500, desc: '2x money for 5 minutes' },
                { id: 'luck_charm', name: 'Luck Charm', icon: '🍀', price: 800, desc: 'Better drop rates' },
            ],
            gacha: [
                { id: 'gacha_pull_basic', name: 'Basic Pull', icon: '🎲', price: 120, desc: '1 roll from mixed pool' },
                { id: 'gacha_pull_elite', name: 'Elite Pull', icon: '🎰', price: 480, desc: 'Higher chance of rare drops' },
                { id: 'gacha_pull_chaos', name: 'Chaos Pull', icon: '🧿', price: 1600, desc: 'Insane highs and lows' },
            ]
        },

        gachaPools: {
            basic: [
                { rarity: 'insane low', weight: 60, items: [
                    { id: 'junk_dust', name: 'Junk Dust', icon: '🪨', type: 'ore', desc: 'Practically worthless dust', stackable: true },
                    { id: 'copper_ore', name: 'Copper Ore', icon: '🟤', type: 'ore', stackable: true },
                    { id: 'exp_potion_01', name: 'ember tonic 1', icon: '🔥', type: 'potion', consumable: true, stackable: true }
                ]},
                { rarity: 'low', weight: 28, items: [
                    { id: 'health_potion', name: 'Health Potion', icon: '❤️', type: 'potion', consumable: true, stackable: true },
                    { id: 'speed_potion', name: 'Speed Potion', icon: '💨', type: 'potion', consumable: true, stackable: true }
                ]},
                { rarity: 'high', weight: 10, items: [
                    { id: 'sun_halo', name: 'Sun Halo', icon: '🪽', type: 'cosmetics', equipable: true, equipType: 'cosmetic', model: { type: 'halo', color: '#ffd166' } },
                    { id: 'aqua_wings', name: 'Aqua Wings', icon: '🦋', type: 'cosmetics', equipable: true, equipType: 'cosmetic', model: { type: 'wings', color: 'rgba(72,202,228,.65)' } }
                ]},
                { rarity: 'insane high', weight: 2, items: [
                    { id: 'omega', name: 'Omega Serum', icon: '🌟', type: 'potion', consumable: true, stackable: true },
                    { id: 'royal_horns', name: 'Royal Horns', icon: '👑', type: 'cosmetics', equipable: true, equipType: 'cosmetic', model: { type: 'horns', color: '#ffd700' } }
                ]}
            ],
            elite: [
                { rarity: 'insane low', weight: 32, items: [{ id: 'iron_ore', name: 'Iron Ore', icon: '⬜', type: 'ore', stackable: true }]},
                { rarity: 'low', weight: 38, items: [{ id: 'regen_potion', name: 'Regeneration', icon: '💚', type: 'potion', consumable: true, stackable: true }]},
                { rarity: 'high', weight: 22, items: [{ id: 'orbit_shards', name: 'Orbit Shards', icon: '🪐', type: 'cosmetics', equipable: true, equipType: 'cosmetic', model: { type: 'orbital', color: '#90e0ef' } }]},
                { rarity: 'insane high', weight: 8, items: [{ id: 'void_draught', name: 'Void Draught', icon: '🕳️', type: 'potion', consumable: true, stackable: true }]}
            ],
            chaos: [
                { rarity: 'insane low', weight: 74, items: [{ id: 'junk_dust', name: 'Junk Dust', icon: '🪨', type: 'ore', stackable: true }]},
                { rarity: 'high', weight: 18, items: [{ id: 'ember_halo', name: 'Ember Halo', icon: '🔥', type: 'cosmetics', equipable: true, equipType: 'cosmetic', model: { type: 'halo', color: '#ff595e' } }]},
                { rarity: 'insane high', weight: 8, items: [
                    { id: 'omega', name: 'Omega Serum', icon: '🌟', type: 'potion', consumable: true, stackable: true },
                    { id: 'royal_horns', name: 'Royal Horns', icon: '👑', type: 'cosmetics', equipable: true, equipType: 'cosmetic', model: { type: 'horns', color: '#ffd700' } }
                ]}
            ]
        },

        earnMoney(amount) {
            this.money += amount;
            this.updateDisplay();
            this.showFloatingMoney(amount);
        },

        showFloatingMoney(amount) {
            const floater = document.createElement('div');
            floater.style.cssText = `
                position: fixed; left: 50%; top: 40%; transform: translateX(-50%);
                color: #ffd700; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px black;
                z-index: 3000; pointer-events: none; animation: floatUp 1.5s ease-out forwards;
            `;
            floater.textContent = `+$${amount}`;
            document.body.appendChild(floater);
            setTimeout(() => floater.remove(), 1500);
        },

        updateDisplay() {
            const display = document.getElementById('money-amount');
            if (display) display.textContent = this.money;
        },

        rarityFromPrice(price) {
            return price > 1000 ? 'mythic' : price > 500 ? 'legendary' : price > 250 ? 'rare' : price > 120 ? 'uncommon' : 'common';
        },

        addToInventory(item, categoryHint = null) {
            const category = categoryHint || this.currentCategory;
            const invItem = {
                id: item.id,
                name: item.name,
                icon: item.icon,
                desc: item.desc,
                type: category === 'potions' ? 'potion' : category,
                rarity: item.rarity || this.rarityFromPrice(item.price || 0),
                stackable: item.stackable ?? ['potions', 'ores'].includes(category),
                consumable: item.consumable ?? (category === 'potions'),
                equipable: !!item.equipable,
                equipType: item.equipType,
                model: item.model
            };
            return window.inventory?.add(invItem);
        },

        weightedPick(entries) {
            const total = entries.reduce((s, e) => s + e.weight, 0);
            let roll = Math.random() * total;
            for (const entry of entries) {
                roll -= entry.weight;
                if (roll <= 0) return entry;
            }
            return entries[entries.length - 1];
        },

        pullGacha(tier = 'basic') {
            const pool = this.gachaPools[tier] || this.gachaPools.basic;
            const rarityBucket = this.weightedPick(pool);
            const prize = rarityBucket.items[Math.floor(Math.random() * rarityBucket.items.length)];
            this.addToInventory(prize, prize.type || 'special');
            this.render();
            const rarityColor = rarityBucket.rarity === 'insane high' ? '#ff4d6d' : rarityBucket.rarity === 'high' ? '#ffd166' : rarityBucket.rarity === 'low' ? '#4cc9f0' : '#adb5bd';
            simulation?.inGameConsole?.(`<span style='color:${rarityColor}'>Gacha ${tier.toUpperCase()}: ${rarityBucket.rarity} → ${prize.name}</span>`, 140);
            return true;
        },

        buy(itemId) {
            let item = null;
            let sourceCategory = this.currentCategory;
            for (const cat of this.categories) {
                const hit = this.items[cat]?.find(i => i.id === itemId);
                if (hit) {
                    item = hit;
                    sourceCategory = cat;
                    break;
                }
            }
            if (!item) return false;

            if (this.money < item.price) {
                alert('Not enough money!');
                return false;
            }

            this.money -= item.price;
            this.updateDisplay();

            if (sourceCategory === 'gacha') {
                if (item.id.includes('elite')) this.pullGacha('elite');
                else if (item.id.includes('chaos')) this.pullGacha('chaos');
                else this.pullGacha('basic');
                return true;
            }

            this.addToInventory(item, sourceCategory);
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
                    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    width: 760px; max-height: 720px; background: linear-gradient(180deg, #0f0f23 0%, #1a1a3e 100%);
                    border: 3px solid #ffd700; border-radius: 15px; padding: 20px; z-index: 2000;
                    display: none; overflow-y: auto; font-family: Arial, sans-serif; box-shadow: 0 0 40px rgba(255, 215, 0, 0.4);
                `;
                document.body.appendChild(panel);
            }

            if (!this.isOpen) {
                panel.style.display = 'none';
                return;
            }

            panel.style.display = 'block';
            let html = `
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
                    <h2 style="color:#ffd700;margin:0;">🏪 Marketplace</h2>
                    <div style="color:#ffd700;font-size:20px;">💰 $${this.money}</div>
                    <button onclick="window.marketplace.toggle()" style="background:#e74c3c;border:none;color:white;padding:8px 15px;border-radius:5px;cursor:pointer;">✕</button>
                </div>
                <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
            `;

            this.categories.forEach(cat => {
                const isActive = cat === this.currentCategory;
                html += `<button onclick="window.marketplace.setCategory('${cat}')" style="background:${isActive ? '#ffd700' : '#333'};color:${isActive ? '#000' : '#fff'};border:none;padding:8px 14px;border-radius:8px;cursor:pointer;font-weight:bold;text-transform:capitalize;">${cat}</button>`;
            });

            html += '</div>';
            if (this.currentCategory === 'gacha') {
                html += `<div style="margin-bottom:10px;color:#dff7ff;font-size:13px;background:rgba(255,255,255,.06);border:1px solid #2b2d42;padding:8px;border-radius:8px;">Gacha has <strong>insane low</strong> and <strong>insane high</strong> tiers. Chaos pull has brutal lows but jackpot highs.</div>`;
            }

            html += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">';
            const currentItems = this.items[this.currentCategory] || [];
            currentItems.forEach(item => {
                const canAfford = this.money >= item.price;
                html += `
                    <div style="background:rgba(255,255,255,0.05);border:2px solid ${canAfford ? '#2ecc71' : '#e74c3c'};border-radius:10px;padding:12px;display:flex;align-items:center;gap:12px;">
                        <div style="font-size:34px;">${item.icon}</div>
                        <div style="flex:1;">
                            <div style="color:white;font-weight:bold;">${item.name}</div>
                            <div style="color:#aaa;font-size:12px;">${item.desc}</div>
                            <div style="color:#ffd700;margin-top:4px;">$${item.price}</div>
                        </div>
                        <button onclick="window.marketplace.buy('${item.id}')" style="background:${canAfford ? '#2ecc71' : '#555'};border:none;color:white;padding:9px 12px;border-radius:5px;cursor:${canAfford ? 'pointer' : 'not-allowed'};" ${canAfford ? '' : 'disabled'}>Buy</button>
                    </div>`;
            });
            html += '</div>';
            panel.innerHTML = html;
        },

        init() {
            document.addEventListener('keydown', (e) => {
                if (e.key.toLowerCase() === 'm') this.toggle();
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
