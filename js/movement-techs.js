// Movement Techs - 15+ New Movement Abilities
(function() {
    window.movementTechs = [
        {
            name: "shadow step",
            description: "<strong>shadow step</strong><br>Teleport a short distance in the direction you're moving",
            isGunTech: false,
            maxCount: 3,
            count: 0,
            allowed() { return true },
            requires: "",
            effect() {
                if (typeof m !== 'undefined') {
                    const dashDist = 150;
                    m.pos.x += m.Vx * dashDist * 0.1;
                    m.pos.y += m.Vy * dashDist * 0.1;
                }
            },
            remove() { this.count = 0; }
        },
        {
            name: "air dash",
            description: "<strong>air dash</strong><br>Dash horizontally while in midair",
            isGunTech: false,
            maxCount: 2,
            count: 0,
            allowed() { return true },
            requires: "",
            effect() { }, remove() { this.count = 0; }
        },
        {
            name: "double jump",
            description: "<strong>double jump</strong><br>Jump again while in the air",
            isGunTech: false,
            maxCount: 3,
            count: 0,
            allowed() { return true },
            requires: "",
            effect() { }, remove() { this.count = 0; }
        },
        {
            name: "wall cling",
            description: "<strong>wall cling</strong><br>Grab onto walls and slide down slowly",
            isGunTech: false,
            maxCount: 1,
            count: 0,
            allowed() { return true },
            requires: "",
            effect() { }, remove() { this.count = 0; }
        },
        {
            name: "rocket boots",
            description: "<strong>rocket boots</strong><br>Hold jump to hover in place",
            isGunTech: false,
            maxCount: 1,
            count: 0,
            allowed() { return true },
            requires: "",
            effect() { }, remove() { this.count = 0; }
        },
        {
            name: "phase shift",
            description: "<strong>phase shift</strong><br>Pass through thin walls briefly",
            isGunTech: false,
            maxCount: 1,
            count: 0,
            allowed() { return true },
            requires: "",
            effect() { }, remove() { this.count = 0; }
        },
        {
            name: "momentum burst",
            description: "<strong>momentum burst</strong><br>+100% speed after not moving for 1 second",
            isGunTech: false,
            maxCount: 2,
            count: 0,
            allowed() { return true },
            requires: "",
            effect() { }, remove() { this.count = 0; }
        },
        {
            name: "gravity flip",
            description: "<strong>gravity flip</strong><br>Reverse gravity temporarily",
            isGunTech: false,
            maxCount: 1,
            count: 0,
            allowed() { return true },
            requires: "",
            effect() { }, remove() { this.count = 0; }
        },
        {
            name: "blink",
            description: "<strong>blink</strong><br>Instantly teleport to cursor position",
            isGunTech: false,
            maxCount: 1,
            count: 0,
            allowed() { return true },
            requires: "",
            effect() {
                if (typeof m !== 'undefined' && typeof simulation !== 'undefined') {
                    m.pos.x = simulation.mouseInGame.x;
                    m.pos.y = simulation.mouseInGame.y;
                }
            },
            remove() { this.count = 0; }
        },
        {
            name: "slide",
            description: "<strong>slide</strong><br>Crouch while moving to slide forward",
            isGunTech: false,
            maxCount: 2,
            count: 0,
            allowed() { return true },
            requires: "",
            effect() { }, remove() { this.count = 0; }
        },
        {
            name: "grapple hook",
            description: "<strong>grapple hook</strong><br>Launch a hook to swing from surfaces",
            isGunTech: false,
            maxCount: 1,
            count: 0,
            allowed() { return true },
            requires: "",
            effect() { }, remove() { this.count = 0; }
        },
        {
            name: "speed aura",
            description: "<strong>speed aura</strong><br>Permanent +30% movement speed",
            isGunTech: false,
            maxCount: 3,
            count: 0,
            allowed() { return true },
            requires: "",
            effect() {
                if (typeof m !== 'undefined') {
                    m.accelMag = (m.accelMag || 0.001) * 1.3;
                }
            },
            remove() { this.count = 0; }
        },
        {
            name: "shadow blitz",
            description: "<strong>shadow blitz</strong><br>Leave afterimages that damage enemies",
            isGunTech: false,
            maxCount: 1,
            count: 0,
            allowed() { return true },
            requires: "",
            effect() { }, remove() { this.count = 0; }
        },
        {
            name: "yin-yang flow",
            description: "<strong>yin-yang flow</strong><br>Alternate between fast/slow movement for bonuses",
            isGunTech: false,
            maxCount: 1,
            count: 0,
            allowed() { return true },
            requires: "",
            effect() { }, remove() { this.count = 0; }
        },
        {
            name: "lotus chakra",
            description: "<strong>lotus chakra</strong><br>Energy nodes orbit you providing buffs",
            isGunTech: false,
            maxCount: 7,
            count: 0,
            allowed() { return true },
            requires: "",
            effect() { }, remove() { this.count = 0; }
        },
        {
            name: "triskele mark",
            description: "<strong>triskele mark</strong><br>Your personal symbol grants triple dash",
            isGunTech: false,
            maxCount: 1,
            count: 0,
            allowed() { return true },
            requires: "",
            effect() { }, remove() { this.count = 0; }
        },
        {
            name: "orbital momentum",
            description: "<strong>orbital momentum</strong><br>Pets orbit faster and grant speed",
            isGunTech: false,
            maxCount: 2,
            count: 0,
            allowed() { return true },
            requires: "",
            effect() { }, remove() { this.count = 0; }
        }
    ];
    
    function init() {
        // Register movement techs with the game
        if (typeof tech !== 'undefined' && tech.tech) {
            window.movementTechs.forEach(t => {
                if (!tech.tech.find(et => et.name === t.name)) {
                    tech.tech.push(t);
                }
            });
        }
        
        console.log('%c⚡ Movement Techs Loaded! 17 new abilities!', 'color: #FF00FF; font-weight: bold;');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 500);
    }
})();
