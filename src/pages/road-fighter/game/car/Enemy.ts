import LaneManager from '../road/LaneManager';
import Road from '../road/Road';

interface IEnemy {
    lane: number;
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
}

class Enemy {
    private enemies: IEnemy[] = [];

    private spawnTimer = 0;

    constructor(
        private readonly lanes: LaneManager,
        private readonly road: Road,
    ) {}

    update(delta: number) {
        this.spawnTimer += delta;

        if (this.spawnTimer >= 1.5) {
            this.spawnEnemy();
            this.spawnTimer = 0;
        }

        for (const enemy of this.enemies) {
            enemy.y += enemy.speed * delta;
        }

        this.enemies = this.enemies.filter(
            (enemy) => enemy.y < this.road.getHeight() + enemy.height,
        );
    }

    render(ctx: CanvasRenderingContext2D) {
        for (const enemy of this.enemies) {
            this.drawEnemy(ctx, enemy);
        }
    }

    getEnemies() {
        return this.enemies;
    }

    private spawnEnemy() {
        const roadWidth = this.road.getRoadWidth();

        const width = roadWidth * 0.16;
        const height = width * 1.55;

        const lane = Math.floor(Math.random() * 3);

        this.enemies.push({
            lane,
            x: this.lanes.getCenter(lane) - width / 2,
            y: -height,
            width,
            height,
            speed: 500,
        });
    }

    private drawEnemy(context: CanvasRenderingContext2D, enemy: IEnemy) {
        const { width, height } = enemy;
        const radius = width * 0.16;

        context.save();

        context.translate(enemy.x + width / 2, enemy.y + height / 2);

        context.translate(-width / 2, -height / 2);

        // Body
        context.fillStyle = '#2b7fff';

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

        // Windshield
        context.fillStyle = '#a6ecff';

        context.fillRect(width * 0.18, height * 0.18, width * 0.64, height * 0.25);

        // Roof
        context.fillStyle = '#1758c8';

        context.fillRect(width * 0.1, height * 0.53, width * 0.8, height * 0.16);

        // Headlights
        context.fillStyle = '#fff7aa';

        context.fillRect(width * 0.14, height * 0.84, width * 0.2, height * 0.07);

        context.fillRect(width * 0.66, height * 0.84, width * 0.2, height * 0.07);

        context.restore();
    }
}

export default Enemy;
