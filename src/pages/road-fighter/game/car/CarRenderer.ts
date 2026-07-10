export interface CarTheme {
    bodyColor: string;
    roofColor: string;
    windowColor: string;
    headLightColor: string;
}

interface CarRenderOptions {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
    theme: CarTheme;
}

export class CarRenderer {
    static render(context: CanvasRenderingContext2D, options: CarRenderOptions) {
        const {
            x,
            y,
            width,
            height,
            rotation = 0,
            theme: { bodyColor, roofColor, windowColor, headLightColor },
        } = options;

        const radius = width * 0.16;

        context.save();

        context.translate(x + width / 2, y + height / 2);

        context.rotate(rotation);

        context.translate(-width / 2, -height / 2);

        // Body
        context.fillStyle = bodyColor;

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

        // Window
        context.fillStyle = windowColor;

        context.fillRect(width * 0.18, height * 0.18, width * 0.64, height * 0.25);

        // Roof
        context.fillStyle = roofColor;

        context.fillRect(width * 0.1, height * 0.53, width * 0.8, height * 0.16);

        // Lights
        context.fillStyle = headLightColor;

        context.fillRect(width * 0.14, height * 0.84, width * 0.2, height * 0.07);

        context.fillRect(width * 0.66, height * 0.84, width * 0.2, height * 0.07);

        context.restore();
    }
}
