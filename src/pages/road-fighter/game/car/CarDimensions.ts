export class CarDimensions {
    static getWidth(roadWidth: number) {
        return Math.min(roadWidth * 0.16, 110);
    }

    static getHeight(width: number) {
        return width * 1.55;
    }
}
