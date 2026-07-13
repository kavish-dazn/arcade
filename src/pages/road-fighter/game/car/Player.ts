import LaneManager from '../road/LaneManager';
import type { Bounds } from '../collision/CollisionManager';
import { CarDimensions } from './CarDimensions';
import { CarRenderer } from './CarRenderer';
import { PLAYER_CAR } from '../../constant';

class Player {
    private width = 0;
    private height = 0;

    private x = 0;
    private y = 0;

    private currentLane = 1;
    private targetLane = 1;

    constructor(private readonly lanes: LaneManager) {}

    resize(canvasHeight: number) {
        this.width = CarDimensions.getWidth(this.lanes.getLaneWidth());
        this.height = CarDimensions.getHeight(this.width);

        this.y = canvasHeight - this.height - Math.max(28, canvasHeight * 0.05);

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
        const width = CarDimensions.getWidth(this.lanes.getLaneWidth());
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

    getBounds(): Bounds {
        return {
            left: this.x + this.width * 0.15,
            right: this.x + this.width * 0.85,
            top: this.y + this.height * 0.1,
            bottom: this.y + this.height * 0.9,
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
