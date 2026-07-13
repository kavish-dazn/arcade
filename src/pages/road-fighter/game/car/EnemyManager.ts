import type { DifficultyLevel } from '@pages/road-fighter/types';

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

    update(delta: number, speed: number, difficultyLevel: DifficultyLevel) {
        this.spawnTimer += delta;

        if (this.spawnTimer >= difficultyLevel.spawnInterval) {
            this.spawnEnemies(speed, difficultyLevel);
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

    private spawnEnemies(speed: number, difficulty: DifficultyLevel) {
        const count = this.randomBetween(difficulty.minCars, difficulty.maxCars);

        const availableLanes = [0, 1, 2];

        for (let i = 0; i < count; i++) {
            if (!availableLanes.length) {
                break;
            }

            const laneIndex = Math.floor(Math.random() * availableLanes.length);

            const lane = availableLanes.splice(laneIndex, 1)[0];

            this.spawnEnemy(lane, speed);
        }
    }

    private spawnEnemy(lane: number, speed: number) {
        const width = CarDimensions.getWidth(this.lanes.getLaneWidth());
        const height = CarDimensions.getHeight(width);

        const theme = ENEMY_CAR_THEMES[Math.floor(Math.random() * ENEMY_CAR_THEMES.length)];

        const enemy = new Enemy(
            lane,
            this.lanes.getCenter(lane) - width / 2,
            -height,
            width,
            height,
            speed,
            theme,
        );

        this.enemies.push(enemy);
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

    private randomBetween(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

export default EnemyManager;
