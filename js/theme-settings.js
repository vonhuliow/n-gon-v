// Theme Settings - adds theme selector to settings and applies runtime theme styles
(function () {
    if (window.themeSettingsLoaded) return;
    window.themeSettingsLoaded = true;

    const THEMES = {
        classic: {
            name: 'Classic',
            css: '--theme-bg:#000000;--theme-panel:#101828;--theme-accent:#7cc6fe;--theme-text:#d9f0ff;--theme-canvas-filter:none;'
        },
        dark: {
            name: 'Dark',
            css: '--theme-bg:#06080f;--theme-panel:#0e1422;--theme-accent:#8d99ae;--theme-text:#dce3ef;--theme-canvas-filter:saturate(0.95) brightness(0.88);'
        },
        bloody: {
            name: 'Bloody',
            css: '--theme-bg:#130406;--theme-panel:#2b0a0f;--theme-accent:#ff4d6d;--theme-text:#ffd6dc;--theme-canvas-filter:saturate(1.15) contrast(1.08) hue-rotate(-8deg);'
        },
        neon: {
            name: 'Neon',
            css: '--theme-bg:#040414;--theme-panel:#0a1230;--theme-accent:#00f5d4;--theme-text:#d9fffb;--theme-canvas-filter:saturate(1.22) brightness(1.03);'
        }
    };

    const applyTheme = (id) => {
        const key = THEMES[id] ? id : 'classic';
        document.documentElement.style.cssText += THEMES[key].css;
        document.body.dataset.theme = key;
        try { localStorage.setItem('ngon_theme', key); } catch (_) {}
    };

    const installStyle = () => {
        if (document.getElementById('theme-settings-style')) return;
        const style = document.createElement('style');
        style.id = 'theme-settings-style';
        style.textContent = `
            :root { --theme-bg:#000; --theme-panel:#101828; --theme-accent:#7cc6fe; --theme-text:#d9f0ff; --theme-canvas-filter:none; }
            body { background: var(--theme-bg) !important; color: var(--theme-text); }
            #canvas { filter: var(--theme-canvas-filter); }
            #info details > summary, #info, #text-log, #right-HUD, #right-HUD-constraint { color: var(--theme-text); }
            #pause-grid-left, #pause-grid-right, #choose-grid, #experiment-grid { border-color: var(--theme-accent); }
            #settings-theme-row label { color: var(--theme-text); }
            #settings-theme-select { background: var(--theme-panel); color: var(--theme-text); border:1px solid var(--theme-accent); border-radius:4px; }
        `;
        document.head.appendChild(style);
    };

    const installSettingsControl = () => {
        if (document.getElementById('settings-theme-row')) return;
        const details = document.getElementById('settings-details');
        const host = details?.querySelector('.details-div');
        if (!host) return;

        const wrap = document.createElement('div');
        wrap.id = 'settings-theme-row';
        wrap.style.cssText = 'margin-top:8px;margin-bottom:8px;';

        const label = document.createElement('label');
        label.setAttribute('for', 'settings-theme-select');
        label.textContent = 'theme:';
        label.style.marginRight = '8px';

        const select = document.createElement('select');
        select.id = 'settings-theme-select';
        for (const [id, meta] of Object.entries(THEMES)) {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = meta.name;
            select.appendChild(option);
        }

        select.addEventListener('change', () => applyTheme(select.value));

        wrap.appendChild(label);
        wrap.appendChild(select);
        host.appendChild(wrap);

        let saved = 'classic';
        try { saved = localStorage.getItem('ngon_theme') || 'classic'; } catch (_) {}
        select.value = THEMES[saved] ? saved : 'classic';
        applyTheme(select.value);
    };

    const boot = () => {
        installStyle();
        installSettingsControl();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
