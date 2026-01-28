(function() {
    const e = {
        name: "sniper rifle",
        descriptionFunction() { return `placeholder desc`},
        ammo: 24,
        ammoPack: 3,
        defaultAmmoPack: 3,
        have: false,
        cycle: 0,
        canSRFire: true,
	cooldown: 0,
	cdLength: 60,
	shotRadius: 50,
	shotPower: 10,
        fire() {
	    this.ammo++;
            if (this.canSRFire) {
		this.ammo--;
                for (let index = 0; index < this.shotPower; index++) {
    			b.explosion(simulation.mouseInGame, this.shotRadius);
		};
		this.canSRFire = false;
	    };
        },
	do() {
                if (!this.canSRFire) {
		    this.cooldown++;
		    if (this.cooldown > this.cdLength) {
		        this.cooldown = 0;
		        this.canSRFire = true;
	    	    };
		};
        },
    };       
	b.guns.push(e);
	const gunArray = b.guns.filter(
	(obj, index, self) =>
		index === self.findIndex((item) => item.name === obj.name)
	);
	const techArray = tech.tech.filter(
	(obj, index, self) =>
		index === self.findIndex((item) => item.name === obj.name)
	);
	b.guns = gunArray;
	tech.tech = techArray;
	console.log("%cSniper mod successfully installed", "color: gray");
})();
