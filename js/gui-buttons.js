// GUI Buttons - Inventory, Customization, Marketplace buttons
if (typeof window.guiButtons === 'undefined') {
    window.guiButtons = {
        
        createButtons() {
            const container = document.createElement('div');
            container.id = 'gui-buttons-container';
            container.style.cssText = `
                position: fixed;
                top: 10px;
                left: 10px;
                z-index: 1000;
                display: flex;
                flex-direction: column;
                gap: 4px;
            `;
            
            const buttons = [
                { id: 'inv-btn', icon: '🎒', label: 'Inventory', onClick: () => window.inventory?.toggle() },
                { id: 'exp-btn', icon: '🔬', label: 'Experiment', onClick: () => window.expandedExperiment?.toggle() || openExperimentMenu() },
                { id: 'custom-btn', icon: '🎨', label: 'Customize', onClick: () => window.customization?.toggle() },
                { id: 'market-btn', icon: '🏪', label: 'Market (M)', onClick: () => window.marketplace?.toggle() },
                { id: 'forge-btn', icon: '🔨', label: 'Forge', onClick: () => window.forging?.toggle() },
            ];
            
            buttons.forEach(btn => {
                const button = document.createElement('button');
                button.id = btn.id;
                button.onclick = btn.onClick;
                button.style.cssText = `
                    background: linear-gradient(135deg, rgba(0,0,0,0.85), rgba(40,40,60,0.85));
                    border: 1px solid #6c5ce7;
                    border-radius: 6px;
                    padding: 6px 10px;
                    color: white;
                    font-family: Arial, sans-serif;
                    font-size: 11px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 8px rgba(108, 92, 231, 0.3);
                `;
                button.innerHTML = `<span style="font-size: 13px;">${btn.icon}</span> ${btn.label}`;
                
                button.onmouseover = () => {
                    button.style.transform = 'scale(1.05)';
                    button.style.borderColor = '#a29bfe';
                    button.style.boxShadow = '0 6px 20px rgba(108, 92, 231, 0.5)';
                };
                button.onmouseout = () => {
                    button.style.transform = 'scale(1)';
                    button.style.borderColor = '#6c5ce7';
                    button.style.boxShadow = '0 4px 15px rgba(108, 92, 231, 0.3)';
                };
                
                container.appendChild(button);
            });
            
            document.body.appendChild(container);
        },
        
        init() {
            if (!document.getElementById('gui-buttons-container')) {
                this.createButtons();
            }
            console.log('%c🎮 GUI Buttons Created!', 'color: #6c5ce7; font-weight: bold;');
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.guiButtons.init());
    } else {
        window.guiButtons.init();
    }
}
