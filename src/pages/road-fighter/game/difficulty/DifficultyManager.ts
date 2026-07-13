import { DIFFICULTY_LEVELS } from './DifficultyConfig';

export class DifficultyManager {
    private current = DIFFICULTY_LEVELS[0];

    update(elapsedSeconds: number) {
        this.current =
            DIFFICULTY_LEVELS.filter((level) => elapsedSeconds >= level.minTime).at(-1)! ??
            DIFFICULTY_LEVELS[0];
    }

    getCurrent() {
        return this.current;
    }
}
