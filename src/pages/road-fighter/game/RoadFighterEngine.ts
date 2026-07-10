import LaneManager from './road/LaneManager';
import Road from './road/Road';
import Player from './car/Player';
import EnemyManager from './car/Enemy';

export class RoadFighterEngine {
    private readonly canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;

    private width = 0;
    private height = 0;

    private readonly road = new Road();
    private readonly lanes = new LaneManager();

    private readonly player = new Player(this.lanes, this.road);
    private readonly enemyManager = new EnemyManager(this.lanes, this.road);

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
        // const roadSpeed = this.height * 0.72;
        this.road.update(deltaSeconds);
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

        context.clearRect(0, 0, this.width, this.height);

        this.drawBackground();
        this.drawRoad();
        this.drawLaneMarkers();
        this.enemyManager.render(context);
        this.drawPlayerCar();
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

    private getRoadWidth() {
        return Math.min(this.width * 0.68, this.height * 1.1);
    }

    private getLaneCenters() {
        const roadWidth = this.getRoadWidth();
        const roadLeft = (this.width - roadWidth) / 2;
        const laneWidth = roadWidth / 3;

        return [roadLeft + laneWidth * 0.5, roadLeft + laneWidth * 1.5, roadLeft + laneWidth * 2.5];
    }
}
