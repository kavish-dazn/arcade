import type { LaneManager } from '../road/LaneManager';
import type { Road } from '../road/Road';

interface IEnemy {
    lane: number;
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
}

export class EnemyManager {
    private enemies: IEnemy[] = [];

    private spawnTimer = 0;

    constructor(
        private readonly lanes: LaneManager,
        private readonly road: Road,
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
            (enemy) => enemy.y < this.road.getHeight() + enemy.height,
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
        const roadWidth = this.road.getRoadWidth();

        const width = roadWidth * 0.16;
        const height = width * 1.55;

        const lane = Math.floor(Math.random() * 3);

        this.enemies.push({
            lane,
            x: this.lanes.getCenter(lane) - width / 2,
            y: -height,
            width,
            height,
            speed: 500,
        });
    }

    private drawEnemy(ctx: CanvasRenderingContext2D, enemy: IEnemy) {
        ctx.save();

        ctx.translate(enemy.x, enemy.y);

        ctx.fillStyle = '#2b7fff';

        ctx.fillRect(0, 0, enemy.width, enemy.height);

        ctx.restore();
    }
}
