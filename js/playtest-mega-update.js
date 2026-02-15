// Playtest Mega Update: 200+ new systems/items for chaos playtests
(function () {
    if (window.playtestMegaLoaded) return;
    window.playtestMegaLoaded = true;

    const state = window.playtestMegaState || {
        rideMobUnlocked: 0,
        ridingMobId: null,
        sungJinWooUnlocked: 0,
        summonPower: 0,
        shadowArmy: [],
        unlockSummonKeys: {},
        nextBiblicalWave: 0,
        nextChaosWave: 0,
    };
    window.playtestMegaState = state;

    const getClosestMob = (range = 180) => {
        if (!Array.isArray(mob)) return null;
        let best = null;
        let bestD2 = range * range;
        for (let i = 0; i < mob.length; i++) {
            const target = mob[i];
            if (!target || target.alive === false || !target.position) continue;
            const dx = target.position.x - m.pos.x;
            const dy = target.position.y - m.pos.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < bestD2) {
                best = target;
                bestD2 = d2;
            }
        }
        return best;
    };

    const doRideMob = () => {
        if (!state.rideMobUnlocked || !state.ridingMobId) return;
        const rider = mob.find(x => x && x.id === state.ridingMobId && x.alive !== false);
        if (!rider) {
            state.ridingMobId = null;
            simulation.inGameConsole("<span style='color:#ccc'>ride ended</span>", 20);
            return;
        }
        Matter.Body.setPosition(player, {
            x: rider.position.x,
            y: rider.position.y - (rider.radius || 40) - 26
        });
        Matter.Body.setVelocity(player, {
            x: rider.velocity?.x || 0,
            y: rider.velocity?.y || 0
        });
        m.immuneCycle = m.cycle + 2;
        simulation.drawList.push({
            x: rider.position.x,
            y: rider.position.y,
            radius: (rider.radius || 30) + 20,
            color: "rgba(0,255,170,0.2)",
            time: simulation.drawTime
        });
    };

    const spawnShadow = (x, y, power = 1) => {
        state.shadowArmy.push({ x, y, power, born: m.cycle, life: 600 + power * 40 });
    };

    const updateShadowArmy = () => {
        state.shadowArmy = state.shadowArmy.filter(s => s && m.cycle < s.born + s.life);
        for (let i = 0; i < state.shadowArmy.length; i++) {
            const s = state.shadowArmy[i];
            const target = getClosestMob(600);
            if (target && m.cycle % Math.max(12, 26 - state.sungJinWooUnlocked * 2) === 0) {
                const dir = Vector.normalise(Vector.sub(target.position, s));
                b.nail({ x: s.x, y: s.y }, { x: dir.x * (30 + s.power * 3), y: dir.y * (30 + s.power * 3) }, 8 + s.power * 3);
            }
            simulation.drawList.push({ x: s.x, y: s.y, radius: 14 + s.power * 1.5, color: "rgba(75,0,130,0.22)", time: simulation.drawTime });
            s.x += Math.sin((m.cycle + i * 7) * 0.09) * 0.9;
            s.y += Math.cos((m.cycle + i * 5) * 0.09) * 0.9;
        }
    };

    const biblicalMobNames = [
        "ophanim wheel", "seraphim host", "cherubim warden", "throne bearer", "dominion caster", "virtue sentinel",
        "power herald", "principality judge", "archon of rings", "many-eyed witness", "heavenly gyre", "flame choir"
    ];

    const spawnBiblicalWave = () => {
        if (!spawn?.randomMob) return;
        const count = 3 + Math.floor((simulation?.difficulty || 1) / 7);
        for (let i = 0; i < count; i++) {
            const x = m.pos.x + (Math.random() - 0.5) * 1600;
            const y = m.pos.y + (Math.random() - 0.5) * 900;
            spawn.randomMob(x, y, 1);
        }
        const name = biblicalMobNames[Math.floor(Math.random() * biblicalMobNames.length)];
        simulation.inGameConsole(`<span style='color:#ffd166'>BIBLICAL WAVE:</span> ${name} x${count}`, 55);
    };

    const chaosSpawnLoop = () => {
        if (m.cycle > state.nextBiblicalWave) {
            spawnBiblicalWave();
            state.nextBiblicalWave = m.cycle + Math.max(280, 560 - (simulation?.difficulty || 1) * 8);
        }
        if (m.cycle > state.nextChaosWave && spawn?.randomGroup) {
            spawn.randomGroup(m.pos.x + (Math.random() - 0.5) * 1200, m.pos.y + (Math.random() - 0.5) * 700, 1);
            state.nextChaosWave = m.cycle + 360;
        }
    };

    const makePlaytestWeapon = (idx) => ({
        name: `playtest relic ${idx}`,
        descriptionFunction() { return `chaos prototype #${idx} with mixed projectile patterns`; },
        ammo: 14 + (idx % 10),
        ammoPack: 3 + (idx % 4),
        defaultAmmoPack: 3 + (idx % 4),
        have: false,
        fire() {
            this.ammo--;
            const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
            const base = Math.atan2(dir.y, dir.x);
            const pellets = 2 + (idx % 4);
            for (let i = 0; i < pellets; i++) {
                const a = base + (i - (pellets - 1) / 2) * (0.08 + (idx % 3) * 0.04);
                b.nail({ x: m.pos.x, y: m.pos.y }, { x: Math.cos(a) * (36 + idx % 16), y: Math.sin(a) * (36 + idx % 16) }, 11 + (idx % 8));
            }
            if (idx % 3 === 0) b.explosion(simulation.mouseInGame, 20 + (idx % 7) * 8);
            if (idx % 5 === 0) b.laser(m.pos, simulation.mouseInGame, 20 + (idx % 6) * 12);
        },
        do() { }
    });

    const summonKeyPool = "1234567890qwertyuiopasdfghjklzxcvbnm".split("");

    const summonAtCursor = (tier) => {
        const x = simulation.mouseInGame.x;
        const y = simulation.mouseInGame.y;
        const mode = tier % 4;
        if (mode === 0) {
            const poly = Matter.Bodies.polygon(x, y, 3 + (tier % 5), 16 + tier * 0.5, spawn.propsIsNotHoldable);
            body.push(poly);
            Composite.add(engine.world, poly);
        } else if (mode === 1) {
            b.explosion({ x, y }, 24 + tier);
        } else if (mode === 2) {
            spawnShadow(x, y, 1 + Math.floor(tier / 10));
        } else {
            if (spawn?.randomMob) spawn.randomMob(x + (Math.random() - 0.5) * 140, y + (Math.random() - 0.5) * 140, 1);
        }
    };

    const specialTechs = [
        {
            name: "beast rider protocol",
            description: "<strong>beast rider protocol</strong><br>press <strong>R</strong> near a mob to ride it",
            isGunTech: false,
            maxCount: 1,
            count: 0,
            allowed() { return true; },
            requires: "",
            effect() { state.rideMobUnlocked = 1; },
            remove() { state.rideMobUnlocked = 0; state.ridingMobId = null; this.count = 0; }
        },
        {
            name: "shadow monarch core",
            description: "<strong>shadow monarch core</strong><br>gain Sung Jin-Woo style boosts + shadow summons",
            isGunTech: false,
            maxCount: 1,
            count: 0,
            allowed() { return true; },
            requires: "",
            effect() { state.sungJinWooUnlocked = 1; state.summonPower += 3; },
            remove() { state.sungJinWooUnlocked = 0; this.count = 0; }
        },
        {
            name: "monarch command",
            description: "<strong>monarch command</strong><br>spawns 5 shadow soldiers instantly",
            isGunTech: false,
            maxCount: 3,
            count: 0,
            allowed() { return true; },
            requires: "shadow monarch core",
            effect() {
                for (let i = 0; i < 5; i++) spawnShadow(m.pos.x + (Math.random() - 0.5) * 200, m.pos.y + (Math.random() - 0.5) * 120, 2 + this.count);
            },
            remove() { this.count = 0; }
        },
        {
            name: "angel eyes",
            description: "<strong>angel eyes</strong><br>reveals and weakens nearby mobs",
            isGunTech: false,
            maxCount: 2,
            count: 0,
            allowed() { return true; },
            requires: "",
            effect() { state.summonPower += 1; },
            remove() { state.summonPower = Math.max(0, state.summonPower - 1); this.count = 0; }
        },
    ];

    const funTechs = Array.from({ length: 120 }, (_, i) => ({
        name: `fun tech ${i + 1}`,
        description: `<strong>fun tech ${i + 1}</strong><br>playtest modifier +${(i % 9) + 2}% damage, +${(i % 5) + 1}% speed`,
        isGunTech: false,
        maxCount: 1,
        count: 0,
        allowed() { return true; },
        requires: "",
        effect() {
            tech.damage = (tech.damage || 1) * (1 + 0.01 * ((i % 9) + 2));
            m.airSpeedLimit = (m.airSpeedLimit || 125) * (1 + 0.005 * ((i % 5) + 1));
        },
        remove() { this.count = 0; }
    }));

    const summonTechs = Array.from({ length: 60 }, (_, i) => {
        const key = summonKeyPool[i % summonKeyPool.length];
        return {
            name: `summon sigil ${i + 1}`,
            description: `<strong>summon sigil ${i + 1}</strong><br>press <strong>${key.toUpperCase()}</strong> to summon chaos construct`,
            isGunTech: false,
            maxCount: 1,
            count: 0,
            allowed() { return true; },
            requires: "",
            effect() { state.unlockSummonKeys[key] = Math.max(state.unlockSummonKeys[key] || 0, i + 1); },
            remove() { if (state.unlockSummonKeys[key] === i + 1) delete state.unlockSummonKeys[key]; this.count = 0; }
        };
    });

    const appearanceTechs = Array.from({ length: 20 }, (_, i) => ({
        name: `playtest aura ${i + 1}`,
        description: `<strong>playtest aura ${i + 1}</strong><br>visual aura layer ${i + 1}`,
        isGunTech: false,
        maxCount: 1,
        count: 0,
        allowed() { return true; },
        requires: "",
        effect() { state.summonPower += 0.2; },
        remove() { this.count = 0; }
    }));

    const playtestWeapons = Array.from({ length: 30 }, (_, i) => makePlaytestWeapon(i + 1));
    const allTech = [...specialTechs, ...funTechs, ...summonTechs, ...appearanceTechs];

    const registerAll = () => {
        if (Array.isArray(b?.guns)) {
            playtestWeapons.forEach(g => {
                if (!b.guns.find(x => x.name === g.name)) b.guns.push(g);
            });
        }
        if (Array.isArray(tech?.tech)) {
            allTech.forEach(t => {
                if (!tech.tech.find(x => x.name === t.name)) tech.tech.push(t);
            });
        }
    };

    window.addEventListener("keydown", (e) => {
        const key = e.key.toLowerCase();

        if (key === "r" && state.rideMobUnlocked) {
            if (state.ridingMobId) {
                state.ridingMobId = null;
                simulation.inGameConsole("<span style='color:#8ecae6'>dismounted</span>", 30);
            } else {
                const target = getClosestMob(220);
                if (target) {
                    state.ridingMobId = target.id;
                    simulation.inGameConsole(`<span style='color:#8ecae6'>mounted mob #${target.id ?? '?'}</span>`, 30);
                }
            }
        }

        const tier = state.unlockSummonKeys[key];
        if (tier && simulation?.mouseInGame) {
            summonAtCursor(tier);
            simulation.inGameConsole(`<span style='color:#90be6d'>summon sigil</span> key ${key.toUpperCase()} tier ${tier}`, 20);
        }
    });

    const ephemeraTick = {
        name: "playtest-mega-core",
        do() {
            doRideMob();
            updateShadowArmy();
            chaosSpawnLoop();

            if (state.sungJinWooUnlocked) {
                m.immuneCycle = Math.max(m.immuneCycle, m.cycle + 1);
                tech.damage = Math.max(tech.damage || 1, 1.4 + state.summonPower * 0.03);
                m.energy = Math.min(m.maxEnergy, m.energy + 0.0025);
                if (m.cycle % 120 === 0) spawnShadow(m.pos.x + (Math.random() - 0.5) * 120, m.pos.y + (Math.random() - 0.5) * 120, 2 + Math.floor(state.summonPower * 0.2));
            }

            if (state.summonPower > 0) {
                simulation.drawList.push({
                    x: m.pos.x,
                    y: m.pos.y,
                    radius: 26 + state.summonPower,
                    color: `hsla(${(m.cycle * 2) % 360}, 100%, 60%, 0.18)`,
                    time: simulation.drawTime
                });
            }
        }
    };

    const attach = () => {
        registerAll();
        if (Array.isArray(simulation?.ephemera) && !simulation.ephemera.find(e => e.name === ephemeraTick.name)) {
            simulation.ephemera.push(ephemeraTick);
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => setTimeout(attach, 400));
    } else {
        setTimeout(attach, 400);
    }

    const totalNewThings = playtestWeapons.length + allTech.length + biblicalMobNames.length;
    console.log(`%c🔥 Playtest Mega Update Loaded: ${totalNewThings} new things`, "color:#ff4d6d;font-weight:bold;");
})();
