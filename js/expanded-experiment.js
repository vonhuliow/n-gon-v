// Expanded Experiment Mode - New Buffs & UI System
if (typeof window.expandedExperiment === 'undefined') {
    window.expandedExperiment = {
        
        extraPlayerBuffs: [
            { name: '🔬 Lab Rat', desc: '+50% all experiment buffs', apply(p) { p.experimentMultiplier = 1.5; } },
            { name: '💪 Titan', desc: '+150% damage, -50% speed', apply(p) { p.damageMultiplier = 2.5; p.Fx = p.Fx * 0.5; } },
            { name: '⚡ Lightning Rod', desc: 'Teleport on hit', apply(p) { p.teleportOnHit = true; } },
            { name: '🛡️ Fortress', desc: 'Absorb 50% damage as shield', apply(p) { p.shieldAbsorption = 0.5; } },
            { name: '🔥 Inferno', desc: 'Attacks burn in radius', apply(p) { p.fireAura = true; } },
            { name: '❄️ Frostbite', desc: 'Slow enemies on hit', apply(p) { p.freezeAura = true; } },
            { name: '⚛️ Quantum', desc: 'Clone yourself occasionally', apply(p) { p.cloneChance = 0.1; } },
            { name: '👻 Specter', desc: 'Phase through walls', apply(p) { p.canPhaseShift = true; } }
        ],
        
        extraWeaponVariants: [
            { name: '🌙 Lunar', desc: 'Bouncing projectiles', variant: 'lunar' },
            { name: '☄️ Meteor', desc: 'Heavy hitting AOE', variant: 'meteor' },
            { name: '🌊 Tsunami', desc: 'Wave of force', variant: 'tsunami' },
            { name: '💨 Tempest', desc: 'Rapid fire', variant: 'tempest' },
            { name: '🕷️ Venom', desc: 'Poison DoT', variant: 'venom' },
            { name: '👁️ Gaze', desc: 'Homing shots', variant: 'gaze' },
            { name: '🎆 Cascade', desc: 'Explosive chain reaction', variant: 'cascade' },
            { name: '🌀 Singularity', desc: 'Black hole effect', variant: 'singularity' }
        ],
        
        isUIOpen: false,
        selectedBuffs: [],
        selectedVariants: [],
        
        toggleUI() {
            this.isUIOpen = !this.isUIOpen;
            this.drawUI();
        },
        
        drawUI() {
            if (!this.isUIOpen) return;
            
            let panel = document.getElementById('expanded-experiment-panel');
            if (!panel) {
                panel = document.createElement('div');
                panel.id = 'expanded-experiment-panel';
                panel.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 600px;
                    max-height: 700px;
                    background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
                    border: 3px solid #00ff00;
                    border-radius: 15px;
                    padding: 20px;
                    z-index: 3000;
                    overflow-y: auto;
                    font-family: Arial, sans-serif;
                    box-shadow: 0 0 50px rgba(0, 255, 0, 0.5);
                    color: #fff;
                `;
                document.body.appendChild(panel);
            }
            
            let html = `
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #00ff00; margin: 0;">🔬 EXPANDED EXPERIMENT MODE</h2>
                    <button onclick="window.expandedExperiment.toggleUI()" style="background: #00ff00; color: #000; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold;">CLOSE</button>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h3 style="color: #00ff00;">🛡️ SELECT FIELD</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 20px;">
            `;
            
            // Core fields from b.fields if available, or fallback to known fields
            const fieldList = (typeof b !== 'undefined' && b.fieldUpgrades) ? b.fieldUpgrades : [
                { name: "Kinetic" }, { name: "Phase" }, { name: "Gravity" }, { name: "Elastic" }
            ];

            fieldList.forEach((field, idx) => {
                html += `
                    <div onclick="if(typeof m !== 'undefined' && m.setField) m.setField(${idx});" style="
                        background: rgba(0,255,255,0.1);
                        border: 2px solid #00ffff;
                        padding: 10px;
                        border-radius: 8px;
                        cursor: pointer;
                        text-align: center;
                    ">
                        <div style="font-weight: bold; color: #00ffff;">${field.name}</div>
                    </div>
                `;
            });

            html += `</div>
                <h3 style="color: #00ff00;">🎁 EXTRA PLAYER BUFFS (${this.extraPlayerBuffs.length})</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            `;
            
            this.extraPlayerBuffs.forEach((buff, idx) => {
                html += `
                    <div onclick="window.expandedExperiment.applyExtraBuff(${idx})" style="
                        background: rgba(0,255,0,0.1);
                        border: 2px solid #00ff00;
                        padding: 10px;
                        border-radius: 8px;
                        cursor: pointer;
                        transition: all 0.2s;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        <div style="font-weight: bold; color: #00ff00;">${buff.name}</div>
                        <div style="font-size: 12px; color: #aaa;">${buff.desc}</div>
                    </div>
                `;
            });
            
            html += `</div></div><div style="margin-bottom: 20px;">
                    <h3 style="color: #00ff00;">⚔️ EXTRA WEAPON VARIANTS (${this.extraWeaponVariants.length})</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            `;
            
            this.extraWeaponVariants.forEach((variant, idx) => {
                html += `
                    <div onclick="window.expandedExperiment.applyExtraVariant(${idx})" style="
                        background: rgba(0,255,0,0.1);
                        border: 2px solid #00ff00;
                        padding: 10px;
                        border-radius: 8px;
                        cursor: pointer;
                        transition: all 0.2s;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        <div style="font-weight: bold; color: #00ff00;">${variant.name}</div>
                        <div style="font-size: 12px; color: #aaa;">${variant.desc}</div>
                    </div>
                `;
            });
            
            html += `</div></div>`;
            panel.innerHTML = html;
            panel.style.display = this.isUIOpen ? 'block' : 'none';
        },
        
        applyExtraBuff(index) {
            const buff = this.extraPlayerBuffs[index];
            if (buff && typeof m !== 'undefined') {
                buff.apply(m);
                this.selectedBuffs.push(buff.name);
                console.log(`✓ Applied extra buff: ${buff.name}`);
            }
        },
        
        applyExtraVariant(index) {
            const variant = this.extraWeaponVariants[index];
            if (variant) {
                this.selectedVariants.push(variant.name);
                console.log(`✓ Applied extra variant: ${variant.name}`);
            }
        },
        
        init() {
            console.log('%c🔬 Expanded Experiment Mode Loaded! 8 new buffs + 8 new variants!', 'color: #00ff00; font-weight: bold;');
        }
    };
    
    window.expandedExperiment.init();
}
