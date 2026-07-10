import LaneManager from '../road/LaneManager';
import Road from '../road/Road';
import { CarDimensions } from './CarDimensions';
import { CarRenderer } from './CarRenderer';
import { BLUE_CAR } from './constant';

interface IEnemy {
    lane: number;
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
}

class Enemy {
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
        const width = CarDimensions.getWidth(this.road.getRoadWidth());
        const height = CarDimensions.getHeight(width);

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

    private drawEnemy(context: CanvasRenderingContext2D, enemy: IEnemy) {
        CarRenderer.render(context, {
            x: enemy.x,
            y: enemy.y,
            width: enemy.width,
            height: enemy.height,
            theme: BLUE_CAR,
        });
    }
}

export default Enemy;
