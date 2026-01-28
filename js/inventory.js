// Inventory System - Stores items, potions, ores, and equipment
if (typeof window.inventory === 'undefined') {
    window.inventory = {
        items: [],
        maxSlots: 120,
        isOpen: false,
        equipped: {
            weapon: null,
            armor: null,
            accessory: null
        },
        
        add(item) {
            if (this.items.length >= this.maxSlots) {
                console.log('Inventory full!');
                return false;
            }
            const existing = this.items.find(i => i.id === item.id && i.stackable);
            if (existing) {
                existing.quantity = (existing.quantity || 1) + (item.quantity || 1);
            } else {
                item.quantity = item.quantity || 1;
                this.items.push(item);
            }
            console.log(`Added ${item.name} to inventory`);
            return true;
        },
        
        remove(itemId, quantity = 1) {
            const idx = this.items.findIndex(i => i.id === itemId);
            if (idx === -1) return false;
            
            this.items[idx].quantity -= quantity;
            if (this.items[idx].quantity <= 0) {
                this.items.splice(idx, 1);
            }
            return true;
        },
        
        has(itemId, quantity = 1) {
            const item = this.items.find(i => i.id === itemId);
            return item && item.quantity >= quantity;
        },
        
        equip(itemId, type = 'weapon') {
            const item = this.items.find(i => i.id === itemId);
            if (!item) return false;
            
            if (this.equipped[type]) {
                const unequipped = this.items.find(i => i.id === this.equipped[type]);
                if (unequipped) console.log(`Unequipped: ${unequipped.name}`);
            }
            
            this.equipped[type] = itemId;
            console.log(`✓ Equipped: ${item.name}`);
            
            if (item.onEquip) item.onEquip();
            if (typeof m !== 'undefined' && item.statBoost) {
                Object.assign(m, item.statBoost);
            }
            return true;
        },
        
        unequip(type = 'weapon') {
            const item = this.items.find(i => i.id === this.equipped[type]);
            if (item && item.onUnequip) item.onUnequip();
            this.equipped[type] = null;
            return true;
        },
        
        use(itemId) {
            const item = this.items.find(i => i.id === itemId);
            if (!item) return false;
            
            if (item.type === 'potion' && window.potions) {
                window.potions.use(item.id);
                this.remove(item.id);
                return true;
            }
            if (item.equipable) {
                this.equip(itemId, item.equipType || 'weapon');
                return true;
            }
            if (item.onUse) {
                item.onUse();
                if (item.consumable) this.remove(item.id);
                return true;
            }
            return false;
        },
        
        toggle() {
            this.isOpen = !this.isOpen;
            this.render();
        },
        
        render() {
            let panel = document.getElementById('inventory-panel');
            if (!panel) {
                panel = document.createElement('div');
                panel.id = 'inventory-panel';
                panel.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 500px;
                    max-height: 600px;
                    background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
                    border: 3px solid #e94560;
                    border-radius: 15px;
                    padding: 20px;
                    z-index: 2000;
                    display: none;
                    overflow-y: auto;
                    font-family: Arial, sans-serif;
                    box-shadow: 0 0 30px rgba(233, 69, 96, 0.5);
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
                    <h2 style="color: #e94560; margin: 0;">🎒 Inventory</h2>
                    <button onclick="window.inventory.toggle()" style="background: #e94560; border: none; color: white; padding: 8px 15px; border-radius: 5px; cursor: pointer;">✕</button>
                </div>
                <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px;">
            `;
            
            this.items.forEach((item, idx) => {
                html += `
                    <div onclick="window.inventory.use('${item.id}')" style="
                        background: rgba(255,255,255,0.1);
                        border: 2px solid ${item.rarity === 'legendary' ? '#ffd700' : item.rarity === 'rare' ? '#9b59b6' : item.rarity === 'uncommon' ? '#3498db' : '#95a5a6'};
                        border-radius: 8px;
                        padding: 10px;
                        text-align: center;
                        cursor: pointer;
                        transition: transform 0.2s;
                    " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                        <div style="font-size: 24px;">${item.icon || '📦'}</div>
                        <div style="color: white; font-size: 10px; margin-top: 5px;">${item.name}</div>
                        <div style="color: #aaa; font-size: 10px;">x${item.quantity}</div>
                    </div>
                `;
            });
            
            for (let i = this.items.length; i < 40; i++) {
                html += `<div style="background: rgba(255,255,255,0.05); border: 2px dashed #333; border-radius: 8px; padding: 10px; min-height: 60px;"></div>`;
            }
            
            html += '</div>';
            panel.innerHTML = html;
        },
        
        init() {
            console.log('%c🎒 Inventory System Loaded!', 'color: #e94560; font-weight: bold;');
        }
    };
    
    window.inventory.init();
}
