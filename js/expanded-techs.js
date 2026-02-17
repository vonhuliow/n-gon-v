diff --git a/js/expanded-techs.js b/js/expanded-techs.js
index 6d1d97155164adab34fa0d2520679fd1a3068099..fb11dedfce2590fefe7ec018d8ddda8be10ca180 100644
--- a/js/expanded-techs.js
+++ b/js/expanded-techs.js
@@ -1,148 +1,123 @@
-// Massive New Techs Expansion - 25 Creative New Techs
-(function() {
-    const newTechs = [
-        {
-            name: "quantum foam",
-            description: "<strong>quantum foam</strong><br>Foam is 10x larger and deals massive explosion damage",
-            isGunTech: true,
-            maxCount: 1,
-            count: 0,
-            requires: "foam",
-            allowed() { return b.guns.find(g => g.name === 'foam' && g.have) },
-            effect() { 
-                const gun = b.guns.find(g => g.name === 'foam');
-                gun.ammoPack = 100;
-                b.setFireCD();
-            },
-            remove() { this.count = 0; }
-        },
-        {
-            name: "cluster missiles",
-            description: "<strong>cluster missiles</strong><br>Missiles fire in volleys of 5 with 0 cooldown",
-            isGunTech: true,
-            maxCount: 1,
-            count: 0,
-            requires: "missile",
-            allowed() { return b.guns.find(g => g.name === 'missile' && g.have) },
-            effect() { 
-                const gun = b.guns.find(g => g.name === 'missile');
-                gun.ammoPack = 50;
-                tech.fireRate *= 0.1;
-                b.setFireCD();
-            },
-            remove() { this.count = 0; }
-        },
-        {
-            name: "overmind drones",
-            description: "<strong>overmind drones</strong><br>Spawn 10 drones at once with infinite health",
-            isGunTech: true,
-            maxCount: 1,
-            count: 0,
-            requires: "drone",
-            allowed() { return b.guns.find(g => g.name === 'drone' && g.have) },
-            effect() { 
-                m.damageDone *= 5;
-                b.droneDamage = 10;
-            },
-            remove() { this.count = 0; }
-        },
-        {
-            name: "fungal bloom",
-            description: "<strong>fungal bloom</strong><br>Spores cover the entire screen and instant-kill non-bosses",
-            isGunTech: true,
-            maxCount: 1,
-            count: 0,
-            requires: "spores",
-            allowed() { return b.guns.find(g => g.name === 'spores' && g.have) },
-            effect() { m.damageDone *= 10; },
-            remove() { this.count = 0; }
-        },
-        {
-            name: "tsunami waves",
-            description: "<strong>tsunami waves</strong><br>Waves are global and deal 1000% damage",
-            isGunTech: true,
-            maxCount: 1,
-            count: 0,
-            requires: "wave",
-            allowed() { return b.guns.find(g => g.name === 'wave' && g.have) },
-            effect() { m.damageDone *= 10; },
-            remove() { this.count = 0; }
-        },
-        {
-            name: "omega harpoon",
-            description: "<strong>omega harpoon</strong><br>Harpoons travel instantly and delete enemies from existence",
-            isGunTech: true,
-            maxCount: 1,
-            count: 0,
-            requires: "harpoon",
-            allowed() { return b.guns.find(g => g.name === 'harpoon' && g.have) },
-            effect() { m.damageDone *= 20; },
-            remove() { this.count = 0; }
-        },
-        // General Creative Techs
-        {
-            name: "gravity anchor",
-            description: "<strong>gravity anchor</strong><br>Stand still to increase your defense by 80% and pull nearby mobs toward you",
-            isGunTech: false,
-            maxCount: 1,
-            count: 0,
-            allowed() { return true },
-            requires: "",
-            effect() { m.isAnchor = true; },
-            remove() { this.count = 0; }
-        },
-        {
-            name: "chronos trigger",
-            description: "<strong>chronos trigger</strong><br>Kills grant 2 seconds of slowed time for everyone but you",
-            isGunTech: false,
-            maxCount: 1,
-            count: 0,
-            allowed() { return true },
-            requires: "",
-            effect() { m.isChronos = true; },
-            remove() { this.count = 0; }
-        },
-        {
-            name: "photonic overdrive",
-            description: "<strong>photonic overdrive</strong><br>Firing your weapon consumes energy instead of ammo if ammo is low",
-            isGunTech: false,
-            maxCount: 1,
-            count: 0,
-            allowed() { return true },
-            requires: "",
-            effect() { m.isPhotonicOverdrive = true; },
-            remove() { this.count = 0; }
-        }
-        // ... Adding 16 more in the actual script registration
-    ];
+// Appearance Tech Pack - cosmetic techs that visibly alter player style
+(function () {
+    if (window.appearanceTechPackLoaded) return;
+    window.appearanceTechPackLoaded = true;
+
+    const state = window.appearanceTechState || {
+        hueShift: 0,
+        auraLevel: 0,
+        ghostTrail: 0,
+        neonOutline: 0,
+        pixelCrown: 0,
+        chromaPulse: 0,
+        voidVeil: 0,
+        goldMask: 0,
+        synthWings: 0,
+        hackerGlitch: 0,
+    };
+    window.appearanceTechState = state;
+
+    const colorFromHue = (h, a = 0.4) => `hsla(${h % 360}, 95%, 60%, ${a})`;
 
-    function register() {
-        if (typeof tech !== 'undefined' && tech.tech) {
-            newTechs.forEach(t => {
-                if (!tech.tech.find(existing => existing.name === t.name)) {
-                    tech.tech.push(t);
-                }
+    const pack = [
+        ["chrome skin", "body gets a chrome aura", "hueShift", 20],
+        ["neon veins", "neon pulses track movement", "auraLevel", 1],
+        ["ghost trail", "leave afterimages while moving", "ghostTrail", 1],
+        ["neon outline", "bright outline around player", "neonOutline", 1],
+        ["pixel crown", "floating digital crown above player", "pixelCrown", 1],
+        ["chroma pulse", "cycling chroma pulse around body", "chromaPulse", 1],
+        ["void veil", "dark veil with subtle particles", "voidVeil", 1],
+        ["gold mask", "gold ring mask around face", "goldMask", 1],
+        ["synth wings", "synthwave wing traces", "synthWings", 1],
+        ["hacker glitch", "glitch boxes around player", "hackerGlitch", 1],
+        ["spectrum shell", "rotating spectrum shell", "hueShift", 35],
+        ["terminal glow", "emerald terminal glow", "auraLevel", 1],
+        ["digital fog", "pixel fog on movement", "ghostTrail", 1],
+        ["ultraviolet trim", "violet edge aura", "neonOutline", 1],
+        ["cyber halo", "floating cyber halo", "pixelCrown", 1],
+    ].map(([name, text, key, value]) => ({
+        name,
+        description: `<strong>${name}</strong><br>${text}`,
+        isGunTech: false,
+        maxCount: 1,
+        count: 0,
+        allowed() { return true; },
+        requires: "",
+        effect() { state[key] += value; },
+        remove() { state[key] = Math.max(0, state[key] - value); this.count = 0; }
+    }));
+
+    const registerTechs = () => {
+        if (typeof tech !== 'undefined' && Array.isArray(tech.tech)) {
+            pack.forEach(t => {
+                if (!tech.tech.find(existing => existing.name === t.name)) tech.tech.push(t);
             });
-            // Fill up to 25 techs with variations
-            for(let i=1; i<=16; i++) {
-                 tech.tech.push({
-                    name: `advanced synergy ${i}`,
-                    description: `<strong>synergy ${i}</strong><br>Creative buff variant #${i}: +${5+i}% overall power.`,
-                    isGunTech: false,
-                    maxCount: 5,
-                    count: 0,
-                    allowed() { return true },
-                    requires: "",
-                    effect() { m.damageDone *= (1 + (0.05 + i*0.01)); },
-                    remove() { this.count = 0; }
-                 });
+        }
+    };
+
+    const drawAppearance = () => {
+        if (typeof m === 'undefined' || !simulation?.drawList) return;
+        const x = m.pos.x;
+        const y = m.pos.y;
+
+        if (state.hueShift > 0 || state.chromaPulse > 0) {
+            const hue = (m.cycle * (1 + state.chromaPulse * 0.5) + state.hueShift * 4) % 360;
+            simulation.drawList.push({ x, y, radius: 28 + state.chromaPulse * 2, color: colorFromHue(hue, 0.22), time: simulation.drawTime });
+            simulation.drawList.push({ x, y, radius: 40 + state.chromaPulse * 3, color: colorFromHue(hue + 120, 0.16), time: simulation.drawTime });
+        }
+        if (state.auraLevel > 0) {
+            simulation.drawList.push({ x, y, radius: 22 + state.auraLevel * 3, color: "rgba(0,255,170,0.20)", time: simulation.drawTime });
+        }
+        if (state.ghostTrail > 0 && Math.abs(m.Vx) + Math.abs(m.Vy) > 2) {
+            simulation.drawList.push({ x: x - m.Vx * 4, y: y - m.Vy * 4, radius: 14, color: "rgba(160,220,255,0.18)", time: simulation.drawTime });
+        }
+        if (state.neonOutline > 0) {
+            simulation.drawList.push({ x, y, radius: 34, color: "rgba(180,40,255,0.14)", time: simulation.drawTime });
+        }
+        if (state.pixelCrown > 0) {
+            for (let i = 0; i < 5; i++) {
+                simulation.drawList.push({ x: x - 20 + i * 10, y: y - 46 - (i % 2) * 6, radius: 4, color: "rgba(255,215,0,0.35)", time: simulation.drawTime });
+            }
+        }
+        if (state.voidVeil > 0) {
+            simulation.drawList.push({ x, y, radius: 45, color: "rgba(20,10,30,0.15)", time: simulation.drawTime });
+        }
+        if (state.goldMask > 0) {
+            simulation.drawList.push({ x, y: y - 8, radius: 12, color: "rgba(255,220,120,0.3)", time: simulation.drawTime });
+        }
+        if (state.synthWings > 0) {
+            simulation.drawList.push({ x: x - 30, y: y - 4, radius: 12, color: "rgba(255,0,120,0.22)", time: simulation.drawTime });
+            simulation.drawList.push({ x: x + 30, y: y - 4, radius: 12, color: "rgba(0,220,255,0.22)", time: simulation.drawTime });
+        }
+        if (state.hackerGlitch > 0 && m.cycle % 6 === 0) {
+            for (let i = 0; i < 3; i++) {
+                simulation.drawList.push({
+                    x: x + (Math.random() - 0.5) * 40,
+                    y: y + (Math.random() - 0.5) * 50,
+                    radius: 5 + Math.random() * 4,
+                    color: "rgba(0,255,120,0.24)",
+                    time: simulation.drawTime
+                });
             }
         }
+    };
+
+    if (simulation?.ephemera) {
+        simulation.ephemera.push({ name: "appearance-tech-pack", do: drawAppearance });
+    } else {
+        const wait = setInterval(() => {
+            if (simulation?.ephemera) {
+                simulation.ephemera.push({ name: "appearance-tech-pack", do: drawAppearance });
+                clearInterval(wait);
+            }
+        }, 300);
     }
 
     if (document.readyState === 'loading') {
-        document.addEventListener('DOMContentLoaded', register);
+        document.addEventListener('DOMContentLoaded', registerTechs);
     } else {
-        setTimeout(register, 500);
+        setTimeout(registerTechs, 400);
     }
+
+    console.log('%c✨ Appearance Tech Pack Loaded (15 techs)', 'color:#9b59b6;font-weight:bold;');
 })();
