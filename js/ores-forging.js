// Ores & Forging System - Collect ores, forge and merge items
if (typeof window.forging === 'undefined') {
    window.forging = {
        isOpen: false,
        
        ores: [
            { id: 'copper_ore', name: 'Copper Ore', icon: '🟤', tier: 1, value: 10 },
            { id: 'tin_ore', name: 'Tin Ore', icon: '⚪', tier: 1, value: 12 },
            { id: 'iron_ore', name: 'Iron Ore', icon: '⬜', tier: 2, value: 25 },
            { id: 'silver_ore', name: 'Silver Ore', icon: '🪙', tier: 2, value: 40 },
            { id: 'gold_ore', name: 'Gold Ore', icon: '🟡', tier: 3, value: 75 },
            { id: 'platinum_ore', name: 'Platinum Ore', icon: '🔘', tier: 3, value: 100 },
            { id: 'diamond_ore', name: 'Diamond Ore', icon: '💎', tier: 4, value: 200 },
            { id: 'mythril_ore', name: 'Mythril Ore', icon: '🔵', tier: 4, value: 300 },
            { id: 'adamantite_ore', name: 'Adamantite Ore', icon: '🔴', tier: 5, value: 450 },
            { id: 'orichalcum_ore', name: 'Orichalcum Ore', icon: '🟠', tier: 5, value: 500 },
            { id: 'void_ore', name: 'Void Ore', icon: '🟣', tier: 6, value: 750 },
            { id: 'celestial_ore', name: 'Celestial Ore', icon: '✨', tier: 6, value: 1000 },
            { id: 'primordial_ore', name: 'Primordial Ore', icon: '🌌', tier: 7, value: 1500 },
            { id: 'cosmic_ore', name: 'Cosmic Ore', icon: '🌠', tier: 7, value: 2000 },
        ],
        
        recipes: [
            { name: 'Bronze Bar', icon: '🥉', requires: [{ id: 'copper_ore', qty: 3 }, { id: 'tin_ore', qty: 2 }], result: { id: 'bronze_bar', type: 'material', bonus: '+5% damage' } },
            { name: 'Steel Bar', icon: '⚙️', requires: [{ id: 'iron_ore', qty: 4 }], result: { id: 'steel_bar', type: 'material', bonus: '+10% damage' } },
            { name: 'Electrum Bar', icon: '💫', requires: [{ id: 'gold_ore', qty: 2 }, { id: 'silver_ore', qty: 2 }], result: { id: 'electrum_bar', type: 'material', bonus: '+15% damage' } },
            { name: 'Mythril Blade', icon: '🗡️', requires: [{ id: 'mythril_ore', qty: 5 }], result: { id: 'mythril_blade', type: 'weapon', bonus: '+25% damage' } },
            { name: 'Diamond Edge', icon: '💎', requires: [{ id: 'diamond_ore', qty: 4 }, { id: 'steel_bar', qty: 2 }], result: { id: 'diamond_edge', type: 'weapon', bonus: '+40% crit' } },
            { name: 'Void Shard', icon: '🌀', requires: [{ id: 'void_ore', qty: 3 }], result: { id: 'void_shard', type: 'accessory', bonus: 'Phase through walls' } },
            { name: 'Celestial Crown', icon: '👑', requires: [{ id: 'celestial_ore', qty: 5 }, { id: 'gold_ore', qty: 10 }], result: { id: 'celestial_crown', type: 'cosmetic', bonus: 'Divine glow effect' } },
            { name: 'Cosmic Armor', icon: '🛡️', requires: [{ id: 'cosmic_ore', qty: 4 }, { id: 'adamantite_ore', qty: 3 }], result: { id: 'cosmic_armor', type: 'armor', bonus: '-50% damage taken' } },
            { name: 'Primordial Core', icon: '💠', requires: [{ id: 'primordial_ore', qty: 3 }, { id: 'void_ore', qty: 2 }], result: { id: 'primordial_core', type: 'accessory', bonus: '+100% all stats' } },
            { name: 'Shadow Cloak', icon: '🌑', requires: [{ id: 'void_ore', qty: 4 }, { id: 'adamantite_ore', qty: 2 }], result: { id: 'shadow_cloak', type: 'armor', bonus: '+20% invisibility' } },
            { name: 'Radiant Amulet', icon: '✨', requires: [{ id: 'celestial_ore', qty: 3 }, { id: 'platinum_ore', qty: 4 }], result: { id: 'radiant_amulet', type: 'accessory', bonus: '+30% healing' } },
            { name: 'Void Gauntlets', icon: '✊', requires: [{ id: 'void_ore', qty: 5 }, { id: 'cosmic_ore', qty: 2 }], result: { id: 'void_gauntlets', type: 'weapon', bonus: '+50% punch damage' } },
            { name: 'Eternal Aegis', icon: '🛡️✨', requires: [{ id: 'primordial_ore', qty: 4 }, { id: 'celestial_ore', qty: 4 }], result: { id: 'eternal_aegis', type: 'armor', bonus: 'Block all damage once' } },
            { name: 'Inferno Blade', icon: '🔥⚔️', requires: [{ id: 'cosmic_ore', qty: 3 }, { id: 'orichalcum_ore', qty: 3 }], result: { id: 'inferno_blade', type: 'weapon', bonus: '+40% fire damage' } },
        ],
        
        mergeTable: {
            'copper_ore': { merge: 3, result: 'iron_ore' },
            'iron_ore': { merge: 3, result: 'gold_ore' },
            'gold_ore': { merge: 3, result: 'diamond_ore' },
            'diamond_ore': { merge: 3, result: 'mythril_ore' },
            'mythril_ore': { merge: 3, result: 'adamantite_ore' },
            'adamantite_ore': { merge: 3, result: 'void_ore' },
            'void_ore': { merge: 3, result: 'celestial_ore' },
            'celestial_ore': { merge: 3, result: 'primordial_ore' },
            'primordial_ore': { merge: 3, result: 'cosmic_ore' },
        },
        
        canForge(recipe) {
            if (!window.inventory) return false;
            for (const req of recipe.requires) {
                if (!window.inventory.has(req.id, req.qty)) return false;
            }
            return true;
        },
        
        forge(recipeIdx) {
            const recipe = this.recipes[recipeIdx];
            if (!this.canForge(recipe)) {
                alert('Missing materials!');
                return false;
            }
            
            for (const req of recipe.requires) {
                window.inventory.remove(req.id, req.qty);
            }
            
            window.inventory.add({
                id: recipe.result.id,
                name: recipe.name,
                icon: recipe.icon,
                type: recipe.result.type,
                rarity: 'legendary',
                stackable: false,
                desc: recipe.result.bonus
            });
            
            this.render();
            return true;
        },
        
        canMerge(oreId) {
            if (!this.mergeTable[oreId]) return false;
            return window.inventory?.has(oreId, this.mergeTable[oreId].merge);
        },
        
        merge(oreId) {
            const mergeInfo = this.mergeTable[oreId];
            if (!this.canMerge(oreId)) return false;
            
            window.inventory.remove(oreId, mergeInfo.merge);
            
            const resultOre = this.ores.find(o => o.id === mergeInfo.result);
            window.inventory.add({
                id: resultOre.id,
                name: resultOre.name,
                icon: resultOre.icon,
                type: 'ore',
                rarity: resultOre.tier >= 5 ? 'legendary' : resultOre.tier >= 3 ? 'rare' : 'common',
                stackable: true
            });
            
            this.render();
            return true;
        },
        
        toggle() {
            this.isOpen = !this.isOpen;
            this.render();
        },
        
        render() {
            let panel = document.getElementById('forging-panel');
            if (!panel) {
                panel = document.createElement('div');
                panel.id = 'forging-panel';
                panel.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 650px;
                    max-height: 700px;
                    background: linear-gradient(180deg, #2d1b00 0%, #4a2c00 100%);
                    border: 3px solid #ff6600;
                    border-radius: 15px;
                    padding: 20px;
                    z-index: 2000;
                    display: none;
                    overflow-y: auto;
                    font-family: Arial, sans-serif;
                    box-shadow: 0 0 40px rgba(255, 102, 0, 0.5);
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
                    <h2 style="color: #ff6600; margin: 0;">🔨 Forge & Merge</h2>
                    <button onclick="window.forging.toggle()" style="background: #e74c3c; border: none; color: white; padding: 8px 15px; border-radius: 5px; cursor: pointer;">✕</button>
                </div>
                
                <h3 style="color: #ffaa00; border-bottom: 1px solid #ff6600; padding-bottom: 5px;">⚔️ Forge Recipes</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px;">
            `;
            
            this.recipes.forEach((recipe, idx) => {
                const canForge = this.canForge(recipe);
                html += `
                    <div style="background: rgba(0,0,0,0.3); border: 2px solid ${canForge ? '#2ecc71' : '#555'}; border-radius: 8px; padding: 10px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                            <span style="font-size: 28px;">${recipe.icon}</span>
                            <span style="color: white; font-weight: bold;">${recipe.name}</span>
                        </div>
                        <div style="color: #aaa; font-size: 11px; margin-bottom: 8px;">
                            Requires: ${recipe.requires.map(r => `${r.qty}x ${r.id.replace('_', ' ')}`).join(', ')}
                        </div>
                        <div style="color: #2ecc71; font-size: 11px; margin-bottom: 8px;">${recipe.result.bonus}</div>
                        <button onclick="window.forging.forge(${idx})" style="
                            background: ${canForge ? '#ff6600' : '#444'};
                            border: none; color: white; padding: 6px 12px;
                            border-radius: 5px; cursor: ${canForge ? 'pointer' : 'not-allowed'};
                            width: 100%;
                        " ${canForge ? '' : 'disabled'}>Forge</button>
                    </div>
                `;
            });
            
            html += `</div>
                <h3 style="color: #ffaa00; border-bottom: 1px solid #ff6600; padding-bottom: 5px;">🔄 Merge Ores (3→1 upgrade)</h3>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
            `;
            
            this.ores.forEach(ore => {
                const canMerge = this.canMerge(ore.id);
                const resultOre = this.mergeTable[ore.id] ? this.ores.find(o => o.id === this.mergeTable[ore.id].result) : null;
                
                html += `
                    <div onclick="${canMerge ? `window.forging.merge('${ore.id}')` : ''}" style="
                        background: rgba(0,0,0,0.3);
                        border: 2px solid ${canMerge ? '#2ecc71' : '#333'};
                        border-radius: 8px;
                        padding: 8px;
                        text-align: center;
                        cursor: ${canMerge ? 'pointer' : 'default'};
                        opacity: ${canMerge ? '1' : '0.5'};
                    ">
                        <div style="font-size: 24px;">${ore.icon}</div>
                        <div style="color: white; font-size: 10px;">${ore.name}</div>
                        ${resultOre ? `<div style="color: #aaa; font-size: 9px;">→ ${resultOre.icon}</div>` : ''}
                    </div>
                `;
            });
            
            html += '</div>';
            panel.innerHTML = html;
        },
        
        dropOre() {
            const rand = Math.random();
            let ore;
            if (rand < 0.4) ore = this.ores[Math.floor(Math.random() * 2)];
            else if (rand < 0.65) ore = this.ores[2 + Math.floor(Math.random() * 2)];
            else if (rand < 0.82) ore = this.ores[4 + Math.floor(Math.random() * 2)];
            else if (rand < 0.92) ore = this.ores[6 + Math.floor(Math.random() * 2)];
            else if (rand < 0.97) ore = this.ores[8 + Math.floor(Math.random() * 2)];
            else if (rand < 0.99) ore = this.ores[10 + Math.floor(Math.random() * 2)];
            else ore = this.ores[12 + Math.floor(Math.random() * 2)];
            
            if (window.inventory) {
                window.inventory.add({
                    id: ore.id,
                    name: ore.name,
                    icon: ore.icon,
                    type: 'ore',
                    rarity: ore.tier >= 5 ? 'legendary' : ore.tier >= 3 ? 'rare' : 'common',
                    stackable: true
                });
            }
            return ore;
        },
        
        init() {
            console.log('%c⛏️ Forging System Loaded! 14 ores + 9 recipes!', 'color: #ff6600; font-weight: bold;');
        }
    };
    
    window.forging.init();
}
