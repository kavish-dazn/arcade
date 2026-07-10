import type { Enemy } from './type';

export class EnemyManager {
    private enemies: Enemy[] = [];

    private spawnTimer = 0;

    constructor(
        private readonly getLaneCenter: (lane: number) => number,
        private readonly getRoadWidth: () => number,
        private readonly getCanvasHeight: () => number,
    ) {}

    update(delta: number) {
        this.spawnTimer += delta;

        if (this.spawnTimer >= 1.5) {
            this.spawnEnemy();
            this.spawnTimer = 0;
        }

        for (const enemy of this.enemies) {
            enemy.y += enemy.speed * delta;
        }

        this.enemies = this.enemies.filter(
            enemy => enemy.y < this.getCanvasHeight() + enemy.height,
        );
    }

    render(ctx: CanvasRenderingContext2D) {
        for (const enemy of this.enemies) {
            this.drawEnemy(ctx, enemy);
        }
    }

    getEnemies() {
        return this.enemies;
    }

    private spawnEnemy() {
        const roadWidth = this.getRoadWidth();

        const width = roadWidth * 0.16;
        const height = width * 1.55;

        const lane = Math.floor(Math.random() * 3);

        this.enemies.push({
            lane,
            x: this.getLaneCenter(lane) - width / 2,
            y: -height,

            width,
            height,

            speed: 500,
        });
    }

    private drawEnemy(
        ctx: CanvasRenderingContext2D,
        enemy: Enemy,
    ) {
        ctx.save();

        ctx.translate(enemy.x, enemy.y);

        ctx.fillStyle = "#2b7fff";

        ctx.fillRect(
            0,
            0,
            enemy.width,
            enemy.height,
        );

        ctx.restore();
    }
}
