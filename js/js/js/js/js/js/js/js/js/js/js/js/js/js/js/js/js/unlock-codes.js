diff --git a/js/unlock-codes.js b/js/unlock-codes.js
index e3464c9a3279929338947e6a15b14b71efc1e9af..e55197dd2a28f527c42aedbb98f4d816372d46c3 100644
--- a/js/unlock-codes.js
+++ b/js/unlock-codes.js
@@ -1,301 +1,248 @@
-// Unlock Codes System - Special codes unlock exclusive content
-(function() {
-    window.unlockCodes = {
+// Unlock Codes System (fixed + upgraded)
+(function () {
+    if (window.unlockCodesLoaded) return;
+    window.unlockCodesLoaded = true;
+
+    const STORE_KEY = 'unlocked_codes_v2';
+    const getGun = (name) => (Array.isArray(b?.guns) ? b.guns.find(g => g.name === name) : null);
+
+    const api = {
         unlockedCodes: [],
-        
         codes: {
-            'QROW2025': {
+            QROW2025: {
                 name: 'Qrow Transformation',
-                description: 'Owner-Only transformation with insane stats',
-                unlocked: false,
+                description: 'Boosted stats + Qrow weapon set + pets',
                 apply() {
                     if (typeof m !== 'undefined') {
-                        m.health = 10;
-                        m.maxHealth = 10;
-                        m.energy = 5;
-                        m.damageMultiplier = 8;
-                        m.accelMag = (m.accelMag || 0.001) * 3;
-                        m.incomingDamageMultiplier = 0.1;
+                        m.maxHealth = Math.max(m.maxHealth || 1, 10);
+                        m.health = Math.min(m.maxHealth, Math.max(m.health || 1, 10));
+                        m.maxEnergy = Math.max(m.maxEnergy || 1, 5);
+                        m.energy = Math.min(m.maxEnergy, Math.max(m.energy || 1, 5));
                     }
-                    window.unlockCodes.grantQrowWeapons();
-                    window.unlockCodes.spawnQrowPets();
-                    console.log('%c🔥 QROW TRANSFORMATION ACTIVATED!', 'color: #FFD700; font-size: 20px; font-weight: bold;');
+                    api.grantQrowWeapons();
+                    api.spawnQrowPets();
+                    simulation?.inGameConsole("<span style='color:#FFD700'>QROW TRANSFORMATION ACTIVATED</span>", 70);
                 }
             },
-            'PHOTON2025': {
+            PHOTON2025: {
                 name: 'Photonic Arsenal',
-                description: 'Unlocks all photonic crystal weapons and techs',
-                unlocked: false,
+                description: 'Unlock photonic pack weapons/tech',
                 apply() {
-                    window.unlockCodes.grantPhotonicArsenal();
-                    console.log('%c💎 PHOTONIC ARSENAL UNLOCKED!', 'color: #00FFFF; font-size: 16px; font-weight: bold;');
+                    api.grantPhotonicArsenal();
+                    simulation?.inGameConsole("<span style='color:#00FFFF'>PHOTONIC ARSENAL UNLOCKED</span>", 60);
                 }
             },
-            'SPEED2025': {
+            SPEED2025: {
                 name: 'Movement Master',
-                description: 'Unlocks all movement techs',
-                unlocked: false,
+                description: 'Max out available movement techs',
                 apply() {
-                    window.unlockCodes.grantMovementTechs();
-                    console.log('%c⚡ MOVEMENT MASTER UNLOCKED!', 'color: #FF00FF; font-size: 16px; font-weight: bold;');
+                    api.grantMovementTechs();
+                    simulation?.inGameConsole("<span style='color:#FF00FF'>MOVEMENT MASTER ENABLED</span>", 60);
                 }
             },
-            'GODMODE': {
+            GODMODE: {
                 name: 'Divine Power',
-                description: 'Maximum stats and invulnerability',
-                unlocked: false,
+                description: 'Very high health/energy and strong defense',
                 apply() {
                     if (typeof m !== 'undefined') {
-                        m.health = 100;
-                        m.maxHealth = 100;
-                        m.damageMultiplier = 50;
-                        m.incomingDamageMultiplier = 0;
+                        m.maxHealth = Math.max(m.maxHealth || 1, 100);
+                        m.health = m.maxHealth;
+                        m.maxEnergy = Math.max(m.maxEnergy || 1, 20);
+                        m.energy = m.maxEnergy;
                     }
-                    console.log('%c👑 GODMODE ENABLED!', 'color: #FFD700; font-size: 20px; font-weight: bold;');
+                    if (typeof tech !== 'undefined') {
+                        tech.damage = Math.max(tech.damage || 1, 3);
+                        tech.harmReduction = Math.min(tech.harmReduction || 1, 0.2);
+                    }
+                    simulation?.inGameConsole("<span style='color:#FFD700'>GODMODE ENABLED</span>", 80);
                 }
-            }
+            },
+            SCYTHE14: {
+                name: 'Scythe Prism (14)',
+                description: 'Unlock all 14 colored scythes',
+                apply() {
+                    api.grantScythe14();
+                    simulation?.inGameConsole("<span style='color:#ff5'>14 COLOR SCYTHES UNLOCKED</span>", 70);
+                }
+            },
         },
-        
+
         qrowWeapons: [
             {
                 name: "hakuman's okami",
-                descriptionFunction() { return `Counter stance sword - block then devastate` },
+                descriptionFunction() { return `Counter stance sword - block then devastate`; },
                 ammo: Infinity,
                 ammoPack: 0,
                 have: false,
                 fire() {
                     const angle = Math.atan2(simulation.mouseInGame.y - m.pos.y, simulation.mouseInGame.x - m.pos.x);
                     for (let i = -3; i <= 3; i++) {
-                        const spread = angle + (i * 0.15);
-                        b.nail({ x: m.pos.x + Math.cos(spread) * 60, y: m.pos.y + Math.sin(spread) * 60 }, 
-                               { x: Math.cos(spread) * 45, y: Math.sin(spread) * 45 }, 40);
+                        const spread = angle + i * 0.15;
+                        b.nail({ x: m.pos.x + Math.cos(spread) * 60, y: m.pos.y + Math.sin(spread) * 60 }, { x: Math.cos(spread) * 45, y: Math.sin(spread) * 45 }, 40);
                     }
-                }
+                },
+                do() {}
             },
             {
                 name: "yamato",
-                descriptionFunction() { return `Dimension-cutting teleport slashes` },
+                descriptionFunction() { return `Dimension-cutting teleport slashes`; },
                 ammo: Infinity,
                 ammoPack: 0,
                 have: false,
                 fire() {
-                    const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
-                    m.pos.x = simulation.mouseInGame.x;
-                    m.pos.y = simulation.mouseInGame.y;
+                    Matter.Body.setPosition(player, { x: simulation.mouseInGame.x, y: simulation.mouseInGame.y });
                     for (let i = 0; i < 8; i++) {
                         const angle = (Math.PI * 2 * i) / 8;
                         b.laser({ x: m.pos.x, y: m.pos.y }, { x: m.pos.x + Math.cos(angle) * 300, y: m.pos.y + Math.sin(angle) * 300 }, 60);
                     }
-                }
+                },
+                do() {}
             },
             {
                 name: "ebony & ivory",
-                descriptionFunction() { return `Twin revolvers with infinite ammo` },
+                descriptionFunction() { return `Twin revolvers with infinite ammo`; },
                 ammo: Infinity,
                 ammoPack: 0,
                 have: false,
                 fire() {
                     const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
                     b.nail({ x: m.pos.x - 15, y: m.pos.y }, { x: dir.x * 60, y: dir.y * 60 }, 25);
                     b.nail({ x: m.pos.x + 15, y: m.pos.y }, { x: dir.x * 60, y: dir.y * 60 }, 25);
-                }
+                },
+                do() {}
             },
-            {
-                name: "lunar crescents",
-                descriptionFunction() { return `Orbiting moon blades that auto-attack` },
-                ammo: 20,
-                ammoPack: 4,
-                defaultAmmoPack: 4,
-                have: false,
-                fire() {
-                    this.ammo--;
-                    for (let i = 0; i < 4; i++) {
-                        const angle = (Math.PI * 2 * i) / 4 + simulation.cycle * 0.1;
-                        const pos = { x: m.pos.x + Math.cos(angle) * 80, y: m.pos.y + Math.sin(angle) * 80 };
-                        b.nail(pos, { x: Math.cos(angle + Math.PI/2) * 30, y: Math.sin(angle + Math.PI/2) * 30 }, 35);
-                    }
-                }
-            }
         ],
-        
+
+        ensureWeaponOwned(name) {
+            if (!Array.isArray(b?.guns)) return false;
+            const idx = b.guns.findIndex(g => g.name === name);
+            if (idx === -1) return false;
+            b.guns[idx].have = true;
+            if (!b.inventory.includes(idx)) b.inventory.push(idx);
+            return true;
+        },
+
         grantQrowWeapons() {
-            if (typeof b !== 'undefined' && b.guns) {
-                this.qrowWeapons.forEach(weapon => {
-                    if (!b.guns.find(g => g.name === weapon.name)) {
-                        b.guns.push(weapon);
-                        weapon.have = true;
-                        if (!b.inventory.includes(b.guns.length - 1)) {
-                            b.inventory.push(b.guns.length - 1);
-                        }
-                    }
-                });
-                if (typeof simulation !== 'undefined') simulation.makeGunHUD();
-            }
+            if (!Array.isArray(b?.guns)) return;
+            this.qrowWeapons.forEach(weapon => {
+                if (!b.guns.find(g => g.name === weapon.name)) b.guns.push(weapon);
+                this.ensureWeaponOwned(weapon.name);
+            });
+            simulation?.makeGunHUD?.();
         },
-        
+
+        grantScythe14() {
+            const keys = ["crimson", "azure", "emerald", "violet", "gold", "glacier", "toxic", "obsidian", "rose", "amber", "neon", "storm", "magma", "lunar"];
+            keys.forEach(k => this.ensureWeaponOwned(`${k} scythe`));
+            simulation?.makeGunHUD?.();
+        },
+
         spawnQrowPets() {
-            // Nine-Tailed Fox pet
-            if (typeof simulation !== 'undefined') {
+            if (!Array.isArray(simulation?.ephemera)) return;
+            if (!simulation.ephemera.find(e => e.name === 'nine-tailed-fox')) {
                 simulation.ephemera.push({
                     name: 'nine-tailed-fox',
                     do() {
-                        const angle = simulation.cycle * 0.03;
+                        const angle = m.cycle * 0.03;
                         const x = m.pos.x + Math.cos(angle) * 100;
                         const y = m.pos.y + Math.sin(angle) * 100 - 30;
-                        ctx.save();
-                        ctx.fillStyle = '#FFD700';
-                        ctx.beginPath();
-                        ctx.arc(x, y, 20, 0, Math.PI * 2);
-                        ctx.fill();
-                        for (let i = 0; i < 9; i++) {
-                            const tailAngle = angle + (i * Math.PI * 2 / 9);
-                            ctx.strokeStyle = '#000';
-                            ctx.lineWidth = 3;
-                            ctx.beginPath();
-                            ctx.moveTo(x, y);
-                            ctx.lineTo(x + Math.cos(tailAngle) * 40, y + Math.sin(tailAngle) * 40);
-                            ctx.stroke();
-                        }
-                        ctx.restore();
-                        
-                        // Auto-attack nearest enemy
-                        if (simulation.cycle % 60 === 0 && typeof mob !== 'undefined') {
-                            for (let i = 0; i < mob.length; i++) {
-                                if (mob[i].alive) {
-                                    const dist = Math.hypot(mob[i].position.x - x, mob[i].position.y - y);
-                                    if (dist < 400) {
-                                        b.laser({ x, y }, mob[i].position, 30);
-                                        break;
-                                    }
-                                }
-                            }
+                        simulation.drawList.push({ x, y, radius: 20, color: 'rgba(255,215,0,0.4)', time: simulation.drawTime });
+                        if (m.cycle % 60 === 0 && Array.isArray(mob)) {
+                            const target = mob.find(mm => mm && mm.alive !== false && mm.position && Math.hypot(mm.position.x - x, mm.position.y - y) < 400);
+                            if (target) b.laser({ x, y }, target.position, 30);
                         }
                     }
                 });
-                
-                // Red Phoenix pet
+            }
+            if (!simulation.ephemera.find(e => e.name === 'red-phoenix')) {
                 simulation.ephemera.push({
                     name: 'red-phoenix',
                     do() {
-                        const angle = -simulation.cycle * 0.02;
+                        const angle = -m.cycle * 0.02;
                         const x = m.pos.x + Math.cos(angle) * 120;
                         const y = m.pos.y + Math.sin(angle) * 60 - 50;
-                        ctx.save();
-                        ctx.fillStyle = '#FF4500';
-                        ctx.beginPath();
-                        ctx.arc(x, y, 15, 0, Math.PI * 2);
-                        ctx.fill();
-                        // Wings
-                        ctx.beginPath();
-                        ctx.moveTo(x - 30, y);
-                        ctx.lineTo(x, y - 10);
-                        ctx.lineTo(x + 30, y);
-                        ctx.closePath();
-                        ctx.fill();
-                        ctx.restore();
-                        
-                        // Heal player
-                        if (simulation.cycle % 120 === 0 && typeof m !== 'undefined' && m.alive) {
-                            m.health = Math.min(m.maxHealth, m.health + 0.05);
-                        }
+                        simulation.drawList.push({ x, y, radius: 16, color: 'rgba(255,69,0,0.42)', time: simulation.drawTime });
+                        if (m.cycle % 120 === 0) m.health = Math.min(m.maxHealth, m.health + 0.05);
                     }
                 });
             }
         },
-        
+
         grantPhotonicArsenal() {
-            // Add photonic weapons
-            if (window.photonicContent) {
-                window.photonicContent.weapons.forEach(w => {
-                    w.have = true;
-                    if (typeof b !== 'undefined' && !b.guns.find(g => g.name === w.name)) {
-                        b.guns.push(w);
-                        b.inventory.push(b.guns.length - 1);
-                    }
-                });
-                if (typeof simulation !== 'undefined') simulation.makeGunHUD();
-            }
+            if (!window.photonicContent?.weapons || !Array.isArray(b?.guns)) return;
+            window.photonicContent.weapons.forEach(w => {
+                if (!b.guns.find(g => g.name === w.name)) b.guns.push(w);
+                this.ensureWeaponOwned(w.name);
+            });
+            simulation?.makeGunHUD?.();
         },
-        
+
         grantMovementTechs() {
-            if (window.movementTechs && typeof tech !== 'undefined') {
-                window.movementTechs.forEach(t => {
-                    const existing = tech.tech.find(et => et.name === t.name);
-                    if (existing) existing.count = existing.maxCount;
-                });
-            }
+            if (!Array.isArray(tech?.tech)) return;
+            tech.tech.forEach(t => {
+                if (t.name && t.name.toLowerCase().includes('movement')) t.count = t.maxCount || 1;
+            });
         },
-        
+
         tryUnlock(code) {
-            const upperCode = code.toUpperCase().trim();
-            if (this.codes[upperCode]) {
-                if (!this.codes[upperCode].unlocked) {
-                    this.codes[upperCode].unlocked = true;
-                    this.unlockedCodes.push(upperCode);
-                    localStorage.setItem('unlocked_codes', JSON.stringify(this.unlockedCodes));
-                    this.codes[upperCode].apply();
-                    const message = upperCode === 'QROW2025' ? 'you have awakened ✓' : this.codes[upperCode].name;
-                    return { success: true, name: message };
-                }
-                return { success: false, message: 'Already unlocked!' };
-            }
-            return { success: false, message: 'Invalid code' };
+            const upper = (code || '').toUpperCase().trim();
+            const target = this.codes[upper];
+            if (!target) return { success: false, message: 'Invalid code' };
+            if (this.unlockedCodes.includes(upper)) return { success: false, message: 'Already unlocked!' };
+            this.unlockedCodes.push(upper);
+            localStorage.setItem(STORE_KEY, JSON.stringify(this.unlockedCodes));
+            target.apply();
+            return { success: true, name: target.name };
         },
-        
+
         applyUnlockedCodes() {
-            this.unlockedCodes.forEach(code => {
-                if (this.codes[code]) {
-                    this.codes[code].apply();
-                }
-            });
+            this.unlockedCodes.forEach(c => this.codes[c]?.apply());
         },
-        
+
         loadSavedCodes() {
             try {
-                const saved = localStorage.getItem('unlocked_codes');
-                if (saved) {
-                    this.unlockedCodes = JSON.parse(saved);
-                    this.unlockedCodes.forEach(code => {
-                        if (this.codes[code]) this.codes[code].unlocked = true;
-                    });
-                }
-            } catch (e) {
-                console.log('No saved unlock codes');
+                const saved = localStorage.getItem(STORE_KEY);
+                if (saved) this.unlockedCodes = JSON.parse(saved) || [];
+            } catch (_) {
+                this.unlockedCodes = [];
             }
         },
-        
+
+        bindUI() {
+            const btn = document.getElementById('unlock-code-btn');
+            const input = document.getElementById('unlock-code');
+            const status = document.getElementById('unlock-status');
+            if (!btn || !input || !status) return;
+
+            const submit = () => {
+                const result = this.tryUnlock(input.value);
+                if (result.success) {
+                    status.style.color = '#0a0';
+                    status.textContent = `✓ Unlocked: ${result.name}`;
+                    input.value = '';
+                } else {
+                    status.style.color = '#c00';
+                    status.textContent = `✗ ${result.message}`;
+                }
+                setTimeout(() => { status.textContent = ''; }, 2500);
+            };
+
+            btn.addEventListener('click', submit);
+            input.addEventListener('keypress', (e) => { if (e.key === 'Enter') submit(); });
+        },
+
         init() {
             this.loadSavedCodes();
-            
-            // Setup unlock button listener
-            document.addEventListener('DOMContentLoaded', () => {
-                const btn = document.getElementById('unlock-code-btn');
-                const input = document.getElementById('unlock-code');
-                const status = document.getElementById('unlock-status');
-                
-                if (btn && input && status) {
-                    btn.addEventListener('click', () => {
-                        const result = window.unlockCodes.tryUnlock(input.value);
-                        if (result.success) {
-                            status.style.color = '#0a0';
-                            status.textContent = `✓ Unlocked: ${result.name}!`;
-                            input.value = '';
-                        } else {
-                            status.style.color = '#c00';
-                            status.textContent = `✗ ${result.message}`;
-                        }
-                        setTimeout(() => status.textContent = '', 3000);
-                    });
-                    
-                    input.addEventListener('keypress', (e) => {
-                        if (e.key === 'Enter') btn.click();
-                    });
-                }
-            });
-            
-            console.log('%c🔓 Unlock Codes System Loaded!', 'color: #FFD700; font-weight: bold;');
+            this.applyUnlockedCodes();
+            if (document.readyState === 'loading') {
+                document.addEventListener('DOMContentLoaded', () => this.bindUI());
+            } else {
+                this.bindUI();
+            }
+            console.log('%c🔓 Unlock Codes System Loaded (fixed)', 'color: #FFD700; font-weight: bold;');
         }
     };
-    
-    window.unlockCodes.init();
+
+    window.unlockCodes = api;
+    api.init();
 })();
