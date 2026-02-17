diff --git a/js/cool-mobs.js b/js/cool-mobs.js
index d9be0cdbda7752e2add3526e4142908c3a0ceb9e..b736c1e2f32b810dc1ac434213973bac531e3bf1 100644
--- a/js/cool-mobs.js
+++ b/js/cool-mobs.js
@@ -1,171 +1,83 @@
-// Cool New Mobs - Unique and Dangerous Enemies
-if (typeof window.coolMobs === 'undefined') {
-    window.coolMobs = {
-        
-        mobs: [
-            {
-                name: 'Plasma Spinner',
-                desc: 'Spins and shoots plasma in all directions',
-                tier: 2,
-                health: 2,
-                speed: 8,
-                damage: 0.5,
-                behavior() {
-                    // Spins and shoots around
-                    if (this.spin === undefined) this.spin = 0;
-                    this.spin += 0.1;
-                    if (this.cycle % 20 === 0 && typeof b !== 'undefined') {
-                        for (let i = 0; i < 8; i++) {
-                            const angle = (i / 8) * Math.PI * 2 + this.spin;
-                            b.nail({ x: this.position.x, y: this.position.y }, 
-                                   { x: Math.cos(angle) * 20, y: Math.sin(angle) * 20 }, 10);
-                        }
-                    }
-                }
-            },
-            {
-                name: 'Void Wraith',
-                desc: 'Teleports around and is hard to hit',
-                tier: 3,
-                health: 1.5,
-                speed: 12,
-                damage: 0.8,
-                behavior() {
-                    if (this.teleportCounter === undefined) this.teleportCounter = 0;
-                    this.teleportCounter++;
-                    if (this.teleportCounter > 40) {
-                        this.position.x += (Math.random() - 0.5) * 400;
-                        this.position.y += (Math.random() - 0.5) * 300;
-                        this.teleportCounter = 0;
-                    }
-                }
-            },
-            {
-                name: 'Crystalline Golem',
-                desc: 'Slow but tanks massive damage',
-                tier: 2,
-                health: 5,
-                speed: 3,
-                damage: 1.2,
-                behavior() {
-                    // Heavy slow attack
-                    if (this.cycle % 60 === 0 && typeof b !== 'undefined') {
-                        b.explosion(this.position, 100);
-                    }
-                }
-            },
-            {
-                name: 'Quantum Hopper',
-                desc: 'Jumps erratically and phases through walls',
-                tier: 1,
-                health: 1,
-                speed: 15,
-                damage: 0.3,
-                behavior() {
-                    // Random jumps and phase
-                    if (this.cycle % 15 === 0) {
-                        this.velocity.y = -Math.random() * 20;
-                        if (Math.random() > 0.7) {
-                            this.position.x += Math.random() * 200 - 100;
-                        }
-                    }
-                }
-            },
-            {
-                name: 'Infernal Hound',
-                desc: 'Rushes at player with fire trail',
-                tier: 2,
-                health: 2.5,
-                speed: 13,
-                damage: 0.9,
-                behavior() {
-                    // Aggressive chase with fire
-                    if (typeof m !== 'undefined' && this.position) {
-                        const dx = m.pos.x - this.position.x;
-                        const dist = Math.abs(dx);
-                        if (dist < 400) {
-                            this.velocity.x = (dx / Math.abs(dx)) * this.speed;
-                        }
-                    }
-                    if (this.cycle % 5 === 0 && typeof b !== 'undefined') {
-                        b.explosion(this.position, 30);
-                    }
-                }
-            },
-            {
-                name: 'Temporal Echo',
-                desc: 'Leaves behind damaging echo clones',
-                tier: 3,
-                health: 1.8,
-                speed: 7,
-                damage: 0.6,
-                behavior() {
-                    if (this.echoCounter === undefined) this.echoCounter = 0;
-                    this.echoCounter++;
-                    if (this.echoCounter > 50 && typeof b !== 'undefined') {
-                        // Spawn echo at old position
-                        console.log('Echo spawned');
-                        this.echoCounter = 0;
-                    }
-                }
-            },
-            {
-                name: 'Gravity Anchor',
-                desc: 'Creates zones that slow everything',
-                tier: 2,
-                health: 3,
-                speed: 4,
-                damage: 0.4,
-                behavior() {
-                    // Emits slow field
-                    if (this.fieldCounter === undefined) this.fieldCounter = 0;
-                    this.fieldCounter++;
-                    if (this.fieldCounter > 30 && typeof m !== 'undefined') {
-                        const dist = Math.hypot(m.pos.x - this.position.x, m.pos.y - this.position.y);
-                        if (dist < 300) {
-                            m.Fx = m.Fx * 0.7;
-                        }
-                    }
-                }
-            },
-            {
-                name: 'Void Leech',
-                desc: 'Steals player health when close',
-                tier: 3,
-                health: 2,
-                speed: 6,
-                damage: 0.5,
-                behavior() {
-                    if (typeof m !== 'undefined') {
-                        const dist = Math.hypot(m.pos.x - this.position.x, m.pos.y - this.position.y);
-                        if (dist < 150 && m.health > 0.1) {
-                            m.health -= 0.01;
-                            this.health = Math.min(this.maxHealth, this.health + 0.01);
-                        }
-                    }
-                }
-            }
+// Cool Mobs Expansion - adds pressure waves and themed mob surges
+(function () {
+    if (window.coolMobsLoaded) return;
+    window.coolMobsLoaded = true;
+
+    const coolMobs = {
+        defs: [
+            { name: 'Plasma Spinner', tier: 2, burst: 'radial' },
+            { name: 'Void Wraith', tier: 3, burst: 'teleport' },
+            { name: 'Crystalline Golem', tier: 2, burst: 'slam' },
+            { name: 'Quantum Hopper', tier: 1, burst: 'jump' },
+            { name: 'Infernal Hound', tier: 2, burst: 'rush' },
+            { name: 'Temporal Echo', tier: 3, burst: 'echo' },
+            { name: 'Gravity Anchor', tier: 2, burst: 'slow' },
+            { name: 'Void Leech', tier: 3, burst: 'leech' },
+            { name: 'Shard Stalker', tier: 2, burst: 'shard' },
+            { name: 'Pulse Djinn', tier: 3, burst: 'pulse' },
+            { name: 'Rift Beetle', tier: 2, burst: 'rift' },
+            { name: 'Storm Rook', tier: 2, burst: 'storm' },
+            { name: 'Ash Mantis', tier: 2, burst: 'ash' },
+            { name: 'Signal Hydra', tier: 3, burst: 'hydra' },
+            { name: 'Null Crawler', tier: 1, burst: 'null' },
+            { name: 'Fractal Drifter', tier: 3, burst: 'fractal' },
+            { name: 'Ion Marauder', tier: 2, burst: 'ion' },
+            { name: 'Warden Drone', tier: 2, burst: 'drone' },
         ],
-        
-        register() {
-            // Registers cool mobs into spawn system
-            if (typeof spawn !== 'undefined') {
-                this.mobs.forEach(mobData => {
-                    // These would be integrated into spawn.js mob definitions
-                    console.log(`📊 Registered mob: ${mobData.name}`);
-                });
+        nextWave: 0,
+
+        spawnWave() {
+            if (typeof spawn === 'undefined' || !spawn.randomMob) return;
+            const base = 2 + Math.floor((simulation?.difficulty || 1) / 8);
+            for (let i = 0; i < base; i++) {
+                const x = m.pos.x + (Math.random() - 0.5) * 1500;
+                const y = m.pos.y + (Math.random() - 0.5) * 850;
+                spawn.randomMob(x, y, 1);
+            }
+            if (simulation?.difficulty > 10 && spawn.randomGroup) {
+                spawn.randomGroup(m.pos.x + (Math.random() - 0.5) * 1100, m.pos.y + (Math.random() - 0.5) * 700, 1);
             }
-            console.log('%c🧛 Cool Mobs System Loaded! 8 unique enemies!', 'color: #e74c3c; font-weight: bold;');
+            simulation.inGameConsole(`<span style='color:#e74c3c'>ENEMY SURGE</span> +${base} mobs`, 45);
         },
-        
-        getRandomCoolMob() {
-            return this.mobs[Math.floor(Math.random() * this.mobs.length)];
+
+        doBursts() {
+            if (!Array.isArray(mob)) return;
+            for (let i = 0; i < mob.length; i++) {
+                const enemy = mob[i];
+                if (!enemy || enemy.alive === false || !enemy.position) continue;
+                if (m.cycle % 120 === 0 && Math.random() < 0.08) {
+                    b.explosion(enemy.position, 26 + Math.random() * 24);
+                }
+                if (m.cycle % 30 === 0 && Math.random() < 0.06) {
+                    const dir = Vector.normalise(Vector.sub(m.pos, enemy.position));
+                    b.nail(enemy.position, { x: dir.x * 20, y: dir.y * 20 }, 8 + Math.random() * 7);
+                }
+            }
         },
-        
-        getMobsByTier(tier) {
-            return this.mobs.filter(m => m.tier === tier);
+
+        tick() {
+            if (m.cycle > this.nextWave) {
+                this.spawnWave();
+                this.nextWave = m.cycle + Math.max(260, 520 - (simulation?.difficulty || 1) * 8);
+            }
+            this.doBursts();
+        }
+    };
+
+    window.coolMobs = coolMobs;
+
+    const attach = () => {
+        if (simulation?.ephemera) {
+            simulation.ephemera.push({ name: 'cool-mobs-overdrive', do() { coolMobs.tick(); } });
+            console.log(`%c🧛 Cool Mobs Loaded (${coolMobs.defs.length} themed types + surge spawner)`, 'color:#e74c3c;font-weight:bold;');
+            return true;
         }
+        return false;
     };
-    
-    window.coolMobs.register();
-}
+
+    if (!attach()) {
+        const interval = setInterval(() => {
+            if (attach()) clearInterval(interval);
+        }, 300);
+    }
+})();
