// Training Mode NPC Assistant System
if (typeof window.trainingNPC === 'undefined') {
    window.trainingNPC = {
        npc: {
            name: 'Sensei',
            icon: '👨‍🏫',
            dialogue: [
                'Welcome to Training Mode!',
                'Learn the basics of combat here!',
                'Practice your movement techs!',
                'Master weapon switching!',
                'Test new abilities safely!'
            ],
            currentDialogue: 0,
            position: { x: 200, y: 300 }
        },
        
        isActive: false,
        currentLesson: 0,
        
        lessons: [
            {
                name: 'Basic Movement',
                desc: 'Learn WASD controls and jumping',
                hints: ['Use W to jump', 'Use A/D to move left/right', 'Press S to crouch'],
                objectives: ['Jump 5 times', 'Move 500 pixels', 'Crouch and stand']
            },
            {
                name: 'Weapon Usage',
                desc: 'Master firing and weapon switching',
                hints: ['Click to fire', 'Use number keys to switch weapons', 'Watch ammo count'],
                objectives: ['Fire 20 shots', 'Switch to 3 weapons', 'Reload weapon']
            },
            {
                name: 'Field Abilities',
                desc: 'Learn field powers',
                hints: ['Press SPACE to activate field', 'Manage energy meter', 'Different fields have different uses'],
                objectives: ['Activate field 5 times', 'Reach max energy', 'Try 3 field types']
            },
            {
                name: 'Potions & Items',
                desc: 'Use inventory and potions',
                hints: ['Press I for inventory', 'Click potions to use', 'Watch your health bar'],
                objectives: ['Use 3 potions', 'Equip an item', 'Switch between 2 items']
            },
            {
                name: 'Superhero Abilities',
                desc: 'Unlock and use hero powers',
                hints: ['Activate abilities with cooldowns', 'Super Strength = mega damage', 'Speed Force = zoom around'],
                objectives: ['Activate 3 abilities', 'Use Speed Force', 'Combine with weapons']
            }
        ],
        
        trainingDummies: [],
        
        spawnDummy(x, y, health = 1) {
            const dummy = {
                position: { x, y },
                health: health,
                maxHealth: health,
                radius: 20,
                isTrainingDummy: true,
                damageDealt: 0,
                timesHit: 0,
                draw() {
                    ctx.fillStyle = '#ff6b6b';
                    ctx.beginPath();
                    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#fff';
                    ctx.font = '12px Arial';
                    ctx.fillText(`HP: ${Math.max(0, this.health)}`, this.position.x - 20, this.position.y + 30);
                }
            };
            this.trainingDummies.push(dummy);
            return dummy;
        },
        
        cleanupDummies() {
            this.trainingDummies = this.trainingDummies.filter(d => d.health > 0);
        },
        
        drawNPC(ctx) {
            if (!this.isActive) return;
            
            ctx.fillStyle = '#FFD700';
            ctx.font = '40px Arial';
            ctx.fillText(this.npc.icon, this.npc.position.x - 20, this.npc.position.y);
            
            ctx.fillStyle = '#fff';
            ctx.font = '14px Arial';
            ctx.fillText(this.npc.name, this.npc.position.x - 30, this.npc.position.y - 50);
            
            // Draw dialogue bubble
            const dialogue = this.npc.dialogue[this.npc.currentDialogue % this.npc.dialogue.length];
            ctx.fillStyle = 'rgba(0,0,0,0.8)';
            ctx.fillRect(this.npc.position.x - 80, this.npc.position.y - 80, 180, 40);
            ctx.fillStyle = '#fff';
            ctx.font = '12px Arial';
            ctx.fillText(dialogue, this.npc.position.x - 75, this.npc.position.y - 65);
            
            // Draw lesson info
            if (this.currentLesson < this.lessons.length) {
                const lesson = this.lessons[this.currentLesson];
                ctx.fillStyle = 'rgba(0,0,0,0.9)';
                ctx.fillRect(10, 10, 300, 100);
                ctx.fillStyle = '#0f0';
                ctx.font = 'bold 14px Arial';
                ctx.fillText(`Lesson ${this.currentLesson + 1}: ${lesson.name}`, 20, 30);
                ctx.fillStyle = '#aaa';
                ctx.font = '12px Arial';
                ctx.fillText(lesson.desc, 20, 50);
                lesson.hints.forEach((hint, i) => {
                    ctx.fillText(`• ${hint}`, 20, 65 + i * 15);
                });
            }
        },
        
        nextLesson() {
            this.currentLesson = Math.min(this.currentLesson + 1, this.lessons.length - 1);
            this.npc.currentDialogue++;
            console.log(`📚 Advanced to lesson: ${this.lessons[this.currentLesson].name}`);
        },
        
        activate() {
            this.isActive = true;
            this.spawnDummy(500, 300, 5);
            this.spawnDummy(700, 300, 3);
            console.log('%c👨‍🏫 Training Mode NPC Activated! Learn with Sensei!', 'color: #FFD700; font-weight: bold;');
        },
        
        deactivate() {
            this.isActive = false;
            this.trainingDummies = [];
        },
        
        init() {
            console.log('%c👨‍🏫 Training NPC System Loaded!', 'color: #FFD700; font-weight: bold;');
        }
    };
    
    window.trainingNPC.init();
}
