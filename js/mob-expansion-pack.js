// Mob Expansion Pack - additional 2D styled mobs using existing game runtime
(function () {
    if (window.mobExpansionPackLoaded) return;
    window.mobExpansionPackLoaded = true;

    const state = {
        spawned: 0,
        maxAlive: 10,
    };

    const aliveCustomCount = () => mob.filter(mb => mb?.alive && mb.isExpansionMob).length;

    const styleDrawPolygon = (me, bodyColor, eyeColor = '#fff') => {
        ctx.beginPath();
        ctx.moveTo(me.vertices[0].x, me.vertices[0].y);
        for (let i = 1; i < me.vertices.length; i++) ctx.lineTo(me.vertices[i].x, me.vertices[i].y);
        ctx.closePath();
        ctx.fillStyle = bodyColor;
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        const eyeDist = me.radius * 0.35;
        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.arc(me.position.x - eyeDist * 0.35, me.position.y - eyeDist * 0.1, Math.max(2, me.radius * 0.14), 0, Math.PI * 2);
        ctx.arc(me.position.x + eyeDist * 0.35, me.position.y - eyeDist * 0.1, Math.max(2, me.radius * 0.14), 0, Math.PI * 2);
        ctx.fill();
    };

    const defineBehavior = (me, type) => {
        me.isExpansionMob = true;
        me.expansionType = type;
        me.accelMag *= 1.18;
        me.delay = Math.max(35, me.delay - 10);
        me.health *= 1.22;

        if (type === 'gore-crawler') {
            me.do = function () {
                this.checkStatus();
                const dir = Vector.normalise(Vector.sub(player.position, this.position));
                this.force.x += dir.x * this.accelMag * 1.3;
                this.force.y += dir.y * this.accelMag * 1.1;
                if (simulation.cycle > this.cd && this.distanceToPlayer() < 130) {
                    this.cd = simulation.cycle + this.delay;
                    b.explosion({ x: this.position.x, y: this.position.y }, 10);
                }
                styleDrawPolygon(this, '#8d0801', '#ffd6d6');
                this.healthBar1();
            };
        } else if (type === 'void-orbiter') {
            me.frictionAir = 0.02;
            me.do = function () {
                this.checkStatus();
                const offset = simulation.cycle * 0.03 + this.index;
                const target = {
                    x: player.position.x + Math.cos(offset) * 120,
                    y: player.position.y + Math.sin(offset) * 85,
                };
                const dir = Vector.normalise(Vector.sub(target, this.position));
                this.force.x += dir.x * this.accelMag * 1.4;
                this.force.y += dir.y * this.accelMag * 1.4;
                if (simulation.cycle % 80 === 0) b.explosion(this.position, 12);
                styleDrawPolygon(this, '#3a0ca3', '#90e0ef');
                this.healthBar2();
            };
        } else if (type === 'bone-wasp') {
            me.accelMag *= 1.45;
            me.do = function () {
                this.checkStatus();
                const dir = Vector.normalise(Vector.sub(player.position, this.position));
                this.force.x += dir.x * this.accelMag * 1.8;
                this.force.y += dir.y * this.accelMag * 1.8;
                if (simulation.cycle > this.cd && this.distanceToPlayer() < 240) {
                    this.cd = simulation.cycle + this.delay;
                    b.explosion({ x: this.position.x + dir.x * 12, y: this.position.y + dir.y * 12 }, 9);
                }
                styleDrawPolygon(this, '#d9d9d9', '#111');
                ctx.strokeStyle = '#fca311';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(this.position.x - this.radius * 1.2, this.position.y);
                ctx.lineTo(this.position.x - this.radius * 2.1, this.position.y - this.radius * 0.6);
                ctx.moveTo(this.position.x + this.radius * 1.2, this.position.y);
                ctx.lineTo(this.position.x + this.radius * 2.1, this.position.y - this.radius * 0.6);
                ctx.stroke();
                this.healthBar3();
            };
        } else {
            me.frictionAir = 0.01;
            me.health *= 1.6;
            me.do = function () {
                this.checkStatus();
                const dir = Vector.normalise(Vector.sub(player.position, this.position));
                this.force.x += dir.x * this.accelMag * 0.85;
                this.force.y += dir.y * this.accelMag * 0.85;
                if (simulation.cycle > this.cd && this.distanceToPlayer() < 180) {
                    this.cd = simulation.cycle + this.delay + 25;
                    b.explosion(this.position, 18);
                }
                styleDrawPolygon(this, '#495057', '#f8f9fa');
                ctx.strokeStyle = '#ced4da';
                ctx.lineWidth = 3;
                ctx.strokeRect(this.position.x - this.radius * 0.7, this.position.y - this.radius * 0.7, this.radius * 1.4, this.radius * 1.4);
                this.healthBar4();
            };
        }
    };

    const spawnExpansionMob = (x, y, type) => {
        if (typeof mobs?.spawn !== 'function') return;
        const shape = type === 'bone-wasp' ? 3 : type === 'void-orbiter' ? 9 : type === 'iron-brute' ? 4 : 6;
        const radius = type === 'iron-brute' ? 30 : type === 'bone-wasp' ? 20 : type === 'void-orbiter' ? 22 : 24;
        const color = type === 'gore-crawler' ? '#8d0801' : type === 'void-orbiter' ? '#3a0ca3' : type === 'bone-wasp' ? '#d9d9d9' : '#495057';
        mobs.spawn(x, y, shape, radius, color);
        const me = mob[mob.length - 1];
        if (!me) return;
        defineBehavior(me, type);
        state.spawned += 1;
    };

    const trySpawnWave = () => {
        if (!m?.alive) return;
        if (aliveCustomCount() >= state.maxAlive) return;
        const pool = ['gore-crawler', 'void-orbiter', 'bone-wasp', 'iron-brute'];
        const toSpawn = Math.min(2, state.maxAlive - aliveCustomCount());
        for (let i = 0; i < toSpawn; i++) {
            const t = pool[Math.floor(Math.random() * pool.length)];
            const x = player.position.x + (Math.random() - 0.5) * 900;
            const y = player.position.y - 180 - Math.random() * 320;
            spawnExpansionMob(x, y, t);
        }
    };

    const installSpawner = () => {
        if (!Array.isArray(simulation?.ephemera)) return;
        if (simulation.ephemera.find(e => e.name === 'mob-expansion-pack-loop')) return;
        simulation.ephemera.push({
            name: 'mob-expansion-pack-loop',
            do() {
                if (simulation.cycle % 720 === 0) trySpawnWave();
            }
        });
    };

    const boot = () => {
        installSpawner();
        console.log('%c☠️ Mob Expansion Pack Loaded', 'color:#ff8fa3;font-weight:bold;');
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 900));
    } else {
        setTimeout(boot, 900);
    }
})();
