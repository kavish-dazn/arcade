import type { GameStats } from '../types';

type Props = {
    stats: GameStats;
};
export function GameOverOverlay({ stats }: Props) {
    return (
        <div className="game-over">
            <div className="game-over__content">
                <h1>GAME OVER</h1>

                <p>Score: {stats.score}</p>

                <p>Time: {stats.elapsedTime}s</p>

                <p>
                    Press <span className="enter">ENTER</span> to Restart
                </p>
            </div>
        </div>
    );
}
