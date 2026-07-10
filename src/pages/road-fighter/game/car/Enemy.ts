import type { Bounds } from '../collision/CollisionManager';
import type { CarTheme } from './CarRenderer';

class Enemy {
    public passed = false;
    public points = 10;

    constructor(
        public lane: number,
        public x: number,
        public y: number,
        public width: number,
        public height: number,
        public speed: number,
        public theme: CarTheme,
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
}

export default Enemy;
