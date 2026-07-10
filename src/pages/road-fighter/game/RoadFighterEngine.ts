import { EnemyManager } from './enemy';
import Player from './player';

export class RoadFighterEngine {
    private readonly canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;
    private height = 0;
    private player = new Player(() => this.getLaneCenters());
    private roadOffset = 0;
    private width = 0;
    private enemyManager!: EnemyManager;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const context = canvas.getContext('2d');

        if (!context) {
            throw new Error('Road Fighter requires a 2D canvas context.');
        }

        this.context = context;

        this.enemyManager = new EnemyManager(
            (lane) => this.getLaneCenter(lane),
            () => this.getRoadWidth(),
            () => this.height,
        );
    }

    resize(width: number, height: number, pixelRatio: number) {
        this.width = width;
        this.height = height;
        this.canvas.width = Math.round(width * pixelRatio);
        this.canvas.height = Math.round(height * pixelRatio);
        this.context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        const roadWidth = this.getRoadWidth();
        this.player.resize(roadWidth, height);
    }

    update(deltaSeconds: number) {
        const roadSpeed = this.height * 0.72;
        this.roadOffset = (this.roadOffset + roadSpeed * deltaSeconds) % this.getLaneDashPeriod();
        this.player.update(deltaSeconds);
        this.enemyManager.update(deltaSeconds);
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
        const roadWidth = this.getRoadWidth();
        const roadLeft = (this.width - roadWidth) / 2;

        context.clearRect(0, 0, this.width, this.height);
        context.fillStyle = '#1c5c2d';
        context.fillRect(0, 0, this.width, this.height);

        this.drawRoad(roadLeft, roadWidth);
        this.drawLaneMarkers(roadLeft, roadWidth);
        this.enemyManager.render(context);
        this.drawPlayerCar();
    }

    private drawLaneMarkers(roadLeft: number, roadWidth: number) {
        const context = this.context;
        const laneWidth = roadWidth / 3;
        const dashHeight = this.getLaneDashHeight();
        const dashPeriod = this.getLaneDashPeriod();

        context.fillStyle = '#f8f4d4';

        for (let lane = 1; lane < 3; lane += 1) {
            const x = roadLeft + laneWidth * lane - 4;

            for (let y = -dashPeriod + this.roadOffset; y < this.height; y += dashPeriod) {
                context.fillRect(x, y, 8, dashHeight);
            }
        }
    }

    private drawPlayerCar() {
        const context = this.context;
        this.player.render(context);
    }

    private drawRoad(roadLeft: number, roadWidth: number) {
        const context = this.context;
        const shoulderWidth = Math.max(16, roadWidth * 0.045);

        context.fillStyle = '#e8d8a1';
        context.fillRect(roadLeft - shoulderWidth, 0, roadWidth + shoulderWidth * 2, this.height);
        context.fillStyle = '#32343b';
        context.fillRect(roadLeft, 0, roadWidth, this.height);
    }

    private getLaneDashHeight() {
        return Math.max(24, this.height * 0.07);
    }

    private getLaneDashPeriod() {
        return this.getLaneDashHeight() * 1.8;
    }

    private getRoadWidth() {
        return Math.min(this.width * 0.68, this.height * 1.1);
    }

    private getLaneCenter(lane: number) {
        const roadWidth = this.getRoadWidth();
        const roadLeft = (this.width - roadWidth) / 2;

        const laneWidth = roadWidth / 3;

        return roadLeft + laneWidth * lane + laneWidth / 2;
    }

    private getLaneCenters() {
        const roadWidth = this.getRoadWidth();
        const roadLeft = (this.width - roadWidth) / 2;
        const laneWidth = roadWidth / 3;

        return [roadLeft + laneWidth * 0.5, roadLeft + laneWidth * 1.5, roadLeft + laneWidth * 2.5];
    }
}
