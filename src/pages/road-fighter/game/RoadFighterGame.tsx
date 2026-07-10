import { useEffect, useRef, useState } from 'react';

import { useBackHandler } from '@focus';

import { RoadFighterEngine } from './RoadFighterEngine';
import { GameOverOverlay } from './GameOverOverlay';
import { GameState } from '../types';

interface RoadFighterGameProps {
    onExitToStart: () => void;
}

export function RoadFighterGame({ onExitToStart }: RoadFighterGameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameState, setGameState] = useState(GameState.Playing);

    const [stats, setStats] = useState({
        score: 0,
        elapsedTime: 0,
    });

    useBackHandler(onExitToStart);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const engine = new RoadFighterEngine(canvas, {
            onGameOver: (stats) => {
                setStats(stats);
                setGameState(GameState.GameOver);
            },
        });
        let animationFrameId = 0;
        let previousTimestamp = performance.now();

        const resize = () => {
            const { height, width } = canvas.getBoundingClientRect();
            engine.resize(width, height, window.devicePixelRatio || 1);
        };

        const onKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowLeft':
                    event.preventDefault();
                    engine.moveLeft();
                    break;

                case 'ArrowRight':
                    event.preventDefault();
                    engine.moveRight();
                    break;

                case 'Enter':
                    event.preventDefault();
                    engine.reset();
                    setGameState(GameState.Playing);
                    break;
            }
        };

        // const onWindowBlur = () => engine.stopMoving();

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
        // window.addEventListener('blur', onWindowBlur);
        animationFrameId = requestAnimationFrame(renderFrame);

        return () => {
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
            window.removeEventListener('keydown', onKeyDown);
            // window.removeEventListener('blur', onWindowBlur);
        };
    }, []);

    return (
        <div className="road-fighter__game">
            <canvas
                aria-label="Road Fighter game. Use the left and right arrow keys to steer."
                className="road-fighter__canvas"
                ref={canvasRef}
            />
            {gameState === GameState.GameOver && <GameOverOverlay stats={stats} />}
            <p className="road-fighter__instructions">
                Use Left and Right to steer · Back for menu
            </p>
        </div>
    );
}
