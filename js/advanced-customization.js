// Advanced Robot Customization GUI
(function() {
    const customGUI = {
        active: false,
        init() {
            const btn = document.createElement('div');
            btn.innerHTML = "🤖 CUSTOMIZE";
            btn.style.cssText = "position:fixed; bottom:20px; left:20px; padding:10px; background:#00ffff; color:#000; cursor:pointer; font-weight:bold; border-radius:5px; z-index:10000; font-family:Arial;";
            btn.onclick = () => this.toggle();
            document.body.appendChild(btn);

            this.createMenu();
        },

        createMenu() {
            this.menu = document.createElement('div');
            this.menu.style.cssText = "display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:rgba(0,0,0,0.95); border:2px solid #00ffff; padding:20px; border-radius:15px; z-index:10001; min-width:300px; color:#fff; font-family:Arial;";
            this.menu.innerHTML = `
                <h2 style="margin-top:0; color:#00ffff;">Robot Customizer</h2>
                <div style="margin-bottom:15px;">
                    <label>Main Color:</label><br>
                    <input type="color" id="robot-color" value="#ffffff" style="width:100%; height:40px; cursor:pointer;">
                </div>
                <div style="margin-bottom:15px;">
                    <label>Bot Style:</label><br>
                    <select id="bot-style" style="width:100%; padding:8px; background:#222; color:#fff; border:1px solid #00ffff;">
                        <option value="default">Classic Drone</option>
                        <option value="sleek">Sleek Interceptor</option>
                        <option value="heavy">Heavy Tanker</option>
                        <option value="plasma">Plasma Core</option>
                    </select>
                </div>
                <button id="apply-custom" style="width:100%; padding:10px; background:#00ffff; color:#000; border:none; cursor:pointer; font-weight:bold;">APPLY CHANGES</button>
                <button id="close-custom" style="width:100%; margin-top:10px; padding:8px; background:#444; color:#fff; border:none; cursor:pointer;">CLOSE</button>
            `;
            document.body.appendChild(this.menu);

            document.getElementById('apply-custom').onclick = () => this.apply();
            document.getElementById('close-custom').onclick = () => this.toggle();
        },

        toggle() {
            this.active = !this.active;
            this.menu.style.display = this.active ? 'block' : 'none';
        },

        apply() {
            const color = document.getElementById('robot-color').value;
            const style = document.getElementById('bot-style').value;
            
            // Hex to HSL for the game's engine
            const r = parseInt(color.slice(1, 3), 16) / 255;
            const g = parseInt(color.slice(3, 5), 16) / 255;
            const b_val = parseInt(color.slice(5, 7), 16) / 255;
            const max = Math.max(r, g, b_val), min = Math.min(r, g, b_val);
            let h, s, l = (max + min) / 2;
            if (max == min) { h = s = 0; } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b_val) / d + (g < b_val ? 6 : 0); break;
                    case g: h = (b_val - r) / d + 2; break;
                    case b_val: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }

            if (typeof m !== 'undefined') {
                m.color.hue = h * 360;
                m.color.sat = s * 100;
                m.color.light = l * 100;
                m.setFillColors();
            }

            // Patch bots
            if (typeof b !== 'undefined') {
                b.botStyle = style;
                console.log("Bot style updated to:", style);
            }

            this.toggle();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => customGUI.init());
    } else {
        setTimeout(() => customGUI.init(), 500);
    }
})();
