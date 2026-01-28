// Customization System - Colors, hats, eyes, accessories
if (typeof window.customization === 'undefined') {
    window.customization = {
        isOpen: false,
        
        equipped: {
            color: 'default',
            hat: null,
            eyes: null,
            accessory: null,
            trail: null,
            aura: null
        },
        
        unlocked: {
            colors: ['default'],
            hats: [],
            eyes: [],
            accessories: [],
            trails: [],
            auras: []
        },
        
        items: {
            colors: [
                { id: 'default', name: 'Default', preview: '#666', animated: false },
                { id: 'crimson', name: 'Crimson', preview: '#e74c3c', animated: false },
                { id: 'ocean', name: 'Ocean Blue', preview: '#3498db', animated: false },
                { id: 'forest', name: 'Forest Green', preview: '#27ae60', animated: false },
                { id: 'royal', name: 'Royal Purple', preview: '#9b59b6', animated: false },
                { id: 'golden', name: 'Golden', preview: '#f1c40f', animated: false },
                { id: 'obsidian', name: 'Obsidian', preview: '#2c3e50', animated: false },
                { id: 'rainbow', name: 'Rainbow', preview: 'linear-gradient(90deg, red, orange, yellow, green, blue, purple)', animated: true },
                { id: 'galaxy', name: 'Galaxy', preview: 'linear-gradient(45deg, #1a1a2e, #4a148c, #1a1a2e)', animated: true },
                { id: 'fire', name: 'Inferno', preview: 'linear-gradient(45deg, #ff0000, #ff6600, #ffcc00)', animated: true },
                { id: 'ice', name: 'Frozen', preview: 'linear-gradient(45deg, #a8e6cf, #dcedc1, #88d8b0)', animated: true },
                { id: 'void', name: 'Void Walker', preview: 'linear-gradient(45deg, #000, #4a0080, #000)', animated: true },
                { id: 'neon', name: 'Neon Pulse', preview: 'linear-gradient(45deg, #ff00ff, #00ffff)', animated: true },
                { id: 'sunset', name: 'Sunset', preview: 'linear-gradient(90deg, #ff6600, #ffcc00, #ff3300)', animated: true },
                { id: 'aurora', name: 'Aurora', preview: 'linear-gradient(90deg, #00ff00, #00ffff, #ff00ff)', animated: true },
                { id: 'magma', name: 'Magma', preview: 'linear-gradient(45deg, #ff0000, #ff6600, #330000)', animated: true },
                { id: 'diamond', name: 'Diamond Shine', preview: 'linear-gradient(45deg, #ffffff, #e0e0e0, #ffffff)', animated: true },
                { id: 'shadow', name: 'Shadow Black', preview: '#1a1a1a', animated: false },
            ],
            hats: [
                { id: 'crown', name: 'Royal Crown', icon: '👑', rarity: 'legendary' },
                { id: 'tophat', name: 'Top Hat', icon: '🎩', rarity: 'rare' },
                { id: 'wizard', name: 'Wizard Hat', icon: '🧙', rarity: 'rare' },
                { id: 'cowboy', name: 'Cowboy Hat', icon: '🤠', rarity: 'uncommon' },
                { id: 'party', name: 'Party Hat', icon: '🎉', rarity: 'common' },
                { id: 'halo', name: 'Angel Halo', icon: '😇', rarity: 'legendary' },
                { id: 'horns', name: 'Devil Horns', icon: '😈', rarity: 'rare' },
                { id: 'bunny', name: 'Bunny Ears', icon: '🐰', rarity: 'uncommon' },
                { id: 'cat', name: 'Cat Ears', icon: '🐱', rarity: 'uncommon' },
                { id: 'santa', name: 'Santa Hat', icon: '🎅', rarity: 'rare' },
                { id: 'pirate', name: 'Pirate Hat', icon: '🏴‍☠️', rarity: 'uncommon' },
                { id: 'chef', name: 'Chef Hat', icon: '👨‍🍳', rarity: 'common' },
                { id: 'space', name: 'Space Helmet', icon: '👨‍🚀', rarity: 'legendary' },
                { id: 'viking', name: 'Viking Helmet', icon: '⚔️', rarity: 'rare' },
                { id: 'propeller', name: 'Propeller Hat', icon: '🚁', rarity: 'common' },
                { id: 'flaming', name: 'Flaming Crown', icon: '🔥👑', rarity: 'legendary' },
                { id: 'frost', name: 'Frost Crown', icon: '❄️👑', rarity: 'legendary' },
                { id: 'ghost', name: 'Ghost Cap', icon: '👻', rarity: 'rare' },
            ],
            eyes: [
                { id: 'normal', name: 'Normal Eyes', icon: '👀', rarity: 'common' },
                { id: 'hearts', name: 'Heart Eyes', icon: '😍', rarity: 'uncommon' },
                { id: 'stars', name: 'Star Eyes', icon: '🤩', rarity: 'rare' },
                { id: 'fire', name: 'Fire Eyes', icon: '🔥', rarity: 'rare' },
                { id: 'laser', name: 'Laser Eyes', icon: '👁️‍🗨️', rarity: 'legendary' },
                { id: 'cyclops', name: 'Cyclops Eye', icon: '👁️', rarity: 'rare' },
                { id: 'robot', name: 'Robot Eyes', icon: '🤖', rarity: 'uncommon' },
                { id: 'alien', name: 'Alien Eyes', icon: '👽', rarity: 'rare' },
                { id: 'galaxy', name: 'Galaxy Eyes', icon: '🌌', rarity: 'legendary' },
                { id: 'rainbow', name: 'Rainbow Eyes', icon: '🌈', rarity: 'legendary' },
                { id: 'angry', name: 'Angry Eyes', icon: '😠', rarity: 'common' },
                { id: 'cool', name: 'Sunglasses', icon: '😎', rarity: 'uncommon' },
            ],
            accessories: [
                { id: 'cape', name: 'Hero Cape', icon: '🦸', rarity: 'rare' },
                { id: 'wings_angel', name: 'Angel Wings', icon: '👼', rarity: 'legendary' },
                { id: 'wings_demon', name: 'Demon Wings', icon: '🦇', rarity: 'legendary' },
                { id: 'wings_butterfly', name: 'Butterfly Wings', icon: '🦋', rarity: 'rare' },
                { id: 'jetpack', name: 'Jetpack', icon: '🚀', rarity: 'rare' },
                { id: 'sword_back', name: 'Sword (Back)', icon: '⚔️', rarity: 'uncommon' },
                { id: 'shield_back', name: 'Shield (Back)', icon: '🛡️', rarity: 'uncommon' },
                { id: 'scarf', name: 'Flowing Scarf', icon: '🧣', rarity: 'common' },
                { id: 'backpack', name: 'Adventure Pack', icon: '🎒', rarity: 'common' },
                { id: 'tail_cat', name: 'Cat Tail', icon: '🐱', rarity: 'uncommon' },
                { id: 'tail_dragon', name: 'Dragon Tail', icon: '🐉', rarity: 'legendary' },
                { id: 'wings_phoenix', name: 'Phoenix Wings', icon: '🔥🦅', rarity: 'legendary' },
                { id: 'cloak_void', name: 'Void Cloak', icon: '🌑', rarity: 'legendary' },
                { id: 'glowing_orb', name: 'Glowing Orb', icon: '🔮', rarity: 'rare' },
                { id: 'lightsaber', name: 'Light Saber (Back)', icon: '⚡', rarity: 'legendary' },
                { id: 'chains', name: 'Chains', icon: '⛓️', rarity: 'uncommon' },
            ],
            trails: [
                { id: 'rainbow', name: 'Rainbow Trail', icon: '🌈', rarity: 'rare', animated: true },
                { id: 'fire', name: 'Fire Trail', icon: '🔥', rarity: 'rare', animated: true },
                { id: 'ice', name: 'Ice Trail', icon: '❄️', rarity: 'rare', animated: true },
                { id: 'sparkle', name: 'Sparkle Trail', icon: '✨', rarity: 'uncommon', animated: true },
                { id: 'hearts', name: 'Heart Trail', icon: '💕', rarity: 'uncommon', animated: true },
                { id: 'stars', name: 'Star Trail', icon: '⭐', rarity: 'uncommon', animated: true },
                { id: 'void', name: 'Void Trail', icon: '🕳️', rarity: 'legendary', animated: true },
                { id: 'lightning', name: 'Lightning Trail', icon: '⚡', rarity: 'rare', animated: true },
            ],
            auras: [
                { id: 'flame', name: 'Flame Aura', icon: '🔥', rarity: 'rare', animated: true },
                { id: 'frost', name: 'Frost Aura', icon: '❄️', rarity: 'rare', animated: true },
                { id: 'electric', name: 'Electric Aura', icon: '⚡', rarity: 'rare', animated: true },
                { id: 'dark', name: 'Dark Aura', icon: '🌑', rarity: 'legendary', animated: true },
                { id: 'light', name: 'Light Aura', icon: '☀️', rarity: 'legendary', animated: true },
                { id: 'nature', name: 'Nature Aura', icon: '🌿', rarity: 'uncommon', animated: true },
                { id: 'cosmic', name: 'Cosmic Aura', icon: '🌌', rarity: 'legendary', animated: true },
            ]
        },
        
        currentTab: 'colors',
        
        equip(type, itemId) {
            this.equipped[type.replace('s', '')] = itemId;
            this.applyCustomizations();
            this.render();
            console.log(`Equipped ${type}: ${itemId}`);
        },
        
        applyCustomizations() {
            if (typeof m === 'undefined') return;
            
            // Apply color
            if (this.equipped.color) {
                const color = this.items.colors.find(c => c.id === this.equipped.color);
                if (color && color.preview) {
                    m.color.hue = 0; // Reset
                    m.color.sat = 0;
                    m.color.light = 100;
                    
                    if (color.id === 'crimson') { m.color.hue = 0; m.color.sat = 70; m.color.light = 50; }
                    else if (color.id === 'ocean') { m.color.hue = 200; m.color.sat = 70; m.color.light = 50; }
                    else if (color.id === 'forest') { m.color.hue = 140; m.color.sat = 70; m.color.light = 40; }
                    else if (color.id === 'royal') { m.color.hue = 280; m.color.sat = 70; m.color.light = 50; }
                    else if (color.id === 'golden') { m.color.hue = 45; m.color.sat = 100; m.color.light = 50; }
                    else if (color.id === 'obsidian') { m.color.hue = 0; m.color.sat = 0; m.color.light = 20; }
                    
                    m.setFillColors();
                }
            }
            
            // Mark that customizations should render
            m.hasCustomizations = true;
            m.equippedCustomizations = { ...this.equipped };
        },
        
        unlock(type, itemId) {
            if (!this.unlocked[type].includes(itemId)) {
                this.unlocked[type].push(itemId);
            }
        },
        
        toggle() {
            this.isOpen = !this.isOpen;
            this.render();
        },
        
        setTab(tab) {
            this.currentTab = tab;
            this.render();
        },
        
        render() {
            let panel = document.getElementById('customization-panel');
            if (!panel) {
                panel = document.createElement('div');
                panel.id = 'customization-panel';
                panel.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 600px;
                    max-height: 700px;
                    background: linear-gradient(180deg, #1a0a2e 0%, #2d1b4e 100%);
                    border: 3px solid #a855f7;
                    border-radius: 15px;
                    padding: 20px;
                    z-index: 2000;
                    display: none;
                    overflow-y: auto;
                    font-family: Arial, sans-serif;
                    box-shadow: 0 0 40px rgba(168, 85, 247, 0.5);
                `;
                document.body.appendChild(panel);
            }
            
            if (!this.isOpen) {
                panel.style.display = 'none';
                return;
            }
            
            panel.style.display = 'block';
            
            const tabs = ['colors', 'hats', 'eyes', 'accessories', 'trails', 'auras'];
            let html = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h2 style="color: #a855f7; margin: 0;">🎨 Customization</h2>
                    <button onclick="window.customization.toggle()" style="background: #e74c3c; border: none; color: white; padding: 8px 15px; border-radius: 5px; cursor: pointer;">✕</button>
                </div>
                <div style="display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap;">
            `;
            
            tabs.forEach(tab => {
                const isActive = tab === this.currentTab;
                html += `<button onclick="window.customization.setTab('${tab}')" style="
                    background: ${isActive ? '#a855f7' : '#333'};
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    text-transform: capitalize;
                ">${tab}</button>`;
            });
            
            html += '</div><div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">';
            
            const items = this.items[this.currentTab] || [];
            items.forEach(item => {
                const isUnlocked = this.currentTab === 'colors' || this.unlocked[this.currentTab].includes(item.id);
                const isEquipped = this.equipped[this.currentTab.replace('s', '')] === item.id;
                const rarityColors = { legendary: '#ffd700', rare: '#9b59b6', uncommon: '#3498db', common: '#95a5a6' };
                
                let previewStyle = '';
                if (this.currentTab === 'colors') {
                    previewStyle = item.preview.includes('gradient') 
                        ? `background: ${item.preview};` 
                        : `background: ${item.preview};`;
                }
                
                html += `
                    <div onclick="${isUnlocked ? `window.customization.equip('${this.currentTab}', '${item.id}')` : ''}" style="
                        background: rgba(255,255,255,0.05);
                        border: 3px solid ${isEquipped ? '#2ecc71' : rarityColors[item.rarity] || '#333'};
                        border-radius: 10px;
                        padding: 12px;
                        text-align: center;
                        cursor: ${isUnlocked ? 'pointer' : 'not-allowed'};
                        opacity: ${isUnlocked ? '1' : '0.4'};
                        position: relative;
                    ">
                        ${this.currentTab === 'colors' ? 
                            `<div style="width: 50px; height: 50px; ${previewStyle} border-radius: 50%; margin: 0 auto; ${item.animated ? 'animation: colorPulse 2s infinite;' : ''}"></div>` :
                            `<div style="font-size: 36px;">${item.icon}</div>`
                        }
                        <div style="color: white; font-size: 11px; margin-top: 8px;">${item.name}</div>
                        ${isEquipped ? '<div style="color: #2ecc71; font-size: 10px;">Equipped</div>' : ''}
                        ${!isUnlocked ? '<div style="position: absolute; top: 5px; right: 5px;">🔒</div>' : ''}
                    </div>
                `;
            });
            
            html += '</div>';
            panel.innerHTML = html;
        },
        
        grantRandomCosmetic() {
            const types = ['hats', 'eyes', 'accessories', 'trails', 'auras'];
            const type = types[Math.floor(Math.random() * types.length)];
            const items = this.items[type].filter(i => !this.unlocked[type].includes(i.id));
            
            if (items.length > 0) {
                const item = items[Math.floor(Math.random() * items.length)];
                this.unlock(type, item.id);
                console.log(`Unlocked cosmetic: ${item.name}`);
                return item;
            }
            return null;
        },
        
        init() {
            const style = document.createElement('style');
            style.textContent = `
                @keyframes colorPulse {
                    0%, 100% { filter: brightness(1); }
                    50% { filter: brightness(1.3); }
                }
            `;
            document.head.appendChild(style);
            
            // Unlock some default items
            this.unlocked.colors = ['default', 'crimson', 'ocean', 'forest'];
            this.unlocked.hats = ['party'];
            this.unlocked.eyes = ['normal'];
            this.unlocked.accessories = ['scarf'];
            
            console.log('%c🎨 Customization System Loaded!', 'color: #a855f7; font-weight: bold;');
        }
    };
    
    window.customization.init();
}
