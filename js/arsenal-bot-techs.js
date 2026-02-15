// Additional bot-focused tech pack
(function () {
    const botTechs = [
        {
            name: "swarm uplink",
            description: "<strong>swarm uplink</strong><br>construct <strong>1</strong> random <strong class='color-bot'>bot</strong>",
            isGunTech: false,
            isBotTech: true,
            maxCount: 3,
            count: 0,
            allowed() { return typeof b !== 'undefined' && b.randomBot; },
            requires: "",
            effect() { if (b.randomBot) b.randomBot(); },
            remove() { this.count = 0; }
        },
        {
            name: "bot fabrication line",
            description: "<strong>bot fabrication line</strong><br>construct <strong>2</strong> random <strong class='color-bot'>bots</strong>",
            isGunTech: false,
            isBotTech: true,
            maxCount: 2,
            count: 0,
            allowed() { return typeof b !== 'undefined' && b.randomBot; },
            requires: "",
            effect() { if (b.randomBot) { b.randomBot(); b.randomBot(); } },
            remove() { this.count = 0; }
        },
        {
            name: "orbital doctrine",
            description: "<strong>orbital doctrine</strong><br>construct an <strong class='color-bot'>orbital-bot</strong>",
            isGunTech: false,
            isBotTech: true,
            maxCount: 2,
            count: 0,
            allowed() { return typeof b !== 'undefined' && b.orbitBot; },
            requires: "",
            effect() { if (b.orbitBot) b.orbitBot(); },
            remove() { this.count = 0; }
        },
        {
            name: "laser protocol",
            description: "<strong>laser protocol</strong><br>construct a <strong class='color-bot'>laser-bot</strong>",
            isGunTech: false,
            isBotTech: true,
            maxCount: 2,
            count: 0,
            allowed() { return typeof b !== 'undefined' && b.laserBot; },
            requires: "",
            effect() { if (b.laserBot) b.laserBot(); },
            remove() { this.count = 0; }
        },
        {
            name: "nail foundry",
            description: "<strong>nail foundry</strong><br>construct a <strong class='color-bot'>nail-bot</strong>",
            isGunTech: false,
            isBotTech: true,
            maxCount: 3,
            count: 0,
            allowed() { return typeof b !== 'undefined' && b.nailBot; },
            requires: "",
            effect() { if (b.nailBot) b.nailBot(); },
            remove() { this.count = 0; }
        },
        {
            name: "foam matrix",
            description: "<strong>foam matrix</strong><br>construct a <strong class='color-bot'>foam-bot</strong>",
            isGunTech: false,
            isBotTech: true,
            maxCount: 3,
            count: 0,
            allowed() { return typeof b !== 'undefined' && b.foamBot; },
            requires: "",
            effect() { if (b.foamBot) b.foamBot(); },
            remove() { this.count = 0; }
        },
        {
            name: "boom relay",
            description: "<strong>boom relay</strong><br>construct a <strong class='color-bot'>boom-bot</strong>",
            isGunTech: false,
            isBotTech: true,
            maxCount: 2,
            count: 0,
            allowed() { return typeof b !== 'undefined' && b.boomBot; },
            requires: "",
            effect() { if (b.boomBot) b.boomBot(); },
            remove() { this.count = 0; }
        },
        {
            name: "dynamo circuit",
            description: "<strong>dynamo circuit</strong><br>construct a <strong class='color-bot'>dynamo-bot</strong>",
            isGunTech: false,
            isBotTech: true,
            maxCount: 2,
            count: 0,
            allowed() { return typeof b !== 'undefined' && b.dynamoBot; },
            requires: "",
            effect() { if (b.dynamoBot) b.dynamoBot(); },
            remove() { this.count = 0; }
        },
        {
            name: "harmonic servos",
            description: "<strong>harmonic servos</strong><br>construct a <strong class='color-bot'>sound-bot</strong>",
            isGunTech: false,
            isBotTech: true,
            maxCount: 2,
            count: 0,
            allowed() { return typeof b !== 'undefined' && b.soundBot; },
            requires: "",
            effect() { if (b.soundBot) b.soundBot(); },
            remove() { this.count = 0; }
        },
        {
            name: "bot convergence",
            description: "<strong>bot convergence</strong><br>convert all bots to <strong class='color-bot'>laser-bots</strong>",
            isGunTech: false,
            isBotTech: true,
            maxCount: 1,
            count: 0,
            allowed() { return typeof b !== 'undefined' && b.convertBotsTo; },
            requires: "at least 2 bots",
            effect() { if (b.convertBotsTo) b.convertBotsTo("laser-bot"); },
            remove() { this.count = 0; }
        },
        {
            name: "bot overclock",
            description: "<strong>bot overclock</strong><br>temporary <strong>+20%</strong> global <strong class='color-d'>damage</strong>",
            isGunTech: false,
            isBotTech: true,
            maxCount: 2,
            count: 0,
            allowed() { return typeof tech !== 'undefined'; },
            requires: "",
            effect() { if (tech && typeof tech.damage === 'number') tech.damage *= 1.2; },
            remove() { if (tech && typeof tech.damage === 'number') tech.damage /= 1.2; this.count = 0; }
        },
        {
            name: "bot shield lattice",
            description: "<strong>bot shield lattice</strong><br><strong>0.95x</strong> <strong class='color-defense'>damage taken</strong>",
            isGunTech: false,
            isBotTech: true,
            maxCount: 2,
            count: 0,
            allowed() { return typeof tech !== 'undefined'; },
            requires: "",
            effect() { if (tech && typeof tech.harmReduction === 'number') tech.harmReduction *= 0.95; },
            remove() { if (tech && typeof tech.harmReduction === 'number') tech.harmReduction /= 0.95; this.count = 0; }
        }
    ];

    window.ngonBotTechs = botTechs;
})();
