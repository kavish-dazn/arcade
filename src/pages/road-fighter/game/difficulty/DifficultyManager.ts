import type { DifficultyLevel } from '@pages/road-fighter/types';
import { DIFFICULTY_LEVELS } from './DifficultyConfig';

class DifficultyManager {
    private current: DifficultyLevel = DIFFICULTY_LEVELS[0];

    update(elapsedSeconds: number) {
        if (elapsedSeconds <= 0) {
            this.current = DIFFICULTY_LEVELS[0];
            return;
        }

        const last = DIFFICULTY_LEVELS[DIFFICULTY_LEVELS.length - 1];

        if (elapsedSeconds <= last.minTime) {
            this.current = this.findPreset(elapsedSeconds);
            return;
        }

        this.current = this.createInfiniteDifficulty(elapsedSeconds, last);
    }

    getCurrent() {
        return this.current;
    }

    private findPreset(elapsedSeconds: number): DifficultyLevel {
        return (
            DIFFICULTY_LEVELS.findLast((level) => elapsedSeconds >= level.minTime) ??
            DIFFICULTY_LEVELS[0]
        );
    }

    private createInfiniteDifficulty(elapsed: number, base: DifficultyLevel): DifficultyLevel {
        const stage = Math.floor((elapsed - base.minTime) / 20);

        return {
            ...base,
            speedMultiplier: Math.min(5, base.speedMultiplier + stage * 0.2),
            spawnInterval: Math.max(0.45, base.spawnInterval - stage * 0.05),
            obstacleSpawnInterval: Math.max(2, base.obstacleSpawnInterval - stage * 0.25),
        };
    }
}

export default DifficultyManager;
