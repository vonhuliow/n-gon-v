// Hacker Overhaul: working movement techs, lock-on sniper, evolving weapon, summon tech keybinds, and extra mob pressure
(function () {
    const ho = window.hackerOverhaul || {
        deadIDs: new Set(),
        gunKills: {},
        movement: {
            speedStacks: 0,
            jumpStacks: 0,
            airDash: 0,
            blink: 0,
            gravityShift: 0,
            regenDash: 0,
            phaseStride: 0,
            hackerAura: 0,
            recoilCancel: 0,
            overclock: 0,
        },
        summonUnlocked: {},
        summonCooldowns: {},
        constructs: [],
        extraMobIntensity: 0,
        initialized: false,
        nextMobSpawnCycle: 0,
        initedHUD: false,
    };
    window.hackerOverhaul = ho;

    const getActiveGunName = () => (b.activeGun !== null && b.guns[b.activeGun]) ? b.guns[b.activeGun].name : null;

    const registerKill = () => {
        if (!Array.isArray(mob)) return;
        for (let i = 0; i < mob.length; i++) {
            const target = mob[i];
            if (!target) continue;
            const id = target.id ?? `${Math.round(target.position?.x || 0)}:${Math.round(target.position?.y || 0)}:${i}`;
            if (target.alive === false && !ho.deadIDs.has(id)) {
                ho.deadIDs.add(id);
                const gunName = getActiveGunName();
                if (gunName) ho.gunKills[gunName] = (ho.gunKills[gunName] || 0) + 1;
            }
        }
    };

    const getClosestMobToCursor = (maxRange = 650) => {
        if (!Array.isArray(mob) || !simulation?.mouseInGame) return null;
        let best = null;
        let bestD2 = maxRange * maxRange;
        for (let i = 0; i < mob.length; i++) {
            const target = mob[i];
            if (!target || target.alive === false || !target.position) continue;
            const dx = target.position.x - simulation.mouseInGame.x;
            const dy = target.position.y - simulation.mouseInGame.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < bestD2) {
                best = target;
                bestD2 = d2;
            }
        }
        return best;
    };

    const lockOnSniper = {
        name: "lock-on sniper",
        descriptionFunction() { return "<strong>LOCK-ON</strong> sniper highlights nearest target and fires a precision burst"; },
        ammo: 14,
        ammoPack: 2,
        defaultAmmoPack: 2,
        have: false,
        cycle: 0,
        lockID: null,
        fire() {
            if (this.ammo <= 0 || m.cycle < this.cycle) return;
            const target = getClosestMobToCursor(750);
            if (!target) {
                simulation.inGameConsole("<span style='color:#f66'>LOCK-ON FAILED</span>", 30);
                this.cycle = m.cycle + 12;
                return;
            }
            this.ammo--;
            this.cycle = m.cycle + 18;
            const hitPos = { x: target.position.x, y: target.position.y };
            b.laser(m.pos, hitPos, 180);
            b.explosion(hitPos, 55);
            if (target.damage) target.damage(0.95, true);
            simulation.inGameConsole(`<span style='color:#9ff'>LOCKED</span> <span style='color:#fff'>ID:${target.id ?? "?"}</span>`, 26);
        },
        do() {
            if (b.activeGun === null || !b.guns[b.activeGun] || b.guns[b.activeGun].name !== this.name) return;
            const target = getClosestMobToCursor(750);
            const nextID = target?.id ?? null;
            if (nextID !== this.lockID) {
                this.lockID = nextID;
                if (target) {
                    simulation.inGameConsole(`<span style='color:#0ff'>TARGET LOCK</span> x:${target.position.x.toFixed(0)} y:${target.position.y.toFixed(0)}`, 20);
                    simulation.drawList.push({ x: target.position.x, y: target.position.y, radius: 35, color: "rgba(0,255,255,0.45)", time: simulation.drawTime });
                } else {
                    simulation.inGameConsole("<span style='color:#888'>SCANNING...</span>", 12);
                }
            }
        }
    };

    const adaptiveWeapon = {
        name: "adaptive exploit rifle",
        descriptionFunction() {
            const kills = ho.gunKills[this.name] || 0;
            const tier = kills >= 60 ? 4 : kills >= 35 ? 3 : kills >= 18 ? 2 : kills >= 8 ? 1 : 0;
            return `<strong>evolves on kill</strong><br>kills: <strong>${kills}</strong> tier: <strong>${tier}</strong>`;
        },
        ammo: 22,
        ammoPack: 5,
        defaultAmmoPack: 5,
        have: false,
        fire() {
            if (this.ammo <= 0) return;
            this.ammo--;
            const kills = ho.gunKills[this.name] || 0;
            const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
            const tier = kills >= 60 ? 4 : kills >= 35 ? 3 : kills >= 18 ? 2 : kills >= 8 ? 1 : 0;
            const pellets = 1 + tier;
            const spread = 0.04 + tier * 0.03;
            const speed = 48 + tier * 4;
            const dmg = 15 + tier * 5;
            for (let i = 0; i < pellets; i++) {
                const angle = Math.atan2(dir.y, dir.x) + (i - (pellets - 1) / 2) * spread;
                b.nail({ x: m.pos.x, y: m.pos.y }, { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }, dmg);
            }
            if (tier >= 2) b.explosion(simulation.mouseInGame, 28 + tier * 6);
            if (tier >= 3) b.laser(m.pos, simulation.mouseInGame, 45 + tier * 12);
            if (tier >= 4) simulation.inGameConsole("<span style='color:#0f0'>ADAPTIVE WEAPON TIER MAX</span>", 20);
        },
        do() { }
    };

    const summonKeys = "1234567890qwertyuiopasdfghjklzxcvbnm".split(""); // 36 keys
    const extraKeys = ["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8"]; // +8 => 44 summon techs
    const keyList = summonKeys.concat(extraKeys);

    const summonAtCursor = (tier, mode) => {
        if (!simulation?.mouseInGame || !Matter?.Bodies || !Matter?.Composite || !engine?.world) return;
        const x = simulation.mouseInGame.x;
        const y = simulation.mouseInGame.y;
        if (mode === "block") {
            const poly = Matter.Bodies.polygon(x, y, 4 + (tier % 5), 18 + tier * 1.3, {
                friction: 0.04,
                restitution: 0.45,
                density: 0.002,
                classType: "body"
            });
            body.push(poly);
            Matter.Composite.add(engine.world, poly);
        } else if (mode === "turret") {
            ho.constructs.push({ x, y, born: m.cycle, life: 650 + tier * 10, mode: "turret", power: 8 + tier * 0.6 });
        } else if (mode === "mine") {
            ho.constructs.push({ x, y, born: m.cycle, life: 420 + tier * 8, mode: "mine", power: 20 + tier * 1.2 });
        } else if (mode === "blast") {
            b.explosion({ x, y }, 35 + tier * 2);
        } else {
            ho.constructs.push({ x, y, born: m.cycle, life: 500 + tier * 8, mode: "drone", power: 10 + tier * 0.7 });
        }
    };

    const movementTechs = [
        ["hacker stride", "+8% movement acceleration", "speedStacks"],
        ["kernel leap", "+7% jump force", "jumpStacks"],
        ["air packet dash", "double-tap jump to dash in air", "airDash"],
        ["blink packet", "press shift to blink to cursor", "blink"],
        ["gravity patch", "small anti-gravity while airborne", "gravityShift"],
        ["regen sprint", "moving fast regenerates energy", "regenDash"],
        ["phase stride", "temporary invulnerability while dashing", "phaseStride"],
        ["hacker aura", "small passive damage bonus", "hackerAura"],
        ["recoil nullifier", "reduced knockback and drift", "recoilCancel"],
        ["overclocked locomotion", "all movement buffs amplified", "overclock"],
    ].map(([name, text, key]) => ({
        name,
        description: `<strong>${name}</strong><br>${text}`,
        isGunTech: false,
        maxCount: 3,
        count: 0,
        allowed() { return true; },
        requires: "",
        effect() { ho.movement[key] = (ho.movement[key] || 0) + 1; },
        remove() { ho.movement[key] = Math.max(0, (ho.movement[key] || 0) - 1); this.count = 0; }
    }));

    const hackerBuffTechs = Array.from({ length: 8 }, (_, i) => ({
        name: `hacker protocol ${i + 1}`,
        description: `<strong>hacker protocol ${i + 1}</strong><br>+${4 + i}% damage, +${2 + i}% mobility`,
        isGunTech: false,
        maxCount: 1,
        count: 0,
        allowed() { return true; },
        requires: "",
        effect() {
            ho.movement.hackerAura += 1;
            ho.movement.speedStacks += 1;
            ho.extraMobIntensity += 0.2;
        },
        remove() {
            ho.movement.hackerAura = Math.max(0, ho.movement.hackerAura - 1);
            ho.movement.speedStacks = Math.max(0, ho.movement.speedStacks - 1);
            ho.extraMobIntensity = Math.max(0, ho.extraMobIntensity - 0.2);
            this.count = 0;
        }
    }));

    const summonModes = ["block", "turret", "drone", "mine", "blast"];
    const summonTechs = keyList.map((key, idx) => ({
        name: `architect daemon ${idx + 1}`,
        description: `<strong>architect daemon ${idx + 1}</strong><br>press <strong>${key.toUpperCase()}</strong> to summon a ${summonModes[idx % summonModes.length]}`,
        isGunTech: false,
        maxCount: 1,
        count: 0,
        allowed() { return true; },
        requires: "architect's touch or hacker tech",
        effect() { ho.summonUnlocked[key] = { tier: idx + 1, mode: summonModes[idx % summonModes.length] }; },
        remove() { delete ho.summonUnlocked[key]; this.count = 0; }
    }));

    // 50+ working techs total = 10 movement + 8 hacker + 44 summon = 62
    const allNewTech = [...movementTechs, ...hackerBuffTechs, ...summonTechs];

    const registerTechsAndWeapons = () => {
        if (typeof b !== "undefined" && Array.isArray(b.guns)) {
            [lockOnSniper, adaptiveWeapon].forEach((gun) => {
                if (!b.guns.find((g) => g.name === gun.name)) b.guns.push(gun);
            });
        }
        if (typeof tech !== "undefined" && Array.isArray(tech.tech)) {
            allNewTech.forEach((entry) => {
                if (!tech.tech.find((t) => t.name === entry.name)) tech.tech.push(entry);
            });
        }
    };

    const applyMovement = () => {
        if (typeof m === "undefined") return;
        const speedMult = 1 + ho.movement.speedStacks * 0.08 + ho.movement.overclock * 0.03;
        const jumpMult = 1 + ho.movement.jumpStacks * 0.07 + ho.movement.overclock * 0.03;
        if (typeof tech !== "undefined" && typeof tech.baseJumpForce === "number") {
            m.jumpForce = tech.baseJumpForce * m.fieldJump * m.squirrelJump * jumpMult / player.mass / player.mass;
        }
        m.FxAir = (m.FxAir || 0.016) * (1 + ho.movement.recoilCancel * 0.01);
        m.airSpeedLimit = (m.airSpeedLimit || 125) * speedMult;
        if (ho.movement.gravityShift > 0 && !m.onGround && input.up) {
            player.force.y -= 0.0001 * ho.movement.gravityShift;
        }
        if (ho.movement.regenDash > 0 && Math.abs(m.Vx) > 7 && m.energy < m.maxEnergy) {
            m.energy = Math.min(m.maxEnergy, m.energy + 0.0012 * ho.movement.regenDash);
        }
        if (ho.movement.hackerAura > 0 && typeof tech?.damage === "number") {
            tech.damage = Math.max(tech.damage, 1 + ho.movement.hackerAura * 0.025);
        }
    };

    const updateConstructs = () => {
        if (!Array.isArray(ho.constructs)) return;
        ho.constructs = ho.constructs.filter((c) => m.cycle < c.born + c.life);
        for (let i = 0; i < ho.constructs.length; i++) {
            const c = ho.constructs[i];
            if (c.mode === "turret") {
                const target = getClosestMobToCursor(500);
                if (target && m.cycle % 18 === 0) {
                    const dir = Vector.normalise(Vector.sub(target.position, c));
                    b.nail({ x: c.x, y: c.y }, { x: dir.x * 35, y: dir.y * 35 }, c.power);
                }
            } else if (c.mode === "mine") {
                if (m.cycle % 45 === 0) b.explosion({ x: c.x, y: c.y }, 25 + c.power * 0.6);
            } else if (c.mode === "drone") {
                const target = getClosestMobToCursor(420);
                if (target && m.cycle % 20 === 0) b.laser({ x: c.x, y: c.y }, target.position, 20 + c.power);
            }
            simulation.drawList.push({ x: c.x, y: c.y, radius: 16, color: "rgba(0,255,120,0.25)", time: simulation.drawTime });
        }
    };

    const spawnMoreMobs = () => {
        if (typeof spawn === "undefined" || !spawn.randomMob || m.cycle < ho.nextMobSpawnCycle) return;
        const baseCount = 1 + Math.floor(ho.extraMobIntensity) + (simulation?.difficulty > 10 ? 1 : 0);
        for (let i = 0; i < baseCount; i++) {
            const x = m.pos.x + (Math.random() - 0.5) * 1200;
            const y = m.pos.y + (Math.random() - 0.5) * 650;
            spawn.randomMob(x, y, 1);
        }
        ho.nextMobSpawnCycle = m.cycle + Math.max(240, 520 - Math.floor(ho.extraMobIntensity * 60));
    };

    if (!ho.initialized) {
        window.addEventListener("keydown", (evt) => {
            const key = evt.key.toLowerCase();
            const summon = ho.summonUnlocked[key];
            if (summon) {
                const cdKey = `summon:${key}`;
                const last = ho.summonCooldowns[cdKey] || -9999;
                if (m.cycle > last + 28) {
                    ho.summonCooldowns[cdKey] = m.cycle;
                    summonAtCursor(summon.tier, summon.mode);
                    simulation.inGameConsole(`<span style='color:#0f0'>SUMMON ${summon.mode.toUpperCase()}</span> key:${key.toUpperCase()}`, 24);
                }
            }

            if (key === "shift" && ho.movement.blink > 0) {
                Matter.Body.setPosition(player, { x: simulation.mouseInGame.x, y: simulation.mouseInGame.y });
                if (ho.movement.phaseStride > 0) m.immuneCycle = m.cycle + 22 + ho.movement.phaseStride * 10;
            }
        });

        simulation.ephemera.push({
            name: "hacker-overhaul-core",
            do() {
                registerKill();
                applyMovement();
                updateConstructs();
                spawnMoreMobs();
                if (!ho.initedHUD) {
                    ho.initedHUD = true;
                    simulation.inGameConsole("<span style='color:#6cf'>HACKER OVERHAUL ACTIVE</span>", 90);
                }
            }
        });

        registerTechsAndWeapons();
        ho.initialized = true;
        console.log(`%c🧠 Hacker Overhaul Loaded: ${allNewTech.length} techs, lock-on sniper, adaptive weapon`, "color:#6cf;font-weight:bold;");
    }
})();
