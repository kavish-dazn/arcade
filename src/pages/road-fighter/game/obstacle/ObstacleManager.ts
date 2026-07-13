import type { DifficultyLevel } from '@pages/road-fighter/types';

import LaneManager from '../road/LaneManager';
import Road from '../road/Road';
import Obstacle from './Obstacle';

class ObstacleManager {
    private obstacles: Obstacle[] = [];
    private spawnTimer = 0;

    constructor(
        private readonly lanes: LaneManager,
        private readonly road: Road,
    ) {}

    update(delta: number, speed: number, level: DifficultyLevel) {
        this.spawnTimer += delta;

        if (this.spawnTimer >= level.obstacleSpawnInterval) {
            this.spawnHole(speed);
            this.spawnTimer = 0;
        }

        for (const obstacle of this.obstacles) {
            obstacle.update(delta);
        }

        this.obstacles = this.obstacles.filter(
            (obstacle) => obstacle.y < this.road.getHeight() + obstacle.height,
        );
    }

    render(ctx: CanvasRenderingContext2D) {
        for (const obstacle of this.obstacles) {
            obstacle.render(ctx);
        }
    }

    getObstacles() {
        return this.obstacles;
    }

    reset() {
        this.obstacles = [];
        this.spawnTimer = 0;
    }

    private spawnHole(speed: number) {
        const lane = Math.floor(Math.random() * this.lanes.getLaneCount());

        const laneWidth = this.lanes.getLaneWidth();

        const width = laneWidth * 0.6;

        const height = width * 0.55;

        this.obstacles.push(
            new Obstacle(
                'hole',
                lane,
                this.lanes.getCenter(lane) - width / 2,
                -height,
                width,
                height,
                speed,
            ),
        );
    }
}

export default ObstacleManager;
