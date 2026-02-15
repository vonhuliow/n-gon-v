// Exact-style scythe arsenal (14 color variants), based on the provided scythe implementation style
(function () {
    const variantConfigs = [
        { key: "crimson", color: "crimson", trail: "rgba(220,20,60,", dmg: 1.00, drain: 0.10, spin: 1.00, blast: 0, stun: 0 },
        { key: "azure", color: "dodgerblue", trail: "rgba(30,144,255,", dmg: 1.05, drain: 0.10, spin: 1.02, blast: 0, stun: 0 },
        { key: "emerald", color: "seagreen", trail: "rgba(46,139,87,", dmg: 1.02, drain: 0.09, spin: 1.00, blast: 0, stun: 0 },
        { key: "violet", color: "blueviolet", trail: "rgba(138,43,226,", dmg: 1.08, drain: 0.11, spin: 1.06, blast: 0, stun: 0 },
        { key: "gold", color: "#ffd700", trail: "rgba(255,215,0,", dmg: 1.12, drain: 0.12, spin: 0.98, blast: 18, stun: 0 },
        { key: "glacier", color: "#6ad7ff", trail: "rgba(106,215,255,", dmg: 0.98, drain: 0.08, spin: 1.03, blast: 0, stun: 0 },
        { key: "toxic", color: "chartreuse", trail: "rgba(127,255,0,", dmg: 1.06, drain: 0.11, spin: 1.01, blast: 0, stun: 20 },
        { key: "obsidian", color: "#555", trail: "rgba(85,85,85,", dmg: 1.14, drain: 0.12, spin: 0.95, blast: 0, stun: 0 },
        { key: "rose", color: "#ff4f81", trail: "rgba(255,79,129,", dmg: 1.03, drain: 0.09, spin: 1.04, blast: 0, stun: 0 },
        { key: "amber", color: "#ffbf00", trail: "rgba(255,191,0,", dmg: 1.07, drain: 0.10, spin: 0.97, blast: 10, stun: 0 },
        { key: "neon", color: "#39ff14", trail: "rgba(57,255,20,", dmg: 1.04, drain: 0.09, spin: 1.12, blast: 0, stun: 0 },
        { key: "storm", color: "#00bcd4", trail: "rgba(0,188,212,", dmg: 1.06, drain: 0.10, spin: 1.08, blast: 0, stun: 16 },
        { key: "magma", color: "#ff3b30", trail: "rgba(255,59,48,", dmg: 1.15, drain: 0.12, spin: 0.96, blast: 22, stun: 0 },
        { key: "lunar", color: "#c0c0ff", trail: "rgba(192,192,255,", dmg: 1.00, drain: 0.08, spin: 1.00, blast: 0, stun: 0 }
    ];

    function cleanupScythe(g) {
        if (!g.scythe) return;
        Matter.Body.setAngularVelocity(g.scythe, 0);
        Composite.remove(engine.world, g.scythe);
        g.scythe.parts.forEach(part => {
            Composite.remove(engine.world, part);
            const index = bullet.indexOf(part);
            if (index !== -1) bullet.splice(index, 1);
        });
        g.scythe = undefined;
        g.bladeTrails = [];
        m.fireCDcycle = 0;
        if (g.constraint) {
            Composite.remove(engine.world, g.constraint);
            g.constraint = undefined;
        }
    }

    function createScytheVariant(cfg) {
        return {
            name: `${cfg.key} scythe`,
            descriptionFunction() {
                return `throw a <b>${cfg.key} scythe</b> that keeps velocity on collision<br>drains <strong class='color-h'>health</strong> instead of ammo<br><span style='color:${cfg.color}'>${(cfg.dmg * 100).toFixed(0)}% damage profile</span>`;
            },
            ammo: Infinity,
            ammoPack: Infinity,
            defaultAmmoPack: Infinity,
            have: false,
            fire() { },
            cycle: 0,
            cycle2: 0,
            scythe: undefined,
            bladeSegments: undefined,
            bladeTrails: [],
            angle: 0,
            constraint: undefined,
            durability: 200,
            maxDurability: 200,
            haveEphemera: false,
            right: true,
            do() {
                if (this.cycle2 === 0) {
                    const oldEffect = powerUps.ammo.effect;
                    powerUps.ammo.effect = () => {
                        oldEffect();
                        for (let i = 0, len = b.inventory.length; i < len; ++i) {
                            const gun = b.guns[b.inventory[i]];
                            if (gun?.name === this.name && tech.durabilityScythe) {
                                gun.durability += (tech.isAmmoForGun && b.guns[b.activeGun].name === this.name) ? 30 : 15;
                            }
                        }
                    };
                }
                this.cycle2++;

                if (!this.haveEphemera) {
                    this.haveEphemera = true;
                    simulation.ephemera.push({
                        name: `${this.name}-ephemera`,
                        do: () => {
                            if (b.activeGun === null || b.guns[b.activeGun].name !== this.name) {
                                for (let i = 0, len = b.inventory.length; i < len; ++i) {
                                    const g = b.guns[b.inventory[i]];
                                    if (g?.name === this.name && g.scythe) {
                                        g.cycle = 0;
                                        cleanupScythe(g);
                                    }
                                }
                            }
                        },
                    });
                }

                if (tech.isAmmoScythe) {
                    this.ammoPack = 1;
                    this.defaultAmmoPack = 1;
                } else {
                    this.ammo = Infinity;
                    this.ammoPack = Infinity;
                    this.defaultAmmoPack = Infinity;
                }

                this.durability = Math.max(0, Math.min(this.durability, this.maxDurability));
                if (b.activeGun !== null && input.fire && (tech.isEnergyHealth ? m.energy >= 0.11 : m.health >= 0.11) && this.durability > 0) {
                    if (!this.scythe && b.guns[b.activeGun].name === this.name) {
                        this.angle = m.angle;
                        if (tech.durabilityScythe) {
                            if (!(this.angle > -Math.PI / 2 && this.angle < Math.PI / 2)) {
                                this.right = false;
                                ({ scythe: this.scythe, bladeSegments: this.bladeSegments } = this.createScythe(player.position, false));
                            } else {
                                this.right = true;
                                ({ scythe: this.scythe, bladeSegments: this.bladeSegments } = this.createScythe(player.position, true));
                            }
                        } else {
                            ({ scythe: this.scythe, bladeSegments: this.bladeSegments } = this.createAndSwingScythe());
                        }

                        if (!tech.isAmmoScythe && !b.guns[b.activeGun].ammo == 0 && !tech.durabilityScythe) {
                            const drain = cfg.drain;
                            if (tech.isEnergyHealth) {
                                m.energy -= drain;
                                if (tech.isPhaseScythe) m.immuneCycle = this.cycle;
                            } else {
                                m.health -= drain;
                                m.displayHealth();
                            }
                        }
                    }
                }

                if (tech.durabilityScythe) {
                    if (!(m.angle > -Math.PI / 2 && m.angle < Math.PI / 2) && this.right === true && this.scythe) cleanupScythe(this);
                    else if ((m.angle > -Math.PI / 2 && m.angle < Math.PI / 2) && this.right === false && this.scythe) cleanupScythe(this);
                    if (this.scythe && (!input.fire || !this.durability)) cleanupScythe(this);
                }

                if (this.scythe && m.cycle > this.cycle + 30 && !tech.durabilityScythe) {
                    cleanupScythe(this);
                } else {
                    if (this.scythe && !tech.isMeleeScythe && !tech.durabilityScythe) {
                        const ang = Math.PI * 0.15 * cfg.spin;
                        if (!(this.angle > -Math.PI / 2 && this.angle < Math.PI / 2)) {
                            Matter.Body.setAngularVelocity(this.scythe, -ang - (tech.scytheRad ? tech.scytheRad * 0.1 : 0));
                        } else {
                            Matter.Body.setAngularVelocity(this.scythe, ang + (tech.scytheRad ? tech.scytheRad * 0.1 : 0));
                        }
                        Matter.Body.setVelocity(this.scythe, { x: Math.cos(this.angle) * 30, y: Math.sin(this.angle) * 30 });
                    } else if (this.scythe && (tech.isMeleeScythe || tech.durabilityScythe)) {
                        if (!(this.angle > -Math.PI / 2 && this.angle < Math.PI / 2)) {
                            Matter.Body.setAngularVelocity(this.scythe, -Math.PI * 0.1 + (tech.isStunScythe ? 0.1 : 0) - (tech.scytheRad ? tech.scytheRad * 0.1 : 0));
                        } else {
                            Matter.Body.setAngularVelocity(this.scythe, Math.PI * 0.1 - (tech.isStunScythe ? 0.1 : 0) + (tech.scytheRad ? tech.scytheRad * 0.1 : 0));
                        }
                        if (tech.durabilityScythe) {
                            if (!this.constraint) {
                                this.constraint = Constraint.create({
                                    pointA: player.position,
                                    bodyB: this.scythe,
                                    pointB: (!(this.angle > -Math.PI / 2 && this.angle < Math.PI / 2)) ? { x: 50, y: 100 } : { x: -50, y: 100 },
                                    stiffness: 0.9,
                                    damping: 0.001
                                });
                                Composite.add(engine.world, this.constraint);
                            }
                        } else {
                            Matter.Body.setPosition(this.scythe, player.position);
                        }
                    }
                }

                if (this.scythe) {
                    for (let i = 0; i < this.bladeSegments.length; i++) {
                        const blade = this.bladeSegments[i];
                        const trail = this.bladeTrails[i] || [];
                        const vertices = blade.vertices.map(vertex => ({ x: vertex.x, y: vertex.y }));
                        trail.push(vertices);
                        if (trail.length > 10) trail.shift();
                        this.bladeTrails[i] = trail;
                    }

                    for (let i = 0; i < this.bladeTrails.length; i++) {
                        const trail = this.bladeTrails[i];
                        const alphaStep = 1 / trail.length;
                        let alpha = 0;
                        for (let j = 0; j < trail.length; j++) {
                            const vertices = trail[j];
                            ctx.beginPath();
                            ctx.moveTo(vertices[0].x, vertices[0].y);
                            for (let k = 1; k < vertices.length; k++) ctx.lineTo(vertices[k].x, vertices[k].y);
                            alpha += alphaStep;
                            ctx.closePath();
                            if (tech.isEnergyHealth) {
                                const eyeColor = m.fieldMeterColor;
                                const r = eyeColor[1], g = eyeColor[2], b = eyeColor[3];
                                ctx.fillStyle = `#${r}${r}${g}${g}${b}${b}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
                            } else if (tech.isAmmoScythe) {
                                ctx.fillStyle = `#c0c0c0${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
                            } else if (tech.isStunScythe) {
                                ctx.fillStyle = `#4b0082${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
                            } else {
                                ctx.fillStyle = `${cfg.trail}${alpha})`;
                            }
                            ctx.fill();
                        }
                    }

                    for (let i = 0; i < this.bladeSegments.length; i++) {
                        ctx.beginPath();
                        ctx.lineJoin = "miter";
                        ctx.miterLimit = 100;
                        ctx.strokeStyle = tech.isEnergyHealth ? m.fieldMeterColor : tech.isAmmoScythe ? "#c0c0c0" : tech.isStunScythe ? "indigo" : cfg.color;
                        ctx.lineWidth = 5;
                        ctx.fillStyle = "black";
                        ctx.moveTo(this.bladeSegments[i].vertices[0].x, this.bladeSegments[i].vertices[0].y);
                        for (let j = 0; j < this.bladeSegments[i].vertices.length; j++) ctx.lineTo(this.bladeSegments[i].vertices[j].x, this.bladeSegments[i].vertices[j].y);
                        ctx.closePath();
                        ctx.stroke();
                        ctx.fill();
                        ctx.lineJoin = "round";
                        ctx.miterLimit = 10;
                    }
                }

                if (this.scythe) {
                    for (let i = 0; i < mob.length; i++) {
                        if (Matter.Query.collides(this.scythe, [mob[i]]).length > 0) {
                            if (tech.durabilityScythe) this.durability--;
                            const dmg = (m.damageDone ? m.damageDone : m.dmgScale) * 0.12 * 2.73 * cfg.dmg * (tech.scytheGlobalMult || 1) * (tech.isLongBlade ? 1.3 : 1) * (tech.scytheRange ? tech.scytheRange * 1.15 : 1) * (tech.isDoubleScythe ? 0.9 : 1) * (tech.scytheRad ? tech.scytheRad * 1.5 : 1);
                            mob[i].damage(dmg, true);
                            simulation.drawList.push({ x: mob[i].position.x, y: mob[i].position.y, radius: Math.sqrt(dmg) * 50, color: simulation.mobDmgColor, time: simulation.drawTime });
                            if (cfg.blast > 0) b.explosion(mob[i].position, cfg.blast);
                            if (cfg.stun > 0 || tech.isStunScythe) mobs.statusStun(mob[i], Math.max(cfg.stun, 90));
                            if (!tech.isMeleeScythe) {
                                const angle = Math.atan2(mob[i].position.y - this.scythe.position.y, mob[i].position.x - this.scythe.position.x);
                                this.scythe.force.x += Math.cos(angle) * 2;
                                this.scythe.force.y += Math.sin(angle) * 2;
                            }
                            break;
                        }
                    }
                }
            },
            createAndSwingScythe(x = player.position.x, y = player.position.y, angle = m.angle) {
                if (this.cycle < m.cycle) {
                    this.cycle = m.cycle + 60 + (tech.scytheRange * 6);
                    m.fireCDcycle = Infinity;
                    const handleWidth = 20;
                    const handleHeight = 200 + (tech.isLongBlade ? 30 : 0) + (tech.isMeleeScythe ? 140 : 0);
                    const handle = Bodies.rectangle(x, y, handleWidth, handleHeight, spawn.propsIsNotHoldable);
                    bullet[bullet.length] = handle; bullet[bullet.length - 1].do = () => { };
                    const bladeWidth = 100, bladeHeight = 20;
                    const numBlades = 10 + (tech.isLongBlade ? 1 : 0) + (tech.isMeleeScythe ? 2 : 0);
                    const extensionFactor = 5.5;
                    const bladeSegments = [];

                    const makeBlade = (bladeX, bladeY, rotateBy) => {
                        const vertices = [
                            { x: bladeX, y: bladeY - bladeHeight / 2 },
                            { x: bladeX + bladeWidth / 2, y: bladeY + bladeHeight / 2 },
                            { x: bladeX - bladeWidth / 2, y: bladeY + bladeHeight / 2 },
                            { x: bladeX, y: bladeY - bladeHeight / 2 + 10 },
                        ];
                        const blade = Bodies.fromVertices(bladeX, bladeY, vertices, spawn.propsIsNotHoldable);
                        bullet[bullet.length] = blade; bullet[bullet.length - 1].do = () => { };
                        Matter.Body.rotate(blade, rotateBy);
                        bladeSegments.push(blade);
                    };

                    for (let i = 0; i < numBlades; i++) {
                        const ext = (i / (numBlades - 1)) * extensionFactor;
                        makeBlade(x - handleWidth / 2 + i * (bladeWidth / 2) - ext * (bladeWidth / 2), y + handleHeight / 2 - i * (bladeHeight / (3 ** i)), -Math.sin(i * (Math.PI / 180) * 5));
                    }
                    if (tech.isDoubleScythe) {
                        for (let i = 0; i < numBlades; i++) {
                            const ext = (i / (numBlades - 1)) * extensionFactor;
                            makeBlade(x + handleWidth / 2 - i * (bladeWidth / 2) + ext * (bladeWidth / 2), y - handleHeight / 2 - i * (bladeHeight / (3 ** i)), -Math.sin(i * (Math.PI / 180) * 5) + Math.PI);
                        }
                    }

                    const scythe = Body.create({ parts: [handle, ...bladeSegments] });
                    Composite.add(engine.world, scythe);
                    Matter.Body.setPosition(scythe, { x, y });
                    scythe.collisionFilter.category = cat.bullet;
                    scythe.collisionFilter.mask = cat.mobBullet | cat.mob;
                    if ((angle > -Math.PI / 2 && angle < Math.PI / 2)) Body.scale(scythe, -1, 1, { x, y });
                    scythe.frictionAir -= 0.01;
                    return { scythe, bladeSegments };
                }
            },
            createScythe(position = player.position, right = true) {
                let x = position.x, y = position.y;
                const handleWidth = 20, handleHeight = 220;
                const handle = Bodies.rectangle(x, y, handleWidth, handleHeight, spawn.propsIsNotHoldable);
                const pommel = Bodies.fromVertices(x, y + handleHeight / 2, [
                    { x, y: y + handleHeight / 2 + 20 }, { x: x + 15, y: y + handleHeight / 2 }, { x, y: y + handleHeight / 2 - 20 }, { x: x - 15, y: y + handleHeight / 2 }
                ], spawn.propsIsNotHoldable);
                const handle2 = Bodies.fromVertices(x + 50, y - handleHeight / 2 - 70, [
                    { x: x + 120, y: y - 140 }, { x: x + 100, y: y - 140 }, { x: x + 23, y }, { x: x + 3, y }
                ], spawn.propsIsNotHoldable);
                const joint = Bodies.polygon(x + 100, y - handleHeight - 20, 5, 30, spawn.propsIsNotHoldable);
                const joint2 = Bodies.polygon(x, y - handleHeight / 2, 3, 20, spawn.propsIsNotHoldable);
                Body.rotate(joint2, Math.PI / 2);

                const blade1 = Bodies.fromVertices(x + 50, y - handleHeight / 2 - 150, [{ x: x - 5, y: y - 10 }, { x: x - 15, y: y + 10 }, { x: x - 100, y: y - 35 }, { x: x - 60, y }], spawn.propsIsNotHoldable);
                const blade2 = Bodies.fromVertices(x + 100, y - handleHeight / 2 - 150, [{ x: x - 10, y: y - 10 }, { x: x + 15, y: y + 10 }, { x: x - 100, y: y - 30 }, { x: x - 60, y }], spawn.propsIsNotHoldable);
                const blade3 = Bodies.fromVertices(x + 150, y - handleHeight / 2 - 130, [{ x: x - 10, y: y - 10 }, { x: x + 15, y: y + 10 }, { x: x - 90, y: y - 30 }, { x: x - 60, y }], spawn.propsIsNotHoldable);
                const blade4 = Bodies.fromVertices(x - 20, y - handleHeight / 2 - 160, [{ x, y: y - 10 }, { x: x + 15, y: y + 10 }, { x: x - 90, y: y - 25 }, { x: x - 60, y: y + 5 }], spawn.propsIsNotHoldable);
                const blade5 = Bodies.fromVertices(x - 90, y - handleHeight / 2 - 160, [{ x, y: y - 30 }, { x: x + 15, y: y - 10 }, { x: x - 90, y: y - 25 }, { x: x - 60, y }], spawn.propsIsNotHoldable);
                const blade6 = Bodies.fromVertices(x - 150, y - handleHeight / 2 - 150, [{ x: x + 10, y: y - 15 }, { x: x + 30, y: y + 4 }, { x: x - 90, y: y + 10 }, { x: x - 30, y: y + 20 }], spawn.propsIsNotHoldable);

                const scythe = Body.create({ parts: [handle, handle2, pommel, blade6, blade5, blade4, blade1, blade2, blade3, joint, joint2] });
                Composite.add(engine.world, scythe);
                Matter.Body.setPosition(scythe, { x, y });
                Matter.Body.setVelocity(scythe, { x: 0, y: 0 });
                scythe.collisionFilter.category = cat.bullet;
                scythe.collisionFilter.mask = cat.mobBullet | cat.powerup | cat.mob | cat.body | cat.bullet;
                Body.scale(scythe, -1, 1);
                if (!right) Body.scale(scythe, -1, 1);
                return { scythe, bladeSegments: [handle, handle2, pommel, blade6, blade5, blade4, blade1, blade2, blade3, joint, joint2] };
            },
        };
    }

    const scytheVariants = variantConfigs.map(createScytheVariant);

    const scytheTech = [
        {
            name: "scythe overclock",
            descriptionFunction() { return `<strong>1.15x</strong> all scythe variant <strong class='color-d'>damage</strong>`; },
            isGunTech: true,
            maxCount: 3,
            count: 0,
            frequency: 2,
            frequencyDefault: 2,
            allowed() { return scytheVariants.some(g => tech.haveGunCheck(g.name)); },
            requires: "any scythe variant",
            effect() { tech.scytheGlobalMult = (tech.scytheGlobalMult || 1) * 1.15; },
            remove() { tech.scytheGlobalMult = (tech.scytheGlobalMult || 1) / 1.15; }
        }
    ];

    if (typeof b !== 'undefined' && Array.isArray(b.guns)) {
        scytheVariants.forEach(g => {
            if (!b.guns.find(existing => existing.name === g.name)) b.guns.push(g);
        });
        b.guns = b.guns.filter((obj, index, self) => index === self.findIndex(item => item.name === obj.name));
    }

    if (typeof tech !== 'undefined' && Array.isArray(tech.tech)) {
        scytheTech.forEach(t => {
            if (!tech.tech.find(existing => existing.name === t.name)) tech.tech.push(t);
        });
        tech.tech = tech.tech.filter((obj, index, self) => index === self.findIndex(item => item.name === obj.name));
    }

    console.log(`%cscythe arsenal installed (${scytheVariants.length} variants)`, "color: crimson; font-weight: bold;");
})();
