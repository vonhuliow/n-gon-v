// Legend Systems Pack - stability, movement techs, lantern menu, mobs, cosmetics, and large expansion set
(function () {
    if (window.legendSystemsPackLoaded) return;
    window.legendSystemsPackLoaded = true;

    const state = {
        initialized: false,
        lanternMenuOpen: false,
        momentumReadyCycle: 0,
        lastMoveCycle: 0,
        grapplePoint: null,
        hoverCycle: 0,
    };

    const ensureNoHorrorDefault = () => {
        if (!tech?.isHorrorTwist) document.body.classList.remove('horror-tech-active');
    };

    const patchGunSafety = () => {
        if (!Array.isArray(b?.guns)) return;
        b.guns.forEach((gun) => {
            if (!gun || typeof gun.fire !== 'function' || gun.__legendSafeFire) return;
            const original = gun.fire.bind(gun);
            gun.fire = function (...args) {
                try {
                    return original(...args);
                } catch (error) {
                    console.warn('[legend-systems-pack] gun fire recovered', gun.name, error);
                    simulation?.inGameConsole?.(`<span style='color:#fca5a5'>Recovered weapon error: ${gun.name}</span>`, 45);
                    return null;
                }
            };
            gun.__legendSafeFire = true;
        });
    };

    const patchGuitarsToWave = () => {
        const wave = b?.guns?.find((g) => g.name === 'wave');
        ['sonic guitar', 'resonance guitar'].forEach((name) => {
            const gun = b?.guns?.find((g) => g.name === name);
            if (!gun || gun.__legendWavePatch) return;
            const originalDo = typeof gun.do === 'function' ? gun.do.bind(gun) : null;
            gun.do = function () {
                if (wave && typeof wave.fire === 'function' && m.cycle % 22 === 0) {
                    tech.isInfiniteWaveAmmo = true;
                    try { wave.fire.call(wave); } catch (_) {}
                }
                if (originalDo) originalDo();
            };
            gun.__legendWavePatch = true;
        });
    };

    const stabilizeBullets = () => {
        if (!Array.isArray(bullet)) return;
        for (let i = bullet.length - 1; i >= 0; i--) {
            const item = bullet[i];
            if (!item || !item.position || !Number.isFinite(item.position.x) || !Number.isFinite(item.position.y)) {
                bullet.splice(i, 1);
            }
        }
    };

    const createLanternMenu = () => {
        if (document.getElementById('lantern-forge-menu')) return;
        const menu = document.createElement('div');
        menu.id = 'lantern-forge-menu';
        menu.style.cssText = 'display:none;position:fixed;z-index:9999;right:24px;top:90px;width:320px;background:#0b0f19;border:1px solid #3ddc97;border-radius:10px;padding:10px;color:#dff;box-shadow:0 0 20px rgba(0,0,0,.5);font-family:Arial,sans-serif;';
        menu.innerHTML = `
            <div style="font-weight:bold;margin-bottom:6px;">Lantern Construct Forge</div>
            <div style="font-size:12px;opacity:.9;margin-bottom:6px;">Type a block size (number) or weapon name to construct.</div>
            <input id="lantern-forge-input" placeholder="e.g. 70 or missiles" style="width:100%;padding:6px;background:#111827;color:#e5e7eb;border:1px solid #374151;border-radius:6px;" />
            <div style="display:flex;gap:6px;margin-top:8px;">
                <button id="lantern-build-block" style="flex:1;background:#2b9348;color:#fff;border:none;padding:6px;border-radius:6px;cursor:pointer;">Construct Block</button>
                <button id="lantern-build-weapon" style="flex:1;background:#3a86ff;color:#fff;border:none;padding:6px;border-radius:6px;cursor:pointer;">Construct Weapon</button>
                <button id="lantern-close" style="background:#6b7280;color:#fff;border:none;padding:6px 10px;border-radius:6px;cursor:pointer;">X</button>
            </div>
        `;
        document.body.appendChild(menu);

        const input = menu.querySelector('#lantern-forge-input');
        menu.querySelector('#lantern-build-block').addEventListener('click', () => {
            const raw = String(input.value || '').trim();
            const size = Math.max(20, Math.min(180, Number(raw) || 60));
            const x = player.position.x + (Math.random() - 0.5) * 60;
            const y = player.position.y - 80;
            body[body.length] = Bodies.rectangle(x, y, size, size, {
                collisionFilter: { category: cat.body, mask: cat.player | cat.map | cat.body | cat.bullet | cat.mob | cat.mobBullet },
                friction: 0.05,
                frictionAir: 0.001,
                restitution: 0.2
            });
            Composite.add(engine.world, body[body.length - 1]);
            simulation.draw?.setPaths?.();
        });
        menu.querySelector('#lantern-build-weapon').addEventListener('click', () => {
            const targetName = String(input.value || '').trim().toLowerCase();
            const idx = b.guns.findIndex((g) => g?.name?.toLowerCase() === targetName);
            if (idx !== -1) {
                b.guns[idx].have = true;
                if (!b.inventory.includes(idx)) b.inventory.push(idx);
                simulation.makeGunHUD?.();
                simulation.updateGunHUD?.();
                simulation.inGameConsole?.(`<span style='color:#86efac'>Constructed weapon: ${b.guns[idx].name}</span>`, 90);
            }
        });
        menu.querySelector('#lantern-close').addEventListener('click', () => {
            menu.style.display = 'none';
            state.lanternMenuOpen = false;
        });
    };

    const toggleLanternMenu = () => {
        if (!tech.isLanternConstruct) return;
        const menu = document.getElementById('lantern-forge-menu');
        if (!menu) return;
        state.lanternMenuOpen = !state.lanternMenuOpen;
        menu.style.display = state.lanternMenuOpen ? 'block' : 'none';
    };

    const registerTech = (entry) => {
        if (!Array.isArray(tech?.tech)) return;
        if (!tech.tech.find((t) => t.name === entry.name)) tech.tech.push(entry);
    };

    const registerMovementTechs = () => {
        const list = [
            ['shadow step', 'Teleport a short distance in movement direction', 'isShadowStep'],
            ['air dash', 'Dash horizontally while in midair', 'isAirDash'],
            ['double jump', 'Jump again while in the air', 'isDoubleJump'],
            ['wall cling', 'Grab walls and slide slowly', 'isWallCling'],
            ['rocket boots', 'Hold jump to hover in place', 'isRocketBoots'],
            ['phase shift', 'Pass through thin walls briefly', 'isPhaseShift'],
            ['momentum burst', '+100% speed after standing still', 'isMomentumBurst'],
            ['gravity flip', 'Reverse gravity temporarily', 'isGravityFlip'],
            ['blink', 'Instantly teleport to cursor', 'isBlinkTech'],
            ['slide', 'Crouch while moving to slide', 'isSlideTech'],
            ['grapple hook', 'Launch hook and swing', 'isGrappleTech']
        ];
        list.forEach(([name, desc, flag]) => registerTech({
            name,
            descriptionFunction() { return desc; },
            maxCount: 1,
            count: 0,
            frequency: 2,
            frequencyDefault: 2,
            allowed() { return !tech[flag]; },
            requires: '',
            effect() { tech[flag] = true; },
            remove() { tech[flag] = false; }
        }));
    };

    const registerLanternAndAnimeTechs = () => {
        const corps = ['will', 'fear', 'rage', 'hope', 'compassion', 'love', 'death', 'life'];
        corps.forEach((corp) => registerTech({
            name: `${corp} lantern summons`,
            descriptionFunction() { return `Summon ${corp} constructs around you`; },
            maxCount: 1,
            count: 0,
            frequency: 2,
            frequencyDefault: 2,
            allowed() { return true; },
            requires: '',
            effect() { tech[`isLantern${corp[0].toUpperCase()+corp.slice(1)}`] = true; },
            remove() { tech[`isLantern${corp[0].toUpperCase()+corp.slice(1)}`] = false; }
        }));

        registerTech({
            name: 'lantern construct forge',
            descriptionFunction() { return `press <strong>K</strong> to open construct menu for block/weapon creation`; },
            maxCount: 1,
            count: 0,
            frequency: 2,
            frequencyDefault: 2,
            allowed() { return !tech.isLanternConstruct; },
            requires: '',
            effect() { tech.isLanternConstruct = true; },
            remove() { tech.isLanternConstruct = false; }
        });

        registerTech({
            name: 'strong tech grant',
            descriptionFunction() { return `Instantly grants one extra random powerful tech pick`; },
            maxCount: 1,
            count: 0,
            frequency: 1,
            frequencyDefault: 1,
            allowed() { return true; },
            requires: '',
            effect() {
                const pool = tech.tech.filter((t) => t && typeof t.allowed === 'function' && t.allowed() && t.count < (t.maxCount || 1));
                const pick = pool[Math.floor(Math.random() * pool.length)];
                if (pick?.effect) pick.effect();
                if (pick) pick.count = (pick.count || 0) + 1;
            },
            remove() {}
        });

        for (let i = 1; i <= 90; i++) {
            registerTech({
                name: `anime circuit ${i}`,
                descriptionFunction() { return `anime overdrive stack ${i}: subtle stat and summon scaling`; },
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() { return true; },
                requires: '',
                effect() {
                    tech.animeStacks = (tech.animeStacks || 0) + 1;
                    m.damageMultiplier = (m.damageMultiplier || 1) * 1.003;
                },
                remove() {
                    tech.animeStacks = Math.max(0, (tech.animeStacks || 0) - 1);
                    m.damageMultiplier = (m.damageMultiplier || 1) / 1.003;
                }
            });
        }
    };

    const addCosmeticTechs = () => {
        ['halo cosmetics tech', 'crimson horn cosmetics tech', 'aura wing cosmetics tech'].forEach((name, idx) => registerTech({
            name,
            descriptionFunction() { return `unlock visible player cosmetic aura ${idx + 1}`; },
            maxCount: 1,
            count: 0,
            frequency: 2,
            frequencyDefault: 2,
            allowed() { return true; },
            requires: '',
            effect() { tech[`cosmeticFlag${idx+1}`] = true; },
            remove() { tech[`cosmeticFlag${idx+1}`] = false; }
        }));
    };

    const spawnHorrorMobs = () => {
        if (!Array.isArray(simulation?.ephemera) || simulation.ephemera.find(e => e.name === 'legend-horror-mobs')) return;
        simulation.ephemera.push({
            name: 'legend-horror-mobs',
            do() {
                if (!m?.alive) return;
                if (simulation.cycle % 900 === 0) {
                    // scary dweller chaser
                    mobs.spawn(player.position.x + (Math.random() - 0.5) * 700, player.position.y - 200, 5, 26, '#1a1a1a');
                    const dweller = mob[mob.length - 1];
                    if (dweller) {
                        dweller.isLegendDweller = true;
                        dweller.health *= 1.8;
                        dweller.do = function () {
                            this.checkStatus();
                            const dir = Vector.normalise(Vector.sub(player.position, this.position));
                            this.force.x += dir.x * this.accelMag * 2.1;
                            this.force.y += dir.y * this.accelMag * 2.1;
                            this.healthBar2();
                            ctx.fillStyle = '#111';
                            ctx.beginPath();
                            ctx.arc(this.position.x, this.position.y, this.radius + Math.sin(simulation.cycle * 0.2) * 2, 0, Math.PI * 2);
                            ctx.fill();
                        };
                    }
                }
                if (simulation.cycle % 1100 === 0) {
                    // giant angel-like mob
                    mobs.spawn(player.position.x + (Math.random() - 0.5) * 900, player.position.y - 320, 8, 48, '#f8f9fa');
                    const angel = mob[mob.length - 1];
                    if (angel) {
                        angel.health *= 3.6;
                        angel.accelMag *= 0.8;
                        angel.do = function () {
                            this.checkStatus();
                            const dir = Vector.normalise(Vector.sub(player.position, this.position));
                            this.force.x += dir.x * this.accelMag;
                            this.force.y += dir.y * this.accelMag;
                            ctx.strokeStyle = '#d6e4ff';
                            ctx.lineWidth = 3;
                            ctx.beginPath();
                            ctx.arc(this.position.x - 46, this.position.y, 36, 0.8, 2.3);
                            ctx.arc(this.position.x + 46, this.position.y, 36, 0.8, 2.3);
                            ctx.stroke();
                            this.healthBar3();
                        };
                    }
                }
                if (simulation.cycle % 420 === 0) {
                    // larger basic mobs
                    const basic = ['starter', 'hopper', 'spinner'];
                    const pick = basic[Math.floor(Math.random() * basic.length)];
                    if (typeof spawn?.[pick] === 'function') spawn[pick](player.position.x + (Math.random() - 0.5) * 1000, player.position.y - 180);
                    const last = mob[mob.length - 1];
                    if (last) {
                        Matter.Body.scale(last, 1.4, 1.4);
                        last.health *= 1.5;
                        last.radius *= 1.4;
                    }
                }
            }
        });
    };

    const addNukeWeapon = () => {
        if (!Array.isArray(b?.guns)) return;
        if (b.guns.find((g) => g.name === 'apocalypse nuke')) return;
        b.guns.push({
            name: 'apocalypse nuke',
            ammo: 2,
            ammoPack: 1,
            defaultAmmoPack: 1,
            have: false,
            descriptionFunction() { return 'ultra nuke payload with massive shockwave'; },
            fire() {
                if (this.ammo !== Infinity) this.ammo--;
                const target = simulation.mouseInGame || m.pos;
                b.explosion(target, 220);
                for (let i = 0; i < 9; i++) {
                    setTimeout(() => b.explosion({ x: target.x + (Math.random() - 0.5) * 240, y: target.y + (Math.random() - 0.5) * 240 }, 90), i * 70);
                }
            },
            do() {}
        });
    };

    const runtimeMovement = () => {
        if (!Array.isArray(simulation?.ephemera) || simulation.ephemera.find(e => e.name === 'legend-movement-runtime')) return;
        simulation.ephemera.push({
            name: 'legend-movement-runtime',
            do() {
                const moving = Math.abs(player.velocity.x) + Math.abs(player.velocity.y) > 0.2;
                if (moving) state.lastMoveCycle = simulation.cycle;

                if (tech.isMomentumBurst && simulation.cycle - state.lastMoveCycle > 60) {
                    state.momentumReadyCycle = simulation.cycle;
                }
                if (tech.isMomentumBurst && state.momentumReadyCycle && simulation.cycle - state.momentumReadyCycle < 45) {
                    Matter.Body.setVelocity(player, { x: player.velocity.x * 1.02, y: player.velocity.y });
                }

                if (tech.isRocketBoots && input.up) {
                    player.force.y -= 0.0009;
                }

                if (tech.isWallCling) {
                    if (Math.abs(player.velocity.x) < 0.3 && !m.onGround && (input.left || input.right)) {
                        Matter.Body.setVelocity(player, { x: player.velocity.x, y: Math.min(player.velocity.y, 1.7) });
                    }
                }

                if (tech.cosmeticFlag1) simulation.drawList.push({ x: m.pos.x, y: m.pos.y - 34, radius: 11, color: 'rgba(255, 225, 130, 0.24)', time: simulation.drawTime });
                if (tech.cosmeticFlag2) simulation.drawList.push({ x: m.pos.x - 18, y: m.pos.y - 20, radius: 8, color: 'rgba(255, 120, 140, 0.2)', time: simulation.drawTime });
                if (tech.cosmeticFlag3) simulation.drawList.push({ x: m.pos.x + 18, y: m.pos.y - 20, radius: 8, color: 'rgba(120, 200, 255, 0.2)', time: simulation.drawTime });
            }
        });
    };

    const addKeys = () => {
        if (window.legendSystemsKeysBound) return;
        window.legendSystemsKeysBound = true;
        document.addEventListener('keydown', (e) => {
            if ((e.key === 'k' || e.key === 'K') && tech.isLanternConstruct) toggleLanternMenu();
            if ((e.key === 'Shift') && tech.isAirDash && !m.onGround) {
                const dir = (input.left ? -1 : 0) + (input.right ? 1 : 0) || (player.velocity.x >= 0 ? 1 : -1);
                Matter.Body.setVelocity(player, { x: dir * 18, y: player.velocity.y * 0.9 });
            }
            if ((e.key === 'b' || e.key === 'B') && tech.isBlinkTech) {
                Matter.Body.setPosition(player, { x: simulation.mouseInGame.x, y: simulation.mouseInGame.y });
            }
            if ((e.key === 'g' || e.key === 'G') && tech.isGravityFlip) {
                player.force.y -= 0.08;
                Matter.Body.setVelocity(player, { x: player.velocity.x, y: -Math.abs(player.velocity.y) - 8 });
            }
            if ((e.key === 'q' || e.key === 'Q') && tech.isShadowStep) {
                const dir = Vector.normalise({ x: (input.right ? 1 : 0) - (input.left ? 1 : 0), y: (input.down ? 1 : 0) - (input.up ? 1 : 0) });
                const d = (Number.isFinite(dir.x) && Number.isFinite(dir.y) && (dir.x || dir.y)) ? dir : { x: 1, y: 0 };
                Matter.Body.setPosition(player, { x: player.position.x + d.x * 110, y: player.position.y + d.y * 110 });
            }
            if ((e.key === 'c' || e.key === 'C') && tech.isSlideTech && m.onGround) {
                Matter.Body.setVelocity(player, { x: player.velocity.x * 1.5, y: player.velocity.y });
            }
        });
    };

    const boot = () => {
        if (state.initialized) return;
        state.initialized = true;
        ensureNoHorrorDefault();
        patchGunSafety();
        patchGuitarsToWave();
        createLanternMenu();
        registerMovementTechs();
        registerLanternAndAnimeTechs();
        addCosmeticTechs();
        spawnHorrorMobs();
        addNukeWeapon();
        runtimeMovement();
        addKeys();

        if (!Array.isArray(simulation?.ephemera) || simulation.ephemera.find(e => e.name === 'legend-stability-loop')) return;
        simulation.ephemera.push({ name: 'legend-stability-loop', do: () => { patchGunSafety(); patchGuitarsToWave(); stabilizeBullets(); } });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 700));
    } else {
        setTimeout(boot, 700);
    }
})();
