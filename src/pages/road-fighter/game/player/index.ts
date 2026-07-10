export default class Player {
    private width = 0;
    private height = 0;

    private x = 0;
    private y = 0;

    private currentLane = 1;
    private targetLane = 1;

    constructor(private readonly getLaneCenters: () => number[]) {}

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
        const lanes = this.getLaneCenters();

        const targetX = lanes[this.targetLane] - this.width / 2;

        const speed = 12;

        this.x += (targetX - this.x) * speed * deltaSeconds;

        if (Math.abs(targetX - this.x) < 1) {
            this.x = targetX;
            this.currentLane = this.targetLane;
        }
    }

    render(context: CanvasRenderingContext2D) {
        const radius = this.width * 0.16;

        context.save();

        context.translate(this.x, this.y);

        context.fillStyle = '#d92929';

        context.beginPath();
        context.moveTo(radius, 0);
        context.lineTo(this.width - radius, 0);
        context.quadraticCurveTo(this.width, 0, this.width, radius);

        context.lineTo(this.width, this.height - radius);

        context.quadraticCurveTo(this.width, this.height, this.width - radius, this.height);

        context.lineTo(radius, this.height);

        context.quadraticCurveTo(0, this.height, 0, this.height - radius);

        context.lineTo(0, radius);

        context.quadraticCurveTo(0, 0, radius, 0);

        context.fill();

        context.fillStyle = '#7ed4ed';

        context.fillRect(
            this.width * 0.18,
            this.height * 0.18,
            this.width * 0.64,
            this.height * 0.25,
        );

        context.fillStyle = '#9a1515';

        context.fillRect(
            this.width * 0.1,
            this.height * 0.53,
            this.width * 0.8,
            this.height * 0.16,
        );

        context.fillStyle = '#fff8b3';

        context.fillRect(
            this.width * 0.14,
            this.height * 0.84,
            this.width * 0.2,
            this.height * 0.07,
        );

        context.fillRect(
            this.width * 0.66,
            this.height * 0.84,
            this.width * 0.2,
            this.height * 0.07,
        );

        context.restore();
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
        const lanes = this.getLaneCenters();

        this.x = lanes[this.targetLane] - this.width / 2;

        this.currentLane = this.targetLane;
    }
}
