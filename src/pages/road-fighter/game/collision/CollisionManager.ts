export interface Bounds {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

export class CollisionManager {
    static isColliding(a: Bounds, b: Bounds): boolean {
        return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    }
}
