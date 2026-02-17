// Dark Tech Pack - 50+ dark utility techs and special summon/ride systems
(function () {
    if (window.darkTechPackLoaded) return;
    window.darkTechPackLoaded = true;

    const state = {
        orbAnchor: null,
        riddenBot: null,
        livingBlockCooldown: 0,
    };

    const ensureRuntime = () => {
        if (!Array.isArray(simulation?.ephemera) || simulation.ephemera.find(e => e.name === 'dark-tech-runtime')) return;
        simulation.ephemera.push({
            name: 'dark-tech-runtime',
            do() {
                if (!m?.alive) return;

                // living blocks: animate nearby blocks and launch one at enemies
                if (tech.isLivingBlocks && simulation.cycle > state.livingBlockCooldown) {
                    state.livingBlockCooldown = simulation.cycle + 75;
                    const nearestBody = Array.isArray(body)
                        ? body.find(obj => obj && obj.position && Vector.magnitude(Vector.sub(obj.position, player.position)) < 420)
                        : null;
                    if (nearestBody) {
                        simulation.drawList.push({
                            x: nearestBody.position.x,
                            y: nearestBody.position.y,
                            radius: 44,
                            color: 'rgba(120, 70, 180, 0.14)',
                            time: simulation.drawTime
                        });
                        const target = Array.isArray(mob)
                            ? mob.find(k => k?.alive && Vector.magnitude(Vector.sub(k.position, nearestBody.position)) < 650)
                            : null;
                        if (target) {
                            const dir = Vector.normalise(Vector.sub(target.position, nearestBody.position));
                            Matter.Body.setVelocity(nearestBody, { x: dir.x * 14, y: dir.y * 14 });
                        }
                    }
                }

                // void orb that spawns mobs
                if (tech.isVoidSpawnOrb) {
                    if (!state.orbAnchor) {
                        state.orbAnchor = { x: m.pos.x + 160, y: m.pos.y - 120 };
                    }
                    const pulse = 20 + Math.sin(simulation.cycle * 0.06) * 8;
                    simulation.drawList.push({
                        x: state.orbAnchor.x,
                        y: state.orbAnchor.y,
                        radius: pulse,
                        color: 'rgba(72, 28, 108, 0.16)',
                        time: simulation.drawTime
                    });
                    if (simulation.cycle % 360 === 0) {
                        const choose = ['starter', 'hopper', 'spinner', 'focuser'];
                        const spawnType = choose[Math.floor(Math.random() * choose.length)];
                        if (typeof spawn?.[spawnType] === 'function') {
                            spawn[spawnType](state.orbAnchor.x + (Math.random() - 0.5) * 80, state.orbAnchor.y + (Math.random() - 0.5) * 80);
                        }
                    }
                } else {
                    state.orbAnchor = null;
                }

                // rideable bot tech
                if (tech.isRideableBot && state.riddenBot && state.riddenBot.position) {
                    Matter.Body.setPosition(player, { x: state.riddenBot.position.x, y: state.riddenBot.position.y - 24 });
                    Matter.Body.setVelocity(player, state.riddenBot.velocity || { x: 0, y: 0 });
                }

                // dark ambient glow from added tech stack
                if (tech.darkTechStacks > 0 && simulation.cycle % 14 === 0) {
                    simulation.drawList.push({
                        x: m.pos.x,
                        y: m.pos.y,
                        radius: 20 + tech.darkTechStacks * 1.3,
                        color: 'rgba(88, 56, 120, 0.08)',
                        time: simulation.drawTime
                    });
                }
            }
        });
    };

    const toggleRide = () => {
        if (!tech.isRideableBot) return;
        if (state.riddenBot) {
            state.riddenBot = null;
            simulation.inGameConsole("<span style='color:#b794f4'>Dismounted bot</span>", 50);
            return;
        }
        const candidate = Array.isArray(bullet)
            ? bullet.find(obj => obj && obj.botType && obj.position && Vector.magnitude(Vector.sub(obj.position, player.position)) < 140)
            : null;
        if (candidate) {
            state.riddenBot = candidate;
            simulation.inGameConsole("<span style='color:#b794f4'>Mounted ride bot</span>", 50);
        }
    };

    const addKeybind = () => {
        if (window.darkTechKeybindBound) return;
        window.darkTechKeybindBound = true;
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' || e.key === 'R') toggleRide();
        });
    };

    const registerTechs = () => {
        if (!Array.isArray(tech?.tech)) return;

        const addTech = (entry) => {
            if (!tech.tech.find(t => t.name === entry.name)) tech.tech.push(entry);
        };

        addTech({
            name: 'arise masonry',
            descriptionFunction() {
                return `nearby <strong class='color-block'>blocks</strong> become <strong>alive</strong> and hunt mobs<br>with a <strong style='color:#8b5cf6'>dark glowing purple</strong> animation`;
            },
            maxCount: 1,
            count: 0,
            frequency: 2,
            frequencyDefault: 2,
            allowed() { return !tech.isLivingBlocks; },
            requires: '',
            effect() { tech.isLivingBlocks = true; },
            remove() { tech.isLivingBlocks = false; }
        });

        addTech({
            name: 'void brood orb',
            descriptionFunction() {
                return `summon a <strong style='color:#7e22ce'>dark orb</strong> that periodically<br>spawns mobs into the battlefield`;
            },
            maxCount: 1,
            count: 0,
            frequency: 2,
            frequencyDefault: 2,
            allowed() { return !tech.isVoidSpawnOrb; },
            requires: '',
            effect() { tech.isVoidSpawnOrb = true; },
            remove() { tech.isVoidSpawnOrb = false; }
        });

        addTech({
            name: 'rideable bot harness',
            descriptionFunction() {
                return `press <strong>R</strong> near your bot to <strong>ride</strong> it<br>press <strong>R</strong> again to dismount`;
            },
            maxCount: 1,
            count: 0,
            frequency: 2,
            frequencyDefault: 2,
            allowed() { return !tech.isRideableBot; },
            requires: '',
            effect() { tech.isRideableBot = true; },
            remove() { tech.isRideableBot = false; state.riddenBot = null; }
        });

        // 52 additional dark-nature techs
        for (let i = 1; i <= 52; i++) {
            addTech({
                name: `dark nature protocol ${i}`,
                descriptionFunction() {
                    return `<strong style='color:#a855f7'>+${(0.5 + i * 0.02).toFixed(2)}%</strong> shadow adaptation<br>stacking dark tech aura power`;
                },
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() { return true; },
                requires: '',
                effect() {
                    tech.darkTechStacks = (tech.darkTechStacks || 0) + 1;
                    if (typeof m !== 'undefined') {
                        m.damageMultiplier = (m.damageMultiplier || 1) * 1.006;
                        m.incomingDamageMultiplier = (m.incomingDamageMultiplier || 1) * 0.997;
                    }
                },
                remove() {
                    tech.darkTechStacks = Math.max(0, (tech.darkTechStacks || 0) - 1);
                    if (typeof m !== 'undefined') {
                        m.damageMultiplier = (m.damageMultiplier || 1) / 1.006;
                        m.incomingDamageMultiplier = (m.incomingDamageMultiplier || 1) / 0.997;
                    }
                }
            });
        }
    };

    const boot = () => {
        registerTechs();
        ensureRuntime();
        addKeybind();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 600));
    } else {
        setTimeout(boot, 600);
    }
})();
