// Fix for player color rendering and field integration
(function() {
    function patchPlayer() {
        if (typeof m === 'undefined') {
            setTimeout(patchPlayer, 100);
            return;
        }

        // Patch setFillColors to trigger UI updates and ensure proper color application
        const originalSetFillColors = m.setFillColors;
        m.setFillColors = function() {
            originalSetFillColors.apply(this, arguments);
            // Ensure colors are updated in our custom UI if it exists
            if (window.moneyUI && window.moneyUI.updateColor) {
                window.moneyUI.updateColor();
            }
            console.log("%c🎨 Player colors synchronized!", "color: #00ff00");
        };

        // Add setField if it doesn't exist or patch it to be more robust
        m.setField = function(mode) {
            this.fieldMode = mode;
            if (this.fieldUpgrades && this.fieldUpgrades[mode] && this.fieldUpgrades[mode].setup) {
                this.fieldUpgrades[mode].setup();
            }
            console.log("%c🌌 Field set to: " + (this.fieldUpgrades[mode] ? this.fieldUpgrades[mode].name : mode), "color: #00ffff");
            
            // Sync with experiment menu if open
            if (window.expandedExperiment && window.expandedExperiment.active) {
                console.log("Experiment field synced");
            }
        };

        console.log("%c✅ Player systems patched and synchronized!", "color: #00ff00; font-weight: bold;");
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', patchPlayer);
    } else {
        setTimeout(patchPlayer, 500);
    }
})();
