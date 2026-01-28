// System Verifier - QA testing for all game systems
if (typeof window.systemVerifier === 'undefined') {
    window.systemVerifier = {
        
        checks: {
            weapons: false,
            techs: false,
            potions: false,
            abilities: false,
            movements: false,
            mobs: false,
            customization: false
        },
        
        results: [],
        
        verifyWeapons() {
            let count = 0;
            if (typeof b !== 'undefined' && b.guns) {
                b.guns.forEach(gun => {
                    if (gun && gun.name && gun.fire) count++;
                });
            }
            this.results.push(`✓ Weapons: ${count} loaded and functional`);
            this.checks.weapons = count > 0;
            return count;
        },
        
        verifyTechs() {
            let count = 0;
            if (typeof tech !== 'undefined' && tech.list) {
                tech.list.forEach(t => {
                    if (t && t.name) count++;
                });
            }
            this.results.push(`✓ Techs: ${count} loaded`);
            this.checks.techs = count > 5;
            return count;
        },
        
        verifyPotions() {
            let count = 0;
            if (typeof window.potions !== 'undefined' && window.potions.list) {
                count = window.potions.list.length;
            }
            this.results.push(`✓ Potions: ${count} available`);
            this.checks.potions = count >= 40;
            return count;
        },
        
        verifyAbilities() {
            let heroCount = 0, gachaCount = 0;
            if (typeof window.superheroAbilities !== 'undefined') {
                heroCount = window.superheroAbilities.abilities.length;
            }
            if (typeof window.gachaField !== 'undefined') {
                gachaCount = window.gachaField.abilities.length;
            }
            this.results.push(`✓ Superhero Abilities: ${heroCount}`);
            this.results.push(`✓ Gacha Abilities: ${gachaCount}`);
            this.checks.abilities = heroCount > 0 && gachaCount > 0;
            return { hero: heroCount, gacha: gachaCount };
        },
        
        verifyMovements() {
            let count = 0;
            if (typeof window.movementTechs !== 'undefined' && Array.isArray(window.movementTechs)) {
                count = window.movementTechs.length;
            }
            this.results.push(`✓ Movement Techs: ${count} loaded`);
            this.checks.movements = count >= 15;
            return count;
        },
        
        verifyMobs() {
            let count = 0;
            if (typeof window.coolMobs !== 'undefined') {
                count = window.coolMobs.mobs.length;
            }
            this.results.push(`✓ Cool Mobs: ${count} registered`);
            this.checks.mobs = count > 0;
            return count;
        },
        
        verifyCustomization() {
            let colors = 0, hats = 0, eyes = 0;
            if (typeof window.customization !== 'undefined') {
                if (window.customization.items) {
                    colors = window.customization.items.colors?.length || 0;
                    hats = window.customization.items.hats?.length || 0;
                    eyes = window.customization.items.eyes?.length || 0;
                }
            }
            this.results.push(`✓ Customization: ${colors} colors, ${hats} hats, ${eyes} eyes`);
            this.checks.customization = colors > 10 && hats > 10;
            return { colors, hats, eyes };
        },
        
        runFullCheck() {
            this.results = [];
            console.log('%c=== SYSTEM VERIFICATION ===', 'color: #0f0; font-weight: bold;');
            
            this.verifyWeapons();
            this.verifyTechs();
            this.verifyPotions();
            this.verifyAbilities();
            this.verifyMovements();
            this.verifyMobs();
            this.verifyCustomization();
            
            console.log('%c--- VERIFICATION RESULTS ---', 'color: #0f0; font-weight: bold;');
            this.results.forEach(r => console.log(r));
            
            const allPassed = Object.values(this.checks).every(v => v);
            console.log(`%c${allPassed ? '✓ ALL SYSTEMS OPERATIONAL' : '⚠ SOME SYSTEMS NEED ATTENTION'}`, 
                       `color: ${allPassed ? '#0f0' : '#ff0'}; font-weight: bold;`);
            
            return this.checks;
        },
        
        getReport() {
            return {
                checks: this.checks,
                results: this.results,
                timestamp: new Date().toLocaleString()
            };
        },
        
        init() {
            console.log('%c🔍 System Verifier Loaded!', 'color: #0f0; font-weight: bold;');
            // Auto-run check on load
            setTimeout(() => this.runFullCheck(), 2000);
        }
    };
    
    window.systemVerifier.init();
}
