// Potions System - expanded potion catalog with real-time effects and HUD icons
if (typeof window.potions === 'undefined') {
    window.potions = {
        activeEffects: [],
        runtime: {
            mounted: false,
            iconHost: null,
            effectTickInterval: null,
            iconTickInterval: null,
            base: {
                damageMultiplier: 1,
                speed: 1,
                jump: 1,
                incomingDamageMultiplier: 1,
                moneyMultiplier: 1
            }
        },

        list: [
            // Core
            { id: 'health_potion', name: 'Health Potion', icon: '❤️', duration: 0, effect: 'instant', desc: 'Restore 25% health', apply() { if (m) { m.health = Math.min(m.maxHealth, m.health + 0.25); m.displayHealth?.(); } } },
            { id: 'mega_health', name: 'Mega Health Potion', icon: '💖', duration: 0, effect: 'instant', desc: 'Restore 50% health', apply() { if (m) { m.health = Math.min(m.maxHealth, m.health + 0.5); m.displayHealth?.(); } } },
            { id: 'full_heal', name: 'Full Restore', icon: '💝', duration: 0, effect: 'instant', desc: 'Restore 100% health', apply() { if (m) { m.health = m.maxHealth; m.displayHealth?.(); } } },
            { id: 'regen_potion', name: 'Regeneration', icon: '💚', duration: 1200, effect: 'regen', desc: 'Heal over 20s', tick() { if (m?.alive) m.health = Math.min(m.maxHealth, m.health + 0.004); } },
            { id: 'shield_potion', name: 'Shield Potion', icon: '🛡️', duration: 900, effect: 'shield', desc: '-50% incoming damage for 15s', tempMod: { incomingDamageMultiplier: 0.5 } },
            { id: 'speed_potion', name: 'Speed Potion', icon: '💨', duration: 1800, effect: 'speed', desc: '+50% speed for 30s', tempMod: { speed: 1.5 } },
            { id: 'damage_potion', name: 'Damage Potion', icon: '⚔️', duration: 1800, effect: 'damage', desc: '+50% damage for 30s', tempMod: { damageMultiplier: 1.5 } },
            { id: 'focus_tonic', name: 'Focus Tonic', icon: '🎯', duration: 1200, effect: 'crit', desc: '+80% damage for 20s', tempMod: { damageMultiplier: 1.8 } },
            { id: 'iron_skin', name: 'Iron Skin', icon: '🔩', duration: 1200, effect: 'defense', desc: '-35% incoming damage', tempMod: { incomingDamageMultiplier: 0.65 } },
            { id: 'wealthy', name: 'Wealth Potion', icon: '💰', duration: 1800, effect: 'wealth', desc: '2x money earned', tempMod: { moneyMultiplier: 2 } },
            { id: 'giant_potion', name: 'Giant Growth', icon: '🦣', duration: 1200, effect: 'size', desc: 'Bigger body and damage', tempMod: { damageMultiplier: 1.4 }, sizeScale: 1.22 },
            { id: 'shrink_potion', name: 'Shrinking', icon: '🐜', duration: 1200, effect: 'size', desc: 'Smaller hitbox and agility', tempMod: { speed: 1.25 }, sizeScale: 0.82 },
            { id: 'phoenix', name: 'Phoenix Ember', icon: '🔥', duration: 0, effect: 'revive', desc: 'Small instant heal + burn burst', apply() { if (!m?.alive) return; m.health = Math.min(m.maxHealth, m.health + 0.2); m.displayHealth?.(); for (let i = 0; i < 8; i++) { const a = (Math.PI * 2 * i) / 8; b?.explosion?.({ x: m.pos.x + Math.cos(a) * 70, y: m.pos.y + Math.sin(a) * 70 }, 22); } } },
            { id: 'storm_elixir', name: 'Storm Elixir', icon: '🌩️', duration: 900, effect: 'storm', desc: 'Periodic lightning detonations', tick() { if (simulation.cycle % 40 === 0 && m?.alive) b?.explosion?.({ x: m.pos.x + (Math.random() - 0.5) * 160, y: m.pos.y + (Math.random() - 0.5) * 160 }, 24); } },
            { id: 'void_draught', name: 'Void Draught', icon: '🕳️', duration: 900, effect: 'void', desc: 'Stronger weapon output, slight fragility', tempMod: { damageMultiplier: 2.1, incomingDamageMultiplier: 1.2 } },
            { id: 'invisibility', name: 'Invisibility', icon: '👻', duration: 900, effect: 'invisible', desc: 'Ghosted shimmer and speed', tempMod: { speed: 1.2 }, apply() { if (m) m.isInvisible = true; }, remove() { if (m) m.isInvisible = false; } },
            { id: 'gravity_syrup', name: 'Gravity Syrup', icon: '🪨', duration: 900, effect: 'gravity', desc: 'Heavy mode, high control', tempMod: { incomingDamageMultiplier: 0.8 }, apply() { if (m) m.gravityPotion = 1.35; }, remove() { if (m) m.gravityPotion = 1; } },
            { id: 'haste_core', name: 'Haste Core', icon: '⚡', duration: 600, effect: 'haste', desc: 'Major speed and jump boost', tempMod: { speed: 2.1, jump: 1.4 } },
            { id: 'adrenal_burst', name: 'Adrenal Burst', icon: '🫀', duration: 600, effect: 'adrenal', desc: 'Fast combat burst', tempMod: { damageMultiplier: 1.7, speed: 1.5 } },
            { id: 'quantum_mix', name: 'Quantum Mix', icon: '🧬', duration: 900, effect: 'quantum', desc: 'Randomized stat surge', apply(effect) { const roll = Math.random(); effect.tempMod = roll < 0.34 ? { damageMultiplier: 2.4 } : roll < 0.67 ? { speed: 2.4 } : { incomingDamageMultiplier: 0.4 }; } },
            { id: 'omega', name: 'Omega Serum', icon: '🌟', duration: 900, effect: 'omega', desc: 'All major stats boosted', tempMod: { damageMultiplier: 2.0, speed: 1.6, jump: 1.35, incomingDamageMultiplier: 0.7 } },
        ],

        findById(id) {
            return this.list.find((p) => p.id === id);
        },

        ensureExpandedCatalog() {
            if (this.list.some((p) => p.id === 'exp_potion_01')) return;
            const themes = [
                ['ember', '🔥', 'damageMultiplier', 1.15],
                ['frost', '❄️', 'incomingDamageMultiplier', 0.92],
                ['wind', '🌪️', 'speed', 1.2],
                ['stone', '🪨', 'incomingDamageMultiplier', 0.85],
                ['spark', '⚡', 'damageMultiplier', 1.2],
                ['sun', '☀️', 'jump', 1.25],
                ['moon', '🌙', 'speed', 1.15],
                ['nova', '💥', 'damageMultiplier', 1.32],
                ['mint', '🍃', 'incomingDamageMultiplier', 0.9],
                ['lotus', '🪷', 'moneyMultiplier', 1.2],
            ];
            const generated = [];
            for (let i = 0; i < 40; i++) {
                const t = themes[i % themes.length];
                generated.push({
                    id: `exp_potion_${String(i + 1).padStart(2, '0')}`,
                    name: `${t[0]} tonic ${i + 1}`,
                    icon: t[1],
                    duration: 480 + (i % 6) * 120,
                    effect: 'temp',
                    desc: `${t[0]} brew boost`,
                    tempMod: { [t[2]]: t[3] + (i % 3) * 0.05 }
                });
            }
            this.list.push(...generated);
        },

        use(potionId) {
            const potion = this.findById(potionId);
            if (!potion) return false;

            const now = Date.now();
            const effect = {
                ...potion,
                appliedAt: now,
                endTime: now + (potion.duration * 16.67),
                uid: `${potion.id}-${now}-${Math.random().toString(36).slice(2, 8)}`
            };

            if (effect.apply) effect.apply.call(this, effect);
            if (potion.duration > 0) this.activeEffects.push(effect);

            simulation?.inGameConsole?.(`<span style='color:#c7f9cc'>Potion used: ${potion.name}</span>`, 90);
            this.renderEffectIcons();
            return true;
        },

        recomputePlayerMods() {
            if (typeof m === 'undefined') return;
            const mods = {
                damageMultiplier: 1,
                speed: 1,
                jump: 1,
                incomingDamageMultiplier: 1,
                moneyMultiplier: 1,
                sizeScale: 1,
            };

            this.activeEffects.forEach((effect) => {
                if (!effect.tempMod) return;
                for (const [k, v] of Object.entries(effect.tempMod)) {
                    if (mods[k] !== undefined) mods[k] *= v;
                }
                if (effect.sizeScale) mods.sizeScale *= effect.sizeScale;
            });

            m.damageMultiplier = this.runtime.base.damageMultiplier * mods.damageMultiplier;
            m.Fx = (m.baseFx || this.runtime.base.speed * 0.016) * mods.speed;
            m.jumpForce = (m.baseJumpForce || this.runtime.base.jump * 0.42) * mods.jump;
            m.incomingDamageMultiplier = this.runtime.base.incomingDamageMultiplier * mods.incomingDamageMultiplier;
            m.moneyMultiplier = this.runtime.base.moneyMultiplier * mods.moneyMultiplier;

            if (m.radius) {
                const baseRadius = m.baseRadius || m.radius;
                m.baseRadius = baseRadius;
                m.radius = Math.max(6, baseRadius * mods.sizeScale);
            }
        },

        renderEffectIcons() {
            if (!this.runtime.iconHost) return;
            const now = Date.now();
            const sorted = [...this.activeEffects].sort((a, b) => a.endTime - b.endTime);
            this.runtime.iconHost.innerHTML = sorted.map((e) => {
                const remaining = Math.max(0, Math.ceil((e.endTime - now) / 1000));
                return `<div title="${e.name}: ${e.desc}" style="display:flex;align-items:center;gap:4px;background:rgba(10,16,28,.88);border:1px solid #4cc9f0;border-radius:6px;padding:3px 6px;color:#dff7ff;font-size:11px;">
                    <span style="font-size:14px">${e.icon || '🧪'}</span><span>${remaining}s</span>
                </div>`;
            }).join('');
        },

        ensureIconHost() {
            if (this.runtime.iconHost) return;
            const host = document.createElement('div');
            host.id = 'potion-effect-icons';
            host.style.cssText = 'position:fixed;left:18px;top:114px;display:flex;gap:6px;flex-wrap:wrap;max-width:320px;z-index:2100;pointer-events:none;';
            document.body.appendChild(host);
            this.runtime.iconHost = host;
        },

        update() {
            const now = Date.now();
            for (let i = this.activeEffects.length - 1; i >= 0; i--) {
                const effect = this.activeEffects[i];
                if (effect.tick) effect.tick.call(this, effect);
                if (now >= effect.endTime) {
                    if (effect.remove) effect.remove.call(this, effect);
                    this.activeEffects.splice(i, 1);
                }
            }
            this.recomputePlayerMods();
            this.renderEffectIcons();
        },

        init() {
            if (this.runtime.mounted) return;
            this.runtime.mounted = true;
            this.ensureExpandedCatalog();
            this.ensureIconHost();

            if (typeof m !== 'undefined') {
                m.baseFx = m.baseFx || m.Fx || 0.016;
                m.baseJumpForce = m.baseJumpForce || m.jumpForce || 0.42;
                m.baseRadius = m.baseRadius || m.radius || 30;
            }

            this.runtime.effectTickInterval = setInterval(() => this.update(), 100);
            this.runtime.iconTickInterval = setInterval(() => this.renderEffectIcons(), 350);

            console.log(`%c🧪 Potions System Loaded! ${this.list.length} potions available.`, 'color: #9b59b6; font-weight: bold;');
        }
    };

    window.potions.init();
}
