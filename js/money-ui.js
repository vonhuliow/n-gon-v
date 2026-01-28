// Money UI - Shows persistent currency counter in HTML overlay (works even in menus)
if (typeof window.moneyUI === 'undefined') {
    window.moneyUI = {
        
        createMoneyDisplay() {
            const container = document.createElement('div');
            container.id = 'money-display-container';
            container.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 1000;
                background: linear-gradient(135deg, rgba(0,0,0,0.8), rgba(50,50,50,0.8));
                border: 3px solid #FFD700;
                border-radius: 12px;
                padding: 12px 18px;
                color: #FFD700;
                font-family: Arial, sans-serif;
                font-size: 18px;
                font-weight: bold;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
                box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
                min-width: 150px;
                text-align: center;
            `;
            container.innerHTML = '💰 $ <span id="money-amount">0</span>';
            document.body.appendChild(container);
        },
        
        updateDisplay() {
            if (!window.progression) return;
            const display = document.getElementById('money-amount');
            if(display) {
                display.textContent = window.progression.currency;
            }
        },
        
        init() {
            if (!document.getElementById('money-display-container')) {
                this.createMoneyDisplay();
            }
            // Update every 100ms to catch all changes
            setInterval(() => this.updateDisplay(), 100);
            console.log('%c💵 Money UI Created - Always visible!', 'color: #00FF00; font-size: 14px; font-weight: bold;');
        }
    };
    
    // Initialize when document is ready
    if(document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.moneyUI.init());
    } else {
        window.moneyUI.init();
    }
}
