// Block Summon System
(function() {
    const blockSummon = {
        name: "architect's touch",
        description: "<strong>architect's touch</strong><br>Press 'H' to summon a physics block at your cursor.",
        isGunTech: false,
        maxCount: 1,
        count: 0,
        allowed() { return true },
        requires: "",
        effect() {
            this.count++;
            console.log("%c🏗️ Block Summon Tech Activated! Press 'H' to build!", "color: #f1c40f; font-weight: bold;");
        },
        remove() { this.count = 0; }
    };

    function init() {
        if (typeof tech !== 'undefined' && tech.tech) {
            if (!tech.tech.find(t => t.name === blockSummon.name)) {
                tech.tech.push(blockSummon);
            }
        }

        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'h' && blockSummon.count > 0) {
                if (typeof m !== 'undefined' && typeof simulation !== 'undefined') {
                    const sides = Math.floor(3 + 5 * Math.random());
                    const size = 20 + 20 * Math.random();
                    const newBlock = Matter.Bodies.polygon(simulation.mouseInGame.x, simulation.mouseInGame.y, sides, size, {
                        friction: 0.05,
                        frictionAir: 0.001,
                        restitution: 0.5,
                        density: 0.002,
                        classType: "body"
                    });
                    if (typeof body !== 'undefined') {
                        body.push(newBlock);
                        Matter.Composite.add(engine.world, newBlock);
                        console.log("Block summoned!");
                    }
                }
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 500);
    }
})();
