import LaneManager from './road/LaneManager';
import Road from './road/Road';
import Player from './car/Player';
import EnemyManager from './car/EnemyManager';
import { CollisionManager } from './collision/CollisionManager';
import { GameState, type GameStats } from '../types';
import { DifficultyManager } from './difficulty/DifficultyManager';
import ObstacleManager from './obstacle/ObstacleManager';

interface RoadFighterCallbacks {
    onGameOver: (stats: GameStats) => void;
}

export class RoadFighterEngine {
    private readonly canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;

    private static readonly WORLD_SPEED = 500;

    private width = 0;
    private height = 0;

    private readonly road = new Road();
    private readonly lanes = new LaneManager();

    private readonly player = new Player(this.lanes);
    private readonly enemyManager = new EnemyManager(this.lanes, this.road);
    private readonly difficulty = new DifficultyManager();
    private obstacleManager = new ObstacleManager(this.lanes, this.road);

    private state = GameState.Playing;
    private startTime = performance.now();
    private endTime = 0;

    private elapsedTime = 0;

    constructor(
        canvas: HTMLCanvasElement,
        private readonly callbacks: RoadFighterCallbacks,
    ) {
        this.canvas = canvas;
        const context = canvas.getContext('2d');

        if (!context) {
            throw new Error('Road Fighter requires a 2D canvas context.');
        }

        this.context = context;
    }

    resize(width: number, height: number, pixelRatio: number) {
        this.width = width;
        this.height = height;
        this.canvas.width = Math.round(width * pixelRatio);
        this.canvas.height = Math.round(height * pixelRatio);
        this.context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        this.road.resize(width, height);

        this.lanes.resize(this.road.getRoadLeft(), this.road.getRoadWidth());
        this.player.resize(height);
    }

    update(deltaSeconds: number) {
        if (this.state !== GameState.Playing) {
            return;
        }
        this.elapsedTime += deltaSeconds;
        this.difficulty.update(this.elapsedTime);

        const level = this.difficulty.getCurrent();
        const speed = RoadFighterEngine.WORLD_SPEED * level.speedMultiplier;

        this.road.update(deltaSeconds, speed);
        this.player.update(deltaSeconds);
        this.enemyManager.update(deltaSeconds, speed, level);
        this.obstacleManager.update(deltaSeconds, speed, level);
        this.checkCollision();
        this.checkObstacleCollision();
    }

    moveLeft() {
        this.player.moveLeft();
    }

    moveRight() {
        this.player.moveRight();
    }

    render() {
        if (!this.width || !this.height) {
            return;
        }

        const context = this.context;

        context.clearRect(0, 0, this.width, this.height);

        this.drawBackground();
        this.drawRoad();
        this.drawLaneMarkers();
        this.enemyManager.render(context);
        this.obstacleManager.render(context);
        this.drawPlayerCar();

        if (this.state === GameState.GameOver) {
            this.drawGameOver();
        }
    }

    reset() {
        this.enemyManager.reset();
        this.state = GameState.Playing;
        this.startTime = performance.now();
        this.endTime = 0;
    }

    getStats(): GameStats {
        return {
            score: this.enemyManager.getScore(),
            elapsedTime: Math.floor((this.endTime - this.startTime) / 1000),
        };
    }

    private drawBackground() {
        this.context.fillStyle = '#1c5c2d';

        this.context.fillRect(0, 0, this.width, this.height);
    }

    private drawLaneMarkers() {
        const ctx = this.context;

        ctx.fillStyle = '#f8f4d4';

        for (let lane = 1; lane < this.lanes.getLaneCount(); lane++) {
            const x = this.lanes.getCenter(lane) - this.lanes.getLaneWidth() / 2 - 4;

            for (
                let y = -this.road.getLaneDashPeriod() + this.road.getRoadOffset();
                y < this.height;
                y += this.road.getLaneDashPeriod()
            ) {
                ctx.fillRect(x, y, 8, this.road.getLaneDashHeight());
            }
        }
    }

    private drawPlayerCar() {
        const context = this.context;
        this.player.render(context);
    }

    private drawRoad() {
        const ctx = this.context;

        ctx.fillStyle = '#e8d8a1';

        ctx.fillRect(
            this.road.getRoadLeft() - this.road.getShoulderWidth(),
            0,
            this.road.getRoadWidth() + this.road.getShoulderWidth() * 2,
            this.height,
        );

        ctx.fillStyle = '#32343b';

        ctx.fillRect(this.road.getRoadLeft(), 0, this.road.getRoadWidth(), this.height);
    }

    private checkCollision() {
        const playerBounds = this.player.getBounds();

        for (const enemy of this.enemyManager.getEnemies()) {
            if (CollisionManager.isColliding(playerBounds, enemy.getBounds())) {
                this.gameOver();
            }
        }
    }

    private checkObstacleCollision() {
        const playerBounds = this.player.getBounds();

        for (const obstacle of this.obstacleManager.getObstacles()) {
            if (obstacle.triggered) {
                continue;
            }

            if (CollisionManager.isColliding(playerBounds, obstacle.getBounds())) {
                obstacle.triggered = true;

                this.player.randomLaneShift();
            }
        }
    }

    private gameOver() {
        if (this.state === GameState.GameOver) {
            return;
        }

        this.state = GameState.GameOver;
        this.endTime = performance.now();
    }

    private drawGameOver() {
        this.callbacks.onGameOver({
            score: this.enemyManager.getScore(),
            elapsedTime: Math.floor((this.endTime - this.startTime) / 1000),
        });
    }
}
