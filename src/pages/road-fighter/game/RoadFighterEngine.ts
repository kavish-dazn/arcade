import { EnemyManager } from './enemy/EnemyManager';

type Direction = 'left' | 'right';

interface Player {
    height: number;
    width: number;
    x: number;
    y: number;
}

export class RoadFighterEngine {
    private readonly canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;
    private height = 0;
    private moving = { left: false, right: false };
    private player: Player = { height: 0, width: 0, x: 0, y: 0 };
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
    }

    private getLaneCenter(lane: number) {
        const roadWidth = this.getRoadWidth();
        const roadLeft = (this.width - roadWidth) / 2;

        const laneWidth = roadWidth / 3;

        return (
            roadLeft +
            laneWidth * lane +
            laneWidth / 2
        );
    }

    resize(width: number, height: number, pixelRatio: number) {
        this.width = width;
        this.height = height;
        this.canvas.width = Math.round(width * pixelRatio);
        this.canvas.height = Math.round(height * pixelRatio);
        this.context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        const roadWidth = this.getRoadWidth();
        this.player.width = Math.min(roadWidth * 0.16, 110);
        this.player.height = this.player.width * 1.55;
        this.player.y = height - this.player.height - Math.max(28, height * 0.06);
        this.player.x = this.clampPlayerX(this.player.x || width / 2 - this.player.width / 2);

        this.enemyManager = new EnemyManager(
            lane => this.getLaneCenter(lane),
            () => this.getRoadWidth(),
            () => this.height,
        );
    }

    setDirection(direction: Direction, isMoving: boolean) {
        this.moving[direction] = isMoving;
    }

    stopMoving() {
        this.moving.left = false;
        this.moving.right = false;
    }

    update(deltaSeconds: number) {
        const roadSpeed = this.height * 0.72;
        const playerSpeed = this.width * 0.5;
        const direction = Number(this.moving.right) - Number(this.moving.left);

        this.roadOffset = (this.roadOffset + roadSpeed * deltaSeconds) % this.getLaneDashPeriod();
        this.player.x = this.clampPlayerX(this.player.x + direction * playerSpeed * deltaSeconds);
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

    private clampPlayerX(x: number) {
        const roadWidth = this.getRoadWidth();
        const roadLeft = (this.width - roadWidth) / 2;
        const shoulder = Math.max(12, roadWidth * 0.05);

        return Math.min(
            roadLeft + roadWidth - shoulder - this.player.width,
            Math.max(roadLeft + shoulder, x),
        );
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
        const { height, width, x, y } = this.player;
        const radius = width * 0.16;

        context.save();
        context.translate(x, y);

        context.fillStyle = '#d92929';
        context.beginPath();
        context.moveTo(radius, 0);
        context.lineTo(width - radius, 0);
        context.quadraticCurveTo(width, 0, width, radius);
        context.lineTo(width, height - radius);
        context.quadraticCurveTo(width, height, width - radius, height);
        context.lineTo(radius, height);
        context.quadraticCurveTo(0, height, 0, height - radius);
        context.lineTo(0, radius);
        context.quadraticCurveTo(0, 0, radius, 0);
        context.fill();

        context.fillStyle = '#7ed4ed';
        context.fillRect(width * 0.18, height * 0.18, width * 0.64, height * 0.25);
        context.fillStyle = '#9a1515';
        context.fillRect(width * 0.1, height * 0.53, width * 0.8, height * 0.16);
        context.fillStyle = '#fff8b3';
        context.fillRect(width * 0.14, height * 0.84, width * 0.2, height * 0.07);
        context.fillRect(width * 0.66, height * 0.84, width * 0.2, height * 0.07);

        context.restore();
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
}
