// Download Center - quick access to downloadable mod JS files
(function () {
    if (window.downloadCenterLoaded) return;
    window.downloadCenterLoaded = true;

    const files = [
        'js/big-arsenal-update.js',
        'js/ai-arsenal-protocol.js',
        'js/arsenal-weapons.js',
        'js/arsenal-bot-techs.js',
        'js/hacker-overhaul.js',
        'js/killforge-weapons.js',
        'js/playtest-mega-update.js',
        'js/scythe-remix-pack.js',
        'js/wave-guitar-pack.js',
        'js/theme-settings.js',
        'js/mob-expansion-pack.js',
        'js/horror-tech.js',
        'js/bullet-runtime-fix.js',
        'js/dark-tech-pack.js',
        'js/fix-fields-reenable.js',
        'js/new-weapons.js',
        'js/unlock-codes.js',
        'js/potions.js',
        'js/inventory.js',
        'js/marketplace.js'
    ];

    const render = () => {
        if (document.getElementById('download-center-root')) return;

        const root = document.createElement('div');
        root.id = 'download-center-root';
        root.style.cssText = 'position:fixed;right:14px;bottom:14px;z-index:3500;font-family:Arial,sans-serif;';

        const btn = document.createElement('button');
        btn.textContent = '⬇ JS Downloads';
        btn.style.cssText = 'background:#1f6feb;color:#fff;border:none;padding:9px 12px;border-radius:8px;cursor:pointer;font-weight:bold;';

        const panel = document.createElement('div');
        panel.style.cssText = 'display:none;position:absolute;right:0;bottom:44px;width:330px;max-height:420px;overflow:auto;background:#0b1220;border:1px solid #2e5ea7;border-radius:10px;padding:10px;box-shadow:0 0 18px rgba(0,0,0,.45);';

        const title = document.createElement('div');
        title.textContent = 'Download mod files (.js)';
        title.style.cssText = 'color:#dff2ff;font-size:13px;font-weight:bold;margin-bottom:8px;';
        panel.appendChild(title);

        files.forEach((path) => {
            const row = document.createElement('div');
            row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid rgba(255,255,255,.08);';

            const name = document.createElement('span');
            name.textContent = path.replace('js/', '');
            name.style.cssText = 'color:#c5defb;font-size:12px;';

            const a = document.createElement('a');
            a.href = path;
            a.download = path.split('/').pop();
            a.textContent = 'Download';
            a.style.cssText = 'color:#7ee787;font-size:12px;text-decoration:none;border:1px solid #2ea043;padding:3px 7px;border-radius:6px;';

            row.appendChild(name);
            row.appendChild(a);
            panel.appendChild(row);
        });

        const tip = document.createElement('div');
        tip.textContent = 'Tip: big-arsenal-update.js is the single-file bundle.';
        tip.style.cssText = 'margin-top:8px;color:#8fb5db;font-size:11px;';
        panel.appendChild(tip);

        btn.addEventListener('click', () => {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });

        root.appendChild(btn);
        root.appendChild(panel);
        document.body.appendChild(root);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', render);
    } else {
        render();
    }
})();
