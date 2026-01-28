// God Mode Tech
(function() {
    const godModeTech = {
        name: "divine intervention",
        description: "<strong>divine intervention</strong><br>Infinite ammo, infinite energy, and infinite health. You are a god.",
        isGunTech: false,
        maxCount: 1,
        count: 0,
        allowed() { return true },
        requires: "",
        effect() {
            this.count++;
            // Apply infinite stats in the game loop
            const godLoop = () => {
                if (this.count > 0 && typeof m !== 'undefined') {
                    m.health = 1;
                    m.energy = m.maxEnergy;
                    if (typeof b !== 'undefined' && b.activeGun !== null) {
                        const gun = b.guns[b.activeGun];
                        if (gun && gun.ammo !== Infinity) {
                            gun.ammo = 999;
                        }
                    }
                    requestAnimationFrame(godLoop);
                }
            };
            godLoop();
        },
        remove() {
            this.count = 0;
        }
    };

    function init() {
        if (typeof tech !== 'undefined' && tech.tech) {
            if (!tech.tech.find(t => t.name === godModeTech.name)) {
                tech.tech.push(godModeTech);
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 500);
    }
})();
