// Inventory System - Stores items, potions, ores, and equipment
if (typeof window.inventory === 'undefined') {
    window.inventory = {
        items: [],
        maxSlots: 120,
        isOpen: false,
        selectedItemId: null,
        equipped: {
            weapon: null,
            armor: null,
            accessory: null,
            cosmetic: null
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
            return true;
        },

        remove(itemId, quantity = 1) {
            const idx = this.items.findIndex(i => i.id === itemId);
            if (idx === -1) return false;
            this.items[idx].quantity -= quantity;
            if (this.items[idx].quantity <= 0) {
                this.items.splice(idx, 1);
                if (this.selectedItemId === itemId) this.selectedItemId = null;
            }
            return true;
        },

        has(itemId, quantity = 1) {
            const item = this.items.find(i => i.id === itemId);
            return !!(item && item.quantity >= quantity);
        },

        getSelected() {
            return this.items.find((i) => i.id === this.selectedItemId) || null;
        },

        select(itemId) {
            this.selectedItemId = itemId;
            this.render();
        },

        equip(itemId, type = 'weapon') {
            const item = this.items.find(i => i.id === itemId);
            if (!item) return false;

            this.equipped[type] = itemId;
            if (item.onEquip) item.onEquip();
            if (typeof m !== 'undefined' && item.statBoost) Object.assign(m, item.statBoost);
            this.render();
            return true;
        },

        unequip(type = 'weapon') {
            const item = this.items.find(i => i.id === this.equipped[type]);
            if (item?.onUnequip) item.onUnequip();
            this.equipped[type] = null;
            this.render();
            return true;
        },

        use(itemId) {
            const item = this.items.find(i => i.id === itemId);
            if (!item) return false;

            if (item.type === 'potion' && window.potions) {
                const ok = window.potions.use(item.id);
                if (!ok) return false;
                this.remove(item.id);
                this.render();
                return true;
            }
            if (item.equipable) {
                this.equip(itemId, item.equipType || 'weapon');
                return true;
            }
            if (item.onUse) {
                item.onUse();
                if (item.consumable) this.remove(item.id);
                this.render();
                return true;
            }
            return false;
        },

        toggle() {
            this.isOpen = !this.isOpen;
            if (this.isOpen && !this.selectedItemId && this.items[0]) this.selectedItemId = this.items[0].id;
            this.render();
        },

        cosmeticModelDraw() {
            const cosmeticId = this.equipped.cosmetic;
            if (!cosmeticId || !m?.alive) return;
            const item = this.items.find((i) => i.id === cosmeticId);
            const model = item?.model;
            if (!model || typeof ctx === 'undefined') return;

            const x = m.pos.x;
            const y = m.pos.y;

            ctx.save();
            if (model.type === 'halo') {
                ctx.strokeStyle = model.color || '#ffd166';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(x, y - 36, 20, 0, Math.PI * 2);
                ctx.stroke();
            } else if (model.type === 'horns') {
                ctx.fillStyle = model.color || '#ef476f';
                ctx.beginPath();
                ctx.moveTo(x - 18, y - 28); ctx.lineTo(x - 10, y - 52); ctx.lineTo(x - 2, y - 28);
                ctx.moveTo(x + 18, y - 28); ctx.lineTo(x + 10, y - 52); ctx.lineTo(x + 2, y - 28);
                ctx.fill();
            } else if (model.type === 'wings') {
                ctx.fillStyle = model.color || 'rgba(120,220,255,.55)';
                ctx.beginPath();
                ctx.ellipse(x - 26, y - 6, 18, 28, 0.4, 0, Math.PI * 2);
                ctx.ellipse(x + 26, y - 6, 18, 28, -0.4, 0, Math.PI * 2);
                ctx.fill();
            } else if (model.type === 'orbital') {
                const a = simulation.cycle * 0.06;
                for (let i = 0; i < 3; i++) {
                    const ang = a + i * (Math.PI * 2 / 3);
                    ctx.fillStyle = model.color || '#8be9fd';
                    ctx.beginPath();
                    ctx.arc(x + Math.cos(ang) * 30, y - 12 + Math.sin(ang) * 12, 5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.restore();
        },

        ensureCosmeticEphemera() {
            if (!Array.isArray(simulation?.ephemera)) return;
            if (simulation.ephemera.find(e => e.name === 'inventory-cosmetic-models')) return;
            simulation.ephemera.push({ name: 'inventory-cosmetic-models', do: () => this.cosmeticModelDraw() });
        },

        render() {
            let panel = document.getElementById('inventory-panel');
            if (!panel) {
                panel = document.createElement('div');
                panel.id = 'inventory-panel';
                panel.style.cssText = `
                    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    width: 720px; max-height: 650px; background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
                    border: 3px solid #e94560; border-radius: 15px; padding: 18px; z-index: 2000;
                    display: none; overflow-y: auto; font-family: Arial, sans-serif; box-shadow: 0 0 30px rgba(233, 69, 96, 0.5);
                `;
                document.body.appendChild(panel);
            }

            if (!this.isOpen) {
                panel.style.display = 'none';
                return;
            }
            panel.style.display = 'block';

            const selected = this.getSelected();
            let html = `
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                    <h2 style="color:#e94560;margin:0;">🎒 Inventory</h2>
                    <button onclick="window.inventory.toggle()" style="background:#e94560;border:none;color:white;padding:8px 15px;border-radius:5px;cursor:pointer;">✕</button>
                </div>
                <div style="display:grid;grid-template-columns: 2fr 1fr;gap:14px;">
                    <div style="display:grid;grid-template-columns: repeat(6, 1fr); gap:8px; align-content:start;">
            `;

            this.items.forEach((item) => {
                const selectedStyle = this.selectedItemId === item.id ? 'box-shadow:0 0 0 2px #8be9fd inset;' : '';
                html += `
                    <div onclick="window.inventory.select('${item.id}')" style="background:rgba(255,255,255,0.1);border:2px solid ${item.rarity === 'mythic' ? '#ff4d6d' : item.rarity === 'legendary' ? '#ffd700' : item.rarity === 'rare' ? '#9b59b6' : item.rarity === 'uncommon' ? '#3498db' : '#95a5a6'};border-radius:8px;padding:8px;text-align:center;cursor:pointer;${selectedStyle}">
                        <div style="font-size:22px;">${item.icon || '📦'}</div>
                        <div style="color:white;font-size:10px;line-height:1.15;">${item.name}</div>
                        <div style="color:#aaa;font-size:10px;">x${item.quantity}</div>
                    </div>
                `;
            });

            for (let i = this.items.length; i < 48; i++) {
                html += `<div style="background:rgba(255,255,255,0.05); border:2px dashed #333; border-radius:8px; min-height:58px;"></div>`;
            }

            html += `</div>
                <div style="background:rgba(255,255,255,.07);border:1px solid #415a77;border-radius:10px;padding:10px;color:#dff7ff;">
                    <h3 style="margin:0 0 8px 0;">Selected Item</h3>
                    ${selected ? `<div style="font-size:30px">${selected.icon || '📦'}</div>
                    <div style="font-weight:bold;margin-top:4px;">${selected.name}</div>
                    <div style="font-size:12px;opacity:.85;margin:4px 0;">Type: ${selected.type || 'misc'} • Qty: ${selected.quantity}</div>
                    <div style="font-size:12px;color:#9ec1d4;min-height:44px;">${selected.desc || 'No description available.'}</div>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">
                        <button onclick="window.inventory.use('${selected.id}')" style="background:#2ecc71;border:none;color:#fff;padding:8px 10px;border-radius:6px;cursor:pointer;">Use</button>
                        ${selected.equipable ? `<button onclick="window.inventory.equip('${selected.id}','${selected.equipType || 'weapon'}')" style="background:#3a86ff;border:none;color:#fff;padding:8px 10px;border-radius:6px;cursor:pointer;">Equip</button>` : ''}
                        ${selected.equipType && this.equipped[selected.equipType] === selected.id ? `<button onclick="window.inventory.unequip('${selected.equipType}')" style="background:#ef476f;border:none;color:#fff;padding:8px 10px;border-radius:6px;cursor:pointer;">Unequip</button>` : ''}
                    </div>` : '<div style="opacity:.8">Click an item then press <strong>Use</strong>.</div>'}
                    <hr style="border-color:#2c3e50;margin:10px 0;">
                    <div style="font-size:12px;">Cosmetic equipped: <strong>${this.equipped.cosmetic || 'none'}</strong></div>
                </div>
            </div>`;

            panel.innerHTML = html;
        },

        init() {
            setInterval(() => this.ensureCosmeticEphemera(), 1200);
            console.log('%c🎒 Inventory System Loaded!', 'color: #e94560; font-weight: bold;');
        }
    };

    window.inventory.init();
}
