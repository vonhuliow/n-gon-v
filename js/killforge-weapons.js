// Killforge Arsenal: 40+ weapons that upgrade with kills, including a nuke weapon and modeled projectiles
(function () {
    if (window.killforgeArsenalLoaded) return;
    window.killforgeArsenalLoaded = true;

    const state = window.killforgeState || {
        deadIds: new Set(),
        killsByGun: {},
        colorShift: 0,
        weaponHue: 0,
    };
    window.killforgeState = state;

    const markKills = () => {
        if (!Array.isArray(mob)) return;
        for (let i = 0; i < mob.length; i++) {
            const target = mob[i];
            if (!target || target.alive !== false) continue;
            const id = target.id ?? `m${i}:${Math.round(target.position?.x || 0)}:${Math.round(target.position?.y || 0)}`;
            if (state.deadIds.has(id)) continue;
            state.deadIds.add(id);
            if (b.activeGun !== null && b.guns[b.activeGun]) {
                const gunName = b.guns[b.activeGun].name;
                state.killsByGun[gunName] = (state.killsByGun[gunName] || 0) + 1;
            }
        }
    };

    const spawnDetailedProjectile = (x, y, angle, speed, tier, colorA, colorB) => {
        const core = Bodies.circle(x, y, 8 + tier, spawn.propsIsNotHoldable);
        const ring = Bodies.polygon(x, y, 6, 12 + tier, spawn.propsIsNotHoldable);
        const fin1 = Bodies.rectangle(x + 12, y + 6, 18, 4, spawn.propsIsNotHoldable);
        const fin2 = Bodies.rectangle(x + 12, y - 6, 18, 4, spawn.propsIsNotHoldable);
        const missile = Body.create({ parts: [core, ring, fin1, fin2] });
        Body.rotate(missile, angle);
        missile.collisionFilter.category = cat.bullet;
        missile.collisionFilter.mask = cat.mob | cat.mobBullet | cat.body;
        missile.endCycle = m.cycle + 45 + tier * 6;
        missile.colorA = colorA;
        missile.colorB = colorB;
        missile.blast = 20 + tier * 10;
        missile.pierce = tier >= 3;
        missile.damageScale = 12 + tier * 5;
        missile.do = function () {
            if (this.endCycle < m.cycle) {
                b.explosion(this.position, this.blast);
                Composite.remove(engine.world, this);
                const idx = bullet.indexOf(this);
                if (idx !== -1) bullet.splice(idx, 1);
                return;
            }
            simulation.drawList.push({ x: this.position.x, y: this.position.y, radius: 10 + tier * 2, color: this.colorA, time: simulation.drawTime });
            if (m.cycle % 3 === 0) simulation.drawList.push({ x: this.position.x, y: this.position.y, radius: 6 + tier, color: this.colorB, time: simulation.drawTime });
            if (m.cycle % 8 === 0) {
                const target = mob.find(v => v && v.alive !== false && v.position && Vector.magnitudeSquared(Vector.sub(v.position, this.position)) < (130 + tier * 40) ** 2);
                if (target) {
                    target.damage((0.12 + tier * 0.06), true);
                    if (!this.pierce) {
                        b.explosion(this.position, this.blast);
                        Composite.remove(engine.world, this);
                        const idx = bullet.indexOf(this);
                        if (idx !== -1) bullet.splice(idx, 1);
                    }
                }
            }
        };
        Composite.add(engine.world, missile);
        Matter.Body.setVelocity(missile, { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed });
        bullet.push(missile);
    };

    const makeKillforgeWeapon = (name, colorA, colorB, ammoBase, mode) => ({
        name,
        descriptionFunction() {
            const k = state.killsByGun[this.name] || 0;
            const tier = Math.min(6, Math.floor(k / 8));
            return `<strong>Killforge</strong> weapon<br>kills: <strong>${k}</strong> tier: <strong>${tier}</strong>`;
        },
        ammo: ammoBase,
        ammoPack: Math.max(2, Math.floor(ammoBase / 5)),
        defaultAmmoPack: Math.max(2, Math.floor(ammoBase / 5)),
        have: false,
        fire() {
            this.ammo--;
            const kills = state.killsByGun[this.name] || 0;
            const tier = Math.min(6, Math.floor(kills / 8));
            const dir = Vector.normalise(Vector.sub(simulation.mouseInGame, m.pos));
            const angle = Math.atan2(dir.y, dir.x);

            if (mode === "nuke") {
                const x = m.pos.x + Math.cos(angle) * 26;
                const y = m.pos.y + Math.sin(angle) * 26;
                spawnDetailedProjectile(x, y, angle, 16 + tier * 1.3, 3 + tier, "rgba(255,80,80,0.35)", "rgba(255,220,120,0.2)");
                if (tier >= 2) {
                    setTimeout(() => b.explosion(simulation.mouseInGame, 90 + tier * 16), 380);
                }
                return;
            }

            const shots = 1 + (tier >= 2 ? 1 : 0) + (tier >= 5 ? 1 : 0);
            const spread = 0.05 + tier * 0.01;
            for (let i = 0; i < shots; i++) {
                const a = angle + (i - (shots - 1) / 2) * spread;
                const x = m.pos.x + Math.cos(a) * 24;
                const y = m.pos.y + Math.sin(a) * 24;
                spawnDetailedProjectile(x, y, a, 22 + tier * 2.3, tier, colorA, colorB);
            }
            if (tier >= 4) b.laser(m.pos, simulation.mouseInGame, 14 + tier * 6);
        },
        do() {
            if (b.activeGun !== null && b.guns[b.activeGun]?.name === this.name) {
                const hue = (m.cycle * 2 + (state.killsByGun[this.name] || 0) * 3) % 360;
                simulation.drawList.push({ x: m.pos.x + Math.cos(m.angle) * 32, y: m.pos.y + Math.sin(m.angle) * 32, radius: 9, color: `hsla(${hue},100%,60%,0.35)`, time: simulation.drawTime });
            }
        }
    });

    const weaponNames = [
        "killforge alpha", "killforge beta", "killforge gamma", "killforge delta", "killforge epsilon", "killforge zeta", "killforge eta", "killforge theta",
        "killforge iota", "killforge kappa", "killforge lambda", "killforge mu", "killforge nu", "killforge xi", "killforge omicron", "killforge pi",
        "killforge rho", "killforge sigma", "killforge tau", "killforge upsilon", "killforge phi", "killforge chi", "killforge psi", "killforge omega",
        "phantom forge 1", "phantom forge 2", "phantom forge 3", "phantom forge 4", "phantom forge 5", "phantom forge 6", "phantom forge 7", "phantom forge 8",
        "arc forge 1", "arc forge 2", "arc forge 3", "arc forge 4", "arc forge 5", "arc forge 6", "arc forge 7", "arc forge 8", "arc forge 9"
    ]; // 41

    const killforgeWeapons = weaponNames.map((n, i) => {
        const hue = (i * 29) % 360;
        const colorA = `hsla(${hue},100%,62%,0.28)`;
        const colorB = `hsla(${(hue + 140) % 360},100%,58%,0.2)`;
        return makeKillforgeWeapon(n, colorA, colorB, 12 + (i % 10), "normal");
    });
    killforgeWeapons.push(makeKillforgeWeapon("killforge nuke", "rgba(255,70,70,0.34)", "rgba(255,235,120,0.22)", 6, "nuke")); // 42

    const colorTechs = [
        {
            name: "humanoid shell",
            description: "<strong>humanoid shell</strong><br>renders a humanoid overlay that follows player motion",
            isGunTech: false,
            maxCount: 1,
            count: 0,
            allowed() { return true; },
            requires: "",
            effect() { state.humanoid = 1; },
            remove() { state.humanoid = 0; this.count = 0; }
        }
    ];

    const animatedColorTechs = Array.from({ length: 28 }, (_, i) => ({
        name: `animated spectrum ${i + 1}`,
        description: `<strong>animated spectrum ${i + 1}</strong><br>adds animated color layer to player and active weapon`,
        isGunTech: false,
        maxCount: 1,
        count: 0,
        allowed() { return true; },
        requires: "",
        effect() { state.colorShift += 1; },
        remove() { state.colorShift = Math.max(0, state.colorShift - 1); this.count = 0; }
    }));

    const register = () => {
        if (Array.isArray(b?.guns)) {
            killforgeWeapons.forEach(g => {
                if (!b.guns.find(existing => existing.name === g.name)) b.guns.push(g);
            });
        }
        if (Array.isArray(tech?.tech)) {
            [...colorTechs, ...animatedColorTechs].forEach(t => {
                if (!tech.tech.find(existing => existing.name === t.name)) tech.tech.push(t);
            });
        }
    };

    const drawHumanoidAndWeaponFX = () => {
        markKills();

        if (state.humanoid) {
            const x = m.pos.x;
            const y = m.pos.y;
            simulation.drawList.push({ x, y: y - 30, radius: 10, color: "rgba(255,220,190,0.35)", time: simulation.drawTime }); // head
            simulation.drawList.push({ x, y: y - 10, radius: 14, color: "rgba(90,170,255,0.24)", time: simulation.drawTime }); // torso
            simulation.drawList.push({ x: x - 14, y: y - 8, radius: 7, color: "rgba(90,170,255,0.2)", time: simulation.drawTime });
            simulation.drawList.push({ x: x + 14, y: y - 8, radius: 7, color: "rgba(90,170,255,0.2)", time: simulation.drawTime });
            simulation.drawList.push({ x: x - 7, y: y + 16, radius: 8, color: "rgba(90,170,255,0.18)", time: simulation.drawTime });
            simulation.drawList.push({ x: x + 7, y: y + 16, radius: 8, color: "rgba(90,170,255,0.18)", time: simulation.drawTime });
        }

        if (state.colorShift > 0) {
            const hue = (m.cycle * (1 + state.colorShift * 0.03)) % 360;
            simulation.drawList.push({ x: m.pos.x, y: m.pos.y, radius: 24 + state.colorShift * 0.7, color: `hsla(${hue},100%,60%,0.22)`, time: simulation.drawTime });
            if (b.activeGun !== null && b.guns[b.activeGun]) {
                const p = { x: m.pos.x + Math.cos(m.angle) * 36, y: m.pos.y + Math.sin(m.angle) * 36 };
                simulation.drawList.push({ x: p.x, y: p.y, radius: 11 + state.colorShift * 0.3, color: `hsla(${(hue + 120) % 360},100%,60%,0.26)`, time: simulation.drawTime });
            }
        }
    };

    const attach = () => {
        register();
        if (Array.isArray(simulation?.ephemera) && !simulation.ephemera.find(e => e.name === "killforge-core")) {
            simulation.ephemera.push({ name: "killforge-core", do: drawHumanoidAndWeaponFX });
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => setTimeout(attach, 400));
    } else {
        setTimeout(attach, 400);
    }

    console.log(`%c⚙️ Killforge Arsenal Loaded: ${killforgeWeapons.length} upgrading weapons + ${1 + animatedColorTechs.length} color/humanoid techs`, "color:#7c3aed;font-weight:bold;");
})();
