import Enemy from './Enemy';
import LaneManager from '../road/LaneManager';
import Road from '../road/Road';
import { CarDimensions } from './CarDimensions';
import { CarRenderer } from './CarRenderer';
import { ENEMY_CAR_THEMES } from '../../constant';

class EnemyManager {
    private enemies: Enemy[] = [];
    private spawnTimer = 0;
    private score = 0;

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
            enemy.update(delta);

            // Enemy has successfully passed the player
            if (!enemy.passed && enemy.y >= this.road.getHeight()) {
                enemy.passed = true;
                this.score += enemy.points;
            }
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

    getScore() {
        return this.score;
    }

    private spawnEnemy() {
        const width = CarDimensions.getWidth(this.road.getRoadWidth());
        const height = CarDimensions.getHeight(width);

        const lane = Math.floor(Math.random() * 3);

        this.enemies.push(
            new Enemy(
                lane,
                this.lanes.getCenter(lane) - width / 2,
                -height,
                width,
                height,
                500,
                ENEMY_CAR_THEMES[Math.floor(Math.random() * ENEMY_CAR_THEMES.length)],
            ),
        );
    }

    private drawEnemy(context: CanvasRenderingContext2D, enemy: Enemy) {
        CarRenderer.render(context, {
            x: enemy.x,
            y: enemy.y,
            width: enemy.width,
            height: enemy.height,
            theme: enemy.theme,
        });
    }

    reset() {
        this.enemies = [];
        this.spawnTimer = 0;
        this.score = 0;
    }
}

export default EnemyManager;
