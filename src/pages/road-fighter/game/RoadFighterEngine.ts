import LaneManager from './road/LaneManager';
import Road from './road/Road';
import Player from './car/Player';
import EnemyManager from './car/EnemyManager';
import { CollisionManager } from './collision/CollisionManager';
import { GameState } from '../constant';

export class RoadFighterEngine {
    private readonly canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;

    private width = 0;
    private height = 0;

    private readonly road = new Road();
    private readonly lanes = new LaneManager();

    private readonly player = new Player(this.lanes, this.road);
    private readonly enemyManager = new EnemyManager(this.lanes, this.road);

    private state = GameState.Playing;
    private startTime = performance.now();
    private endTime = 0;

    constructor(canvas: HTMLCanvasElement) {
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
        this.player.resize(this.road.getRoadWidth(), height);
    }

    update(deltaSeconds: number) {
        if (this.state !== GameState.Playing) {
            return;
        }
        // const roadSpeed = this.height * 0.72;
        this.road.update(deltaSeconds);
        this.player.update(deltaSeconds);
        this.enemyManager.update(deltaSeconds);
        this.checkCollision();
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

    private gameOver() {
        if (this.state === GameState.GameOver) {
            return;
        }

        this.state = GameState.GameOver;
        this.endTime = performance.now();
    }

    private drawGameOver() {
        const ctx = this.context;

        ctx.save();

        ctx.fillStyle = 'rgba(0,0,0,0.75)';
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.fillStyle = '#fff';

        ctx.textAlign = 'center';

        ctx.font = 'bold 64px Arial';

        ctx.fillText('GAME OVER', this.width / 2, this.height / 2 - 120);

        ctx.font = '36px Arial';

        ctx.fillText(
            `Score: ${this.enemyManager.getScore()}`,
            this.width / 2,
            this.height / 2 - 30,
        );

        const seconds = Math.floor((this.endTime - this.startTime) / 1000);

        ctx.fillText(`Time: ${seconds}s`, this.width / 2, this.height / 2 + 30);

        ctx.fillText('Press ENTER to Restart', this.width / 2, this.height / 2 + 120);

        ctx.restore();
    }
}
