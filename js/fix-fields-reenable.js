// Field Recovery Fixes: re-enable broken field usage for modded runs
(function () {
    if (window.fieldRecoveryFixLoaded) return;
    window.fieldRecoveryFixLoaded = true;

    const safeRebuildField = () => {
        if (typeof m === 'undefined') return;
        if (!Array.isArray(m.fieldUpgrades)) m.fieldUpgrades = [];
        if (typeof m.fieldMode !== 'number' || m.fieldMode < 0 || m.fieldMode >= m.fieldUpgrades.length) {
            m.fieldMode = 0;
        }
        if (typeof m.setField === 'function' && m.fieldUpgrades.length > 0) {
            try {
                const name = m.fieldUpgrades[m.fieldMode]?.name || m.fieldUpgrades[0]?.name;
                if (name) m.setField(name);
            } catch (_) {
                // no-op safety fallback
            }
        }
    };

    const addRecoveryTech = () => {
        if (!Array.isArray(tech?.tech)) return;
        const entry = {
            name: 'field recovery patch',
            description: '<strong>field recovery patch</strong><br>rebuilds field state and restores usable field mode',
            isGunTech: false,
            maxCount: 1,
            count: 0,
            allowed() { return true; },
            requires: '',
            effect() {
                safeRebuildField();
                simulation?.inGameConsole("<span style='color:#7bdff2'>field system recovered</span>", 50);
            },
            remove() { this.count = 0; }
        };
        if (!tech.tech.find(t => t.name === entry.name)) tech.tech.push(entry);
    };

    window.addEventListener('keydown', (e) => {
        if (e.key === 'F8') {
            safeRebuildField();
            simulation?.inGameConsole("<span style='color:#7bdff2'>F8 field recovery applied</span>", 45);
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addRecoveryTech);
    } else {
        setTimeout(addRecoveryTech, 300);
    }

    if (Array.isArray(simulation?.ephemera)) {
        simulation.ephemera.push({
            name: 'field-recovery-watchdog',
            do() {
                if (typeof m === 'undefined') return;
                if (m.cycle % 300 === 0 && (!Array.isArray(m.fieldUpgrades) || m.fieldUpgrades.length === 0)) {
                    safeRebuildField();
                }
            }
        });
    }

    console.log('%c🛠️ Field recovery fixes loaded (F8 quick restore)', 'color:#7bdff2;font-weight:bold;');
})();
