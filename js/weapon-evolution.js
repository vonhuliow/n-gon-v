// Weapon Evolution System
if (typeof window.weaponEvolution === 'undefined') {
    window.weaponEvolution = {
        kills: {},
        evolutionTechs: [
            {
                name: "gun evolution",
                description: "<strong>gun evolution</strong><br>Your active gun evolves based on kills (visuals, fire rate, projectiles)",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                allowed() { return true },
                requires: "",
                effect() { 
                    window.weaponEvolution.active = true;
                },
                remove() { 
                    this.count = 0;
                    window.weaponEvolution.active = false;
                }
            }
        ],
        active: false,
        
        init() {
            if (typeof tech !== 'undefined' && tech.tech) {
                this.evolutionTechs.forEach(t => {
                    if (!tech.tech.find(existing => existing.name === t.name)) {
                        tech.tech.push(t);
                    }
                });
            }
            console.log('%c🧬 Weapon Evolution System Loaded!', 'color: #ff00ff; font-weight: bold;');
        },
        
        onKill(mobName) {
            if (!this.active || b.activeGun === null) return;
            const gun = b.guns[b.activeGun];
            if (!gun) return;
            const gunName = gun.name;
            this.kills[gunName] = (this.kills[gunName] || 0) + 1;
            
            this.checkEvolution(gunName);
        },
        
        checkEvolution(gunName) {
            const kills = this.kills[gunName];
            const gun = b.guns[b.activeGun];
            if (!gun) return;
            
            if (kills === 10) {
                gun.color = "#00ffff";
                console.log(`%c✨ ${gunName} Evolved to Tier 1!`, 'color: #00ffff; font-weight: bold;');
            }
            if (kills === 25) {
                gun.isEvolved = true;
                console.log(`%c🔥 ${gunName} Evolved to Tier 2! EXTRA POWER!`, 'color: #ff0000; font-weight: bold;');
            }
            if (kills === 50) {
                gun.isUltimate = true;
                console.log(`%c💎 ${gunName} REACHED ULTIMATE FORM!`, 'color: #ffffff; font-weight: bold;');
            }
        }
    };
    window.weaponEvolution.init();
}
