diff --git a/js/potions.js b/js/potions.js
index 3bc945af7b381553c0847a20262519b6ca988db7..9cc123fa67aa22b3e05ba93674c4226c6a312316 100644
--- a/js/potions.js
+++ b/js/potions.js
@@ -1,134 +1,185 @@
-// Potions System - 35+ potions with temporary effects
+// Potions System - expanded potion catalog with real-time effects and HUD icons
 if (typeof window.potions === 'undefined') {
     window.potions = {
         activeEffects: [],
-        
+        runtime: {
+            mounted: false,
+            iconHost: null,
+            effectTickInterval: null,
+            iconTickInterval: null,
+            base: {
+                damageMultiplier: 1,
+                speed: 1,
+                jump: 1,
+                incomingDamageMultiplier: 1,
+                moneyMultiplier: 1
+            }
+        },
+
         list: [
-            // Health & Defense (1-8)
-            { id: 'health_potion', name: 'Health Potion', icon: '❤️', duration: 0, effect: 'instant', desc: 'Restore 25% health', apply() { if(m) m.health = Math.min(m.maxHealth, m.health + 0.25); } },
-            { id: 'mega_health', name: 'Mega Health Potion', icon: '💖', duration: 0, effect: 'instant', desc: 'Restore 50% health', apply() { if(m) m.health = Math.min(m.maxHealth, m.health + 0.5); } },
-            { id: 'full_heal', name: 'Full Restore', icon: '💝', duration: 0, effect: 'instant', desc: 'Restore 100% health', apply() { if(m) m.health = m.maxHealth; } },
-            { id: 'regen_potion', name: 'Regeneration', icon: '💚', duration: 1200, effect: 'regen', desc: 'Heal over 20s', apply() { if(m) m.health = Math.min(m.maxHealth, m.health + 0.01); } },
-            { id: 'shield_potion', name: 'Shield Potion', icon: '🛡️', duration: 900, effect: 'shield', desc: 'Block damage 15s', apply() { if(m) m.immuneToHarm = true; }, remove() { if(m) m.immuneToHarm = false; } },
-            { id: 'iron_skin', name: 'Iron Skin', icon: '🔩', duration: 1200, effect: 'defense', desc: '-50% damage taken', tempMod: { incomingDamage: 0.5 } },
-            { id: 'diamond_shell', name: 'Diamond Shell', icon: '💎', duration: 900, effect: 'defense', desc: '-75% damage taken', tempMod: { incomingDamage: 0.25 } },
-            { id: 'absorption', name: 'Absorption', icon: '🫧', duration: 600, effect: 'absorb', desc: 'Extra hit points', apply() { if(m) m.health += 0.3; } },
-            
-            // Speed & Movement (9-16)
-            { id: 'speed_potion', name: 'Speed Potion', icon: '💨', duration: 1800, effect: 'speed', desc: '+50% speed 30s', tempMod: { speed: 1.5 } },
-            { id: 'mega_speed', name: 'Mega Speed', icon: '⚡', duration: 900, effect: 'speed', desc: '+100% speed 15s', tempMod: { speed: 2.0 } },
-            { id: 'sonic_boost', name: 'Sonic Boost', icon: '🚀', duration: 600, effect: 'speed', desc: '+200% speed 10s', tempMod: { speed: 3.0 } },
-            { id: 'feather_fall', name: 'Feather Fall', icon: '🪶', duration: 1800, effect: 'gravity', desc: 'Slow falling', tempMod: { gravity: 0.3 } },
-            { id: 'leaping', name: 'Leaping Potion', icon: '🦘', duration: 1200, effect: 'jump', desc: '+100% jump height', tempMod: { jump: 2.0 } },
-            { id: 'super_jump', name: 'Super Jump', icon: '🦸', duration: 600, effect: 'jump', desc: '+300% jump height', tempMod: { jump: 4.0 } },
-            { id: 'dash_potion', name: 'Dash Potion', icon: '💫', duration: 1800, effect: 'dash', desc: 'Enable air dash', tempMod: { canDash: true } },
-            { id: 'flight', name: 'Flight Elixir', icon: '🕊️', duration: 600, effect: 'flight', desc: 'Temporary flight', tempMod: { canFly: true } },
-            
-            // Damage & Combat (17-26)
-            { id: 'damage_potion', name: 'Damage Potion', icon: '⚔️', duration: 1800, effect: 'damage', desc: '+50% damage 30s', tempMod: { damage: 1.5 } },
-            { id: 'mega_damage', name: 'Mega Damage', icon: '🗡️', duration: 900, effect: 'damage', desc: '+100% damage 15s', tempMod: { damage: 2.0 } },
-            { id: 'berserker', name: 'Berserker Rage', icon: '😤', duration: 600, effect: 'damage', desc: '+200% damage, +50% speed', tempMod: { damage: 3.0, speed: 1.5 } },
-            { id: 'fire_power', name: 'Fire Power', icon: '🔥', duration: 1200, effect: 'fire', desc: 'Attacks burn enemies', tempMod: { fireDamage: true } },
-            { id: 'ice_power', name: 'Ice Power', icon: '❄️', duration: 1200, effect: 'ice', desc: 'Attacks slow enemies', tempMod: { slowDamage: true } },
-            { id: 'lightning', name: 'Lightning Strike', icon: '⚡', duration: 1200, effect: 'lightning', desc: 'Chain lightning on hit', tempMod: { chainDamage: true } },
-            { id: 'poison_coat', name: 'Poison Coating', icon: '🧪', duration: 1200, effect: 'poison', desc: 'Attacks poison enemies', tempMod: { poisonDamage: true } },
-            { id: 'vampiric', name: 'Vampiric Essence', icon: '🧛', duration: 1200, effect: 'lifesteal', desc: 'Heal on damage dealt', tempMod: { lifesteal: 0.1 } },
-            { id: 'critical_eye', name: 'Critical Eye', icon: '🎯', duration: 1200, effect: 'crit', desc: '+50% crit chance', tempMod: { critChance: 0.5 } },
-            { id: 'explosive', name: 'Explosive Shots', icon: '💥', duration: 900, effect: 'explosive', desc: 'Bullets explode', tempMod: { explosive: true } },
-            
-            // Utility (27-35)
-            { id: 'invisibility', name: 'Invisibility', icon: '👻', duration: 900, effect: 'invisible', desc: 'Invisible 15s', apply() { if(m) m.isInvisible = true; }, remove() { if(m) m.isInvisible = false; } },
-            { id: 'giant_potion', name: 'Giant Growth', icon: '🦣', duration: 1200, effect: 'size', desc: '2x size, +100% dmg', tempMod: { size: 2.0, damage: 2.0 } },
-            { id: 'shrink_potion', name: 'Shrinking', icon: '🐜', duration: 1200, effect: 'size', desc: '0.5x size, harder to hit', tempMod: { size: 0.5 } },
-            { id: 'magnet', name: 'Magnet Potion', icon: '🧲', duration: 1800, effect: 'magnet', desc: 'Attract pickups', tempMod: { magnetRange: 300 } },
-            { id: 'lucky', name: 'Luck Potion', icon: '🍀', duration: 1800, effect: 'luck', desc: 'Better drops 30s', tempMod: { luckBonus: 0.5 } },
-            { id: 'wealthy', name: 'Wealth Potion', icon: '💰', duration: 1800, effect: 'wealth', desc: '2x money earned', tempMod: { moneyMult: 2.0 } },
-            { id: 'xray', name: 'X-Ray Vision', icon: '👁️', duration: 1200, effect: 'xray', desc: 'See through walls', tempMod: { xrayVision: true } },
-            { id: 'time_slow', name: 'Time Dilation', icon: '⏱️', duration: 600, effect: 'time', desc: 'Slow time around you', tempMod: { timeScale: 0.5 } },
-            { id: 'chaos', name: 'Chaos Elixir', icon: '🌀', duration: 900, effect: 'chaos', desc: 'Random effects!', apply() { this.applyRandomEffect(); } },
-            
-            // Legendary (36-40)
-            { id: 'godmode', name: 'Divine Blessing', icon: '✨', duration: 600, effect: 'godmode', desc: 'Invincible 10s', apply() { if(m) m.immuneToHarm = true; }, remove() { if(m) m.immuneToHarm = false; } },
-            { id: 'omega', name: 'Omega Serum', icon: '🌟', duration: 900, effect: 'omega', desc: 'All stats +100%', tempMod: { damage: 2.0, speed: 2.0, jump: 2.0 } },
-            { id: 'phoenix', name: 'Phoenix Tear', icon: '🔶', duration: 0, effect: 'revive', desc: 'Auto-revive on death', apply() { if(m) m.hasRevive = true; } },
-            { id: 'black_hole', name: 'Black Hole Brew', icon: '🕳️', duration: 1200, effect: 'vortex', desc: 'Pull enemies in', tempMod: { vortexPull: true } },
-            { id: 'supernova', name: 'Supernova Elixir', icon: '☀️', duration: 600, effect: 'supernova', desc: 'Massive AOE damage', apply() { this.triggerSupernova(); } },
+            // Core
+            { id: 'health_potion', name: 'Health Potion', icon: '❤️', duration: 0, effect: 'instant', desc: 'Restore 25% health', apply() { if (m) { m.health = Math.min(m.maxHealth, m.health + 0.25); m.displayHealth?.(); } } },
+            { id: 'mega_health', name: 'Mega Health Potion', icon: '💖', duration: 0, effect: 'instant', desc: 'Restore 50% health', apply() { if (m) { m.health = Math.min(m.maxHealth, m.health + 0.5); m.displayHealth?.(); } } },
+            { id: 'full_heal', name: 'Full Restore', icon: '💝', duration: 0, effect: 'instant', desc: 'Restore 100% health', apply() { if (m) { m.health = m.maxHealth; m.displayHealth?.(); } } },
+            { id: 'regen_potion', name: 'Regeneration', icon: '💚', duration: 1200, effect: 'regen', desc: 'Heal over 20s', tick() { if (m?.alive) m.health = Math.min(m.maxHealth, m.health + 0.004); } },
+            { id: 'shield_potion', name: 'Shield Potion', icon: '🛡️', duration: 900, effect: 'shield', desc: '-50% incoming damage for 15s', tempMod: { incomingDamageMultiplier: 0.5 } },
+            { id: 'speed_potion', name: 'Speed Potion', icon: '💨', duration: 1800, effect: 'speed', desc: '+50% speed for 30s', tempMod: { speed: 1.5 } },
+            { id: 'damage_potion', name: 'Damage Potion', icon: '⚔️', duration: 1800, effect: 'damage', desc: '+50% damage for 30s', tempMod: { damageMultiplier: 1.5 } },
+            { id: 'focus_tonic', name: 'Focus Tonic', icon: '🎯', duration: 1200, effect: 'crit', desc: '+80% damage for 20s', tempMod: { damageMultiplier: 1.8 } },
+            { id: 'iron_skin', name: 'Iron Skin', icon: '🔩', duration: 1200, effect: 'defense', desc: '-35% incoming damage', tempMod: { incomingDamageMultiplier: 0.65 } },
+            { id: 'wealthy', name: 'Wealth Potion', icon: '💰', duration: 1800, effect: 'wealth', desc: '2x money earned', tempMod: { moneyMultiplier: 2 } },
+            { id: 'giant_potion', name: 'Giant Growth', icon: '🦣', duration: 1200, effect: 'size', desc: 'Bigger body and damage', tempMod: { damageMultiplier: 1.4 }, sizeScale: 1.22 },
+            { id: 'shrink_potion', name: 'Shrinking', icon: '🐜', duration: 1200, effect: 'size', desc: 'Smaller hitbox and agility', tempMod: { speed: 1.25 }, sizeScale: 0.82 },
+            { id: 'phoenix', name: 'Phoenix Ember', icon: '🔥', duration: 0, effect: 'revive', desc: 'Small instant heal + burn burst', apply() { if (!m?.alive) return; m.health = Math.min(m.maxHealth, m.health + 0.2); m.displayHealth?.(); for (let i = 0; i < 8; i++) { const a = (Math.PI * 2 * i) / 8; b?.explosion?.({ x: m.pos.x + Math.cos(a) * 70, y: m.pos.y + Math.sin(a) * 70 }, 22); } } },
+            { id: 'storm_elixir', name: 'Storm Elixir', icon: '🌩️', duration: 900, effect: 'storm', desc: 'Periodic lightning detonations', tick() { if (simulation.cycle % 40 === 0 && m?.alive) b?.explosion?.({ x: m.pos.x + (Math.random() - 0.5) * 160, y: m.pos.y + (Math.random() - 0.5) * 160 }, 24); } },
+            { id: 'void_draught', name: 'Void Draught', icon: '🕳️', duration: 900, effect: 'void', desc: 'Stronger weapon output, slight fragility', tempMod: { damageMultiplier: 2.1, incomingDamageMultiplier: 1.2 } },
+            { id: 'invisibility', name: 'Invisibility', icon: '👻', duration: 900, effect: 'invisible', desc: 'Ghosted shimmer and speed', tempMod: { speed: 1.2 }, apply() { if (m) m.isInvisible = true; }, remove() { if (m) m.isInvisible = false; } },
+            { id: 'gravity_syrup', name: 'Gravity Syrup', icon: '🪨', duration: 900, effect: 'gravity', desc: 'Heavy mode, high control', tempMod: { incomingDamageMultiplier: 0.8 }, apply() { if (m) m.gravityPotion = 1.35; }, remove() { if (m) m.gravityPotion = 1; } },
+            { id: 'haste_core', name: 'Haste Core', icon: '⚡', duration: 600, effect: 'haste', desc: 'Major speed and jump boost', tempMod: { speed: 2.1, jump: 1.4 } },
+            { id: 'adrenal_burst', name: 'Adrenal Burst', icon: '🫀', duration: 600, effect: 'adrenal', desc: 'Fast combat burst', tempMod: { damageMultiplier: 1.7, speed: 1.5 } },
+            { id: 'quantum_mix', name: 'Quantum Mix', icon: '🧬', duration: 900, effect: 'quantum', desc: 'Randomized stat surge', apply(effect) { const roll = Math.random(); effect.tempMod = roll < 0.34 ? { damageMultiplier: 2.4 } : roll < 0.67 ? { speed: 2.4 } : { incomingDamageMultiplier: 0.4 }; } },
+            { id: 'omega', name: 'Omega Serum', icon: '🌟', duration: 900, effect: 'omega', desc: 'All major stats boosted', tempMod: { damageMultiplier: 2.0, speed: 1.6, jump: 1.35, incomingDamageMultiplier: 0.7 } },
         ],
-        
-        applyRandomEffect() {
-            const randomPotion = this.list[Math.floor(Math.random() * this.list.length)];
-            if (randomPotion.id !== 'chaos') {
-                this.use(randomPotion.id);
-            }
+
+        findById(id) {
+            return this.list.find((p) => p.id === id);
         },
-        
-        triggerSupernova() {
-            if (typeof b !== 'undefined' && typeof simulation !== 'undefined') {
-                for (let i = 0; i < 20; i++) {
-                    const angle = (i / 20) * Math.PI * 2;
-                    const dist = 200;
-                    const x = (m?.pos?.x || 400) + Math.cos(angle) * dist;
-                    const y = (m?.pos?.y || 300) + Math.sin(angle) * dist;
-                    b.explosion({ x, y }, 100);
-                }
+
+        ensureExpandedCatalog() {
+            if (this.list.some((p) => p.id === 'exp_potion_01')) return;
+            const themes = [
+                ['ember', '🔥', 'damageMultiplier', 1.15],
+                ['frost', '❄️', 'incomingDamageMultiplier', 0.92],
+                ['wind', '🌪️', 'speed', 1.2],
+                ['stone', '🪨', 'incomingDamageMultiplier', 0.85],
+                ['spark', '⚡', 'damageMultiplier', 1.2],
+                ['sun', '☀️', 'jump', 1.25],
+                ['moon', '🌙', 'speed', 1.15],
+                ['nova', '💥', 'damageMultiplier', 1.32],
+                ['mint', '🍃', 'incomingDamageMultiplier', 0.9],
+                ['lotus', '🪷', 'moneyMultiplier', 1.2],
+            ];
+            const generated = [];
+            for (let i = 0; i < 40; i++) {
+                const t = themes[i % themes.length];
+                generated.push({
+                    id: `exp_potion_${String(i + 1).padStart(2, '0')}`,
+                    name: `${t[0]} tonic ${i + 1}`,
+                    icon: t[1],
+                    duration: 480 + (i % 6) * 120,
+                    effect: 'temp',
+                    desc: `${t[0]} brew boost`,
+                    tempMod: { [t[2]]: t[3] + (i % 3) * 0.05 }
+                });
             }
+            this.list.push(...generated);
         },
-        
+
         use(potionId) {
-            const potion = this.list.find(p => p.id === potionId);
+            const potion = this.findById(potionId);
             if (!potion) return false;
-            
-            console.log(`Using potion: ${potion.name}`);
-            
-            if (potion.apply) {
-                potion.apply.call(this);
-            }
-            
-            if (potion.duration > 0) {
-                this.activeEffects.push({
-                    ...potion,
-                    startTime: Date.now(),
-                    endTime: Date.now() + (potion.duration * 16.67)
-                });
-            }
-            
+
+            const now = Date.now();
+            const effect = {
+                ...potion,
+                appliedAt: now,
+                endTime: now + (potion.duration * 16.67),
+                uid: `${potion.id}-${now}-${Math.random().toString(36).slice(2, 8)}`
+            };
+
+            if (effect.apply) effect.apply.call(this, effect);
+            if (potion.duration > 0) this.activeEffects.push(effect);
+
+            simulation?.inGameConsole?.(`<span style='color:#c7f9cc'>Potion used: ${potion.name}</span>`, 90);
+            this.renderEffectIcons();
             return true;
         },
-        
+
+        recomputePlayerMods() {
+            if (typeof m === 'undefined') return;
+            const mods = {
+                damageMultiplier: 1,
+                speed: 1,
+                jump: 1,
+                incomingDamageMultiplier: 1,
+                moneyMultiplier: 1,
+                sizeScale: 1,
+            };
+
+            this.activeEffects.forEach((effect) => {
+                if (!effect.tempMod) return;
+                for (const [k, v] of Object.entries(effect.tempMod)) {
+                    if (mods[k] !== undefined) mods[k] *= v;
+                }
+                if (effect.sizeScale) mods.sizeScale *= effect.sizeScale;
+            });
+
+            m.damageMultiplier = this.runtime.base.damageMultiplier * mods.damageMultiplier;
+            m.Fx = (m.baseFx || this.runtime.base.speed * 0.016) * mods.speed;
+            m.jumpForce = (m.baseJumpForce || this.runtime.base.jump * 0.42) * mods.jump;
+            m.incomingDamageMultiplier = this.runtime.base.incomingDamageMultiplier * mods.incomingDamageMultiplier;
+            m.moneyMultiplier = this.runtime.base.moneyMultiplier * mods.moneyMultiplier;
+
+            if (m.radius) {
+                const baseRadius = m.baseRadius || m.radius;
+                m.baseRadius = baseRadius;
+                m.radius = Math.max(6, baseRadius * mods.sizeScale);
+            }
+        },
+
+        renderEffectIcons() {
+            if (!this.runtime.iconHost) return;
+            const now = Date.now();
+            const sorted = [...this.activeEffects].sort((a, b) => a.endTime - b.endTime);
+            this.runtime.iconHost.innerHTML = sorted.map((e) => {
+                const remaining = Math.max(0, Math.ceil((e.endTime - now) / 1000));
+                return `<div title="${e.name}: ${e.desc}" style="display:flex;align-items:center;gap:4px;background:rgba(10,16,28,.88);border:1px solid #4cc9f0;border-radius:6px;padding:3px 6px;color:#dff7ff;font-size:11px;">
+                    <span style="font-size:14px">${e.icon || '🧪'}</span><span>${remaining}s</span>
+                </div>`;
+            }).join('');
+        },
+
+        ensureIconHost() {
+            if (this.runtime.iconHost) return;
+            const host = document.createElement('div');
+            host.id = 'potion-effect-icons';
+            host.style.cssText = 'position:fixed;left:18px;top:114px;display:flex;gap:6px;flex-wrap:wrap;max-width:320px;z-index:2100;pointer-events:none;';
+            document.body.appendChild(host);
+            this.runtime.iconHost = host;
+        },
+
         update() {
             const now = Date.now();
             for (let i = this.activeEffects.length - 1; i >= 0; i--) {
                 const effect = this.activeEffects[i];
-                
-                // Apply tempMod effects continuously
-                if (effect.tempMod && typeof m !== 'undefined') {
-                    if (effect.tempMod.damage) m.damageMultiplier = (m.damageMultiplier || 1) * effect.tempMod.damage;
-                    if (effect.tempMod.speed) m.Fx = (m.Fx || 0.016) * effect.tempMod.speed;
-                    if (effect.tempMod.jump) m.jumpForce = (m.jumpForce || 0.42) * effect.tempMod.jump;
-                    if (effect.tempMod.incomingDamage) m.incomingDamageMultiplier = effect.tempMod.incomingDamage;
-                    if (effect.tempMod.gravity) m.fieldFx = (m.fieldFx || 1) * effect.tempMod.gravity;
-                    if (effect.tempMod.size && m.radius) m.radius = m.radius * effect.tempMod.size;
-                    if (effect.tempMod.magnetRange) m.magnetRange = effect.tempMod.magnetRange;
-                    if (effect.tempMod.moneyMult) m.moneyMultiplier = effect.tempMod.moneyMult;
-                }
-                
+                if (effect.tick) effect.tick.call(this, effect);
                 if (now >= effect.endTime) {
-                    if (effect.remove) effect.remove();
+                    if (effect.remove) effect.remove.call(this, effect);
                     this.activeEffects.splice(i, 1);
-                    console.log(`Effect expired: ${effect.name}`);
                 }
             }
+            this.recomputePlayerMods();
+            this.renderEffectIcons();
         },
-        
-        getActiveEffects() {
-            return this.activeEffects.map(e => e.name);
-        },
-        
+
         init() {
-            setInterval(() => this.update(), 100);
-            console.log('%c🧪 Potions System Loaded! 40 potions available!', 'color: #9b59b6; font-weight: bold;');
+            if (this.runtime.mounted) return;
+            this.runtime.mounted = true;
+            this.ensureExpandedCatalog();
+            this.ensureIconHost();
+
+            if (typeof m !== 'undefined') {
+                m.baseFx = m.baseFx || m.Fx || 0.016;
+                m.baseJumpForce = m.baseJumpForce || m.jumpForce || 0.42;
+                m.baseRadius = m.baseRadius || m.radius || 30;
+            }
+
+            this.runtime.effectTickInterval = setInterval(() => this.update(), 100);
+            this.runtime.iconTickInterval = setInterval(() => this.renderEffectIcons(), 350);
+
+            console.log(`%c🧪 Potions System Loaded! ${this.list.length} potions available.`, 'color: #9b59b6; font-weight: bold;');
         }
     };
-    
+
     window.potions.init();
 }
