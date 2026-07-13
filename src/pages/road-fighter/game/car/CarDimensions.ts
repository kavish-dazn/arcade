export class CarDimensions {
    static getWidth(laneWidth: number) {
        return laneWidth * 0.35;
    }

    static getHeight(width: number) {
        return width * 1.45;
    }
}
