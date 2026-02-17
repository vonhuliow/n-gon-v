// Horror Tech - dark, grayscale, twisted world modifier
(function () {
    if (window.horrorTechLoaded) return;
    window.horrorTechLoaded = true;

    const state = {
        styleInstalled: false,
        active: false,
    };

    const installStyle = () => {
        if (state.styleInstalled) return;
        state.styleInstalled = true;
        const style = document.createElement('style');
        style.id = 'horror-tech-style';
        style.textContent = `
            body.horror-tech-active {
                background: #050505 !important;
            }
            body.horror-tech-active #canvas {
                filter: grayscale(0.9) contrast(1.05) brightness(0.72) sepia(0.08);
            }
            body.horror-tech-active #text-log,
            body.horror-tech-active #info,
            body.horror-tech-active #right-HUD,
            body.horror-tech-active #right-HUD-constraint {
                color: #c7c7c7 !important;
                text-shadow: none;
            }
            body.horror-tech-active #health-bg {
                filter: grayscale(0.85) brightness(0.82);
            }
        `;
        document.head.appendChild(style);
    };

    const setHorrorVisual = (enabled) => {
        installStyle();
        state.active = !!enabled;
        if (enabled) {
            document.body.classList.add('horror-tech-active');
        } else {
            document.body.classList.remove('horror-tech-active');
        }
    };

    const installRuntime = () => {
        if (!Array.isArray(simulation?.ephemera)) return;
        if (simulation.ephemera.find((e) => e.name === 'horror-tech-runtime')) return;
        simulation.ephemera.push({
            name: 'horror-tech-runtime',
            do() {
                const enabled = !!tech.isHorrorTwist;
                if (enabled !== state.active) setHorrorVisual(enabled);

                if (!enabled) return;

                if (simulation.cycle % 180 === 0 && m?.alive) {
                    simulation.drawList.push({
                        x: m.pos.x + (Math.random() - 0.5) * 220,
                        y: m.pos.y + (Math.random() - 0.5) * 180,
                        radius: 18 + Math.random() * 32,
                        color: 'rgba(160,160,160,0.05)',
                        time: simulation.drawTime
                    });
                }

                if (simulation.cycle % 420 === 0 && m?.alive) {
                    simulation.inGameConsole("<span style='color:#cccccc'>the dark listens...</span>", 90);
                }
            }
        });
    };

    const registerTech = () => {
        if (!Array.isArray(tech?.tech)) return;
        if (tech.tech.find((t) => t.name === 'horror protocol')) return;

        const horrorTech = {
            name: 'horror protocol',
            descriptionFunction() {
                return `turn the run <strong>dark</strong>, <strong>gray</strong>, and <strong>twisted</strong><br><strong>1.08x</strong> your <strong class='color-d'>damage</strong>, <strong>0.92x</strong> incoming damage`;
            },
            isGunTech: false,
            maxCount: 1,
            count: 0,
            frequency: 2,
            frequencyDefault: 2,
            allowed() { return !tech.isHorrorTwist; },
            requires: '',
            effect() {
                tech.isHorrorTwist = true;
                tech.horrorDamageMult = 1.08;
                tech.horrorDefenseMult = 0.92;
                if (typeof m !== 'undefined') {
                    m.damageMultiplier = (m.damageMultiplier || 1) * tech.horrorDamageMult;
                    m.incomingDamageMultiplier = (m.incomingDamageMultiplier || 1) * tech.horrorDefenseMult;
                }
                setHorrorVisual(true);
            },
            remove() {
                if (tech.isHorrorTwist) {
                    if (typeof m !== 'undefined') {
                        m.damageMultiplier = (m.damageMultiplier || 1) / (tech.horrorDamageMult || 1.08);
                        m.incomingDamageMultiplier = (m.incomingDamageMultiplier || 1) / (tech.horrorDefenseMult || 0.92);
                    }
                }
                tech.isHorrorTwist = false;
                tech.horrorDamageMult = 1;
                tech.horrorDefenseMult = 1;
                setHorrorVisual(false);
            }
        };

        const anchor = tech.tech.findIndex((t) => t.name === 'spherical harmonics');
        if (anchor >= 0) tech.tech.splice(anchor, 0, horrorTech);
        else tech.tech.push(horrorTech);
    };

    const boot = () => {
        registerTech();
        installRuntime();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 450));
    } else {
        setTimeout(boot, 450);
    }
})();
