// Movement Techs Control Implementation
if (typeof window.movementControls === 'undefined') {
    window.movementControls = {
        init() {
            console.log('%c🚀 Movement Controls System Initializing...', 'color: #FF00FF; font-weight: bold;');
            this.hook();
        },
        
        hook() {
            if (typeof m === 'undefined') return;
            const origMove = m.move;
            m.move = () => {
                origMove.call(m);
                this.handleMovementTechs();
            };
        },
        
        handleMovementTechs() {
            if (!window.movementTechs) return;
            if (input.shift) {
                if (this.hasTech("Air Dash") && !m.onGround) {
                    this.applyForce(m.angle, 0.5);
                }
                if (this.hasTech("Shadow Step")) {
                    m.pos.x += Math.cos(m.angle) * 5;
                    m.pos.y += Math.sin(m.angle) * 5;
                }
            }
            if (input.up && !m.onGround && this.hasTech("Double Jump")) {
                 if (m.canDoubleJump === undefined) m.canDoubleJump = true;
                 if (m.canDoubleJump && m.Vy > -2) {
                     Matter.Body.setVelocity(player, { x: player.velocity.x, y: -12 });
                     m.canDoubleJump = false;
                 }
            }
            if (m.onGround) m.canDoubleJump = true;
            if (input.space && !m.onGround && this.hasTech("Rocket Boots")) {
                this.applyForce(-Math.PI/2, 0.05);
            }
        },
        
        hasTech(name) {
            const found = tech.tech.find(t => t.name === name.toLowerCase());
            return found && found.count > 0;
        },
        
        applyForce(angle, magnitude) {
            player.force.x += Math.cos(angle) * magnitude;
            player.force.y += Math.sin(angle) * magnitude;
        }
    };
    window.movementControls.init();
}
