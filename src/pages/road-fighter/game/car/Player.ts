import LaneManager from '../road/LaneManager';
import type Road from '../road/Road';
import { CarDimensions } from './CarDimensions';
import { CarRenderer } from './CarRenderer';
import { PLAYER_CAR } from './constant';

class Player {
    private width = 0;
    private height = 0;

    private x = 0;
    private y = 0;

    private currentLane = 1;
    private targetLane = 1;

    constructor(
        private readonly lanes: LaneManager,
        private readonly road: Road,
    ) {}

    resize(roadWidth: number, canvasHeight: number) {
        this.width = Math.min(roadWidth * 0.16, 110);
        this.height = this.width * 1.55;

        this.y = canvasHeight - this.height - Math.max(28, canvasHeight * 0.06);

        this.snapToLane();
    }

    moveLeft() {
        this.targetLane = Math.max(0, this.targetLane - 1);
    }

    moveRight() {
        this.targetLane = Math.min(2, this.targetLane + 1);
    }

    update(deltaSeconds: number) {
        const targetX = this.lanes.getCenter(this.targetLane) - this.width / 2;

        const speed = 12;

        this.x += (targetX - this.x) * speed * deltaSeconds;

        if (Math.abs(targetX - this.x) < 1) {
            this.x = targetX;
            this.currentLane = this.targetLane;
        }
    }

    render(context: CanvasRenderingContext2D) {
        const width = CarDimensions.getWidth(this.road.getRoadWidth());
        const height = CarDimensions.getHeight(width);

        CarRenderer.render(context, {
            x: this.x,
            y: this.y,
            width,
            height,
            rotation: Math.PI,
            theme: PLAYER_CAR,
        });
    }

    getBounds() {
        return {
            left: this.x,
            top: this.y,
            right: this.x + this.width,
            bottom: this.y + this.height,
        };
    }

    getLane() {
        return this.currentLane;
    }

    private snapToLane() {
        this.x = this.lanes.getCenter(this.targetLane) - this.width / 2;

        this.currentLane = this.targetLane;
    }
}

export default Player;
