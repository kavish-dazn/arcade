import { useEffect, useRef } from 'react';

import { useBackHandler } from '@focus';

import { RoadFighterEngine } from './RoadFighterEngine';

interface RoadFighterGameProps {
    onExitToStart: () => void;
}

export function RoadFighterGame({ onExitToStart }: RoadFighterGameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useBackHandler(onExitToStart);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const engine = new RoadFighterEngine(canvas);
        let animationFrameId = 0;
        let previousTimestamp = performance.now();

        const resize = () => {
            const { height, width } = canvas.getBoundingClientRect();
            engine.resize(width, height, window.devicePixelRatio || 1);
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                event.preventDefault();
                engine.setDirection(event.key === 'ArrowLeft' ? 'left' : 'right', true);
            }
        };

        const onKeyUp = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                engine.setDirection(event.key === 'ArrowLeft' ? 'left' : 'right', false);
            }
        };

        const onWindowBlur = () => engine.stopMoving();

        const renderFrame = (timestamp: number) => {
            const deltaSeconds = Math.min((timestamp - previousTimestamp) / 1000, 0.05);
            previousTimestamp = timestamp;
            engine.update(deltaSeconds);
            engine.render();
            animationFrameId = requestAnimationFrame(renderFrame);
        };

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(canvas);
        resize();
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        window.addEventListener('blur', onWindowBlur);
        animationFrameId = requestAnimationFrame(renderFrame);

        return () => {
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
            window.removeEventListener('blur', onWindowBlur);
        };
    }, []);

    return (
        <div className="road-fighter__game">
            <canvas
                aria-label="Road Fighter game. Use the left and right arrow keys to steer."
                className="road-fighter__canvas"
                ref={canvasRef}
            />
            <p className="road-fighter__instructions">Use Left and Right to steer · Back for menu</p>
        </div>
    );
}
