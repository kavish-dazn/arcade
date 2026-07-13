import type { Bounds } from '../collision/CollisionManager';

export type ObstacleType = 'hole';

class Obstacle {
    public triggered = false;

    constructor(
        public readonly type: ObstacleType,
        public lane: number,
        public x: number,
        public y: number,
        public width: number,
        public height: number,
        public speed: number,
    ) {}

    update(delta: number) {
        this.y += this.speed * delta;
    }

    getBounds(): Bounds {
        return {
            left: this.x + this.width * 0.15,
            top: this.y + this.height * 0.1,
            right: this.x + this.width * 0.85,
            bottom: this.y + this.height * 0.9,
        };
    }

    render(ctx: CanvasRenderingContext2D) {
        switch (this.type) {
            case 'hole':
                this.drawHole(ctx);
                break;
        }
    }

    private drawHole(ctx: CanvasRenderingContext2D) {
        ctx.save();

        ctx.translate(this.x, this.y);

        ctx.fillStyle = '#111';

        ctx.beginPath();

        ctx.ellipse(
            this.width / 2,
            this.height / 2,
            this.width / 2,
            this.height * 0.35,
            0,
            0,
            Math.PI * 2,
        );

        ctx.fill();

        ctx.strokeStyle = '#444';
        ctx.lineWidth = 3;

        ctx.stroke();

        ctx.restore();
    }
}

export default Obstacle;
